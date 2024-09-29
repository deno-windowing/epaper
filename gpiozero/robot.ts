import { Motor } from "./motor.ts";

export class Robot {
  #leftMotor: Motor;
  #rightMotor: Motor;

  constructor(
    leftPins: { forward: number; backward: number },
    rightPins: { forward: number; backward: number },
  ) {
    this.#leftMotor = new Motor(leftPins.forward, leftPins.backward);
    this.#rightMotor = new Motor(rightPins.forward, rightPins.backward);
  }

  forward() {
    this.#leftMotor.forward();
    this.#rightMotor.forward();
  }

  backward() {
    this.#leftMotor.backward();
    this.#rightMotor.backward();
  }

  left() {
    this.#leftMotor.backward();
    this.#rightMotor.forward();
  }

  right() {
    this.#leftMotor.forward();
    this.#rightMotor.backward();
  }

  stop() {
    this.#leftMotor.stop();
    this.#rightMotor.stop();
  }

  close() {
    this.#leftMotor.close();
    this.#rightMotor.close();
  }
}
