function Vector(x, y, polar) {

    if (polar) { //given mag (x) and direction (y)...
        this.x = x * Math.cos(y);
        this.y = x * Math.sin(y);
    } else {
        this.x = x;
        this.y = y;
    }
}

Vector.prototype.isOnScreen = function() {
    if (this.x < canvas.width && this.x > 0 && this.y < canvas.height && this.y > 0) {
        return true;
    }
    return false;
}

Vector.prototype.getMag = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

Vector.prototype.distance = function (v) {
    return Math.sqrt(
        (Math.pow(this.x - v.x, 2)) +
        (Math.pow(this.y - v.y, 2))
    );
}

Vector.prototype.multiply = function (k) {
    return new Vector(this.x * k, this.y * k);
}

Vector.prototype.multVectors = function (v) {
    return (this.x * v.x) + (this.y * v.y);
}

Vector.prototype.subtract = function (v) {
    return new Vector(this.x - v.x, this.y - v.y);
}

Vector.prototype.project = function (v) {
    var tangent = v.multiply((v.multVectors(this)) / Math.pow(v.getMag(), 2)); 
    //Vector tangent to the line of collision. 
    var inLine = new Vector(v.y, -v.x);
    inLine = inLine.multiply(Math.abs((v.x * this.y) - (v.y * this.x)) / Math.pow(v.getMag(), 2));
    //Vector in line with the line of collision
    if (inLine.multVectors(this) < 0) { //if theta is less than 0, reverse inline
        return [tangent, inLine.multiply(-1)];
    } else {
        return [tangent, inLine];
    }
}

Vector.prototype.add = function (v) {
    return new Vector(this.x + v.x, this.y + v.y);
}

Vector.prototype.getDirection = function () {
    return Math.atan(this.y/this.x);
}
