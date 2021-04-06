import {Player, Enemy, Bullet, Gun} from "./subjects.js";
import {Vector2, Vector3} from "./vector.js";
import {Button, Label} from "./uielements.js";

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
        this.pp = 0
        this.ppCounter = new Label(new Vector2(10, 690), this)
        this.ppCounter.fillText = "rgba(255,255,255,1)"
        this.ppCounter.font = "16px sans-serif"
        this.ready = false
        this.audioReady = false
        this.ellapsedTime = 0
        this.player = new Player(5, this, 20, 150);
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
        this.ppCounter.text = "PP: " + this.pp
        this.ppCounter.render()

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
        this.splashImage = new Image()
        this.splashImage.src = splashImagePath
        this.splashImagePosition = new Vector2(40,40)
        this.buttons.push(new Button(new Vector2(40, 250), this, new Vector2(320, 60)))
        this.buttons[0].fill = "rgb(255,255,255)"
        this.buttons[0].fillText = "rgb(0,0,0)"
        this.buttons[0].font = "30px 'Press Start 2P', cursive"
        this.buttons[0].label = "< Main Menu"
        this.buttons[0].setOnClickListener(() => {


            window.location.reload(false)
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

        this.level1Button.fill = "rgb(255, 50, 50)"
        this.level1Button.fillText = "white"
        this.level1Button.font = "30px 'Press Start 2P', cursive"
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

        this.level2Button = new Button(new Vector2(40, 300), this, new Vector2(320, 60))

        this.level2Button.fill = "rgb(255, 50, 255)"
        this.level2Button.fillText = "white"
        this.level2Button.font = "30px 'Press Start 2P', cursive"
        this.level2Button.setOnClickListener(() => {
            $.ajax({
                type: 'GET',
                url: "/data/level_2.json",
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
        this.level2Button.label = "Level 2"

        this.level3Button = new Button(new Vector2(40, 370), this, new Vector2(320, 60))

        this.level3Button.fill = "rgba(40,53,147 ,1)"
        this.level3Button.fillText = "white"
        this.level3Button.font = "30px 'Press Start 2P', cursive"
        this.level3Button.setOnClickListener(() => {
            $.ajax({
                type: 'GET',
                url: "/data/level_3.json",
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
        this.level3Button.label = "Level 3"

        this.buttons.push(this.level1Button)
        this.buttons.push(this.level2Button)
        this.buttons.push(this.level3Button)
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