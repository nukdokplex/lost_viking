import {Player, Enemy, Bullet, Gun} from "./subjects.js";
import {Vector2, Vector3} from "./vector.js";

class Screen {
    game
    background
    constructor(game) {
        this.game = game
    }

    render(){
        if (this.background !== undefined){
            this.game.gl.drawImage(
                this.background,
                0,
                0,
                400,
                711
            )
        }
    }

    destroy(){

    }

    setBackground(path){
        this.background = new Image()
        this.background.src = path
    }

    move(){

    }
}

class Level extends Screen{
    player
    enemies
    enemiesToSpawn
    musicFile
    backgroundImage
    pp
    ppCounter
    musicPlayer
    bullets
    ellapsedTime = 0

    constructor(game, enemiesToSpawn, musicFile, backgroundImage) {
        super(game)
        this.bullets = []
        this.enemies = []
        this.player = new Player(5, this, 20, 100);
        this.player.position = new Vector2(canvas.width / 2, canvas.height - 150)
        this.enemiesToSpawn = enemiesToSpawn
        this.musicFile = musicFile
        this.backgroundImage = backgroundImage

        this.setBackground(this.backgroundImage)

    }

    destroy(){
        super.destroy()
    }

    render(){
        super.render()
        this.ellapsedTime+=renderInterval
        this.player.render()

        this.bullets.forEach(function (bullet) {
            bullet.render()
        })
        this.enemies.forEach(enemy => {
            enemy.render()
        })

        this.spawn()
    }

    spawn(){

        let spawnEnemies = this.enemiesToSpawn[this.ellapsedTime]

        if (spawnEnemies !== undefined){

            spawnEnemies.forEach(e => {
                let enemyToSpawn = new Enemy(
                    this,
                    e.speed,
                    20,
                    new Vector3(e.movementVector.x, e.movementVector.y),
                    e.spawnX,
                    e.hp,
                    e.cooldown,
                    e.damage,
                    e.bulletDamage,
                    e.bulletSpeed,
                    e.fill
                )
                this.enemies.push(enemyToSpawn)
            })
        }
    }

    move(){
        super.move()
        this.player.move()
        this.bullets.forEach(bullet => bullet.move())
        this.enemies.forEach(enemy => enemy.move())
    }
}

class Menu extends Screen{
    constructor(game) {
        super(game);
    }
}

class MainMenu extends Screen{
    labels = []
    buttons = []

    constructor(game) {
        super(game);
    }
}

export {Screen, Level, Menu, MainMenu}