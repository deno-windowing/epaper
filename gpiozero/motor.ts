import { GPIODriver } from "./gpio.ts";

export class Motor {
  #forwardGpio: GPIODriver;
  #backwardGpio: GPIODriver;

  constructor(forwardPin: number, backwardPin: number) {
    this.#forwardGpio = new GPIODriver(forwardPin, "out");
    this.#backwardGpio = new GPIODriver(backwardPin, "out");
  }

  forward() {
    this.#forwardGpio.setValue(1);
    this.#backwardGpio.setValue(0);
  }

  backward() {
    this.#forwardGpio.setValue(0);
    this.#backwardGpio.setValue(1);
  }

  stop() {
    this.#forwardGpio.setValue(0);
    this.#backwardGpio.setValue(0);
  }

  close() {
    this.#forwardGpio.close();
    this.#backwardGpio.close();
  }
}
