# JSX

Created: Jun 26, 2021 1:46 AM
Tags: frontend, web

## JSX?

```jsx
const el = <span>JSX!</span>;
```

**Syntax extension to JavaScript**. It would remind us of a _template language_, but it's only from JavaScript.

It's intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript.

### What is template language?

Template language is the language that is **embedded** within some other master document. In the template, the document text is the most prevalent, with just a bit of code.

```php
print "Hello world with" + hj
print "This is template." + hj + "comes here."
```

```php
Hello world with $hj.
This is template. $hj comes here.
```

## But JSX produces React elements

So by using JSX, React can put markup and logic into one unit, called **component.**

React doesn't require using JSX, but it's found helpful to use by most React users.

### React without JSX

Using react without JSX is convenient when you don't want to set up compilation in your build environment. (But don't you want? 😄)

Each JSX element is compiled down to `React.createElement(component, props, ... children)` by Babel.

So this code with JSX is compiled to the code that doesn't use JSX below:

```jsx
// With JSX
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.hj}</div>;
  }
}

ReactDOM.render(<Hello hj="Hyunjoo" />, document.getElementById("root"));
```

```jsx
// Without JSX
class Hello extends React.Component {
  render() {
    return React.createElement("div", null, `Hello ${this.props.hj}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, { hj: "Hyunjoo" }, null),
  document.getElementById("root")
);
```

If we use shorthand form for `React.createElement` as below, it becomes as convenient to use React with JSX.

```jsx
// We can use shorthand of React.createElement
const e = React.createElement;

ReactDOM.render(
	e('div', {className: 'greeting'}, 'Hello World'), document.getElementById('root')
```

Then it creates **React element object** like this:

```jsx
// Simplified
const element = {
  type: "div",
  props: {
    className: "greeting",
    children: "Hello World",
  },
};
```

And React reads these objects and uses them to construct the DOM and keep it up to date.

### Embedding Expressions in JSX

We **put any valid JS expression** inside the curly braces in JSX. String, function, etc. We wrap JSX in parentheses to avoid the pitfalls of _Automatic Semicolon Insertion_.

- Automatic Semicolon Insertion (ASI)

  This rule is described in the ECMAScript specification, and it happens when the Script or Module is parsed from left to right.

  Those statements are affected by the ASI.

  - empty statement
  - `var` statement
  - expression statement
  - `do-while` statement
  - `continue` statement
  - `break` statement
  - `return` statement
  - `throw` statement

  Classic example is with the `ReturnStatement`.

  ```jsx
  return;
  ("something");
  ```

  is transformed to

  ```jsx
  return;
  ("something");
  ```

### So is JSX an Expression

Since JSX because JS function call after compilation, we can use JSX inside of `if` , `for` statements.

React Dom uses `camelCase` , so does JSX that is more JS than HTML.

### JSX Prevents Injection Attacks

It's safe to embed user input in JSX directly:

```jsx
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM **_escapes_** before rendering. Everything is converted to a string before being rendered. This helps prevent XSS (cross-site-scripting) attacks.

### Using Dot Notation for JSX Type

It's convenient if you have a single module that exports many React components.

```jsx
import React from "react";

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  },
};

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Why can't component's name start with lowercase?

The lowercase started name refers to a build-in component. So it results in a string `div` or `span` passed to `React.createElement`.

### Choosing the React element type at Runtime

This often comes up when you want to render a different component based on a prop:

```jsx
import React from "react";
import { PhotoStory, VideoStory } from "./stories";

const components = {
  photo: PhotoStory,
  video: VideoStory,
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  // return <components[props.storyType] story={props.story} />;
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

### Don't recommend to use prop without value

`<MyTextBox autocomplete />` and `<MyTextBox autocomplete={true} />` are same, but, it will occur confusion with the ES6 object shorthand `{foo}` which is short for `{foo: foo}`.

### Spread Attributes

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a **spread** operator to pass the whole props object. You can also pick specific props that your component will consume.

```jsx
const Button = (props) => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

Spread attributes can be useful but they also make it easy to pass unnecessary props to components that don’t care about them or to pass invalid HTML attributes to the DOM. We recommend using this syntax sparingly.

A React component can also return an array of elements:

```jsx
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript Expressions as Children

By enclosing it within `{}`. For example, these expressions are equivalent.

```jsx
<MyComponent>foo</MyComponent>
<MyComponent>{'foo'}</MyComponent>
```

```jsx
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ["finish doc", "submit pr", "nag dan to review"];
  return (
    <ul>
      {todos.map((message) => (
        <Item key={message} message={message} />
      ))}{" "}
    </ul>
  );
}
```

### Booleans, Null, and Undefined Are Ignored

`false`, `null`, `undefined`, and `true` are valid children.

```jsx
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Some “falsy” values, such as the 0 number, are still rendered by React.

To fix this, make sure that the expression before && is always boolean.

## Reference

template language

[https://stackoverflow.com/questions/4026597/what-is-a-templating-language](https://stackoverflow.com/questions/4026597/what-is-a-templating-language)

jsx

Official react page- [https://reactjs.org/docs/introducing-jsx.html](https://reactjs.org/docs/introducing-jsx.html) and many others:

[https://reactjs.org/docs/react-without-jsx.html](https://reactjs.org/docs/react-without-jsx.html)

[https://reactjs.org/docs/jsx-in-depth.html](https://reactjs.org/docs/jsx-in-depth.html)

[https://reactjs.org/docs/jsx-in-depth.html](https://reactjs.org/docs/jsx-in-depth.html)

ASI

[https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)

[https://262.ecma-international.org/7.0/#sec-automatic-semicolon-insertion](https://262.ecma-international.org/7.0/#sec-automatic-semicolon-insertion)
