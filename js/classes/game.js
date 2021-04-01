import {Level, MainMenu, Menu} from "./level.js";
import {Vector2, Vector3} from "./vector.js";

class Game {
    gl
    canvas
    currentLevel
    musicPlayer

    constructor(gl, canvas) {
        this.gl = gl
        this.canvas = canvas
    }

    navigate(level){
        this.currentLevel = level
    }

    render (){
        this.currentLevel.render()
    }

    move(){
        this.currentLevel.move();
    }

    initialize(){
        let movements = {
            "ArrowLeft": {"x": -1, "y": 0},
            "ArrowRight": {"x": 1, "y": 0},
            "ArrowUp": {"x": 0, "y": -1},
            "ArrowDown": {"x": 0, "y": 1},
            "u": {"x": 0, "y": 0}
        }
        let level1 = {
            'enemies' : {
                2000: [
                    {
                        'movementVector': {
                            'x': 0,
                            'y': 1
                        },
                        'spawnX': 100,
                        'speed': 2,
                        'hp': 100,
                        'cooldown': 400,
                        'damage': 50,
                        'bulletDamage': 25,
                        'bulletSpeed': 5,
                        'fill': "rgba(200, 60, 50, 1)"
                    },
                    {
                        'movementVector': {
                            'x': 0,
                            'y': 1
                        },
                        'spawnX': 200,
                        'speed': 2,
                        'hp': 100,
                        'cooldown': 400,
                        'damage': 50,
                        'bulletDamage': 25,
                        'bulletSpeed': 5,
                        'fill': "rgba(200, 60, 50, 1)"
                    },
                    {
                        'movementVector': {
                            'x': 0,
                            'y': 1
                        },
                        'spawnX': 300,
                        'speed': 2,
                        'hp': 100,
                        'cooldown': 400,
                        'damage': 50,
                        'bulletDamage': 25,
                        'bulletSpeed': 5,
                        'fill': "rgba(200, 60, 50, 1)"
                    },
                ],


            },
            'musicFile': "/sound/redefined.mp3",
            'backgroundImage': "/img/level_1_bg.jpg"
        }

        this.navigate(new Level(this, level1.enemies, level1.musicFile, level1.backgroundImage))
        let pressableKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "u"]

        let pressedKeys = []


        setInterval(() => {
            this.clearCanvas()
            if (!this.currentLevel.isPrototypeOf(MainMenu)){
                let playerMovementVector = new Vector3(0,0,1)

                playerMovementVector.x = 0
                playerMovementVector.y = 0
                pressedKeys.forEach(function (pressedKey){
                    playerMovementVector.x = playerMovementVector.x + movements[pressedKey].x
                    playerMovementVector.y = playerMovementVector.y + movements[pressedKey].y
                })

                this.currentLevel.player.setIsFiring(pressedKeys.includes("u"))

                this.currentLevel.player.setMovement(playerMovementVector)
            }
            this.render()
        }, renderInterval)

        setInterval(() => {
            this.move()
        }, moveInterval);

        window.addEventListener("keydown", function (e){

            if ((pressableKeys.includes(e.key)) && !(pressedKeys.includes(e.key))){
                pressedKeys.push(e.key)
            }


        },false)

        window.addEventListener("keyup", function (e){
            if ((pressableKeys.includes(e.key)) && (pressedKeys.includes(e.key))){

                const index = pressedKeys.indexOf(e.key)

                pressedKeys.splice(index, 1)


            }
        },false)
    }

    clearCanvas(){
        this.gl.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export {Game}