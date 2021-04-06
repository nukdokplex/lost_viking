import {Level, MainMenu, Menu} from "./level.js";
import {Vector2, Vector3} from "./vector.js";

class Game {
    gl
    canvas
    currentScreen
    musicPlayer


    constructor(gl, canvas) {
        this.gl = gl
        this.canvas = canvas
    }

    navigate(screen){
        if (this.currentScreen !== undefined)
            this.currentScreen.destroy()
        this.currentScreen = screen
    }

    navigateWithoutDestruction(screen){

        this.currentScreen = screen
    }

    render (){
        this.currentScreen.render()
    }

    move(){
        this.currentScreen.move();
    }

    initialize(){
        let movements = {
            "ArrowLeft": {"x": -1, "y": 0},
            "ArrowRight": {"x": 1, "y": 0},
            "ArrowUp": {"x": 0, "y": -1},
            "ArrowDown": {"x": 0, "y": 1},
            "KeyU": {"x": 0, "y": 0},
        }




        let mainMenu = new MainMenu(this)
        mainMenu.setBackground('/img/main-menu.png')


        this.navigate(mainMenu)
        let pressableKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyU", "Escape"]

        let pressedKeys = []


        setInterval(() => {
            if (this.currentScreen instanceof Level) {

                if (this.currentScreen.ready) {
                    this.clearCanvas()
                    let playerMovementVector = new Vector3(0, 0, 1)

                    playerMovementVector.x = 0
                    playerMovementVector.y = 0
                    pressedKeys.forEach(function (pressedKey) {
                        playerMovementVector.x = playerMovementVector.x + movements[pressedKey].x
                        playerMovementVector.y = playerMovementVector.y + movements[pressedKey].y
                    })

                    this.currentScreen.player.setIsFiring(pressedKeys.includes("KeyU"))



                    this.currentScreen.player.setMovement(playerMovementVector)

                    if (pressedKeys.includes("Escape")){
                        this.currentScreen.gameOver()
                    }
                    this.render()
                }

            }
            else{
                this.clearCanvas()
                this.render()
            }
        }, renderInterval)

        setInterval(() => {
            if (this.currentScreen instanceof Level) {
                if (this.currentScreen.ready) {
                    this.move()
                }
            }
            else{
                this.move()
            }
        }, moveInterval);

        window.addEventListener("keydown", function (e){

            if ((pressableKeys.includes(e.code)) && !(pressedKeys.includes(e.code))){
                e.preventDefault()
                pressedKeys.push(e.code)
            }


        },false)

        window.addEventListener("keyup", function (e){
            e.preventDefault()
            if ((pressableKeys.includes(e.code)) && (pressedKeys.includes(e.code))){

                const index = pressedKeys.indexOf(e.code)

                pressedKeys.splice(index, 1)


            }
        },false)
    }

    clearCanvas(){
        this.gl.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export {Game}