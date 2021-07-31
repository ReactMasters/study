# GraphQL+React+TypeScript로 Instagram 웹 만들기 (1)

이 포스트는 GraphQL, React, TypeScript를 이용해 만든 인스타그램 웹 클라이언트를 GraphQL을 중점으로 설명하였습니다. React 프로젝트 생성 및 초기 설정 부분은 생략하였습니다.

# GraphQL Setup for TypeScript

---

apollo code generation을 사용하기 위해 apollo를 콘솔에서도 부를 수 있도록 apollo 패키지를 전역으로 설치합니다.

apollo code generation을 이용하면 apollo가 작성한 코드에서 쿼리와 뮤테이션을 찾아 인터페이스를 만들어줍니다. 

```bash
npm install -g apollo
```

먼저 **apollo.config.js** 파일을 생성합니다. 

- includes: 태그를 찾을 대상 파일을 설정하고,
- tagname: 태그명이 gql임을 명시하고,
- service:
    - name: 백엔드 서비스의 이름을 명시하고(anything),
    - url: schema 파일이 있는 백엔드 서버의 url을 작성합니다.

```jsx
// apollo.config.js
module.exports = {
    client: {
        includes: ["./src/**/*.{tsx,ts}"],
        tagname: "gql",
        service: {
            name:"instaclone-backend",
            url: "http://localhost:4000/graphql",
        },
    },
};
```

# Apollo Client Setup

---

### Installing dependencies

백엔드 서버와 연결하기 위해 Apollo Client를 설치합니다. 

```bash
npm install @apollo/client graphql
```

### Apollo Client

**apollo.ts** 파일을 생성한 후, Apollo Client 객체를 생성합니다. 

token 정보를 담은 authorization 헤더를 모든 HTTP request에 추가해주기 위해 커스텀 링크를 추가해주었습니다. 

먼저 local storage에서 토큰 정보를 가져와 context 안에 담은 후, httpLink가 읽을 수 있도록 headers에 context를 추가적으로 붙여 리턴합니다. 서버는 이 헤더를 user의 권한을 확인할 때 사용할 수 있으며, GraphQL execution context에 붙여 리졸버가 이 context 정보를 이용해 다른 정보를 처리할 수 있습니다.  

```tsx
import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from "@apollo/client/utilities";

export const logUserIn = (token: string) => {
    localStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
};

export const logUserOut = () => {
    localStorage.removeItem(TOKEN);
    window.location.reload();
};

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: localStorage.getItem(TOKEN),
        }
    };
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            User: {
                keyFields: (obj) => `User:${obj.username}`,
            },
            Query: {
                fields: {
                  seeFeed: offsetLimitPagination()
                },
            },
        },
    }),
});
```

**App.tsx** 파일을 생성하고 가장 바깥쪽에 ApolloProvider 컴포넌트로 감싸줍니다. 이로써 리액트 컴포넌트 트리에서 설정된 apollo client 인스턴스에 접근할 수 있습니다. 

```tsx
function App(){
	return (
		<ApolloProvider client={client}>
			... 
		</ApolloProvider> 
	);
}
export default App;
```

# Executing a mutation

---

```tsx
const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            ok
            token
            error
        }
    }
`;
```

```tsx
const { login, loading } = useMutation(LOGIN_MUTATION, {
	onCompleted,
});
```

# Executing a query

---

```tsx
const SEE_PROFILE_QUERY = gql`
    query seeProfile($username: String!){
        seeProfile(username: $username){
            firstName
            lastName
            username
            email
            phonenum
            gender
            bio
            avatar
            photos{
                ...PhotoFragment
            }
            totalFollowing
            totalFollowers
            isMe
            isFollowing
        }
    }
    ${PHOTO_FRAGMENT}
`;
```

```tsx
const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
	varibles: {
		username,
	}
});
```