// led_board.ts

import { DigitalOutputDevice } from "./digitalOutputDevice.ts";

export class LEDBoard {
  #leds: DigitalOutputDevice[];

  constructor(pins: number[]) {
    this.#leds = pins.map((pin) => new DigitalOutputDevice(pin));
  }

  on() {
    this.#leds.forEach((led) => led.on());
  }

  off() {
    this.#leds.forEach((led) => led.off());
  }

  toggle() {
    this.#leds.forEach((led) => led.toggle());
  }

  setValues(values: boolean[]) {
    this.#leds.forEach((led, index) => {
      if (values[index]) {
        led.on();
      } else {
        led.off();
      }
    });
  }

  close() {
    this.#leds.forEach((led) => led.close());
  }
}
