# setState의 특성 이해하기 + useCallback 으로 성능 up!

오늘은 제가 여러 형태의 form 을 만들다가 자주 겪었던 문제를 써볼려고 해요.

먼저 다음과 같은 상황을 예시로 듭시다.

### Client 의 요청사항

1. **이름**을 쓸 수 있다.
2. **나이**를 쓸 수 있다.
3. **기타 정보**로 취미, 사용하고 있는 스마트 폰, 사용하는 랩탑을 쓰는 칸이 있다.
4. **기타 정보**의 필드들은 더 추가/삭제/수정이 빈번하게 될 예정이다.

이런 상황에서 다음과 같은 폼을 만들었다고 할게요.

## Bad case

```tsx
interface ProfileDetail {
  hobby?: string;
  phone?: string;
  laptop?: string;
}

export default function Page() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [detail, setDetail] = useState<ProfileDetail>({
    hobby: "",
    phone: "",
    laptop: "",
  });
  console.log(detail);
  return (
    <Wrapper>
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="나이"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <Input
        placeholder="phone"
        value={detail?.phone}
        onChange={(e) => setDetail({ ...detail, phone: e.target.value })}
      />
      <Input
        placeholder="hobby"
        value={detail?.hobby}
        onChange={(e) => setDetail({ ...detail, hobby: e.target.value })}
      />
      <Input
        placeholder="laptop"
        value={detail?.laptop}
        onChange={(e) => setDetail({ ...detail, laptop: e.target.value })}
      />
    </Wrapper>
  );
}
```

detail로 상태를 묶는건 코드의 편의를 위해 묶었어요. 리액트에서는 가능한 개별 상태로 분리하기를 권장합니다.

위의 코드는 문제가 많습니다.

1. detail 안의 필드들의 인풋들이 거의 비슷한 onChange 구문을 가지고 있습니다.
2. onChange 함수에 매번 arrow function으로 집어넣기 때문에 rerender 될 때마다 새로 함수가 만들어져 전달됩니다.

이를 조금 개선시켜봅시다.

## Not bad case

```tsx
export default function Page() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [detail, setDetail] = useState<ProfileDetail>({
    hobby: "",
    phone: "",
    laptop: "",
  });
  const handleDetailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // e.target.placeholder
    setDetail({ ...detail, [e.target.name]: e.target.value });
  };
  console.log(detail);
  return (
    <Wrapper>
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="나이"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <Input
        name="phone"
        placeholder="phone"
        value={detail?.phone}
        onChange={handleDetailChange}
      />
      <Input
        name="hobby"
        placeholder="hobby"
        value={detail?.hobby}
        onChange={handleDetailChange}
      />
      <Input
        name="laptop"
        placeholder="laptop"
        value={detail?.laptop}
        onChange={handleDetailChange}
      />
    </Wrapper>
  );
}
```

name 속성에 필드 명을 넣어서 중복되는 코드를 하나로 만들고, 화살표 함수로 전달하던 onChange도 하나의 변수로 합쳐서 전달했습니다.

매 렌더링마다 세개의 서로다른 onChange 함수가 생성되어 전달되는 것보단 훨씬 나아졌습니다.

그러나 여전히 문제는 있습니다. 매 렌더링마다 handleDetailChange는 다시 생성되고 있습니다.

이걸 조금 더 개선시켜봅시다.

## Good case

저는 다음 특성을 이용했습니다.

- useCallback은 함수를 메모이제이션 해줍니다. DependencyList 에 할당된 녀석들이 변경되지 않는 한 변경되지 않습니다. 여기서는 빈 배열로 초기 렌더링 한번에만 선언되고 이후로는 함수가 재선언되지 않게했습니다.
- useState를 통해 얻는 setState 함수는 state와 달리 그 참조가 변하지 않습니다. 
즉, 훅을 쓸 때 DependencyList 에 전달해주지 않아도 무방합니다.
- setState에서 functional-updates 기능이 있습니다. 새로운 인자대신, 함수형으로 사용하면 파라미터로 이전 상태값을 가져옵니다. 이렇게 쓰면 훅 안에서 쓰일 때 이전 상태를 참조하느라 상태를 Dependency List 에 넣어줄 필요가 없어집니다.

```tsx
export default function Page() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [detail, setDetail] = useState<ProfileDetail>({
    hobby: "",
    phone: "",
    laptop: "",
  });
  const handleDetailChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) =>
      setDetail((detail) => ({
        ...detail,
        [e.target.name]: e.target.value,
      })),
    []
  );
  console.log(detail);
  return (
    <Wrapper>
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="나이"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <Input
        name="phone"
        placeholder="phone"
        value={detail?.phone}
        onChange={handleDetailChange}
      />
      <Input
        name="hobby"
        placeholder="hobby"
        value={detail?.hobby}
        onChange={handleDetailChange}
      />
      <Input
        name="laptop"
        placeholder="laptop"
        value={detail?.laptop}
        onChange={handleDetailChange}
      />
    </Wrapper>
  );
}
```

이렇게 함으로써 렌더링 마다 onChange로 전달해줄 함수를 재생성하지 않고, 오로지 유일하게 한번 생성된후, 그 함수가 다른 여러개 인풋에 재사용될 수 있게 했습니다. ☺️☺️☺️☺️