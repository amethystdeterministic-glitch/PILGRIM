#ifndef AMETHYST_KERNEL_H
#define AMETHYST_KERNEL_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    float l_c;
    float c_i;
    float b_w;
    float p_s;
    float n_s;
} AmethystAsv;

typedef struct {
    float dims[8];
} AmethystRsv;

typedef struct {
    AmethystAsv asv;
    AmethystRsv rsv;
    uint8_t crisis_flag;        // 0 = false, non-zero = true
    float extractor_divergence; // [0,1]
} AmethystKernelInputs;

typedef struct {
    uint32_t route; // See AmethystRouteState
    float d_norm;   // [0,1]
} AmethystKernelOutput;

typedef enum {
    AMETHYST_ROUTE_CRISIS = 0,
    AMETHYST_ROUTE_FAILSAFE = 1,
    AMETHYST_ROUTE_CONVERGENCE = 2,
    AMETHYST_ROUTE_DIVERGENCE = 3,
    AMETHYST_ROUTE_CONTRADICTION = 4,
    AMETHYST_ROUTE_EXTREME_CONTRADICTION = 5
} AmethystRouteState;

void amethyst_kernel_route(
    const AmethystKernelInputs* in,
    AmethystKernelOutput* out
);

#ifdef __cplusplus
}
#endif

#endif /* AMETHYST_KERNEL_H */
