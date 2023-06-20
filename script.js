const NUM_POINTS = 150;
const POINT_SIZE = 10;
const MAX_VEL = 10.0;

let points = [];

function movePoint(point) {
    point["pos"].add(point["vel"]);
    if (point["pos"].x < 0 || point["pos"].x > width) {
        point["vel"].x *= -1;
    }
    if (point["pos"].y < 0 || point["pos"].y > height) {
        point["vel"].y *= -1;
    }
}

function drawLineFirstPair() {
    let minDistance = points[0]["pos"].dist(points[1]["pos"]);
    let minI = 0;
    let minJ = 1;
    points.forEach((p1, i) => {
        points.forEach((p2, j) => {
            if (i == j) return;
            let dist = p1["pos"].dist(p2["pos"]);
            if (dist < minDistance) {
                minDistance = dist;
                minI = i;
                minJ = j;
            }
        });
    });
    points[minI]["r"] = minDistance / 2.0;
    points[minJ]["r"] = minDistance / 2.0;
    line(points[minI]["pos"].x, points[minI]["pos"].y, points[minJ]["pos"].x, points[minJ]["pos"].y);
}

function drawLineNextPair() {
    console.assert(NUM_POINTS > 2);
    let minI = null;
    let minJ = null;
    let minDistance = width;
    points.forEach((p1, i) => {
        if (p1["r"] == 0) return;
        points.forEach((p2, j) => {
            if (p2["r"] > 0) return;
            let dist = p1["pos"].dist(p2["pos"]);
            if (dist < minDistance) {
                minDistance = dist;
                minI = i;
                minJ = j;
            }
        });
    });
    points[minJ]["r"] = minDistance - points[minI]["r"];
    line(points[minI]["pos"].x, points[minI]["pos"].y, points[minJ]["pos"].x, points[minJ]["pos"].y);
}

function resetRadiusAll() {
    points.forEach((p) => {
        p["r"] = 0.0;
    });
}

function someRadiusNotSet() {
    for (let i = 0; i < NUM_POINTS; i++) {
        if (points[i]["r"] == 0) return true;
    }
    return false;
}

function setup() {
    console.assert(NUM_POINTS > 1);
    createCanvas(windowWidth-20, windowHeight-20);
    for (let i = 0; i < NUM_POINTS; i++) {
        points.push({
            "pos": createVector(random(width), random(height)),
            "vel": createVector(random(-MAX_VEL, MAX_VEL), random(-MAX_VEL, MAX_VEL)),
            "col": color(random(256), random(256), random(256)),
            "r": 0.0,
        });
    }
    strokeWeight(2);
    stroke(253, 208, 35);
}

function draw() {
    background(50, 41, 100);
    resetRadiusAll();
    points.forEach((point) => {
        movePoint(point);
    });
    drawLineFirstPair();
    while (someRadiusNotSet()) {
        drawLineNextPair();
    }
}

function windowResized() {
    resizeCanvas(windowWidth-20, windowHeight-20);
}

setup();