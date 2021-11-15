class Tall {
    getCriteria() { "height > 180" }
}

class Heavy {
    getCriteria() { "weight > 90" }
}

// I want to make Giant class that is tall and heavy
// However, you cannot inherit multiple parent classes.

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


class TallParentInterface {
    public getCriteria?() {

    }
}

type Constructor<ParentInterface> = new (...args: any[]) => ParentInterface;

// TallMixin

// function TallMixin<SuperClass>(superClass: SuperClass) { // This will throw an compile error
function TallMixin<SuperClass extends Constructor<TallParentInterface>>(superClass: SuperClass) {
    return class extends superClass {
        getCriteria() {
            if (super.getCriteria) {
                super.getCriteria();
            }
            console.log("height > 180cm");
        }
    }
}

function HeavyMixin<SuperClass extends Constructor<any>>(superClass: SuperClass) {
    return class extends superClass {
        getCriteria() {
            if (super.getCriteria) {
                super.getCriteria();
            }
            console.log("weight > 90kg");
        }
    }
}

function addMixins<Constructor>(subClass: Constructor, ...mixins: any[]) {
    return mixins.reduce((prev, cur) => cur(prev), subClass);
}

const MixInApplication = HeavyMixin(TallMixin(Person));

const MixinApplication2 = addMixins(Person, TallMixin, HeavyMixin);

const mixInApplicationInstance = new MixInApplication();

const mixInApplicationInstance2 = new MixinApplication2();

mixInApplicationInstance.getCriteria();
mixInApplicationInstance2.getCriteria();