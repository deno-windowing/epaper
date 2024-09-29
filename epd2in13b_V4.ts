// deno-lint-ignore-file no-explicit-any
import {
  BUSY_PIN,
  CS_PIN,
  DC_PIN,
  EPD_HEIGHT,
  EPD_WIDTH,
  RaspberryPi,
  RST_PIN,
} from "./core.ts";

export class EPaperDisplay {
  resetPin = RST_PIN;
  dcPin = DC_PIN;
  busyPin = BUSY_PIN;
  csPin = CS_PIN;
  width = EPD_WIDTH;
  height = EPD_HEIGHT;

  reset() {
    RaspberryPi.digitalWrite(this.resetPin, true);
    RaspberryPi.delay(200);
    RaspberryPi.digitalWrite(this.resetPin, false);
    RaspberryPi.delay(200);
    RaspberryPi.digitalWrite(this.resetPin, true);
    RaspberryPi.delay(200);
  }

  sendCommand(command: any) {
    RaspberryPi.digitalWrite(this.dcPin, false);
    RaspberryPi.digitalWrite(this.csPin, false);
    RaspberryPi.spiWriteByte(command);
    RaspberryPi.digitalWrite(this.csPin, true);
  }

  sendData(data: Uint8Array | number) {
    RaspberryPi.digitalWrite(this.dcPin, true);
    RaspberryPi.digitalWrite(this.csPin, false);
    RaspberryPi.spiWriteByte(data);
    RaspberryPi.digitalWrite(this.csPin, true);
  }

  busy() {
    while (RaspberryPi.digitalRead(this.busyPin) === 0) {
      RaspberryPi.delay(100);
    }
  }
  setWindows(
    { start, end }: {
      start: { x: number; y: number };
      end: { x: number; y: number };
    },
  ) {
    this.sendCommand(0x44); // SET_RAM_X_ADDRESS_START_END_POSITION
    this.sendData((start.x >> 3) & 0xff);
    this.sendData((end.x >> 3) & 0xff);

    this.sendCommand(0x45); // SET_RAM_Y_ADDRESS_START_END_POSITION
    this.sendData(start.y & 0xff);
    this.sendData((start.y >> 8) & 0xff);
    this.sendData(end.y & 0xff);
    this.sendData((end.y >> 8) & 0xff);
  }

  setCursor({ x, y }: { x: number; y: number }) {
    this.sendCommand(0x4E); // SET_RAM_X_ADDRESS_COUNTER
    this.sendData(x & 0xff);

    this.sendCommand(0x4F); // SET_RAM_Y_ADDRESS_COUNTER
    this.sendData(y & 0xff);
    this.sendData((y >> 8) & 0xff);
  }

  init() {
    RaspberryPi.moduleInit();
    this.reset();

    this.busy();
    this.sendCommand(0x12); // SWRESET
    this.busy();

    this.sendCommand(0x01); // Driver output control
    this.sendData(0xf9);
    this.sendData(0x00);
    this.sendData(0x00);

    this.sendCommand(0x11); // data entry mode
    this.sendData(0x03);

    this.setWindows({
      start: { x: 0, y: 0 },
      end: { x: this.width - 1, y: this.height - 1 },
    });
    this.setCursor({ x: 0, y: 0 });

    this.sendCommand(0x3C); // BorderWavefrom
    this.sendData(0x05);

    this.sendCommand(0x18); // Read built-in temperature sensor
    this.sendData(0x80);

    this.sendCommand(0x21); // Display update control
    this.sendData(0x80);
    this.sendData(0x80);

    this.busy();
  }

  onDisplay() {
    this.sendCommand(0x20);
  }

  display(imageBlack: Uint8Array, imageRed: Uint8Array) {
    this.sendCommand(0x24); // WRITE_RAM
    for (let i = 0; i < this.width / 8 * this.height; i++) {
      this.sendData(imageBlack[i]);
    }

    this.sendCommand(0x26); // WRITE_RAM
    for (let i = 0; i < this.width / 8 * this.height; i++) {
      this.sendData(imageRed[i]);
    }

    this.sendCommand(0x22); // DISPLAY REFRESH
    this.sendCommand(0xC7); // DISPLAY REFRESH
    this.sendData(0xC4); // DISPLAY REFRESH
    RaspberryPi.delay(100);
    this.busy();
  }

  clear() {
    const lineWidth = this.width % 8 === 0
      ? this.width / 8
      : this.width / 8 + 1;
    const line = new Uint8Array(lineWidth * this.height);
    line.fill(0xff);
    this.sendCommand(0x24);
    this.sendData(line);

    this.sendCommand(0x26);
    this.sendData(line);

    this.onDisplay();
  }

  sleep() {
    this.sendCommand(0x10) // DEEP_SLEEP
    this.sendData(0x01) // check code
    
    RaspberryPi.delay(2000)
    RaspberryPi.moduleExit()
  }

}
