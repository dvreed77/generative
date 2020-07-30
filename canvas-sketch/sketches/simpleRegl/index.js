/**
 * A WebGL example of a dithered noise blob/sphere, using Regl.
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require("canvas-sketch");

// Import geometry & utilities
const createRegl = require("regl");
const createPrimitive = require("primitive-icosphere");
const createCamera = require("perspective-camera");
const glslify = require("glslify");
const hexRgb = require("hex-rgb");

// Utility to convert hex string to [ r, g, b] floats
const hexToRGB = (hex) => {
  const rgba = hexRgb(hex, { format: "array" });
  return rgba.slice(0, 3).map((n) => n / 255);
};

const settings = {
  // Output size
  dimensions: [256, 256],

  // Setup render loop
  animate: true,
  duration: 7,
  fps: 24,

  // Ensure we set up a canvas with WebGL context, not 2D
  context: "webgl",

  // We can pass down some properties to the WebGL context...
  attributes: {
    antialias: true, // turn on MSAA
  },
};

const sketch = ({ gl, canvasWidth, canvasHeight }) => {
  // Background & foreground colors
  const color = "#dbdbcf";
  const foregroundRGB = hexToRGB(color);
  const backgroundRGBA = [...foregroundRGB, 1.0];

  const color1 = "#09a0c7";
  const color2 = [...hexToRGB(color1), 1];

  // Setup REGL with our canvas context
  const regl = createRegl({ gl });

  const drawMesh = regl({
    // In a draw call, we can pass the shader source code to regl
    frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

    vert: `
  precision mediump float;
  attribute vec2 position;
  void main () {
    gl_Position = vec4(position, 0, 1);
  }`,

    attributes: {
      position: [
        [-1, 0],
        [0, -1],
        [1, 1],
      ],
    },

    uniforms: {
      color: color2,
    },

    count: 3,
  });

  return ({ viewportWidth, viewportHeight, time, playhead }) => {
    // On each tick, update regl timers and sizes
    regl.poll();

    // Clear backbuffer with black
    regl.clear({
      color: backgroundRGBA,
      depth: 1,
      stencil: 0,
    });

    drawMesh();
  };
};

canvasSketch(sketch, settings);
