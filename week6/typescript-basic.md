# Typescript Basic

## 1.Type Inference

```js
let a = 1;
a = 'A'; // error
```

> ts file에서는 에러를 발생
> let a = 1을 통해서 a는 number라는걸 유추했기 때문에

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

> 변수를 선언할 때, 변수 값의 타입을 명시함으로써, 변수 값의 데이타 타입을 지정해주는 것

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

- Enum은 interface와 달리 runtime에 존재하는 object이기 때문에 실제 compile된 js 파일에서도 나타남
  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d039dd54-15be-457d-ac4e-760aa2b6b12b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d039dd54-15be-457d-ac4e-760aa2b6b12b/Untitled.png)

Reference: https://www.notion.so/TypeScript-aaf3fe7676704f358487dcd33622d640#d3bb637aa4d440f39b453cc556a68902
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
