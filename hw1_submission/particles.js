// document.addEventListener("DOMContentLoaded", function () {
// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.r = random(8, 15); // doubles as mass
    this.lucky = Math.random() < 0.05;

    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-2, 2), random(-1, 1.5));
    this.acc = createVector(0, 0);

    this.maxforce = 0.0000000000001;
    this.maxspeed = 1.5;

    this.distanceToBlob = this.pos.dist(blobMonsterPos);
  }

  // creation of a particle.
  show() {
    noStroke();
    fill(this.lucky ? "rgba(245,169,72,1)" : "rgba(200,169,169,0.5)");
    // push();

    if (this.distanceToBlob < maxBlobRadius && !this.lucky) {
      fill("rgba(255,0,0,0.7) ");
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
    let des = null;

    if (this.pos.x < offset) {
      des = createVector(this.maxspeed, this.vel.y);
    } else if (this.pos.x > width - offset) {
      des = createVector(-this.maxspeed, this.vel.y);
    }

    if (this.pos.y < offset) {
      des = createVector(this.vel.x, this.maxspeed);
    } else if (this.pos.y > height - offset) {
      des = createVector(this.vel.x, -this.maxspeed);
    }

    if (des !== null) {
      des.normalize();
      des.mult(this.maxspeed);
      let steer = p5.Vector.sub(des, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
  seek(target) {
    // params are vector pos of where you want to seek
    let des = p5.Vector.sub(target, this.pos);
    des.setMag(this.maxspeed);
    let steering = p5.Vector.sub(des, this.vel);
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

const minBlobRadius = 25;
const sizeDifference = 35;
let currentBlobRadius = minBlobRadius;
let scareRange = 20;

const growSpeed = 0.1;

let maxBlobRadius = minBlobRadius + sizeDifference;

let blobMonsterPos;

let growing = false;
let blobMonsterFill = "rgba(255,255,255,0.8)";

let score = 0;

let eatSound;
let luckyEatSound;

function preload() {
  soundFormats("mp3");
  eatSound = loadSound("sounds/blip");
  luckyEatSound = loadSound("sounds/powerup");
}

function setup() {
  createCanvas(500, 400, document.getElementById("game"));
  blobMonsterPos = createVector(width / 2, height / 2);
  for (let i = 0; i < width / 5; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background("#0c0e12");
  textSize(22);
  textFont("Pixelify Sans");
  fill("white");

  text(score, 10, 30);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (
      particles[i].distanceToBlob <= currentBlobRadius + particles[i].r &&
      growing
    ) {
      if (particles[i].lucky) {
        maxBlobRadius += 15;
        scareRange = maxBlobRadius / 2 - 5;
        console.log("maxBlobRadius:", maxBlobRadius, "scareRange:", scareRange);
        luckyEatSound.play();
      } else {
        eatSound.play();
      }
      // Remove the particle from the array
      particles.splice(i, 1);
      score += 1;

      continue;
    }
    particles[i].show();
    particles[i].update();
    fleevect = particles[i].flee(blobMonsterPos);

    if (particles[i].distanceToBlob - currentBlobRadius < scareRange) {
      particles[i].applyForce(fleevect);
    }

    particles[i].boundaries(25);
  }

  // draw the blobmonster
  fill(blobMonsterFill);
  circle(width / 2, height / 2, currentBlobRadius * 2);

  fill("rgba(255,255,255,0.1)");
  circle(width / 2, height / 2, maxBlobRadius * 2);
  if (growing) {
    // Gradually increase the size of the circle towards the target size
    currentBlobRadius = lerp(currentBlobRadius, maxBlobRadius, growSpeed);
    // console.log(currentBlobRadius);
  } else {
    // Gradually decrease the size of the circle towards the initial size
    currentBlobRadius = lerp(currentBlobRadius, minBlobRadius, growSpeed);
    // console.log(currentBlobRadius);
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
// });
