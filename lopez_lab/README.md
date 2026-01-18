Amethyst Kernel v8.2.2 — Quartz Polished LTS
===========================================

This SDK contains:

- amethyst_kernel/     → Rust crate with core kernel + FFI
- amethyst_kernel.h    → C header
- demo.c               → C demo program
- kernel_ctypes.py     → Python ctypes demo binding

Basic usage:

1. Build the Rust library:

   cd amethyst_kernel
   cargo build --release

2. From C:

   Copy amethyst_kernel.h and link against the built library (e.g. libamethyst_kernel.a or libamethyst_kernel.so).

   gcc ../demo.c -L./target/release -lamethyst_kernel -o demo
   ./demo

3. From Python (ctypes):

   Ensure libamethyst_kernel.so is on your library path, then:

   python3 ../kernel_ctypes.py
