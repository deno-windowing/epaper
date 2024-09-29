import { GPIODriver } from "./gpio.ts";

type LightCallback = () => void;

export class LightSensor {
  #gpio: GPIODriver;
  #intervalId: number | null = null;
  #whenLight: LightCallback | null = null;
  #whenDark: LightCallback | null = null;
  #lastState: 0 | 1 = 0;

  constructor(pin: number) {
    this.#gpio = new GPIODriver(pin, "in");
    this.#startMonitoring();
  }

  #startMonitoring() {
    this.#intervalId = setInterval(() => {
      const state = this.#gpio.getValue();
      if (state !== this.#lastState) {
        if (state === 1 && this.#whenLight) {
          this.#whenLight();
        } else if (state === 0 && this.#whenDark) {
          this.#whenDark();
        }
        this.#lastState = state;
      }
    }, 100);
  }

  onLight(callback: LightCallback) {
    this.#whenLight = callback;
  }

  onDark(callback: LightCallback) {
    this.#whenDark = callback;
  }

  close() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
    }
    this.#gpio.close();
  }
}
