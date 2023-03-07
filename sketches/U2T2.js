const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1080 ]
};

let pal = ['#e27226', '#e8c295', '#74380f', '#4b7d9c', '#a1d3c9', '#3c3434'];

let colorGrid = (number) => {
  return pal[number];
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#f1f4c6';
    context.fillRect(0, 0, width, height);

    const cx = 0;
    const cy = 0;

    const w = width  * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 40;
    const radius = width * 0.9;

    for (let i = 0; i < num * 10; i++) {
      // Necessary Calculations
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);
      xx = cx + radius * 0.2 * Math.sin(angle);
      yy = cy + radius * 0.2 * Math.cos(angle);

      // Center Piece
      if (random.chance(0.7)) {
        context.save();
        context.translate(xx, yy);
        context.rotate(angle);
        // context.scale(random.range(0.1, 2), random.range(0.2, 0.5))
        context.scale(1, random.range(0.5,1.3));

        context.fillStyle = "#9d94ff";
        context.beginPath();
        context.rect(-w * 0.5, -h * 0.5, w, h);
        context.fill();
        context.restore();
      }
      
      // Clock Tick Marks
      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5))

      context.fillStyle = "Black";
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      // Arcs
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(5, 20);
      context.strokeStyle = pal[random.rangeFloor(pal.length)];

      context.beginPath();
      context.arc(0, 0, radius * random.range(0.3, 1.5), slice * random.range(0, -8), slice * random.range(1, 5));
      context.stroke();

      context.restore();

      // Extra Circles
      context.save();
      context.translate(cx + radius * random.range(1.2, 1.5) * Math.sin(angle), cy + radius * random.range(1.2, 1.5) * Math.cos(angle));
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.2, 0.5))

      context.lineWidth = random.range(10, 40);

      context.beginPath();
      context.arc(0, 0, radius * random.range(0.05, 0.3), slice * random.range(0, -8), slice * random.range(1, 5));
      context.stroke();

      context.restore();

    } 


  };
};

canvasSketch(sketch, settings);
