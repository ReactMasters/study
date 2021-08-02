# CSRF

웹사이트 구축을 하다보면 CSRF라는 종종 접하게 된다. CSRF가 무엇인지 알아보자.

CSRF는 **Cross Site Request Forgery**를 뜻한다. 즉 다른 웹사이트로의 요청을 위조하는 방식으로 이루어지는 보안 공격을 뜻한다. CSRF의 이해를 돕기 위해 아래와 같은 예시를 들어보자.

사용자가 A 웹사이트에 로그인하여 해당 웹사이트를 이용한다. 사용자의 로그인 상태를 관리하는 방식은 다양하지만 A사이트는 대표적으로 이용되는 쿠키를 이용하고 있다. 이때 크게 두가지 방식으로 CSRF 공격이 이루어질 수 있다. 

### 하이퍼링크 방식

***www.A.com/a-certain-activity-that-the-hacker-wants-to-trigger?suspicious-query=send-me-money***  같이 A의 도메인을 갖고 있으나 해커가 원하는 특정 작업을 수행하도록 경로와 쿼리 파라미터가 조작된 링크를 이메일 등을 통해 보내는 것이다. 사용자가 해당 링크를 클릭하면 GET Request가 보내지게 되는데 이때 앞서 로그인 때 생성된 쿠키도 함께 보내진다. A 웹사이트 입장에서는 이것이 사용자가 정상적인 경로로 보낸 요청인지 CSRF 공격을 위한 하이퍼링크를 통해 보내진 요청인지 구분할 수 없다. 따라서 사용자가 의도치 않은 작업을 수행하게 된다.

### 외부 웹사이트 방식

위에서 하이퍼링크 방식에는 한가지 문제점이 있다. 대부분의 웹사이트는 중요한 요청은 GET이 아닌 POST 방식을 이용한다는 것이다. 이를 우회하기 위해 해커는 아래와 같은 B 웹사이트를 만든다.

www.B.com

```html
<form id="malicious-form" action="www.A.com/private-endpoint" method="POST">
	<input type="text" value="maliciou-value">
</form>
```

```jsx
// This code will be inserted in a script tag
document.body.addEventListener('load', ()=>{
	document.querySelector("#malicious-form").submit();
});
```

[www.B.com](http://www.B.com) 웹사이트에 접속하면 자바스크립트 코드가 실행되며 자동으로 form을 submit하게 된다.

### 해결 방안

CSRF 공격으로부터 유저를 보호하려면 어떻게 해야할까? 크게 두가지 방법이 있다.

1. SameSite Cookie 설정
SameSite의 기본 설정은 Lax다. Lax로 설정된 쿠키는 링크 등을 통해 웹사이트에 접속할 때 전송된다. 즉 이메일에 링크를 통해 www.A.com에 접속하면 쿠기가 전송된다는 뜻이다. 즉 위에서 말한 하이퍼링크 방식의 CSRF 공격에 취약하다. SameSite 설정을 Strict로 설정하면 쿠키가 발행된 도메인/웹사이트 이외의 경로를 통해 접속된 경우 쿠키를 보내지 않는다. 즉 해커가 임의로 보낸 링크로 www.A.com을 접속하더라도 쿠기가 보내지지 않고, 쿠키가 보내지지 않으면 사용자는 로그인하지 않은 것으로 간주되므로 Request로 처리되지 않는다.

2. CSRF Token 발행
Form input에 고유한 특정 토큰을 삽입하고 요청을 받을 때 이를 검증하는 방식이다. 아래 코드와 같이 form 안에 고유한 일회성 토큰 값을 넣는다. 정상적인 경로를 통해 Submit된 form은 토큰 값을 함께 보내게 되고, 서버는 이를 사용자 정보와 대조하고 정상적인 토큰인지 확인한다.

```jsx
<form id="csrf-token-form" action="www.A.com/private-endpoint" method="POST">
	<input type="text" value="some-input-value">
	<input type="hidden" value="some-unique-nonce-token">
</form>
```

1. JWT 토큰 + httpOnly 쿠키
JWT 토큰을 사용하되 Refresh Token만 쿠키에 저장하고 Access Token은 자바스크립트 변수로 사용하면 된다. 해커가 CSRF로 공격을 하더라도 쿠키에는 Refresh Token만 있고 Access Token이 없으므로 Request가 처리되지 않는다. 즉 쿠키에 담긴 Refresh Token을 사용해 Access Token을 받고 이를 자바스크립트를 통해 읽어서 다시 Request를 보내도록 강제하는 것이다. 여기서 httpOnly의 쿠키가 개입하게 된다. httpOnly로 설정된 쿠키는 자바스크립트를 통해 읽을 수 없다. 즉 브라우저에 쿠키를 저장하고 브라우저가 이를 보내는 것은 가능하나 자바스크립트로 이 쿠키 값을 읽어나 조작할 수 없는 것이다.