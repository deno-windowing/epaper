import { GPIODriver } from "./gpio.ts";

export class DigitalInputDevice {
  #gpio: GPIODriver;
  #whenActivated: (() => void) | null = null;
  #whenDeactivated: (() => void) | null = null;
  #lastState: 0 | 1 = 0;

  constructor(pin: number, _pullUp: boolean = false) {
    this.#gpio = new GPIODriver(pin, "in");
    this.#startEdgeDetection();
  }

  #startEdgeDetection() {
    setInterval(() => {
      const state = this.#gpio.getValue();
      if (state !== this.#lastState) {
        if (state === 1 && this.#whenActivated) {
          this.#whenActivated();
        } else if (state === 0 && this.#whenDeactivated) {
          this.#whenDeactivated();
        }
        this.#lastState = state;
      }
    }, 10);
  }

  onActivated(callback: () => void) {
    this.#whenActivated = callback;
  }

  onDeactivated(callback: () => void) {
    this.#whenDeactivated = callback;
  }

  get isActive(): boolean {
    return this.#gpio.getValue() === 1;
  }

  close() {
    this.#gpio.close();
  }
}
