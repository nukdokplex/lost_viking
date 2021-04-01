class Vector2 {
    x
    y

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector3 extends Vector2{
    z

    constructor(x, y, z) {
        super(x, y);
        this.z = z
    }
}

export {Vector2, Vector3}