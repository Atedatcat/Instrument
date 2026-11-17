
// ------------------------------
// 1. VARIABLES
// ------------------------------

// Images
let backgroundImage;
let waterImage;
let dolphinImage;

// Sounds
let sunshineSound;
let oceanSound;

// Canvas dimensions
let sceneWidth = 560;
let sceneHeight = 416;

// Sun position
let sunX = 110;
let sunY = 105;
let sunSize = 105;

// Dolphin position
let dolphinStartX = 25;
let dolphinStartY = 380;

let dolphinX = dolphinStartX;
let dolphinY = dolphinStartY;

let dolphinWidth = 175;
let dolphinHeight = 130;

// Dolphin animation settings
let jumping = false;
let jumpStart = 0;

let jumpDuration = 1800;
let jumpDistance = 360;
let jumpHeight = 230;


// ------------------------------
// 2. LOAD IMAGES AND SOUNDS
// ------------------------------

function preload() {

  backgroundImage = loadImage("sunset-background.jpg");
  waterImage = loadImage("ocean-water.png");
  dolphinImage = loadImage("dolphin.png");

  sunshineSound = loadSound("sunshine.mp3");
  oceanSound = loadSound("ocean-wave.mp3");

}


// ------------------------------
// 3. SET UP THE CANVAS
// ------------------------------

function setup() {

  let canvas = createCanvas(sceneWidth, sceneHeight);

  canvas.parent("canvas-container");

  imageMode(CORNER);

  describe(
    "An interactive pastel sunset over the ocean. Clicking the sun plays a sunshine sound, clicking the water plays an ocean sound, and clicking the sky makes a dolphin jump across the ocean."
  );

}


// ------------------------------
// 4. DRAW THE SCENE
// ------------------------------

function draw() {

  // Background
  image(backgroundImage, 0, 0, width, height);

  // Sun
  drawSun();

  // Dolphin animation
  drawDolphin();

  // Water must be drawn LAST
  // so the dolphin disappears behind it.
  image(waterImage, 0, 0, width, height);

}


// ------------------------------
// 5. DRAW THE SUN
// ------------------------------

function drawSun() {

  let ctx = drawingContext;

  let gradient = ctx.createLinearGradient(
    sunX - sunSize / 2,
    sunY - sunSize / 2,
    sunX + sunSize / 2,
    sunY + sunSize / 2
  );

  gradient.addColorStop(0, "#FFE18B");
  gradient.addColorStop(1, "#F58C83");

  ctx.fillStyle = gradient;

  ctx.beginPath();

  ctx.arc(
    sunX,
    sunY,
    sunSize / 2,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


// ------------------------------
// 6. DRAW THE DOLPHIN
// ------------------------------

function drawDolphin() {

  // Default starting position
  dolphinX = dolphinStartX;
  dolphinY = dolphinStartY;

  if (jumping) {

    // Calculate animation progress
    let progress = (millis() - jumpStart) / jumpDuration;

    progress = constrain(progress, 0, 1);

    // Move dolphin from left to right
    dolphinX = dolphinStartX + jumpDistance * progress;

    // Create curved jumping motion
    dolphinY = dolphinStartY -
      jumpHeight * sin(progress * PI);

    // Reset when jump finishes
    if (progress >= 1) {

      jumping = false;

      dolphinX = dolphinStartX;
      dolphinY = dolphinStartY;

    }

  }

  // Draw dolphin
  image(
    dolphinImage,
    dolphinX,
    dolphinY,
    dolphinWidth,
    dolphinHeight
  );

}


// ------------------------------
// 7. WATER WAVE POSITION
// ------------------------------

function waterTopAt(x) {

  return 352 - 18 * cos(TWO_PI * x / 280);

}


// ------------------------------
// 8. MOUSE INTERACTIONS
// ------------------------------

function mousePressed() {

  // Enable browser audio
  userStartAudio();


  // SUN INTERACTION
  let distanceFromSun = dist(
    mouseX,
    mouseY,
    sunX,
    sunY
  );

  if (distanceFromSun < sunSize / 2) {

    if (sunshineSound.isPlaying()) {
      sunshineSound.stop();
    }

    sunshineSound.play();

    return false;

  }


  // OCEAN INTERACTION
  if (mouseY >= waterTopAt(mouseX)) {

    if (oceanSound.isPlaying()) {
      oceanSound.stop();
    }

    oceanSound.play();

    return false;

  }


  // DOLPHIN INTERACTION
  if (!jumping) {

    jumping = true;
    jumpStart = millis();

  }

  return false;

}