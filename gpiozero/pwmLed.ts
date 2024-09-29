import { GPIODriver } from "./gpio.ts";

export class PWMLED {
  #gpio: GPIODriver;
  #frequency: number;

  constructor(pin: number, frequency: number = 100) {
    this.#gpio = new GPIODriver(pin, "out");
    this.#frequency = frequency;
  }

  setValue(value: number) {
    value = Math.max(0, Math.min(1, value));
    if (value === 0) {
      this.#gpio.stopPWM();
      this.#gpio.setValue(0);
    } else if (value === 1) {
      this.#gpio.stopPWM();
      this.#gpio.setValue(1);
    } else {
      this.#gpio.startPWM(this.#frequency, value);
    }
  }

  on() {
    this.setValue(1);
  }

  off() {
    this.setValue(0);
  }

  toggle() {
    const currentValue = this.#gpio.getValue();
    this.setValue(currentValue === 0 ? 1 : 0);
  }

  blink(onTime: number = 1, offTime: number = 1, n: number = Infinity) {
    let count = 0;
    const blinkInterval = setInterval(() => {
      this.on();
      setTimeout(() => {
        this.off();
      }, onTime * 1000);

      count++;
      if (count >= n) {
        clearInterval(blinkInterval);
      }
    }, (onTime + offTime) * 1000);
  }

  pulse(
    fadeInTime: number = 1,
    fadeOutTime: number = 1,
    n: number = Infinity,
  ) {
    let count = 0;
    const stepTime = 50;
    const stepsIn = fadeInTime * 1000 / stepTime;
    const stepsOut = fadeOutTime * 1000 / stepTime;
    const pulseInterval = setInterval(async () => {
      for (let i = 0; i <= stepsIn; i++) {
        this.setValue(i / stepsIn);
        await new Promise((r) => setTimeout(r, stepTime));
      }
      for (let i = stepsOut; i >= 0; i--) {
        this.setValue(i / stepsOut);
        await new Promise((r) => setTimeout(r, stepTime));
      }
      count++;
      if (count >= n) {
        clearInterval(pulseInterval);
        this.off();
      }
    }, (fadeInTime + fadeOutTime) * 1000);
  }

  close() {
    this.#gpio.close();
  }
}
