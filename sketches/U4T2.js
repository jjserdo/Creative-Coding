const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate:true
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    const phi = random.range(0, Math.PI * 2);

    agents.push(new Agent(x, y, phi));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      // agent.bounce(width, height);
      agent.wrap(width, height);
    });

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y, phi) {
    this.x = x;
    this.y = y;
    this.phi = phi;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y, phi) {
    this.pos = new Vector(x, y, phi);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1), random.range(-0.1, 0.1));
    this.size = random.range(10, 70);
  }

  // bounce(width, height) {
  //   if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
  //   if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  // }

  wrap(width, height) {
    if (this.pos.x <= 0) this.pos.x = width - 1;
    if (this.pos.x >= width) this.pos.x = 0;
    if (this.pos.y <= 0) this.pos.y = height - 1;
    if (this.pos.y >= height) this.pos.y = 0;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.pos.phi += this.vel.phi;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(this.pos.phi);

    context.lineWidth = 4;

    context.beginPath();
    context.rect(-this.size/2, -this.size/2, this.size, this.size);
    context.fill();
    context.stroke();

    context.restore();
  }
}