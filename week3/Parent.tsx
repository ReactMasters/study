import { ReactNode, useCallback, useMemo, useState } from "react";
import NormalChild from "../Children/NormalChild";
import MemoChild from "../Children/MemoChild";
import PassPropsChild from "../Children/PassPropsChild";

const Parent = ({ children }: { children: ReactNode }) => {
    const [counter, setCounter]  = useState(0);
    const [counter2, setCounter2]  = useState(0);

    // useCallback memoize the function not the result. Even if the function itself
    // points at the same object, the result itself is not memoized. On the contrary,
    // useMemo memoizes the result(element in this case) itself. 

    // const renderMemoChild = useCallback(()=>{
    //     return <MemoChild></MemoChild>
    // },[]);

    // const renderMemoChild = useCallback(()=>{
    //     return <MemoChild></MemoChild>
    // },[counter2]);

    const renderMemoChild = useMemo(()=>{
        return <MemoChild></MemoChild>
    },[]);

    return <div>
        <div onClick={()=>setCounter(counter+1)}>Counter: {counter}</div>
        <PassPropsChild counter={counter}></PassPropsChild>
        <NormalChild></NormalChild>
        {children}
        {renderMemoChild}
    </div>
}

export default Parent;