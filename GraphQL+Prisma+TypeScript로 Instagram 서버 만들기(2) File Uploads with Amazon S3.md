# GraphQL+Prisma+TypeScript로 Instagram 서버 만들기(2): File Uploads with Amazon S3

Technical Skills: Apollo, Node.js, React.js, graphql, prisma, typescript

이 포스트는 [GraphQL+Prisma+TypeScript로 Instagram서버 만들기(1)](https://www.notion.so/GraphQL-Prisma-TypeScript-Instagram-1-Get-started-9182c0d724f24e6ba72d54364c8bd90f) 포스트를 이어서 작성하였습니다. 

이 시리즈는 GraphQL, Prisma, Node.js, React, TypeScript를 이용해 만든 인스타그램 서버를 GraphQL을 중점으로 설명하였습니다.   

- GraphQL+Prisma+TypeScript로 Instagram 서버 만들기 시리즈

    [(1) Get started](https://www.notion.so/GraphQL-Prisma-TypeScript-Instagram-1-Get-started-9182c0d724f24e6ba72d54364c8bd90f)

    [(2) File Uploads with Amazon S3]()

    [(3) Subscriptions](https://www.notion.so/GraphQL-Prisma-TypeScript-Instagram-3-Subscriptions-f6644242d66046bea9d391c4c3d3cab2)

(2)편에서는 File uploads를 Amazon S3와 함께 구현하는 방법에 대해 알아보도록 하겠습니다. 

# File uploads

Apollo 서버를 사용하면, 타입을 정의할 때(`xx.typeDefs.ts`) `upload` 타입을 추가하는 것만으로 클라이언트로부터 파일을 업로드 받을 수 있습니다. 예를 들어 `upload` 타입의 인자를 받는 mutation(뮤테이션)을 작성하면, 서버에 저장된 파일에 연결된 `stream`을 얻을 수 있고, 심지어는 외부 클라우드 서비스(e.g., AWS S3)에 연결된 `stream`도 얻을 수 있습니다. 

`Upload` 타입은 다음의 attributes를 가지고 있습니다. 
* `stream`: 업로드하는 파일의 upload stream입니다. Node.js 스트림을 파일 시스템이나 다른 클라우드 저장소로 연결할 수 있습니다.
* `filename`: 업로드하는 파일의 이름
* `mimetype`: text/plain, application/octet-stream 등과 같은 파일의 MIME 타입
* `encoding`: 사용할 파일 인코딩 방법 (e.g., UTF-8)

Apollo 서버에 파일 업로드를 세팅하는 방법에는 세 가지가 있습니다. 각각의 장단점은 [링크](https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/)를 참조해주시길 바랍니다. 

- Multipart Upload Requests
- Signed Upload URLs
- Utilizing an Image Server

여기서는 **Multipart Upload Request** 접근법을 사용합니다. 

Multipart Upload Request 접근법은 프로덕트에는 적합하지 않습니다. 

![GraphQL+Prisma+TypeScript%E1%84%85%E1%85%A9%20Instagram%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%200ae120c1131d4b46b5113ebfdd87c00b/Untitled.png](GraphQL+Prisma+TypeScript%E1%84%85%E1%85%A9%20Instagram%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%200ae120c1131d4b46b5113ebfdd87c00b/Untitled.png)

Fig. 1. Multipart Upload Requests approach to file uploads using a Hobbyist GraphQL Architecture. (출처: [https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/](https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/))

**Multipart Upload Request** 접근법을 사용하면 Fig. 1.에서 보이는 것처럼, Apollo Client를 사용하는 프론트엔드 앱은 `apollo-upload-client` 패키지를 사용하여 Apollo 서버에 파일을 업로드할 수 있습니다. 

Apollo 서버는 GraphQL 스키마에서 upload mutation에 `Upload`타입 인자를  드러냅니다. Upload mutation이 실행하는 동안, `Upload` 타입은 지정한 도착지 (e.g., AWS S3 storage)로 연결되는 stream을 드러냅니다.

# How to implement File Uploads with Multipart Upload Request

이전 포스트에서 typescript환경에서 apollo 서버 세팅을 완성하였기 때문에 이번 포스트에서는 apollo 서버 세팅 이후의 과정을 설명하겠습니다. 

Apollo Server 3을 쓰기 위해선 `apollo-server` 대신 `apollo-server-express` 패키지를 사용해야 합니다.

먼저, `graphql-upload`패키지를 설치합니다.

```bash
npm install --save graphql-upload
```

서버를 생성할 때(`server.ts`) 아래의 코드를 추가해줍니다.

```tsx
// This middleware should be added before calling `applyMiddleware`.
app.use('./static', express.static('uploads'));
```

그다음 `Upload` 타입의 인자를 받는 mutation을 작성합니다. 

아래의 예시는 파일을 업로드하는 mutation입니다. 인자로 `Upload`타입의 `file`과, `String`타입의 `caption`을 받으며 생성된 `Photo` 객체를 리턴합니다. 

```tsx
// uploadPhoto.typeDefs.ts
import { gql } from 'apollo-server';

export default gql`
	type Mutation {
		uploadPhoto(
			file: Upload!,
			caption: String,
		): Photo
	}
`;
```

```tsx
// uploadPhoto.resolvers.ts
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';
import { uploadToS3 } from '../../shared/shared.utils';

export default {
	Mutation: {
		uploadPhoto: protectedResolver(
			async (_, { file, caption }, { loggedInUser, client }) => {
				let hashtagObj = [];
				if(caption){
					hashtagObj = processHashtags(caption);
				}
				const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
				return client.photo.create({
					data: {
						user: {
							connect: {
								id: loggedInUser.id,
							}
						},
						file: fileUrl,
						caption,
						...hashtagObj.length > 0 && {
								hashtags: {
									connectOrCreate: hashtagObj,
								}
						}
				});
			}
		),
	}
}
```

토큰을 가진 로그인한 사용자만 접근할 수 있도록 구현한 `protectedResolver`로 감싸준 후, 먼저 인자로 `caption`을 받았을 경우, hashtag(#) 객체 `hashtagObj`를 추출합니다. 그 후 AWS S3에 파일을 업로드 한 후 파일의 URL 값을 받아 `photo` 객체 안에 같이 넣어줍니다.

### Uploading to AWS S3

Amazon S3는 객체 저장 서비스로, 이미지, 비디오 등 어떤 타입의 파일이든 저장 가능한 저장소를 제공합니다. 

먼저 AWS SDK를 사용하기 위해 설치합니다. 

```bash
npm install --save aws-sdk
```

AWS S3를 사용하기 위해 [amazon](https://aws.amazon.com/ko/) 계정 로그인하고 

1. IAM 메뉴에서 aws 계정에서 사용 가능한 API 키를 생성합니다.
2. [amazon s3](https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2) 메뉴에서 버킷을 생성합니다.

생성한 버킷 정보를 바탕으로 아래 코드를 작성합니다. 

```tsx
import * as AWS from 'aws-sdk';

AWS.config.update({
	credentials: {
		accessKeyId: process.env.AWS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
	region: "ap-northeast-2",
});

const bucketInstance = new AWS.S3();

export const uploadToS3 = async (file, userId, folderName) => {
	const { filename, createReadStream } = await file;
	const readStream = createReadStream();
	const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
	const { Loaction } = await bucketInstance
		.upload({
			Bucket: "instaclone-s3upload",
			Key: objectName,
			ACL: "public-read",
			Body: readStream,
		}).promise();
};
```

- aws API 키(`accessKeyId`, `secretAccessKey`)와, (optional)지역(`region`)을 설정해줍니다.
- AWS S3 객체를 생성합니다.
- AWS S3 인스턴스(`bucketInstance`)를 사용하여 버킷에 업로드합니다.

클라이언트 단에서 파일을 업로드하는 방법에 대해 궁금하시다면 [GraphQL+React+TypeScript로 Instagram 웹 만들기 (3): File Uploads with Amazon S3](https://www.notion.so/GraphQL-React-TypeScript-Instagram-2-File-Uploads-with-Amazon-S3-2ed518c9021d44f294d024a2da6e1eaf)을 이어 봐주시길 바랍니다. 

### createReadStream() 실행 시 "Maximum call stack size exceeded" 에러 발생할 경우

[링크](https://github.com/apollographql/apollo-server/issues/3508)를 참조하여 해결하면 됩니다. 

1. `package.json` 맨 아래에 "resolutions" 추가합니다.

```json
"resolutions": {
	"fs-capacitor": "^6.2.0",
	"graphql-upload": "^11.0.0"
}
```

2. `package.json` scripts에 preinstall 값 추가합니다. 

```json
"scripts": {
	"preinstall": "npx npm-force-resolutions",
	...
}
```

3. node_modules를 지우고 `npm install` 다시 실행합니다. 

# 참고자료

[☝️ GraphQL File Uploads with React Hooks, TypeScript & Amazon S3 [Tutorial]](https://www.apollographql.com/blog/graphql/file-uploads/with-react-hooks-typescript-amazon-s3-tutorial/)