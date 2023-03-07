const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  // Size of the whole context
  dimensions: [ 1080, 1080 ],
  animate: true,
  playbackRate: "throttle",
  fps: 10
};

let manager, image;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

// type${} is the small
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 15;
  const cols = Math.floor( width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

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
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      // getting the red value of the RGB
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(g);

      // context.font = `${cell * 2}px ${fontFamily}`;
      // if (Math.random() < 0.1) context.font = `${cell * 1}px ${fontFamily}`;

      context.fillStyle = 'white';

      context.save();
      context.translate(x + cell * 0.5, y + cell * 0.5);

      context.fillText(glyph, 0, 0);
      // Random
      // context.drawImage(image, 0, 0, cols / 2, rows / 2);

      context.restore();
    };

    context.drawImage(typeCanvas, 0, 0);
  };
};

// Glyphs for design
const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';

  const glyphs = '_= /'.split('');

  return random.pick(glyphs);
};

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject ) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};
// 

const start = async () => {
  const url = './images/pics.jpg';
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();