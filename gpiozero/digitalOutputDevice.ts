import { GPIODriver } from "./gpio.ts";

export class DigitalOutputDevice {
  #gpio: GPIODriver;
  #activeHigh: boolean;

  constructor(
    pin: number,
    activeHigh: boolean = true,
    initialValue: boolean = false,
  ) {
    this.#gpio = new GPIODriver(pin, "out");
    this.#activeHigh = activeHigh;
    this.value = initialValue;
  }

  get value(): boolean {
    const val = this.#gpio.getValue();
    return this.#activeHigh ? val === 1 : val === 0;
  }

  set value(val: boolean) {
    const setValue = this.#activeHigh ? (val ? 1 : 0) : (val ? 0 : 1);
    this.#gpio.setValue(setValue);
  }

  on() {
    this.value = true;
  }

  off() {
    this.value = false;
  }

  toggle() {
    this.value = !this.value;
  }

  close() {
    this.#gpio.close();
  }
}
