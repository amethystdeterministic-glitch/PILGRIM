#include "amethyst_kernel.h"
#include <stdio.h>

int main() {
    AmethystKernelInputs in = {
        .asv = { 1.0f, 1.0f, 0.0f, 1.0f, 1.0f },
        .rsv = { .dims = {0.0f} },
        .crisis_flag = 0,
        .extractor_divergence = 0.0f
    };

    AmethystKernelOutput out;
    amethyst_kernel_route(&in, &out);

    printf("Route: %u\n", out.route);
    printf("D_norm: %.6f\n", out.d_norm);

    return 0;
}
