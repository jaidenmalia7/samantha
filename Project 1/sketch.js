let heartSize = 50; // Heart size
let pulseSpeed = 2; // Speed of pulsation

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(202, 31, 59);

  // Center
  let centerX = width / 2;
  let centerY = height / 2;

  // Calculate the pulsating heart size
  let heartBeat = sin(frameCount * 0.1) * 10; // Adjust the factor for speed

  //Main heart
  noStroke();
  fill(238, 131, 149);
  beginShape();
  vertex(centerX, centerY + heartBeat);
  bezierVertex(centerX, centerY - 50 + heartBeat, centerX + 100, centerY - 50 + heartBeat, centerX + 100, centerY + heartBeat);
  bezierVertex(centerX + 100, centerY + 50 + heartBeat, centerX, centerY + 150 + heartBeat, centerX, centerY + 150 + heartBeat);
  bezierVertex(centerX, centerY + 150 + heartBeat, centerX - 100, centerY + 50 + heartBeat, centerX - 100, centerY + heartBeat);
  bezierVertex(centerX - 100, centerY - 50 + heartBeat, centerX, centerY - 50 + heartBeat, centerX, centerY + heartBeat);
  endShape(CLOSE);
}
