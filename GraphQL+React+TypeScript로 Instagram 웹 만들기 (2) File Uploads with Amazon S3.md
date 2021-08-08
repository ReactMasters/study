# GraphQL+React+TypeScript로 Instagram 웹 만들기 (2): File Uploads with Amazon S3

Technical Skills: Apollo, React.js, graphql, typescript

이 포스트는 [GraphQL+React+TypeScript로 Instagram 웹 만들 [GraphQL+React+TypeScript로 I.textClipping](GraphQL+React+TypeScript로 I.textClipping) 기 (1)](https://www.notion.so/GraphQL-React-TypeScript-Instagram-1-Get-Started-2613c2c7803b43cf87356dd55ab8aef8) 포스트를 이어서 작성하였습니다. 이 시리즈는 GraphQL, React, TypeScript를 이용해 만든 인스타그램 웹 클라이언트를 GraphQL을 중점으로 설명하였습니다. 

- GraphQL+React+TypeScript로 Instagram 웹 만들기 시리즈

    [(1) Get started](https://www.notion.so/GraphQL-React-TypeScript-Instagram-1-Get-Started-2613c2c7803b43cf87356dd55ab8aef8)

    (2) File Uploads with Amazon S3

    [(4) Subscriptions](https://www.notion.so/GraphQL-React-TypeScript-Instagram-4-Subscriptions-5f4e2d82515b4994a1e8e2199433bed1)

오늘은 클라이언트에서 File Uploads를 사용하는 방법에 대해 알아보도록 하겠습니다. Apollo 서버에서 `Upload` 타입을 추가함으로써, 클라이언트가 파일을 업로드할 수 있습니다.

# Setup

---

먼저 `apollo-upload-client` 패키지를 설치합니다.

```bash
npm install apollo-upload-client @types/apollo-upload-client
```

Apollo client를 생성하는 파일(`apollo.ts`)에 아래의 코드를 추가합니다. 

```tsx
import { createUploadLink } from 'apollo-upload-client';

const httpLink = createUploadLink({
    uri: "http://localhost:4000/graphql",
});
```

이 때 `createUploadLink`는 `createHttpLink`를 [대체할 수 있습니다](https://github.com/jaydenseric/apollo-upload-client/issues/133).

# Uploading a file from the client to cloud storage

---

### 프로필 사진 변경하는 컴포넌트 구현하기

```tsx
// EditProfilePhoto.tsx
import { gql, useMutation } from '@apollo/client';
import styled from 'styled-component';

const EDIT_PROFILE_PHOTO_MUTATION = gql`
	mutation editProfile($avatar: Upload){
		editProfile(avatar: $avatar){
			ok
			error
		}
	}
`;

type EditProfilePhotoProps = {
	labelName: string, 
};

const EditProfilePhotoContainer = styled.div`
	label {
		display: inline;
		color: #0095f6;
		font-weight: 600;
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	input[type="file"]{
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
`;

const EditProfilePhoto = ({ labelName, }: EditProfilePhotoProps) => {
	const onCompleted = (data: any) => {
		const { editProfile: { ok, error }, } = data;
		if(ok){
			console.log("Complete!");
		}
	};
    
	const [ editProfilePhoto, { loading, error } ] = useMutation(EDIT_PROFILE_PHOTO_MUTATION, {
		onCompleted,
	});
	    
	const uploadFile = (event: any): void => {
		editProfilePhoto({
			variables: event.target.files[0],
		});
	};
	
	if(loading) return <div>Loading...</div>;
	if(error) return <div>{JSON.stringify(error, null, 2)}</div>;
	
	return (
		<EditProfilePhotoContainer>
			<label htmlFor="file_upload">{ labelName }</label>
			<input type="file" id="file_upload" required onChange={uploadFile.bind(this)} />
		</EditProfilePhotoContainer>
	);
};
export default EditProfilePhoto;
```

프로필 사진 변경 버튼이 있는 곳에 EditProfilePhoto 컴포넌트를 추가합니다.

```tsx
<EditProfilePhoto labelName="프로필 사진 바꾸기" />
```

# 참고자료

---

[☝️ GraphQL File Uploads with React Hooks, TypeScript & Amazon S3 [Tutorial]](https://www.apollographql.com/blog/graphql/file-uploads/with-react-hooks-typescript-amazon-s3-tutorial/)