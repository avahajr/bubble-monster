// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.r = random(3, 15); // doubles as mass
    this.lucky = Math.random() < 0.05;

    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-2, 2), random(-1, 1.5));
    this.acc = createVector(0, 0);
    this.speed = sqrt(this.vel.x ^ (2 + this.vel.y) ^ 2);

    this.maxforce = (1 / 5) * (this.r ^ 5);
    this.maxspeed = 1.5;

    this.distanceToBlob = dist(this.pos.x, this.pos.y, width / 2, height / 2);
  }

  // creation of a particle.
  show() {
    noStroke();
    fill(this.lucky ? "rgba(245,169,72,1)" : "rgba(200,169,169,0.5)");
    push();

    if (this.distanceToBlob < blobMonsterRadius) {
      fill("red");
    }
    circle(this.pos.x, this.pos.y, this.r);
  }

  // setting the particle in motion.
  update() {
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.distanceToBlob = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    // eating logic
  }
  boundaries(offset) {
    let desired = null;

    if (this.pos.x < offset) {
      desired = createVector(this.maxspeed, this.vel.y);
    } else if (this.pos.x > width - offset) {
      desired = createVector(-this.maxspeed, this.vel.y);
    }

    if (this.pos.y < offset) {
      desired = createVector(this.vel.x, this.maxspeed);
    } else if (this.pos.y > height - offset) {
      desired = createVector(this.vel.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
  seek(target) {
    // params are vector pos of where you want to seek
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    let steering = p5.Vector.sub(desired, this.vel);
    return steering;
  }
  flee(target) {
    return this.seek(target).mult(-1);
  }
  applyForce(force) {
    this.acc.add(force);
  }
}

let particles = [];

let blobMonsterRadius = 25;
let sizeDifference = 75;

let maxblobsize = blobMonsterRadius + sizeDifference;

let growing = false;
let blobMonsterFill = "rgba(255,255,255,0.8)";

let timer = 60;
// let purple = "rgba(189,147,249,0.5)";

function setup() {
  createCanvas(500, 400, document.getElementById("game"));
  for (let i = 0; i < width / 5; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background("#0c0e12");
  textSize(22);
  textFont("Pixelify Sans");
  fill("white");

  text(timer, 10, 30);

  let blobMonster = createVector(width / 2, height / 2);

  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
    particles[i].update();
    fleevect = particles[i].flee(blobMonster);

    if (particles[i].distanceToBlob < blobMonsterRadius - 10 && !growing) {
      particles[i].applyForce(fleevect);
    }
    if (particles[i].distanceToBlob < blobMonsterRadius - 25 && growing) {
      particles[i].applyForce(fleevect);
    }
    particles[i].boundaries(25);
  }

  // draw the blobmonster
  fill(blobMonsterFill);
  circle(width / 2, height / 2, blobMonsterRadius);

  fill("rgba(255,255,255,0.1)");
  circle(width / 2, height / 2, maxblobsize);
  if (growing) {
    // Gradually increase the size of the circle towards the target size
    blobMonsterRadius = lerp(blobMonsterRadius, maxblobsize, 0.125);
  } else {
    // Gradually decrease the size of the circle towards the initial size
    blobMonsterRadius = lerp(blobMonsterRadius, 50, 0.125);
  }
}

function keyPressed() {
  if (keyCode === 32) {
    growing = true;
    blobMonsterFill = "rgba(255,255,255,0.95)";
  }
}

function keyReleased() {
  if (keyCode === 32) {
    growing = false;
    blobMonsterFill = "rgba(255,255,255,0.8)";
  }
}
