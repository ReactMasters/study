import React, { useEffect } from 'react';

interface IntersectionObserverOption {
    root: HTMLElement | null,
    rootMargin: string,
    threshold: number
}

const useIntersection = (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverOption,
    target: HTMLElement | null) => {

    useEffect(() => {
        const observer = new IntersectionObserver(callback, options);
        if (target) {
            observer.observe(target);
        } else {
            console.log("no target")
        }
        return () => {
            // stop observing all targets
            observer.disconnect();

            // stop observing a specific target
            // observer.unobserve(target);
        }
    }, [target]);

}

export default useIntersection;