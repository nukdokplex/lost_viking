import {Vector2, Vector3} from "./vector.js";


class Collision {
    radius
    subject
    constructor(radius, subject) {
        this.radius = radius
        this.subject = subject
    }

    collide(subject){
        return this.getDistance(subject.position) <= this.radius+subject.collision.radius;
    }

    collideCanvasBorders(){
        return this.collidePosition(new Vector2(0, this.subject.position.y)) ||
            this.collidePosition(new Vector2(this.subject.level.game.canvas.clientWidth, this.subject.position.y)) ||
            this.collidePosition(new Vector2(this.subject.position.x, 0)) ||
            this.collidePosition(new Vector2(this.subject.position.x, this.subject.level.game.canvas.clientHeight))
    }

    collideCanvasSpecificBorders(left = false, top = false, right = false, bottom = false){
        return this.collidePosition(new Vector2(0, this.subject.position.y)) && left ||
            this.collidePosition(new Vector2(this.subject.level.game.canvas.clientWidth, this.subject.position.y)) && right ||
            this.collidePosition(new Vector2(this.subject.position.x, 0)) && top ||
            this.collidePosition(new Vector2(this.subject.position.x, this.subject.level.game.canvas.clientHeight)) && bottom
    }

    collideCanvasVerticalBorders(){
        return this.collidePosition(new Vector2(0, this.subject.position.y)) ||
            this.collidePosition(new Vector2(this.subject.level.game.canvas.clientWidth, this.subject.position.y))
    }

    collideCanvasHorizontalBorders(){
        return this.collidePosition(new Vector2(this.subject.position.x, 0)) ||
            this.collidePosition(new Vector2(this.subject.position.x, this.subject.level.game.canvas.clientHeight))
    }

    collideCanvasBordersWithPosition(position){
        return this.collidePosition(new Vector2(0, position.y)) ||
            this.collidePosition(new Vector2(this.subject.level.game.canvas.clientWidth, position.y)) ||
            this.collidePosition(new Vector2(position.x, 0)) ||
            this.collidePosition(new Vector2(position.x, this.subject.level.game.canvas.clientHeight))
    }

    collidePosition(position){
        return this.getDistance(position) <= this.radius;
    }

    getDistance(position){
        return Math.sqrt(
            Math.pow(this.subject.position.x - position.x, 2) +
            Math.pow(this.subject.position.y - position.y, 2)
        );
    }
}

export {Collision}