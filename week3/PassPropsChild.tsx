const PassPropsChild = ({ counter }: { counter: number }) => {

    console.log("PassPropsChild render", counter);
    return <div>PassProps Child</div>
}

export default PassPropsChild;