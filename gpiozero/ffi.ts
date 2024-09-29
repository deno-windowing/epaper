const lib = Deno.dlopen("libgpiod.so.2", {
  "gpiod_chip_open_by_name": { parameters: ["pointer"], result: "pointer" },
  "gpiod_chip_get_line": {
    parameters: ["pointer", "u32"],
    result: "pointer",
  },
  "gpiod_line_request_output": {
    parameters: ["pointer", "pointer", "i32"],
    result: "i32",
  },
  "gpiod_line_request_input": {
    parameters: ["pointer", "pointer"],
    result: "i32",
  },
  "gpiod_line_set_value": { parameters: ["pointer", "i32"], result: "i32" },
  "gpiod_line_get_value": { parameters: ["pointer"], result: "i32" },
  "gpiod_chip_close": { parameters: ["pointer"], result: "void" },
});

// deno-lint-ignore no-explicit-any
let libspi: any;
try {
  libspi = Deno.dlopen("/usr/lib/libspi.so", {
    // Define required SPI functions
  });
} catch {
  console.error("SPI not available");
}

export const spi = libspi ? libspi.symbols : undefined;

export const gpiod = lib.symbols;
