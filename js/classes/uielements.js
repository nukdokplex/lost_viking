import {GameObject} from "./gameobject.js";

class Button extends GameObject{
    label
    fill
    fillText
    font
    size
    listener
    originalListener
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

    destroy(){
        if (this.listener !== null){
            this.screen.game.canvas.removeEventListener('click', this.originalListener)
        }
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
        let button = this
        this.originalListener = function (event) {
            button.canvasClick(event)
        }
        this.screen.game.canvas.addEventListener('click', this.originalListener, false)
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

class ProgressBar extends GameObject{
    size
    progress
    fill
    constructor(position, screen, size, progress, fill) {
        super(position, screen);
        this.size = size
        this.progress = progress
        this.fill = fill
    }

    render() {
        super.render();
        this.screen.game.gl.fillStyle = this.fill
        this.screen.game.gl.fillRect(this.position.x, this.position.y, this.size.x/100*this.progress, this.size.y)
    }

    move(){

    }
}

export {Button, Label, ProgressBar}