import { GPIODriver } from "./gpio.ts";

type MotionCallback = () => void;

export class MotionSensor {
  #gpio: GPIODriver;
  #intervalId: number | null = null;
  #whenMotion: MotionCallback | null = null;
  #whenNoMotion: MotionCallback | null = null;
  #lastState: 0 | 1 = 0;

  constructor(pin: number) {
    this.#gpio = new GPIODriver(pin, "in");
    this.#startMonitoring();
  }

  #startMonitoring() {
    this.#intervalId = setInterval(() => {
      const state = this.#gpio.getValue();
      if (state !== this.#lastState) {
        if (state === 1 && this.#whenMotion) {
          this.#whenMotion();
        } else if (state === 0 && this.#whenNoMotion) {
          this.#whenNoMotion();
        }
        this.#lastState = state;
      }
    }, 100);
  }

  onMotion(callback: MotionCallback) {
    this.#whenMotion = callback;
  }

  onNoMotion(callback: MotionCallback) {
    this.#whenNoMotion = callback;
  }

  close() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
    }
    this.#gpio.close();
  }
}
