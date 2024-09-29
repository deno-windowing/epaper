import { GPIODriver } from "./gpio.ts";

export class PWMOutputDevice {
  #gpio: GPIODriver;
  #frequency: number;
  #value: number = 0;

  constructor(
    pin: number,
    frequency: number = 100,
    initialValue: number = 0,
  ) {
    this.#gpio = new GPIODriver(pin, "out");
    this.#frequency = frequency;
    this.value = initialValue;
  }

  get value(): number {
    return this.#value;
  }

  set value(val: number) {
    val = Math.max(0, Math.min(1, val));
    this.#value = val;
    if (val === 0 || val === 1) {
      this.#gpio.stopPWM();
      this.#gpio.setValue(val);
    } else {
      this.#gpio.startPWM(this.#frequency, val);
    }
  }

  on() {
    this.value = 1;
  }

  off() {
    this.value = 0;
  }

  close() {
    this.#gpio.close();
  }
}
