import {GameObject} from "./gameobject.js";
import {Collision} from "./collision.js";
import {Vector2, Vector3} from "./vector.js";

function hslToRgb(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        let hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

class Subject extends GameObject {
    defaultSpeed
    movementVector
    health
    damage
    collision
    level
    constructor(defaultSpeed, collisionRadius, level, position) {
        super(position, level);
        this.defaultSpeed = defaultSpeed
        this.collision = new Collision(collisionRadius, this)
        this.level = level
    }

    render() {
        //Render collision
        /*gl.strokeStyle = "rgb(255,255,255)"
        gl.beginPath()
        gl.arc(this.position.x, this.position.y, this.collision.radius, 0, 2*Math.PI, false)
        gl.stroke()*/
        super.render();
    }

    setMovement(movementVector){
        this.movementVector = movementVector
    }

    move(){
        let newPosition = new Vector2(this.position.x + this.movementVector.x*this.defaultSpeed, this.position.y + this.movementVector.y*this.defaultSpeed)

        //Tricky stop-movement canvas border collisions
        //They may look spaghettily, but this is only way to make it work
        if (this.movementVector.x !== 0){
            if (this.movementVector.x > 0 && !this.collision.collideCanvasSpecificBorders(false, false, true) ||
                this.movementVector.x < 0 && !this.collision.collideCanvasSpecificBorders(true)){
                this.position.x = newPosition.x
            }
        }

        if (this.movementVector.y !== 0){
            if (this.movementVector.y > 0 && !this.collision.collideCanvasSpecificBorders(false, false, false, true) ||
                this.movementVector.y < 0 && !this.collision.collideCanvasSpecificBorders(false, true)){
                this.position.y = newPosition.y
            }
        }

    }

    destroy(type){
        if (type === Bullet){
            this.removeFromArray(this.level.bullets)
        }
        else if (type === Enemy){
            this.removeFromArray(this.level.enemies)
        }
    }

    removeFromArray(array){
        array.splice(
            array.indexOf(this),
            1
        )
    }
}

class Bullet extends Subject {
    movementVector
    damage
    id
    constructor(damage, position, movementVector, defaultSpeed, collisionRadius, level) {
        super(defaultSpeed, collisionRadius, level);
        this.damage = 50;
        this.position = position;
        this.movementVector = movementVector
        this.defaultSpeed = defaultSpeed
    }

    render(){
        this.level.game.gl.fillStyle = "rgba(0, 125, 200, 1 )";
        this.level.game.gl.beginPath()
        this.level.game.gl.arc(this.position.x, this.position.y, this.collision.radius, 0, 2 * Math.PI)
        this.level.game.gl.closePath()
        this.level.game.gl.fill()
        super.render()
    }

    move(){
        super.move()


        if (this.collision.collideCanvasSpecificBorders(false, true, false, true)){
            this.destroy(Bullet)
        }

        if (this.collision.collideCanvasSpecificBorders(true, false, true)){
            this.movementVector.x = -this.movementVector.x
        }

    }
}

class Gun extends GameObject {
    isFiring = false
    cooldownTime
    ellapsedTime
    owner
    constructor(owner, bulletVector, bulletSpeed, bulletDamage, gunPosition, cooldownTime, level) {
        super(0)
        this.ellapsedTime = 0
        this.cooldownTime = 150
        this.owner = owner
        this.bulletVector = bulletVector
        this.bulletSpeed = bulletSpeed
        this.bulletDamage = bulletDamage
        this.gunPosition = gunPosition
        this.cooldownTime = cooldownTime
        this.level = level
    }

    getGunAbsolutePosition(){
        return new Vector2(this.owner.position.x+this.gunPosition.x, this.owner.position.y+this.gunPosition.y)
    }

    fire(){

        if (this.ellapsedTime >= this.cooldownTime && this.isFiring){
            let bullets = [];
            bullets.push(new Bullet(this.bulletDamage, this.getGunAbsolutePosition(), this.bulletVector, this.bulletSpeed, 3, this.owner.level))
            this.isCooldown = true
            this.ellapsedTime = 0
            return bullets;

        }
        else{
            this.ellapsedTime+=moveInterval
            return null;
        }
    }
}

class Enemy extends Subject {

    health
    gun
    constructor(level, defaultSpeed, collisionRadius, movementVector, position, health, cooldown, damage, bulletDamage, bulletSpeed, fill) {
        super(defaultSpeed, collisionRadius, level, position);

        this.movementVector = movementVector
        this.health = health
        this.gun = new Gun(this, new Vector3(this.movementVector.x, 1, 1), bulletSpeed, bulletDamage, new Vector2(0, 32), cooldown)
        this.gun.isFiring = cooldown > 0

        this.damage = damage
        this.fill = fill
    }

    render() {
        this.level.game.gl.fillStyle = this.fill;
        this.level.game.gl.beginPath()
        this.level.game.gl.moveTo(this.position.x-36, this.position.y - 31)
        this.level.game.gl.lineTo(this.position.x+36, this.position.y - 31)
        this.level.game.gl.lineTo(this.position.x, this.position.y + 31)
        this.level.game.gl.closePath()
        this.level.game.gl.fill()
        super.render()
    }

    move() {
        super.move();

        for (let i = 0; i < this.level.bullets.length; i++){
            if (this.collision.collide(this.level.bullets[i])){
                this.health -= this.level.bullets[i].damage
                this.level.pp += 5
                this.level.bullets.splice(i, 1)
            }
        }

        if (this.health <= 0){
            this.level.pp += 10
            this.destroy(Enemy)

        }

        if (this.collision.collideCanvasSpecificBorders(false, false, false, true)){
            this.destroy(Enemy)
        }

        if (this.collision.collideCanvasSpecificBorders(true, false, true)){
            this.movementVector.x = -this.movementVector.x
        }

        let bullets = this.gun.fire()

        if (bullets != null){
            Array.prototype.push.apply(this.level.bullets, bullets)
        }
    }
}

class Player extends Subject {
    gun
    maxHealth = 150
    constructor(defaultSpeed, level, collisionRadius, health) {
        super(defaultSpeed, collisionRadius, level);
        this.gun = new Gun(this, new Vector3(0, -1, 1), 7, 50, new Vector2(0, -32), 100)
        this.health = health
    }

    render() {
        let color = hslToRgb(this.health / this.maxHealth / 3, 1, 0.5)
        this.level.game.gl.fillStyle = "rgba( "+color[0]+", "+color[1]+", "+color[2]+", 1 )";
        this.level.game.gl.beginPath()
        this.level.game.gl.moveTo(this.position.x-36, this.position.y + 31)
        this.level.game.gl.lineTo(this.position.x+36, this.position.y + 31)
        this.level.game.gl.lineTo(this.position.x, this.position.y - 31)
        this.level.game.gl.closePath()
        try {
            this.level.game.gl.fill()
        }
        catch (e) {

        }
        super.render()
    }

    setIsFiring(isFiring){
        this.gun.isFiring = isFiring
    }

    move(){
        super.move()

        for (let i = 0; i < this.level.enemies.length; i++){
            if (this.collision.collide(this.level.enemies[i])){
                this.health -= this.level.enemies[i].damage
                this.level.enemies[i].destroy(Enemy)
            }
        }

        for (let i = 0; i < this.level.bullets.length; i++){
            if (this.collision.collide(this.level.bullets[i])){
                this.health -= this.level.bullets[i].damage
                this.level.bullets[i].destroy(Bullet)
            }
        }

        if (this.health <= 0){
            this.level.gameOver()
        }

        let bullets = this.gun.fire()

        if (bullets != null){
            Array.prototype.push.apply(this.level.bullets, bullets)
        }
    }
}

export {Subject, Enemy, Gun, Bullet, Player}