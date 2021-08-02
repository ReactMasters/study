# GraphQL+Prisma+TypeScript로 Instagram 서버 만들기

이 포스트는 GraphQL, Prisma, Node.js, React, TypeScript를 이용해 만든 인스타그램 서버를 GraphQL을 중점으로 설명하였습니다.   

Apollo Server Express를 활용해 GraphQL 서버를 만들었고, 서버를 Prisma를 통해 데이터베이스와 연결하였습니다. 

# Installing dependencies

---

### Apollo Server Express, GraphQL

Apollo Server는 GraphQL 서버로, REST API 위에 GraphQL API를 제공합니다. 

GraphQL 서버를 세팅하기 위해 `apollo-server-express`와 `graphql` 패키지를 설치합니다. 

```bash
npm install apollo-server-express graphql --save
```

`apollo-server-express` 패키지는 `apollo-server`패키지에 [Express](https://expressjs.com)를 통합한 것입니다. 

`apollo-server-express`를 사용하면 `server.applyMiddleWare({ app })` 구문을 사용하여 Apollo Server 인스턴스에 Express HTTP 인스턴스를 미들웨어로 적용할 수 있게 됩니다.

### Prisma

```bash
npm install prisma --save-dev
npx prisma
npm install @prisma/cli --save-dev
npm install @prisma/client
```

Prisma는 오픈소스 ORM(Object-Relational Mapping)으로, 관계형 데이터베이스(테이블)와 데이터(클래스)를 자동으로 매핑해줍니다. 

Prisma cli(command line interface)는 Prisma 프로젝트를 cmd에서 접근할 수 있도록 도와줍니다. 

Prisma를 설치하면 `.env` 파일이 생성되는데 이 파일에 DATABASE_URL, 포트번호 등의 중요 정보를 저장합니다. 

### TypeScript

```bash
 npm install typescript ts-node --save-dev
```

설치 후, TypeScript 설정을 위해 `tsconfig.json` 파일을 작성합니다.

```json
{
    "compilerOptions": {
        "outDir": "./build",
        "allowJs": true,
        "target": "es5",
    },
    "include": ["./src/**/*"]
}
```

### package.json 파일 수정

```json
"scripts": {
	"preinstall": "npx npm-force-resolutions",
  "dev": "nodemon --exec ts-node src/server --ext ts,graphql --delay 2s",
  "migrate": "npx prisma migrate dev --preview-feature"
},
```

# File Directory

---

설명에 앞서 GraphQL 서버 앱의 파일 구조를 살펴보겠습니다. 

```c
|-- server
|   |-- prisma
|   |   |-- migrations
|   |   |   |-- ...
|   |   |-- schema.prisma
|   |-- src
|   |   |-- users
|   |   |   |-- ...
|   |   |-- photos
|   |   |   |-- ...
|   |   |-- comments
|   |   |   |-- ...
|   |   |-- messages
|   |   |   |-- ...
|   |   |-- shared
|   |   |   |-- ...
|   |   |-- client.ts
|   |   |-- schema.ts
|   |   |-- server.ts
|   |   |-- types.d.ts
|   |-- .env
|   |-- tsconfig.json
|   |-- package.json
```

구현한 인스타그램 서버는 다음의 기능을 포함하고 있습니다.

- users: 계정 생성, 로그인, 프로필 조회, 프로필 업데이트, 파일 업로드, 팔로우/팔로잉, 유저 검색
- photos: 사진 업로드, 사진 조회, 사진 수정, 사진 삭제, 사진검색, 해시태그 조회, 피드 조회, 사진 조회, 사진 댓글 조회, 좋아요/싫어요
- comments: 댓글 조회, 댓글 작성, 댓글 수정, 댓글 삭제
- messages: 메세지 보내기, 받은 메세지 읽기, 채팅방 생성 및 업데이트, 생성된 채팅방 조회

# Schema

---

## schema.prisma

**schema.prisma**은 Prisma를 셋팅하는 주요 설정 파일입니다. 스키마는 data sources, generators, data model definition 세 가지 파트로 구성됩니다. 

- datasource: 데이터베이스는 postgresql를 사용함을 명시하고, .env 파일에 저장한 `DATABASE_URL`을 연결해줍니다.
- generator: 어떤 클라이언트가 생성되어야하는지 명시합니다. 하나 이상의 generators를 가질 수 있습니다.
- model: data model을 정의하는 부분으로, 사용하는 데이터 소스 별 형태를 명시합니다. [Graphql 형식](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e)의 작성 방식과 거의 동일합니다.

아래는 클론인스타그램 서버에서 작성한 **schema.prisma** 파일의 일부입니다.

```graphql
datasource db {
	provider = "postgresql"
	url = env("DATABASE_URL")
}

generator client {
	provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement()) 
  firstName String
  lastName  String?
  username  String    @unique
  email     String    @unique
  password  String    @db.VarChar(200)
  phonenum  String?
  gender    String?
  bio       String?
  avatar    String?
  photos    Photo[]
  likes     Like[]
  comments  Comment[]
  followers User[]    @relation("FollowRelation", references: [id])
  following User[]    @relation("FollowRelation", references: [id])
  rooms     Room[]
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
...
```

- 필드: id, firstName, lastName, ..., createdAt, updatedAt
- 필드 타입:
    - Int, String (스칼라 타입)
    - Photo, Like, Comment, User, Room, Message (모델 타입)
- Type modifiers:
    - `[]`는 리스트인 필드를 나타낼 때 사용합니다.
    - `?`는 필수가 아닌 필드를 명시할 때 사용합니다.
- 네이티브 타입 (Version 2.17.0+): 최대 길이가 200 bytes인 String 등을 지정할 수 있습니다. (`@db.VarChar(200)`)
- Attributes:
    - [`@id`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#id)
    - [`@unique`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1)
    - [`@default`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#default)

**schema.prisma** 파일에 변경사항이 있을 때마다 migrate 해줍니다.

```bash
npx prisma migrate dev --preview-feature
```

# Type Definitions

---

작성한 **schema.prisma** 파일을 바탕으로 타입을 정의합니다. 

User의 타입은 다음과 같습니다. 

```tsx
import { gql } from 'apollo-server'; 

export default gql`
    type User {
        id:             Int!
        firstName:      String!
        lastName:       String
        username:       String!
        email:          String!
        password:       String!
        phonenum:       String
        gender:         String
        bio:            String
        avatar:         String
        photos:         [Photo]
        following:      [User]
        followers:      [User]
        totalFollowing: Int!
        totalFollowers: Int!
        isMe:           Boolean!
        isFollowing:    Boolean!
        createdAt:      String!
        updatedAt:      String!
    }
`;
```

쿼리와 뮤테이션의 타입도 정의합니다. 아래 예시는 프로필을 조회하는 쿼리와 로그인하는 뮤테이션의 타입입니다.

```tsx
// /src/users/seeProfile/seeProfile.typeDefs.ts
import { gql } from 'apollo-server'; 

export default gql`
    type Query {
        seeProfile(username: String!): User
    }
`;
```

```tsx
// /src/users/login/login.typeDefs.ts
import { gql } from 'apollo-server'; 

export default gql`
    type LoginResult {
        ok: Boolean!
        token: String  
        error: String
    }
    type Mutation {
        login(
            username: String!,
            password: String!
        ): LoginResult!
    }
`;
```

# Resolver

---

gql에서는 데이터를 가져오는 구체적인 과정을 담당하는 resolver(리졸버)가 있고, 이를 직접 구현해야 합니다. 

리졸버 함수는 총 4개의 인자를 받습니다. 

- root: 연쇄적 리졸버 호출에서 부모 리졸버가 리턴한 객체입니다. 이 객체를 활용해 현재 리졸버가 내보낼 값을 조절할 수 있습니다.
- args: 쿼리에서 입력으로 넣은 인자입니다.
- context: 모든 리졸버에게 전달되는 context입니다. 주로 미들웨어를 통해 입력된 값이 들어있습니다. 구현한 인스타그램 서버에서는 로그인정보 `loggedInUser`와 PrismaClient 객체 `client`를 전달하였습니다.
- info: 스키마 정보와 더불어 현재 쿼리의 특정 필드 정보를 가지고 있습니다. 잘 사용하지 않는 필드입니다.

    먼저 **types.d.ts** 파일에 `Context`와 `Resolver`, 그리고 resolver 배열 `Resolvers`의 타입을 정의합니다. 

```tsx
// types.d.ts
import { PrismaClient, User } from '@prisma/client';

export type Context = {
	loggedInUser?: User;
	client: PrismaClient;
}
export type Resolver = (root: any, args: any, context: Context, info: any) => any;
export type Resolvers = {
	[key:string]: {
		[key:string]: Resolver
	}
};
```

 그 다음, 

```tsx
export default {
    User: {
        totalFollowing: ({ id }, _, { client }) => 
            client.user.count({
                where: {
                    followers: {
                        some: {
                            id,
                        },
                    },
                },
            }),
        totalFollowers: ({ id }, _, { client }) => 
            client.user.count({
                where: {
                    following: {
                        some: {
                            id,
                        },
                    },
                },
            }),
        isMe: ({ id }, _, { loggedInUser } ) => {
            if(!loggedInUser){
                return false;
            }
            return id === loggedInUser.id;
        },
        isFollowing: async ({ id }, _, { loggedInUser, client }) => {
            if(!loggedInUser){
                return false;
            }
            const exists = await client.user.count({
                where: {
                    username: loggedInUser.username,
                    following: {
                        some: {
                            id,
                        },
                    },
                },
            });
            return Boolean(exists);
            
        },
        photos: ({ id }, _, { client }) => client.user.findUnique({ where: { id } }).photos(),
    }
}
```

d

# Queries and Mutations

---

GraphQL에서는 쿼리를 데이터를 읽는데(**R**) 사용하고, 뮤테이션은 데이터를 변조하는데(**CUD**) 사용합니다. 

```tsx
// /src/users/seeProfile/seeProfile.resolvers.ts
import { Resolvers } from '../../types';
const resolvers: Resolvers = {
    Query: {
        seeProfile: (_, { username }, { client }) => 
            client.user.findUnique({ 
                where: { 
                    username,
                },
            }),
    },
};
export default resolvers;
```

```tsx
// /src/users/login/login.resolvers.ts
export default {
    Mutation: {
        login: async ( _, { username, password }, { client }) => {
            const bcrypt = require("bcryptjs");
            const jwt = require("jsonwebtoken");
            // 1. find user with args.username
            const user = await client.user.findFirst({ where: { username }});
            if(!user){
                return {
                    ok: false,
                    error: "User not found.",
                };
            }
            // 2. check password with args.password
            const passwordOk = await bcrypt.compare(password, user.password);
            if(!passwordOk){
                console.log(password, user.password);
                return {
                    ok: false,
                    error: "Incorrect password.",
                }
            }
            // 3. issue a token and send it to the user
            const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            };
        },
    },
};
```

# Building server

---

**schema.ts** 파일을 생성하고, 모델 별로 구현된 type definitions와 resolvers 파일들을 loadFileSync를 이용하여 합칩니다. 이는 서버 인스턴스 생성할 때 사용하기 위함입니다. 

```tsx
import { loadFilesSync, mergeResolvers, mergeTypeDefs } from 'graphql-tools';

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const loadedResolvers = loadFilesSync(
    `${__dirname}/**/*.resolvers.ts`
);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);
```

**server.ts** 파일을 만들고 아래의 코드를 이용해 ApolloServer 인스턴스를 생성합니다. 

context에서는 로그인 정보와 Apollo Client 객체를 모든 리졸버에게 전달하고 있습니다. 

```tsx
// server.ts
import * as http from 'http';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import client from './client';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	context: async (ctx) => {
		if(ctx.req){
			return {
				loggedInUser: await getUser(ctx.req.headers.token),
				client,
			};
		} else {
			...
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => 
	console.log(`🚀 Server ready at https://localhost:4000${server.graphqlPath}`)
};
```