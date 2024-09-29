import { AnalogInputDevice } from "./analogInputDevice.ts";

export class LightSensor {
  #analogInput: AnalogInputDevice;

  constructor(channel: number) {
    this.#analogInput = new AnalogInputDevice(channel);
  }

  get value(): number {
    return this.#analogInput.value;
  }

  close() {
    this.#analogInput.close();
  }
}
