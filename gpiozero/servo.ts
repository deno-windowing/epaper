import { GPIODriver } from "./gpio.ts";

export class Servo {
  #gpio: GPIODriver;
  #minPulseWidth: number;
  #maxPulseWidth: number;
  #frequency: number = 50;
  #angle: number = 0;

  constructor(
    pin: number,
    minPulseWidth: number = 1,
    maxPulseWidth: number = 2,
  ) {
    this.#gpio = new GPIODriver(pin, "out");
    this.#minPulseWidth = minPulseWidth;
    this.#maxPulseWidth = maxPulseWidth;
  }

  setAngle(angle: number) {
    if (angle < -90 || angle > 90) {
      throw new Error("Angle must be between -90 and 90 degrees");
    }
    this.#angle = angle;
    const pulseWidth =
      ((angle + 90) / 180) * (this.#maxPulseWidth - this.#minPulseWidth) +
      this.#minPulseWidth;
    const dutyCycle = pulseWidth / (1000 / this.#frequency);
    this.#gpio.startPWM(this.#frequency, dutyCycle);
  }

  detach() {
    this.#gpio.stopPWM();
  }

  close() {
    this.detach();
    this.#gpio.close();
  }
}
