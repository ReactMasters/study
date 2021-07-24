# Typescript Basic

## 1.Type Inference

```js
let a = 1;
a = 'A'; // error
```

- ts file에서는 에러를 발생
- let a = 1을 통해서 a는 number라는걸 유추했기 때문에

```js
let student = {
  //assign 된 값을 기반으로 타입을 추론
  name: 'Yui',
  course: 'Getting Started with TS',
  codingLevel: 100,
  code: function () {
    console.log('I am studying TS hard');
  },
};

student.name = 10;
// 이미 name이 string인것을 위에서 유추했기때문에 에러 발생

function calCodingLevel(lostPoints) {
  return 100 - lostPoints;
  // 100-lostPoints 통해서 lostPoints이 number인것을 유추한다
}
```

> 이미 리턴값이 number임을 추론한다

## 2.Type Annotations

- 변수를 선언할 때, 변수 값의 타입을 명시함으로써, 변수 값의 데이타 타입을 지정해주는 것

```js
let x: string = 'Yui';
// 변수 뒤에 ':' 을 이용해서 타입 명시
```

```js
let studentID: number = '12346'; // error
let studentName: string = 'Yui Kim';
let age: number = 20;
let gender: string = 'female';
let subject: string = 'javascript';
let cute: boolean = true;
let corseCompleted: boolean = false;
```

### 3.함수의 타입 선언

- return 값이 없을때

```js
function getStudentDetails(studentID: number): void {}
```

- string 일때

```js
function getStudentDetails(studentID: number): string {
  return 'string';
}
```

- object 일때

```js
function getStudentDetails(studentID: number): object {
  return null;
}
```

- object 일때: 타입선언은 구체적으로 해주는 것이 좋다

```js
function getStudentDetails(studentID: number): {
  studentID: number,
  studentName: string,
  age: number,
  gender: string,
  subject: string,
  cute: boolean,
  corseCompleted: boolean,
} {
  return null;
}
```

> 위의 경우 **interface**가 필요

## 4.Interface

- need to start Capital letter

```js
...
interface Student {
  studentID: number;
  studentName: string;
  age: number;
  gender: string;
  subject: string;
  cute: boolean;
  corseCompleted: boolean;
}
//return 값이 Student와 타입과 일치 해야 에러가 없음
function getStudentDetails(studentID: number): Student {
  return {
    studentID: 12346,
    studentName: 'Yui Kim',
    age: 20,
    gender: 'female',
    subject: 'javascript',
    cute: true,
    corseCompleted: false,
  };
}
```

- Optional property: add '?'

```js
interface Student {
  studentID: number;
  studentName: string;
  age?: number;
//Add '?' when the age is not mandatory
  gender: string;
  subject: string;
  cute: boolean;
  corseCompleted: boolean면
}

//age가 없어서 error가 없음
function getStudentDetails(studentID: number): Student {
  return {
    studentID: 12346,
    studentName: 'Yui Kim',
    gender: 'female',
    subject: 'javascript'음
    cute: true,
    corseCompleted: false,
  };
}
```

- Method inside Interface

```js
interface Student {
...
addComment(comment:string) : string;
addComment1?: (comment: string) => string;
}
```

- Readonly property

```js
...
interface Student {
  readonly studentID: number; //readonly 추가
  studentName: string;
  age?: number;
  gender: string;
  subject: string;
  cute: boolean;
  corseCompleted: boolean;
}

function saveStudentDetails(student: Student): void {
  student.studentID = 112345; //error: 재할당이 안됨
}

saveStudentDetails(student1);
```

## 5.Enum and literal type to limit property

```js
enum GenderType {
  Male,
  Female,
  genderNeutral,
}

let student1 = {
  studentID: 121212,
  studentName: 'John Paluo',
  gender: GenderType.Male,
  subject: 'Mongo DB',
  cute: true,
  corseCompleted: false,
};

interface Student {
  studentID: number;
  studentName: string;
  age?: number;
  gender: GenderType;
  subject: string;
  cute: boolean;
  corseCompleted: boolean;
  addComment?: (comment: string) => string;
}

function getStudentDetails(studentID: number): Student {
  return {
    studentID: 12346,
    studentName: 'Yui Kim',
    gender: GenderType.Female,
    subject: 'javascript',
    cute: true,
    corseCompleted: false,
  };
}

function saveStudentDetails(student: Student): void {}

saveStudentDetails(student1);
```

> Enum은 interface와 달리 runtime에 존재하는 object이기 때문에 실제 compile된 js 파일에서도 나타남

- Numeric Enum 숫자형 열거형: 각각의 enum값에 index가 자동적으로 할당됨

```js
//app.ts
enum GenderType{
  Male,
  Female
	genderNeutral
}

//app.js
(function (GenderType) {
    GenderType[GenderType["Male"] = 0] = "Male";
    GenderType[GenderType["Female"] = 1] = "Female";
    GenderType[GenderType["genderNeutral"] = 2] = "genderNeutral";
})(GenderType || (GenderType = {}));
```

- String Enum 문자형 열거형

```js
//app.ts
enum GenderType {
  Male = 'male',
  Female = 'female',
  genderNeutral = 'genderNeutral',
}

//app.js
var GenderType;
(function (GenderType) {
    GenderType["Male"] = "male";
    GenderType["Female"] = "female";
    GenderType["genderNeutral"] = "genderNeutral";
})(GenderType || (GenderType = {}))
```

- Literal Type

```js
interface Student {
  readonly studentID: number;
  studentName: string;
  age?: number;
  gender: 'male' | 'female' | 'genderNeural';
  subject: string;
  cute: boolean;
  corseCompleted: boolean;
  addComment?: (comment: string) => string;
}
```

```js
//app.ts
let studentID: number = 12346;
let studentName: string = 'Yui Kim';
let age: number = 20;
let gender: string = 'female';
let subject: string = 'javascript';
let cute: boolean = true;
let corseCompleted: boolean = false;

enum GenderType {
  Male = 'male',
  Female = 'female',
  genderNeutral = 'genderNeutral',
}

let student1 = {
  studentID: 121212,
  studentName: 'John Paluo',
  gender: 'male',
  subject: 'Mongo DB',
  cute: true,
  corseCompleted: false,
};

interface Student {
  studentID: number;
  studentName: string;
  age?: number;
  gender: 'female' | 'male' | 'genderNetral';
  subject: string;
  cute: boolean;
  corseCompleted: boolean;
  addComment?: (comment: string) => string;
}

function getStudentDetails(studentID: number): Student {
  return {
    studentID: 12346,
    studentName: 'Yui Kim',
    gender: 'female',
    subject: 'javascript',
    cute: true,
    corseCompleted: false,
  };
}

function saveStudentDetails(student: Student): void {}

saveStudentDetails(student1 as Student);
```

## 6.Any, Union Type, Type Aliases & Type Guards

- any : 작업중인 코드의 타입 명시가 어려운 경우(third party library에서 동적 컨텐츠를 가져오는 경우에 타입이 뭔지 알수 없을때)에 제한적으로 사용

```js
//any를 쓴경우엔 number에서 string으로 타입 재선언 가능
let someValue: any = 5;
someValue = 'Yui';
```

- Union type: number와 string 두가지로 타입을 제한하고 싶을때에 사용

```js
let someValue: number | string = 5;
someValue = 'Yui';
```

> 지정한 number와 string이 아닌 boolean을 할당하면 에러 발생

- Type Aliases: 같은 union 타입이 반복될경우에 그것을 타입으로 지정해줘서 재사용

```js
//before
let someValue: number | string = 5;
someValue = 'Yui';
let price: number | string = 4;
price = '$5';

//after
type StOrNum = number | string;
let someValue: StOrNum = 5;
someValue = 'Yui';
let price: StOrNum = 4;
price = '$5';
```

```js
//before
let totalCost: number;
let orderID: number | string;

const calTotalCost = (price: number | string, qty: number): void => {};

const findOrderID = (
  customer: { customerId: number | string, name: string },
  productId: number | string
): number | string => {
  return orderID;
};

//after
type StOrNum = number | string; //Type Aliases

let totalCost: number;
let orderID: StOrNum; //1

const calTotalCost = (price: StOrNum, qty: number): void => {}; //2

const findOrderID = (
  customer: { customerId: StOrNum, name: string }, //3
  productId: StOrNum //4
): StOrNum => {
  //5
  return orderID;
};
```

- Type Guards: 유니온 타입을 사용할때 typeof를 통해서 코드 검증을 수행하는것

```js
type StOrNum = number | string;
let itemPrice: number;

const setItemPrice = (price: StOrNum): void => {
  itemPrice = price; //error 발생
};

setItemPrice(50);
```

```js
//Type Guards
const setItemPrice = (price: StOrNum): void => {
  if (typeof price !== 'number') itemPrice = 0;
  else itemPrice = price;
};
```

## Interface VS Type Aliases

Reference https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

- differences of Interface vs Type Aliases

```js
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

function getBear(): Bear {
  return { name: 'Yui', honey: true };
}

const bear = getBear();
bear.name;
bear.honey;
```

```js
type Animal = {
  name: string,
};

type Bear = Animal & {
  honey: boolean,
};

function getBear(): Bear {
  return { name: 'Pooh', honey: true };
}

const bear = getBear();
bear.name;
bear.honey;
```

- Adding new fields to an existing interface

```js
interface Animal {
  name: string;
}

interface Animal {
  age?: string;
}

interface Bear extends Animal {
  honey: boolean;
}

function getBear(): Bear {
  return { name: 'Pooh', honey: true };
}

const bear = getBear();
bear.name;
bear.honey;
```

- A type cannot be changed after being created

```js
interface Animal {
  name: string;
}

interface Animal {
  age?: string;
}

// Error: Duplicate identifier 'Animal'
```

## 7.함수의 타이핑(Type Annotations), 선택적 매개 변수(Optional Parameter)와 기본 매개 변수(Default Parameter)

### 1)함수의 리턴 타입 지정하기

```js
function 함수이름(parameter1, parameter2): 함수의 리턴 타입 {
}
```

- 함수의 리턴 타입 void : return이 없을때는 void로

```js
function sendGreeting(message: string, userName: string): void {
  console.log(`${message}, ${userName}`);
}
```

- return 타입이 있을때의 예시: return 값이 string이므로 string으로

```js
function sendGreeting(message: string, userName: string): string {
  return `${message}, ${userName}`;
}
```

- return 타입이 array일때 예시

```js
function sendGreeting(message: string, userName: string): string[] {
  return [message, userName]; //리턴값이 string이면서 array
}
```

### 2) parameter의 리던타입

- 타입을 지정해놓고 다른 타입 입력시에 error

```js
function sendGreeting(message: string, userName: string): string[] {
  return [message, userName];
}

console.log(sendGreeting('Hello', 1));

//error: Argument of type 'number' is
//not assignable to parameter of type 'string'
```

- Optional Parameter는 꼭 맨 뒤에 위치해야함

```js
function 함수이름(param1: string, param2?: number,
뒤에 다른 파라미터도 꼭 Optional Parameter여야 됨)
```

- Optional Parameter (선택적 매개변수): '?' 활용

```js
function sendGreeting(message: string, userName?: string): void {
  console.log(`${message}, ${userName}`); //Hello, undefined
}

sendGreeting('Hello');
```

- Default Parameter (기본 매개변수) : string도 필요없고(Type Inference) '?'도 없어야됨

```js
function sendGreeting(message: string, userName = 'You'): void {
  console.log(`${message}, ${userName}`); //Hello, You
}

sendGreeting('Hello');
```

```js
function sendGreeting(message = 'Hello', userName = 'You'): void {
  console.log(`${message}, ${userName}`);
}

sendGreeting(); // Hello, You
sendGreeting('Hi'); // Hi, You
sendGreeting('Hi', 'Yui'); // Hi, Yui
```

Reference: https://www.notion.so/TypeScript-aaf3fe7676704f358487dcd33622d640#d3bb637aa4d440f39b453cc556a68902
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
