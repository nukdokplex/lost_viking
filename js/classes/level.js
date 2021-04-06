import {Player, Enemy, Bullet, Gun} from "./subjects.js";
import {Vector2, Vector3} from "./vector.js";
import {Button} from "./uielements.js";

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
        this

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
    originalEnemiesToSpawn
    musicFile
    backgroundImage
    pp
    ppCounter
    musicPlayer
    ready
    audioReady
    bullets
    ellapsedTime

    constructor(game, enemiesToSpawn, musicFile, backgroundImage) {
        super(game)
        this.bullets = []
        this.enemies = []
        this.ready = false
        this.audioReady = false
        console.log(this.ellapsedTime)
        this.ellapsedTime = 0
        console.log(this.ellapsedTime)
        this.player = new Player(5, this, 20, 100);
        this.player.position = new Vector2(this.game.canvas.width / 2, this.game.canvas.height - 150)
        this.enemiesToSpawn = enemiesToSpawn
        this.originalEnemiesToSpawn = enemiesToSpawn
        this.musicFile = musicFile
        this.backgroundImage = backgroundImage

        this.musicPlayer = new Audio(this.musicFile)
        this.musicPlayer.volume = 0.15
        this.musicPlayer.addEventListener('canplaythrough', () => {
            this.ready = true
            this.musicPlayer.play()

        })


        this.setBackground(this.backgroundImage)

    }

    destroy(){
        this.musicPlayer.src = ""
        this.musicPlayer.remove()
        this.player = null
        super.destroy()

    }

    render(){
        super.render()

        this.player.render()

        this.bullets.forEach(function (bullet) {
            bullet.render()
        })
        this.enemies.forEach(enemy => {
            enemy.render()
        })


    }

    gameOver(){
        this.game.navigateWithoutDestruction(new Menu(this.game, this, "/img/game-over.png"))
    }

    cleared(){
        this.game.navigateWithoutDestruction(new Menu(this.game, this, "/img/level-cleared.png"))
    }

    spawn(){
        while(true) {

            if (this.enemiesToSpawn.length === 0){
                this.cleared()
                break;
            }

            if (this.enemiesToSpawn[0].time > this.ellapsedTime) {
                break;
            }

            let e = this.enemiesToSpawn.shift().enemy
            //console.log(e)
            let enemyToSpawn = new Enemy(
                this,
                e.speed,
                20,
                new Vector3(e.movementVector.x, e.movementVector.y),
                new Vector2(e.spawnX, 0),
                e.hp,
                e.cooldown,
                e.damage,
                e.bulletDamage,
                e.bulletSpeed,
                e.fill
            )
            this.enemies.push(enemyToSpawn)
        }
    }

    move(){
        super.move()
        this.ellapsedTime+=10
        this.player.move()
        this.bullets.forEach(bullet => bullet.move())
        this.enemies.forEach(enemy => enemy.move())
        this.spawn()
    }
}

class Menu extends Screen{
    buttons = []
    splashImage
    splashImagePosition

    constructor(game, level, splashImagePath) {
        super(game);
        this.level = level
        this.level.game = this.game
        this.level.musicPlayer.volume = 0.05
        this.splashImage = new Image(splashImagePath)
        this.splashImagePosition = new Vector2(40,40)
        this.buttons.push(new Button(new Vector2(40, 250), this, new Vector2(320, 60)))
        this.buttons[0].fill = "rgb(255,255,255)"
        this.buttons[0].fillText = "rgb(0,0,0)"
        this.buttons[0].font = "48px sans-serif"
        this.buttons[0].label = "< Main Menu"
        this.buttons[0].setOnClickListener(() => {
            this.level.musicPlayer.pause()
            this.level.musicPlayer.currentTime = 0
            this.game.navigate(new MainMenu(this.game))

        })

        this.buttons.push(new Button(new Vector2(40, 320), this, new Vector2(320, 60)))
        this.buttons[1].fill = "rgb(255,255,255)"
        this.buttons[1].fillText = "rgb(0,0,0)"
        this.buttons[1].font = "48px sans-serif"
        this.buttons[1].label = "Retry"
        this.buttons[1].setOnClickListener(() => {
            this.level.musicPlayer.pause()
            this.level.musicPlayer.currentTime = 0
            this.game.navigate(new Level(this.game, this.level.originalEnemiesToSpawn, this.level.musicFile, this.level.backgroundImage))

        })
    }

    render() {
        super.render()
        this.level.render()
        this.game.gl.fillStyle = "rgba(0,0,0,0.15)"
        this.game.gl.fillRect(0,0, this.game.canvas.clientWidth, this.game.canvas.clientHeight)
        this.game.gl.drawImage(this.splashImage, this.splashImagePosition.x, this.splashImagePosition.y, this.splashImage.width, this.splashImage.height)
        this.buttons.forEach(button => button.render())

    }

    move() {
        super.move();
        //this.level.move()
    }
}

class MainMenu extends Screen{
    labels = []
    buttons = []
    selectedLevel = 1
    level1Button
    level2Button
    level3Button

    constructor(game) {
        super(game);

        this.level1Button = new Button(new Vector2(40, 230), this, new Vector2(320, 60))

        this.level1Button.fill = "rgb(50, 255, 100)"
        this.level1Button.fillText = "white"
        this.level1Button.font = "48px sans-serif"
        this.level1Button.setOnClickListener(() => {
            $.ajax({
                type: 'GET',
                url: "/data/level_1.json",
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: (data) => {
                    this.game.navigate(new Level(this.game, data.enemies, data.musicFile, data.backgroundImage))
                },
                error: function (e) {
                    alert("Не удалось загрузить данные уровня... Действие невозможно!")
                }


            })

        })
        this.level1Button.label = "Level 1"

        this.buttons.push(this.level1Button)
    }

    render(){
        super.render()
        this.buttons.forEach(button => {
            button.render()
        })
        this.labels.forEach(label => {
            label.render()
        })
    }
}

export {Screen, Level, Menu, MainMenu}