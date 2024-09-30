import { GPIODriver } from "./gpio.ts";

type ButtonCallback = () => void;

export class Button {
  #gpio: GPIODriver;
  #intervalId: number | null = null;
  #whenPressed: ButtonCallback | null = null;
  #whenReleased: ButtonCallback | null = null;
  #lastState: 0 | 1 = 0;

  get gpio(): GPIODriver {
    return this.#gpio;
  }

  constructor(pin: number) {
    this.#gpio = new GPIODriver(pin, "in");
    this.#startMonitoring();
  }

  #startMonitoring() {
    this.#intervalId = setInterval(() => {
      const state = this.#gpio.getValue();
      if (state !== this.#lastState) {
        if (state === 1 && this.#whenPressed) {
          this.#whenPressed();
        } else if (state === 0 && this.#whenReleased) {
          this.#whenReleased();
        }
        this.#lastState = state;
      }
    }, 50);
  }

  onPressed(callback: ButtonCallback) {
    this.#whenPressed = callback;
  }

  onReleased(callback: ButtonCallback) {
    this.#whenReleased = callback;
  }

  close() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
    }
    this.#gpio.close();
  }
}
