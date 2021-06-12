# Base64 인코딩이란

모든 파일은 결국 "binary"입니다. 0, 1로 이루어졌다는 것이죠. 다만 이 0,1 로 이루어진 데이터를 다르게 표현할 수 있습니다. 16진수로도 표현할 수 있습니다.

Base64는 binary 데이터를 6bit(2^6 = 64)씩 끊어서 해당 숫자의 ASCII 문자열 형식으로 나타냅니다.

자세한 변환 과정은 이따가 보여드릴게요!

ASCII 코드는 각 글자에 부여된 고유한 코드 약속입니다.

```tsx
"A".charCodeAt(0); // 65 : "A"의 ASCII 코드 번호
```

이를 테면 글자 "A"는 ASCII 코드 번호가 65입니다.
당연히 65를 여러 진법에 따라 다르게 표현할 수 있습니다.

```tsx
// "A"의 표현
ASCII(base-2) : 1000001
ASCII(base-8) : 101
ASCII(base-10) : 65
ASCII(base-16) : 41
```

## Base64로 인코딩하는 과정

예시로 "Man" 이라는 데이터를 Base64로 인코딩해본다고 해봅시다.

다음과 같은 과정을 거칩니다.

1. 일단 각 글자의 ASCII 코드를 가져옵니다.
2. 해당 ASCII 코드를 2진수로 나타냅니다.
3. 2진수로 나타낸 표현을 모두 이어붙입니다.
4. 이걸 6bit씩 끊고 Base64 테이블에 일치하는 문자열로 변환합니다.

![Base64 Table](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8096615c-4694-4e01-aba5-32f3649306a7%2FUntitled.png?table=block&id=657ab325-4d37-4f5b-98d3-3b7ad94024c1&spaceId=a7fb34be-79a2-4b46-a391-88f6d203e1c6&width=3320&userId=83bbde61-714a-493e-88b0-9ca933e5f590&cache=v2)

설명을 위해 다음 코드를 만들었습니다.

```tsx
const base64Table: { [key: string]: string } = {
  "000000": "A",
  "000001": "B",
  "000010": "C",
  //... 위의 base65 테이블을 객체로 만든겁니다.
};

const before = "Man";
console.log({ before });
let total = "";
for (let char of before) {
  const ascii = char.charCodeAt(0);
  const binary = ascii.toString(2).padStart(8, "0");
  total += binary;
  console.log({ char, ascii, binary });
}
console.log(total);

let after = "";
for (let i = 0; i < total.length; i += 6) {
  const sixBit = total.slice(i, i + 6);
  const char = base64Table[sixBit];
  console.log({
    sixBit,
    char,
  });
  after += char;
}
console.log({ after });

export {};
```

```tsx
// 출력
{ before: 'Man' }
{ char: 'M', ascii: 77, binary: '01001101' }
{ char: 'a', ascii: 97, binary: '01100001' }
{ char: 'n', ascii: 110, binary: '01101110' }
010011010110000101101110
{ sixBit: '010011', char: 'T' }
{ sixBit: '010110', char: 'W' }
{ sixBit: '000101', char: 'F' }
{ sixBit: '101110', char: 'u' }
{ after: 'TWFu' }
```

1. 일단 각 글자의 ASCII 코드를 가져옵니다.
   M ⇒ 77
   a ⇒ 97
   n ⇒ 110
2. 해당 ASCII 코드를 2진수로 나타냅니다. 단 8자리 이진수로(8bit, 1byte) 만들어야합니다.
   M ⇒ 77 ⇒ 1001101 ⇒ (8자리) ⇒ 01001101
   ...
3. 2진수로 나타낸 표현을 모두 이어붙입니다.
   010011010110000101101110
4. 이걸 6bit씩 끊고 Base64 테이블에 일치하는 문자열로 변환합니다.
   010011 ⇒ "T"
   ...
5. 최종적으로 모두 이어 붙이면 완성
   "TWFu"

실제로 잘 된건지 체크하려면 Web api의 btoa 함수를 사용해보세요

![Console example](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fbddad73c-1297-427c-8443-ad8f073dd272%2FUntitled.png?table=block&id=d51cc876-976a-4123-a796-3d1715bc7c9d&spaceId=a7fb34be-79a2-4b46-a391-88f6d203e1c6&width=1030&userId=83bbde61-714a-493e-88b0-9ca933e5f590&cache=v2)

잘 됐네요!

## References

[Base64 - MDN Web Docs Glossary: Definitions of Web-related terms | MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
