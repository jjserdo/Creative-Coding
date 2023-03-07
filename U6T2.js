const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  // Size of the whole context
  dimensions: [ 1080, 1080 ],
  animate: true,
  playbackRate: "throttle",
  fps: 10
};

///////// Tweakpane Initialization ///////////////////////
const params = {
  lineCap: 'butt',
  cell: 20,
  scaleMin: 1,
  scaleMax: 30,
  frame: 0,
  animate: true,
  words: 'math',
};


///////// Initialization //////////////////////////////////
let manager, image;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

///////////////// Creating type and canvas /////////////////
// type${} is the small
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cols = Math.floor( width / params.cell);
  const rows = Math.floor(height / params.cell);
  const numcells = cols * rows;

  // Shows that typeCanvas is small
  typeCanvas.width  = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    // Draw Image in the small context
    typeContext.drawImage(image, 0, 0, cols, rows);
    // Get Image data from the small context
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    
    // Initialize Context
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    // Get RGB data from typeData
    for (let i = 0; i < numcells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * params.cell;
      const y = row * params.cell;

      // getting the red value of the RGB
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(g);

      // context.font = `${params.cell * 2}px ${fontFamily}`;
      // if (Math.random() < 0.1) context.font = `${params.cell * 1}px ${fontFamily}`;

      // Frame based on animate on or off
      const f = params.animate ? frame : params.frame;

      context.fillStyle = 'white';

      context.save();
      context.translate(x + params.cell * 0.5, y + params.cell * 0.5);

      context.fillText(glyph, 0, 0);
      // Random
      // context.drawImage(image, 0, 0, cols / 2, rows / 2);

      context.restore();
    };

    context.drawImage(typeCanvas, 0, 0);
  };
};

///////////////////////// Functions  /////////////////////////

// Glyphs for design
const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';

  const glyphs = params.words.split('');

  return random.pick(glyphs);
};

// Async Function for loading image
const LoadImage = (url) => {
  return new Promise((resolve, reject ) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

//////////////// GUI /////////////////////////////////////////
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid'});
  folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square'}});
  folder.addInput(params, 'cell', {min: 2, max: 50, step: 1});
  folder.addInput(params, 'scaleMin', {min: 1, max: 100});
  folder.addInput(params, 'scaleMax', {min: 1, max: 100});


  folder = pane.addFolder({ title: 'Animation'});
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', {min: 0, max: 999});
  folder.addInput(params, 'words')
}

//////////////// Starting Canvas-Sketch ///////////////////////
const start = async () => {
  const url = './images/pics.jpg';
  image = await LoadImage(url);
  createPane();
  manager = await canvasSketch(sketch, settings);
};

start();