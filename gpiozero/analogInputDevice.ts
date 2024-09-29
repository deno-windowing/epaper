import { MCP3008 } from "./mcp3008.ts";

export class AnalogInputDevice {
  #adc: MCP3008;
  #channel: number;

  constructor(channel: number, spiChannel: number = 0) {
    this.#adc = new MCP3008(spiChannel);
    this.#channel = channel;
  }

  get value(): number {
    return this.#adc.read(this.#channel);
  }

  close() {
    this.#adc.close();
  }
}
