from ctypes import *

lib = CDLL("./libamethyst_kernel.so")

class ASV(Structure):
    _fields_ = [
        ("l_c", c_float),
        ("c_i", c_float),
        ("b_w", c_float),
        ("p_s", c_float),
        ("n_s", c_float),
    ]

class RSV(Structure):
    _fields_ = [("dims", c_float * 8)]

class KernelInputs(Structure):
    _fields_ = [
        ("asv", ASV),
        ("rsv", RSV),
        ("crisis_flag", c_uint8),
        ("extractor_divergence", c_float),
    ]

class KernelOutput(Structure):
    _fields_ = [
        ("route", c_uint32),
        ("d_norm", c_float),
    ]

lib.amethyst_kernel_route.argtypes = [POINTER(KernelInputs), POINTER(KernelOutput)]
lib.amethyst_kernel_route.restype = None

def run_kernel():
    input = KernelInputs(
        ASV(1.0, 1.0, 0.0, 1.0, 1.0),
        RSV((0.0,) * 8),
        0,
        0.0,
    )
    output = KernelOutput()
    lib.amethyst_kernel_route(byref(input), byref(output))
    print("Route:", output.route)
    print("D_norm:", output.d_norm)

if __name__ == "__main__":
    run_kernel()
