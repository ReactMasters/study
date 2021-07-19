# Inheritance in JavaScript

2021.7.17



Instead of redefining the properties of a parent object, we can inherit them from it.

You can implement it by using `call()` function inside the child one.

**With  `call()` , an object can use a method belonging to another object.** The first parameter specifies the value of `this` that you want to use when running the function, and the other parameters are arguments for the function.

Plus, `this` refers to the **caller** of the function.

```js
function Person(first, last, age) {
  this.name = {
    first,
    last
  };
  this.age = age;
};

Person.prototype.greeting = function() {
  alert('Hi! I\'m ' + this.name.first + '.');
};

function Teacher(first, last, age, subject) {
  Person.call(this, first, last, age); // 
  this.subject = subject;
}
```

If the constructor you are inheriting from doesn't take its property values from parameters, you don't need to specify them as additional arguments in `call()`. 

```js
function BlueGlassBrick() {
  Brick.call(this);

  this.opacity = 0.5;
  this.color = 'blue';
}
```

But the `Person()` has a `prototype` property, which just contains an object with a reference to the constructor function. It does not contain the methods of the Person constructor's `prototype` property yet.



## Setting Teacher()'s prototype and constructor reference

1. Prototype Change

`Object.create(proto)`

```js
Teacher.prototype = Object.create(Person.prototype);
```

The new object has `Person.prototype` as its prototype and it became `Teacher`'s prototype. Now all `Person.prototype` methods are available on `Teacher`.

But `Teacher.prototype`'s `constructor` property is now equal to `Person()`.

2. Prototype Constructor Change

```js
Object.defineProperty(Teacher.prototype, 'constructor', {
    value: Teacher,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
```

Overriding prototype function is available.

```js
Teacher.prototype.greeting = function () {...}
```



## ECMAScript 2015 Classes

Class syntax as a way to write reusable classes using easier and cleaner syntax.

```js
class Person {
  constructor(first, last, age) {
    this.name = {
      first,
      last
    };
    this.age = age;
  }

  greeting() {
    console.log(`Hi! I'm ${this.name.first}`);
  };
}

class Teacher extends Person {
  constructor(first, last, age, subject) {
    // super(); // Now 'this' is initialized by calling the parent constructor.
    					// it accepts arguments for the parent constructor.
    super(first, last, age);
    this.subject = subject;
  }
}

let hj = new Person('Hyunjoo', 'Park', 100);
let hj2 = new Teacher('Hyunjoo', 'Park', 50, 'Math');
```

### Getters and Setters

```js
class Teacher extends Person {
  ...
  get subject() {
    return this._subject;
  }

  set subject(newSubject) {
    this._subject = newSubject;
  }
}
```

For simple cases, however, plain property access without a getter or setter will do just fine.

Private class field is possible in very modern browsers- See the browser compatibility: https://caniuse.com/mdn-javascript_classes_private_class_fields