# JavaScript에서 this

## 오해하기 쉬운 것들

1. this는 함수 자기 자신을 가르키지 않습니다.
2. 그렇다고 해당하는 렉시컬 스코프 객체를 참조하지도 않습니다. 스코프도 내부에 선언된 함수들을 프로퍼티로 가지는 객체의 일종이나 스코프 객체는 자바스크립트 엔진 내부에 있고, 자바스크립트 코드로는 접근하지 못합니다.

## this란 무엇인가?

this는 작성 시점이 아닌 런타임 시점에 바인딩 되며 호출 당시 상황에 따라 context가 결정됩니다. 다시 말해 함수 선언 위치와는 상관 없이 this 바인딩은 오로지 **어떻게 함수를 호출했는가** 에 따라 정해집니다.

어떠한 함수를 호출하면 실행 콘텍스트(execution context)가 만들어집니다. 여기에는 함수가 호출된 근원(call stack)과 호출 방법, 전달된 인자 등의 정보가 담겨있습니다.

this 레퍼런스는 그중 하나로 함수가 실행되는 동안 이용할 수 있습니다.

## this 바인딩과 호출부(call-site)

호출부는 함수를 호출한 지점으로 가면 금방 찾을 수 있을 것 같지만, 코딩 패턴에 따라 진짜 호출부가 어디인지 모호할 때가 많습니다. 중요한 건 호출 스택을 생각해보는 것입니다. 호출부는 현재 실행하는 함수 직전의 '내부'에 있습니다.

다음 예시를 봅시다.

```jsx
function baz() {
  console.log("baz");
  bar(); // 이곳이 bar의 호출부입니다.
}
function bar() {
  console.log("bar");
  foo(); // 이곳이 foo의 호출부입니다.
}
function foo() {
  console.log("foo");
}
baz(); // baz의 호출부입니다.
```

호출 스택은 baz→bar→foo 입니다. 따라서 foo의 호출부는 bar 내부입니다.

이제 함수가 실행되는 동안 this가 무엇을 참조할지를 호출부가 어떻게 결정하는지 알아봅시다.

### 1. Default binding(this = window)

첫 번째 규칙은 단독함수실행입니다. 다른 규칙에 해당하지 않을 경우 적용되는 this의 기본 규칙이죠.

```jsx
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

a를 선언하는 순간 글로벌 스코프에 a가 선언되고 window라는 객체의 프로퍼티 a로 접근할 수 있습니다.

그리고 foo() 호출 시 this는 전역객체 window 입니다. 기본 바인딩은 전역 객체만이 기본 바인딩의 대상입니다.

strict-mode 에서는 전역 객체로 기본 바인딩 되지 않아 this는 undefined가 됩니다.

### 2. Implicit binding(this = caller)

두 번째 규칙은 호출부에 컨텍스트 객체가 있는지 객체의 소유/포함 여부를 확인하는 것입니다.

```jsx
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var a = 3;
obj.foo(); // 2
```

obj는 foo라는 함수를 프로퍼티로 참조하고 있습니다. 이 경우 `obj.foo()` 의 호출부는 obj입니다. 함수 레퍼런스(obj.foo) 에 대한 컨텍스트 객체 (obj)가 존재할 때 이 컨텍스트 객체가 this에 바인딩됩니다. 이를 우리는 암시적 바인딩이라고 합니다. 따라서 여기서 this는 obj 입니다.

그런데 객체 프로퍼티 참조가 nesting된 구조로 chaining 되어 호출되었다면, 오로지 최하위(직전) 객체만 바인딩 됩니다.

```jsx
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo,
};
var obj1 = {
  a: 2,
  obj2: obj2,
};
var a = 3;
obj1.obj2.foo(); // 42
```

**암시적 소실**

```jsx
function foo() {
  console.log(this.a);
}
var obj = {
  a: 42,
  foo: foo,
};
var bar = obj.foo;
var a = 3;
bar(); // 3
```

이러한 경우 bar는 obj.foo를 통해 foo 라는 함수 레퍼런스를 직접 가리키는 또다른 레퍼런스가 됩니다. 그리고 호출부에서도 평범하게 bar()로 호출하므로 기본 바인딩이 되어 전역(window)객체를 this로 삼습니다.

### 3. Explicit Binding(this = 우리가 강제한 무언가)

`call()` 과 `apply()` 메소드, ES6+에서의 `bind()` 메소드를 이용하여 this를 지정하여 호출 할 수도 있습니다.

두 메서드 모두 Function 객체의 prototype 메서드입니다.

```tsx
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

둘 다 `this` 로 여겨질 녀석과 그 외의 함수 호출에 전달할 인수(argument)를 받는 다는 것은 동일하지만, argument를 개별 인수로 받을지, 배열로 받을지만 다릅니다.

여기서 전달하는 this 에 primitive type을 전달하면 해당 타입에 대응되는 객체 (string ⇒ new String())가 this가 됩니다.

![JavaScript%E1%84%8B%E1%85%A6%E1%84%89%E1%85%A5%20this/Untitled.png](JavaScript%E1%84%8B%E1%85%A6%E1%84%89%E1%85%A5%20this/Untitled.png)

이렇게 원시 값에 대응 되는 객체로 this가 삼아지는 것을 Boxing 이라 합니다.

### 4. new 바인딩 (this = 생성된 인스턴스)

```tsx
function foo(a) {
  this.a = a;
  console.log(this);
}

var bar = new foo(3);
```

우리에게 익숙한 생성자 호출(new라는 키워드로 함수를 호출)을 통한 객체 생성은 인스턴스를 만들고, 그 내부의 this는 해당하는 인스턴스를 가리킵니다.

위와 같은 함수를 정의하고 그냥 호출할 때와 생성자 호출할 때 this는 각기 다릅니다.

![JavaScript%E1%84%8B%E1%85%A6%E1%84%89%E1%85%A5%20this/Untitled%201.png](JavaScript%E1%84%8B%E1%85%A6%E1%84%89%E1%85%A5%20this/Untitled%201.png)

즉 생성자 호출을 통해 객체 생성을 하면 함수 내부의 this는 생성된 인스턴스를 가리킵니다.

## 결론

this 는 어떻게 호출되느냐에 따라 달라지는 녀석입니다. 기본 바인딩, 호출 부를 가리키는 바인딩, new로 인스턴스를 생성할 때의 binding, 그리고 명시적으로 바인딩해주는 것에 따라 this는 달라집니다.

this가 무엇인지 파악할 때는 아래와 같은 순서로 생각해보면 편합니다.

1. new 함수로 호출했다면 ⇒ 생성된 객체가 this입니다.
2. call, apply, bind 메서드로 바인딩 했다면 ⇒ 명시적으로 지정해준 this가 this입니다.
3. caller(해당 함수를 프로퍼티로 가지고 있는)가 있게 호출 된다면 ⇒ caller가 this입니다.
4. 그 외에는 기본 바인딩이 적용되어 글로벌 객체가(런타임이 브라우저라면 window, node라면 global) this입니다.
