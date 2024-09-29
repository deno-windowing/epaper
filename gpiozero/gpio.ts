import { gpiod } from "./ffi.ts";

export class GPIODriver {
  #chip: Deno.PointerValue;
  #line: Deno.PointerValue;
  #pin: number;
  #pwmIntervalId: number | null = null;
  #dutyCycle: number = 0;
  #frequency: number = 0;

  constructor(pin: number, direction: "in" | "out") {
    this.#pin = pin;
    const chipName = Deno.UnsafePointer.of(
      new TextEncoder().encode("gpiochip0\0"),
    );
    this.#chip = gpiod.gpiod_chip_open_by_name(chipName)!;

    if (this.#chip.valueOf() === 0n) {
      throw new Error("Failed to open GPIO chip");
    }

    this.#line = gpiod.gpiod_chip_get_line(this.#chip, pin)!;
    if (this.#line.valueOf() === 0n) {
      throw new Error(`Failed to get line for pin ${pin}`);
    }

    const consumer = Deno.UnsafePointer.of(
      new TextEncoder().encode("deno_gpio\0"),
    );
    const ret = direction === "out"
      ? gpiod.gpiod_line_request_output(this.#line, consumer, 0)
      : gpiod.gpiod_line_request_input(this.#line, consumer);

    if (ret !== 0) {
      throw new Error(`Failed to request ${direction} on pin ${pin}`);
    }
  }

  startPWM(frequency: number, dutyCycle: number) {
    this.stopPWM();

    this.#frequency = frequency;
    this.#dutyCycle = dutyCycle;

    const period = 1000 / frequency;
    const onTime = period * dutyCycle;
    // const offTime = period - onTime;

    this.#pwmIntervalId = setInterval(() => {
      this.setValue(1);
      setTimeout(() => {
        this.setValue(0);
      }, onTime);
    }, period);
  }

  changeDutyCycle(dutyCycle: number) {
    if (this.#pwmIntervalId === null) {
      throw new Error("PWM is not running");
    }
    this.startPWM(this.#frequency, dutyCycle);
  }

  stopPWM() {
    if (this.#pwmIntervalId !== null) {
      clearInterval(this.#pwmIntervalId);
      this.#pwmIntervalId = null;
      this.setValue(0);
    }
  }

  setValue(value: 0 | 1) {
    const ret = gpiod.gpiod_line_set_value(this.#line, value);
    if (ret !== 0) {
      throw new Error(`Failed to set value on pin ${this.#pin}`);
    }
  }

  getValue(): 0 | 1 {
    const ret = gpiod.gpiod_line_get_value(this.#line);
    if (ret === -1) {
      throw new Error(`Failed to get value from pin ${this.#pin}`);
    }
    return ret as 0 | 1;
  }

  close() {
    this.stopPWM();
    gpiod.gpiod_chip_close(this.#chip);
  }
}
