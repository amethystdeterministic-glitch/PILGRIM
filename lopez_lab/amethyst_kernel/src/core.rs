//! Core implementation of the Amethyst Kernel v8.2.2 — Quartz Polished LTS.

#![allow(clippy::excessive_precision)]

use core::f32;

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct ASV {
    pub l_c: f32,
    pub c_i: f32,
    pub b_w: f32,
    pub p_s: f32,
    pub n_s: f32,
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct RSV {
    pub dims: [f32; 8],
}

#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RouteState {
    Crisis = 0,
    FailSafe = 1,
    Convergence = 2,
    Divergence = 3,
    Contradiction = 4,
    ExtremeContradiction = 5,
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct KernelInputs {
    pub asv: ASV,
    pub rsv: RSV,
    pub crisis_flag: bool,
    pub extractor_divergence: f32,
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct KernelOutput {
    pub route: RouteState,
    pub d_norm: f32,
}

// --------- Constants (Quartz v8.2.2 canonical) ---------

const T_C: f32 = 0.15;
const T_D: f32 = 0.40;
const T_X: f32 = 0.70;

const TAU: f32 = 0.25;
const SPL_LC_THRESH: f32 = 0.82;
const AMC_X_THRESH: f32 = 0.85;

const SQRT_8: f32 = 2.828_427_3_f32;

// --------- Helpers ---------

fn clamp_unit(x: f32) -> f32 {
    if !x.is_finite() {
        return x;
    }
    if x < 0.0 {
        0.0
    } else if x > 1.0 {
        1.0
    } else {
        x
    }
}

fn ivr_violation(inputs: &KernelInputs) -> bool {
    let a = &inputs.asv;
    let asv_vals = [a.l_c, a.c_i, a.b_w, a.p_s, a.n_s];

    if asv_vals.iter().any(|v| !v.is_finite() || *v < 0.0 || *v > 1.0) {
        return true;
    }

    if inputs
        .rsv
        .dims
        .iter()
        .any(|v| !v.is_finite() || *v < 0.0 || *v > 1.0)
    {
        return true;
    }

    if !inputs.extractor_divergence.is_finite()
        || inputs.extractor_divergence < 0.0
        || inputs.extractor_divergence > 1.0
    {
        return true;
    }

    false
}

fn phi_projection(asv: &ASV) -> [f32; 8] {
    let l_c = clamp_unit(asv.l_c);
    let c_i = clamp_unit(asv.c_i);
    let b_w = clamp_unit(asv.b_w);
    let p_s = clamp_unit(asv.p_s);
    let n_s = clamp_unit(asv.n_s);

    [
        l_c,
        c_i,
        b_w,
        p_s,
        n_s,
        clamp_unit((l_c + c_i) * 0.5),
        clamp_unit((b_w - n_s).abs().min(1.0)),
        clamp_unit((p_s + n_s) * 0.5),
    ]
}

fn harmonic_distance(asv_star: [f32; 8], rsv: &RSV) -> f32 {
    let mut sum_sq = 0.0;
    for i in 0..8 {
        let diff = asv_star[i] - rsv.dims[i];
        sum_sq += diff * diff;
    }
    clamp_unit(sum_sq.sqrt() / SQRT_8)
}

fn amc_x(asv: &ASV) -> f32 {
    clamp_unit(
        (1.0 - asv.l_c)
            .max(1.0 - asv.c_i)
            .max(1.0 - asv.n_s),
    )
}

// --------- Public Kernel Entry Point ---------

pub fn route(inputs: &KernelInputs) -> KernelOutput {
    if inputs.crisis_flag {
        return KernelOutput {
            route: RouteState::Crisis,
            d_norm: 1.0,
        };
    }

    if ivr_violation(inputs) || inputs.extractor_divergence > TAU {
        return KernelOutput {
            route: RouteState::FailSafe,
            d_norm: 1.0,
        };
    }

    let asv_star = phi_projection(&inputs.asv);
    let d_norm = harmonic_distance(asv_star, &inputs.rsv);

    let mut route = if d_norm < T_C {
        RouteState::Convergence
    } else if d_norm < T_D {
        RouteState::Divergence
    } else if d_norm < T_X {
        RouteState::Contradiction
    } else {
        RouteState::ExtremeContradiction
    };

    let amc_score = amc_x(&inputs.asv);
    if amc_score >= AMC_X_THRESH
        && matches!(
            route,
            RouteState::Contradiction | RouteState::ExtremeContradiction
        )
    {
        route = RouteState::Divergence;
    }

    if inputs.asv.l_c >= SPL_LC_THRESH
        && matches!(
            route,
            RouteState::Contradiction | RouteState::ExtremeContradiction
        )
    {
        route = RouteState::Divergence;
    }

    KernelOutput { route, d_norm }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn rsv_zero() -> RSV {
        RSV { dims: [0.0; 8] }
    }

    #[test]
    fn test_crisis_override() {
        let inputs = KernelInputs {
            asv: ASV {
                l_c: 1.0,
                c_i: 1.0,
                b_w: 0.5,
                p_s: 1.0,
                n_s: 1.0,
            },
            rsv: rsv_zero(),
            crisis_flag: true,
            extractor_divergence: 0.0,
        };

        let out = route(&inputs);
        assert_eq!(out.route, RouteState::Crisis);
    }
}
