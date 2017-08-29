function Ball(xPos, yPos, xVel, yVel, mass, radius, show, colour) {
    this.pos = new Vector(xPos, yPos);
    this.vel = new Vector(xVel, yVel);
    this.mass = mass;
    this.show = show;
    this.acc = new Vector(0, 0);
    this.radius = radius;
    this.frozen = false;
    this.collided = false;
    this.colour = colour;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
}

Ball.prototype.resetCollision = function () {
    if (this.collided) {
        this.vel = this.newVel;
        this.collided = false;
    }
}

Ball.prototype.hitWall = function () {
    if (this.pos.x > canvas.width - this.radius) { //hit right wall
        this.vel.x *= -1;
    }
    if (this.pos.x < this.radius) { //hit left wall
        this.vel.x *= -1;
    }
    if (this.pos.y < this.radius) { //hit top wall
        ping.play();
        this.remove();
        score += this.mass;
    }
    if (this.pos.y > canvas.height - this.radius) { //hit bottom wall
        this.vel.y *= -1;
        score -= this.mass;
    }
}

Ball.prototype.remove = function () {
    balls.splice(balls.indexOf(this), 1);
}

Ball.prototype.applyGravity = function (b) { //returns a force vector 
    var distance = this.pos.distance(b.pos);
    var gForce = new Vector(0, 0);
    if (distance > this.radius + b.radius + 10) {
        var gForceMag = (G * this.mass * b.mass) / Math.pow(distance, 2) || 0; //Newton's 
        //law of universal gravitation F=(G*M*m)/r^2
        gForce = this.pos.subtract(b.pos); //vector difference between the two balls
        gForce = gForce.multiply(gForceMag / gForce.getMag() /*distance*/ ); //scales gforce 
        //vector to correct magnitude based on gForceMag
    }
    return gForce;
}

Ball.prototype.updateAcceleration = function (force) { //adds the forces to acc
    this.acc = force.multiply(1 / this.mass);
}

Ball.prototype.updateVelocity = function () {
    if (this.vel.getMag() < minVel) {
        this.vel = this.vel.multiply(0);
        return;
    }
    this.hitWall();
    var friction = this.vel.multiply(groundFriction / this.vel.getMag());
    this.vel = this.vel.subtract(friction);
    this.vel = this.vel.add(this.acc);
}

Ball.prototype.updatePosition = function () {
    this.pos = this.pos.add(this.vel.multiply(velScale));
}

Ball.prototype.calculateForce = function () { //calculates the sum of all the force 
    //vectors for gravity
    var sum = new Vector(0, 0);
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (b != this) {
            sum = sum.add(this.applyGravity(b));
        }
    }
    return sum;
}

Ball.prototype.checkCollisions = function () {
    for (var ball of balls) {
        if (ball != this) {
            if (this.contacting(ball)) {
                this.collide(ball);
            };
        }
    }
}

Ball.prototype.contacting = function (b) {
/*    //first check to make sure the balls are not moving away from each other
    var posDif = this.pos.subtract(b.pos);
    var bTheta = b.vel.multVectors(posDif);
    var thisTheta = b.vel.multVectors(posDif);
    var colliding = false;
    if (!(bTheta < 0 && thisTheta < 0)) { //if both balls are not moving away from each other 
        colliding = this.pos.distance(b.pos) <= (this.radius + b.radius);
        //the distance between the balls is less than the sum of their radius's
    }
    return colliding;*/
    return this.pos.distance(b.pos) <= (this.radius + b.radius);
}

Ball.prototype.collide = function (b) {
    var difVector = this.pos.subtract(b.pos);
    var projV = this.vel.project(difVector); //returns projection of velocity vector 
    //against the vector of the difference of the balls' positions 
    this.inLine = projV[1]; //projected vector inline with line of collision
    this.tangent = projV[0]; //projected vector tangent to line of collision
    //during a 2D elastic collision, the only component that changes is the vector 
    //component tangent to the line of collision
    this.bTangent = b.vel.project(difVector)[0];
    //Below is the math for one dimensional elastic collision based calculated knowing the initial 
    //speed (yes speed, not velocity because here we are just looking at the one component
    //of the velocity vector that is tangent to the collision line) and the mass of the two objcets
    //since the momentum (mv) and kinetic energy (1/2(mv^2)) are conserved, we can use a system
    //of equations to isolate the speed for one ball after the collisoion
    //u1 = initial speed of object 1, u2 initial speed of object 2, m1 = mass of obejct 1, m2 = 
    //mass of object 2, v1 = speed of object 1 after collision
    //v1 = (u1(m1-m2)+2*m2*u2)/m1+m2
    this.newTangent = (this.tangent.multiply(this.mass - b.mass).add(this.bTangent.multiply(2 * b.mass)));
    this.newTangent = this.newTangent.multiply(1 / (this.mass + b.mass)); //this line was seperated
    //from the line above simply to make the program less convoluted    
    this.newVel = this.newTangent.add(this.inLine);
    this.collided = true;
}

Ball.prototype.freeze = function () { //freezes a ball so the acc, vel, and pos are
    //not updated
    this.frozen = true;
}

Ball.prototype.unFreeze = function () {
    this.frozen = false;
}

Ball.prototype.showVectors = function () { //visual display of the ball's vectors
    this.showVector(this.vel, '#34cf7f');
    this.showVector(this.inLine, '#00FF00');
    this.showVector(this.tangent, '#FF0000');
    this.showVector(this.newVel, '#e5e100');
    //this.showVector(this.newTangent, '#e500ce');
}

Ball.prototype.showVector = function (v, colour) { //displays a specific vector
    if (v) {
        ctx.beginPath();
        ctx.strokeStyle = colour;
        ctx.moveTo(this.pos.x, this.pos.y);
        var sv = this.pos.add(v.multiply(10)); //scaled vector 
        ctx.lineTo(sv.x, sv.y);
        ctx.stroke();
    }
}
