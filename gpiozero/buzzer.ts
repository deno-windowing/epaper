import { GPIODriver } from "./gpio.ts";

export class Buzzer {
  #gpio: GPIODriver;

  constructor(pin: number) {
    this.#gpio = new GPIODriver(pin, "out");
  }

  on() {
    this.#gpio.setValue(1);
  }

  off() {
    this.#gpio.setValue(0);
  }

  beep(onTime: number = 1, offTime: number = 1, n: number = 1) {
    let count = 0;
    const beepInterval = setInterval(() => {
      this.on();
      setTimeout(() => {
        this.off();
      }, onTime * 1000);

      count++;
      if (count >= n) {
        clearInterval(beepInterval);
      }
    }, (onTime + offTime) * 1000);
  }

  close() {
    this.#gpio.close();
  }
}
