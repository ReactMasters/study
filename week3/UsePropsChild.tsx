const UsePropsChild = ({ counter }: { counter: number }) => {

    console.log("UsePropsChild render");
    return <div>{counter} UseProps Child</div>
}

export default UsePropsChild;