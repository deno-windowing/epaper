import { GPIODriver } from "./gpio.ts";

export class LED {
  #gpio: GPIODriver;

  constructor(pin: number) {
    this.#gpio = new GPIODriver(pin, "out");
  }

  get gpio() {
    return this.#gpio;
  }
  
  on() {
    this.#gpio.setValue(1);
  }

  off() {
    this.#gpio.setValue(0);
  }

  toggle() {
    const currentValue = this.#gpio.getValue();
    this.#gpio.setValue((currentValue ^ 1) as 0 | 1);
  }

  blink(interval: number = 1000, times: number = Infinity) {
    let count = 0;
    const blinkInterval = setInterval(() => {
      this.toggle();
      count++;
      if (count >= times * 2) {
        clearInterval(blinkInterval);
      }
    }, interval);
  }

  close() {
    this.#gpio.close();
  }
}
