<!-- link: https://www.notion.so/Css-container-bc59a89287d54116b80a857684d6725c -->

# Css container

[https://developer.mozilla.org/en-US/docs/Web/CSS/contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
[https://css-tricks.com/next-gen-css-container/](https://css-tricks.com/next-gen-css-container/)

CSS Container의 필요성

media query를 통해 구현되는 반응형 디자인은 기본적으로 뷰포트의 크기(주로 너비)에 따라 다른 디자인을 적용하는 방식으로 이루어진다. 그러나 각 컴포넌트의 디자인은 단순히 뷰포트의 크기뿐만 아니라 전체 레이아웃에서 해당 컴포넌트의 위치에 따라 달라지기도 한다. 결국엔 같은 컴포넌트임에도 불구하고 위치에 따라 class, id 등을 이용한 추가적인 셀렉터와 디자인을 별도로 추가해줘야하는 일이 빈번히 발생한다.

css container는 뷰포트의 크기가 아닌 부모 컨테이너의 크기에 따라 다른 디자인을 적용한다.

아래 예제와 같이 부모 컨테이너에 contain 값을 부여하고 미디어 쿼리와 비슷하게 @container 키워드를 통해 조건을 지정한다. 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        html, body{
            height : 100%;
            width : 100%;
        }
        .card-container{
            min-height: 100px;
            contain: 
            style
            /* Indicates that, for properties that can have effects on more than just an element and its descendants, those effects don't escape the containing element. Note that this value is marked "at-risk" in the spec and may not be supported everywhere. */
            layout
            /* Indicates that nothing outside the element may affect its internal layout and vice versa. */
            size;
            /* Indicates that the element can be sized without the need to examine its descendants' sizes. */
        }
        .card{
            display : flex;
        }
        .title{
            background-color: aquamarine;
        }
        .content{
            background-color: burlywood;
        }
        .column{
            display : flex;
            min-height: fit-content;
        }
        .left{
            flex : 1;
        }
        .column .card-container{
            flex : 2;
        }
        img{
            width : 50px;
            display: block;
        }

        @container(max-width: 700px){
            .card{
                background: grey;
                flex-direction: column;
            }
        }
      
    </style>
</head>
<body>
    <div class="column">
        <div class="left">
            HAHAHA
        </div>
        <div class="card-container">
            <div class="card">
                <img src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dd550016-2b59-4904-91d0-13d7a75106e9/jordan-jumpman-2021-pf-basketball-shoe-X3gQBM.png" class="title">TITLE</div>
                <div class="content">BODY</div>
            </div>
        </div>
    </div>

    <div class="card-container">
        <div class="card">
            <img src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dd550016-2b59-4904-91d0-13d7a75106e9/jordan-jumpman-2021-pf-basketball-shoe-X3gQBM.png" class="title">TITLE</div>
            <div class="content">BODY</div>
        </div>
    </div>

</body>
</html>
```