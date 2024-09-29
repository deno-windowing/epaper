import { EPaperDisplay } from "../mod.ts";
import { createCanvas } from "jsr:@gfx/canvas@0.5.6";

const epaper = new EPaperDisplay();
const canvas = createCanvas(300, 300);
const ctx = canvas.getContext("2d");

// Set line width
ctx.lineWidth = 10;

// Wall
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();

epaper.init();

epaper.display(
    new Uint8Array(ctx.createImageData(epaper.width, epaper.height).data),
    new Uint8Array(ctx.createImageData(epaper.width, epaper.height).data),
);
