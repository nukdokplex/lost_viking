import {GameObject} from "./gameobject.js";

class Button extends GameObject{
    label
    fill
    fillText
    font
    size
    padding
    listener
    constructor(position) {
        super(position);

    }

    render(){
        gl.fillStyle = this.fill
        gl.textAlign = "center"
        gl.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        )
        gl.fillStyle = this.fillText
        gl.font = this.font

        gl.fillText(
            this.label,
            this.position.x+this.padding.x,
            this.position.y+this.padding.y,
            this.size.x
        )
    }

    canvasClick(event){
        let x = event.pageX - canvas.offsetLeft - canvas.clientLeft
        let y = event.pageY - canvas.offsetTop - canvas.clientTop

        if (this.position.x <= x <= this.position.x+this.size.x &&
            this.position.y <= y <= this.position.y+this.size.y){
            this.listener()
        }
    }

    setOnClickListener(listener){
        this.listener = listener
        gl.addEventListener('click', this.canvasClick(event), false)
    }
}

export {Button}