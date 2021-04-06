import {GameObject} from "./gameobject.js";

class Button extends GameObject{
    label
    fill
    fillText
    font
    size
    listener
    constructor(position, screen, size) {
        super(position, screen);
        this.size = size

    }

    render(){
        this.screen.game.gl.fillStyle = this.fill
        this.screen.game.gl.textAlign = "center"
        this.screen.game.gl.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        )
        this.screen.game.gl.fillStyle = this.fillText
        this.screen.game.gl.font = this.font
        this.screen.game.gl.textBaseline = "middle"
        this.screen.game.gl.fillText(
            this.label,
            (this.position.x+this.size.x/2),
            (this.position.y+this.size.y/2),
            this.size.x
        )
    }

    canvasClick(event){

        let x = event.pageX - this.screen.game.canvas.offsetLeft - this.screen.game.canvas.clientLeft
        let y = event.pageY - this.screen.game.canvas.offsetTop - this.screen.game.canvas.clientTop

        if (this.position.x <= x &&
            x <= this.position.x+this.size.x &&
            this.position.y <= y &&
            y <= this.position.y+this.size.y){
            this.listener()
        }
    }

    setOnClickListener(listener){
        this.listener = listener
        this.screen.game.canvas.addEventListener('click', event => {
            this.canvasClick(event)
        }, false)
    }
}

class Label extends GameObject{
    text
    fill
    fillText
    font

    constructor(position, screen) {
        super(position, screen);
    }

    render() {
        super.render();
        this.screen.game.gl.fillStyle = this.fillText
        this.screen.game.gl.textAlign = "start"

        this.screen.game.gl.font = this.font

        this.screen.game.gl.fillText(
            this.text,
            (this.position.x),
            (this.position.y),
        )
    }


}

export {Button, Label}