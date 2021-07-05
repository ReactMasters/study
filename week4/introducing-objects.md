# MDN Introducing Javascript Objects

Created: July 3, 2021 8:54 AM
Tags: frontend, web

# Object basics

### Object

An object is a **collection of related data and/or functionality**, which are called **properties** and **methods** when they are inside objects.

### **Object literal**

**Object literal** is an object that we've literally written out.

```jsx
const objectName = {
  member1Name: member1Value,
  member2Name: member2Value,
  member3Name: member3Value,
};
```

It is very common to create an object using an object literal when you want to transfer a series of structured, related data items in some manner, for example sending a request to the server to be put into a database.

### `this`

The `this` keyword refers to the **current object** the code is being written inside.

# Object-oriented JavaScript for beginners

### Abstraction

Abstraction is creating a simple model of a more complex thing.

In JS it's creating object type which defines the generic data and functionality.

### Constructors and object instances

The constructor function is JavaScript's version of a class.

The function is doing something with parameter and return value in general but JavaScript's constructor function is different. It works as the OOP's class.

When an object instance is created from a class, the class's **constructor function** is run to create it. The object instance is instantiated from the class.

```jsx
// Example of creating an object without contructor.
// It explicitly creates a new empty object and return it.
function createNewPerson(name) {
  const obj = {};
  obj.name = name;
  obj.greeting = function () {
    alert("Hi! I'm " + obj.name + ".");
  };
  return obj;
}
const hj = createNewPerson("Hyunjoo");
hj.name;
hj.greeting();

// But with constructor function
function Person(name) {
  this.name = name;
  this.greeting = function () {
    alert("Hi! I'm " + this.name + ".");
  };
}

let anotherHj = new Person("Hyunjoo");
anotherHj.name;
anotherHj.greeting();
```

A constructor function name usually starts with a **capital** letter to recognize easier in code.

### Inheritance and Polymorphism

In OOP, we can create new classes based on other classes — these new **child classes** (also known as **subclasses**) can be made to **inherit** the data and code features of their **parent class**, so you can reuse functionality common to all the object types rather than having to duplicate it.

**Polymorphism** is the ability of multiple object types to implement the same functionality.

### Other ways to create object instances

The Object() constructor

Using the create() method

# Object prototypes

### Prototype-based language

JavaScript is often described as a **prototype-based language**.

An object's prototype object may also have a prototype object, which it inherits methods and properties from, and so on. This is often referred to as a **prototype chain**.

### Understanding prototype objects

In JavaScript, a link is made between the object instance and its prototype. The link is its `__proto__` property, which is derived from the prototype property on the constructor.

When we create the object, We also see some other members such as toString, valueOf. These are defined on `the object`'s prototype object's prototype object, which is `Object.prototype`.

The prototype chain is traversed only while retrieving properties. Thus if properties are `set` or `deleted` **directly** on the object, the prototype chain is not traversed.

Before ECMAScript 2015, there wasn't officially a way to access an object's `prototype` directly — the "links" between the items in the chain are defined in an internal property, referred to as `[[prototype]]` in the ECMAScript specification.

Most modern browsers, however, do offer property available called `[__proto__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)` .

Since ECMAScript 2015, you can access an object's prototype object indirectly via `Object.getPrototypeOf(obj)`.

### The prototype property- where inherited members are defined

If we look at the `[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)` reference page, some are inherited, and some aren't.

As mentioned above, the inherited ones are the ones defined on the `**prototype**` property. That is, the ones that begin with `Object.prototype.`, and not the ones that begin with just `Object.`

So `Object.prototype.toString()` , `Object.prototype.valueOf()` , etc. are available to any object types that inherit from `Object.prototype`, including new object instances created from the `Person()` constructor.

### The constructor property

The `constructor` property points to the original constructor function.

```jsx
anotherHj.constructor; // returns Person() constructor

let person3 = new anotherHj.constructor("Karen", "Stephenson", 26, "female", [
  "playing drums",
  "mountain climbing",
]);
// new Person(...)
```

It can be useful when we want to create a new instance and don't have a reference to the original constructor easily available for some reason.

### Modifying prototypes

```jsx
Person.prototype.farewell = function () {
  alert(this.name.first + " has left the building. Bye for now!");
};
anotherHj.farewell();
```

The whole inheritance chain has updated dynamically, automatically making this new method available on all object instances derived from the constructor.

Conversely, deleting properties defined on the constructor's prototype using the delete operator removes the respective properties from all other class instances too.

```jsx
delete anotherHj.__proto__.farewell;
delete Person.prototype.farewell;
```

We will rarely see properties defined on the prototype **property**, because they are **not** very **flexible** when defined like this.

And `this` returns `undefined` when it's used in properties.

In fact, a fairly common pattern for more object definitions is to define the **properties inside the constructor**, and the **methods on the prototype**. This makes the code easier to read, as the constructor only contains the property definitions, and the methods are split off into separate blocks.

```jsx
// Constructor with property definitions

function Test(a, b, c, d) {
  // property definitions
}

// First method definition

Test.prototype.x = function() { ... };

// Second method definition

Test.prototype.y = function() { ... };

// etc.
```
