import { GPIODriver } from "./gpio.ts";

export class DistanceSensor {
  #trigger: GPIODriver;
  #echo: GPIODriver;

  constructor(triggerPin: number, echoPin: number) {
    this.#trigger = new GPIODriver(triggerPin, "out");
    this.#echo = new GPIODriver(echoPin, "in");
  }

  async getDistance(): Promise<number> {
    this.#trigger.setValue(0);
    await new Promise((r) => setTimeout(r, 2));
    this.#trigger.setValue(1);
    await new Promise((r) => setTimeout(r, 0.01));
    this.#trigger.setValue(0);

    const start = performance.now();
    while (this.#echo.getValue() === 0) {
      if (performance.now() - start > 1000) {
        throw new Error("Timeout waiting for echo to start");
      }
    }
    const signalOn = performance.now();

    while (this.#echo.getValue() === 1) {
      if (performance.now() - signalOn > 1000) {
        throw new Error("Timeout waiting for echo to end");
      }
    }
    const signalOff = performance.now();

    const timePassed = signalOff - signalOn;
    const distance = (timePassed * 34300) / 2 / 1000;

    return distance;
  }

  close() {
    this.#trigger.close();
    this.#echo.close();
  }
}
