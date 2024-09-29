import { Button } from "./gpiozero/button.ts";
import { LED } from "./gpiozero/led.ts";

export const EPD_WIDTH = 122;
export const EPD_HEIGHT = 250;
export const RST_PIN = 17;
export const DC_PIN = 25;
export const CS_PIN = 8;
export const BUSY_PIN = 24;
export const PWR_PIN = 18;
export const MOSI_PIN = 10;
export const SCLK_PIN = 11;

export class RaspberryPi {
  // SPI;
  static GPIO_RST_PIN = new LED(RST_PIN);
  static GPIO_DC_PIN = new LED(DC_PIN);
  static GPIO_CS_PIN = new LED(CS_PIN);
  static GPIO_PWR_PIN = new LED(PWR_PIN);
  static GPIO_BUSY_PIN = new Button(BUSY_PIN);

  static digitalWrite(pin: number, value?: boolean) {
    switch (pin) {
      case RST_PIN:
        if (value) {
          this.GPIO_RST_PIN.on();
          break;
        }
        this.GPIO_RST_PIN.off();
        break;
      case DC_PIN:
        if (value) {
          this.GPIO_DC_PIN.on();
          break;
        }
        this.GPIO_DC_PIN.off();
        break;
      case CS_PIN:
        if (value) {
          this.GPIO_CS_PIN.on();
          break;
        }
        this.GPIO_CS_PIN.off();
        break;
      case PWR_PIN:
        if (value) {
          this.GPIO_PWR_PIN.on();
          break;
        }
        this.GPIO_PWR_PIN.off();
        break;
    }
  }

  static digitalRead(pin: number) {
    switch (pin) {
      case BUSY_PIN:
        return this.GPIO_BUSY_PIN.gpio.getValue();
      case RST_PIN:
        return this.GPIO_RST_PIN.gpio.getValue();
      case DC_PIN:
        return this.GPIO_DC_PIN.gpio.getValue();
      case CS_PIN:
        return this.GPIO_CS_PIN.gpio.getValue();
      case PWR_PIN:
        return this.GPIO_PWR_PIN.gpio.getValue();
    }
  }

  static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static spiWriteByte(bytes: Uint8Array | number) {
    console.log("SPI write byte:", bytes);
  }

  static moduleInit() {
    this.GPIO_RST_PIN.off();
    this.GPIO_DC_PIN.off();
    this.GPIO_CS_PIN.off();
    this.GPIO_PWR_PIN.on();
  }

  static moduleExit() {
    this.GPIO_RST_PIN.off();
    this.GPIO_DC_PIN.off();
    this.GPIO_CS_PIN.off();
    this.GPIO_PWR_PIN.off();
  }

}
