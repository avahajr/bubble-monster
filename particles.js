// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.r = random(3, 15);
    this.lucky = Math.random() < 0.05;

    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-2, 2), random(-1, 1.5));
    this.acc = createVector(0, 0);
    this.speed = sqrt(this.vel.x ^ (2 + this.vel.y) ^ 2);

    this.maxforce = 8;
    this.maxspeed = 0.2;

    this.distanceToBlob = dist(this.pos.x, this.pos.y, width / 2, height / 2);
  }

  // creation of a particle.
  createParticle() {
    noStroke();
    fill(this.lucky ? "rgba(245,169,72,1)" : "rgba(200,169,169,0.5)");
    if (this.distanceToBlob < blobMonsterRadius) {
      fill("red");
    }
    circle(this.pos.x, this.pos.y, this.r);
  }

  // setting the particle in motion.
  update() {
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.distanceToBlob = dist(this.pos.x, this.pos.y, width / 2, height / 2);

    // eating logic
  }

  flee(params) {
    //called internally if too close to the blob
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
  for (let i = 0; i < particles.length; i++) {
    particles[i].createParticle();
    particles[i].update();
  }
  // draw the blobmonster
  fill(blobMonsterFill);
  circle(width / 2, height / 2, blobMonsterRadius);

  fill("rgba(255,255,255,0.1)");
  circle(width / 2, height / 2, maxblobsize);
  if (growing) {
    // Gradually increase the size of the circle towards the target size
    blobMonsterRadius = lerp(blobMonsterRadius, maxblobsize, 0.05);
  } else {
    // Gradually decrease the size of the circle towards the initial size
    blobMonsterRadius = lerp(blobMonsterRadius, 50, 0.05);
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
