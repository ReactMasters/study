class Sprite {
    name = "";
    x = 0;
    y = 0;

    constructor(name: string) {
        this.name = name;
    }
}

// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

type Constructor = new (...args: any[]) => any;

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

function Scale<TBase extends Constructor>(Base: TBase) {
    return class Scaling extends Base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        _scale = 1;

        setScale(scale: number) {
            this._scale = scale;
        }

        get scale(): number {
            return this._scale;
        }
    };
}

function Color<TBase extends Constructor>(Base: TBase) {
    return class Coloring extends Base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        private _color = "#000";

        setColor(color: string) {
            this._color = color;
        }

        get color(): string {
            return this._color;
        }
    };
}

// Compose a new class from the Sprite class,
// with the Mixin Scale applier:
const EightBitSprite = Color(Scale(Sprite));

const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
flappySprite.setColor("red");
console.log(flappySprite.scale, flappySprite.color);