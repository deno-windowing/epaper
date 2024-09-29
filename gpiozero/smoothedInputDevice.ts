import { DigitalInputDevice } from "./digitalInputDevice.ts";

export class SmoothedInputDevice extends DigitalInputDevice {
  #queue: number[] = [];
  #sampleSize: number;

  constructor(pin: number, sampleSize: number = 5) {
    super(pin);
    this.#sampleSize = sampleSize;
    this.#startSmoothing();
  }

  #startSmoothing() {
    setInterval(() => {
      const value = this.isActive ? 1 : 0;
      if (this.#queue.length >= this.#sampleSize) {
        this.#queue.shift();
      }
      this.#queue.push(value);
    }, 10);
  }

  get smoothedValue(): number {
    const sum = this.#queue.reduce((a, b) => a + b, 0);
    return sum / this.#queue.length;
  }

  override get isActive(): boolean {
    return this.smoothedValue >= 0.5;
  }
}
