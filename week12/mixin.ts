class Tall {
    getCriteria: () => { "height > 180" }
}

class Heavy {
    getCriteria: () => { "weight > 90" }
}

// I want to make Giant class that is tall and heavy
// However, you cannot inherit multiple super classes.
// class Giant extends Tall extends Heavy{

// }

class Person {

}

const Meh: { constructor: (...args: any[]) => any } = {
    constructor: () => {

    }
}

// const Me: Constructor = function(){

// }

// const me = new Me();

type Constructor = new (...args: any[]) => {};

// TallMixin

// function TallMixin<SuperClass>(superClass: SuperClass) { // This will throw an compile error
function TallMixin<SuperClass extends Constructor>(superClass: SuperClass) {
    return class extends superClass {
        getCriteria() {
            return "height > 180cm"
        }
    }
}

function HeavyMixin<SuperClass extends Constructor>(superClass: SuperClass) {
    return class extends superClass {
        getCriteria() {
            return "weight > 90kg"
        }
    }
}

const TallMixinApplication = HeavyMixin(TallMixin(Person));

const tallMixinApplicationInstance = new TallMixinApplication();

const criteria = tallMixinApplicationInstance.getCriteria();

console.log(criteria);
