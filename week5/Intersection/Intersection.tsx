import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Intersection.module.scss'
import useIntersection from './useIntersection';

const Intersection = () => {
    const intersectionCb = useCallback<IntersectionObserverCallback>((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(styles.active);
            } else {
                entry.target.classList.remove(styles.active);
            }
        })
    }, []);
    const target = useRef<any>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(intersectionCb,
            {
                root: null,
                rootMargin: '0px',
                threshold: 1
            }
        );

        observer.observe(target.current);

        return () => {
            // stop observing all targets
            observer.disconnect();

            // stop observing a specific target
            // observer.unobserve(target);
        }
    }, []);
    // useIntersection(intersectionCb, {
    //     root: null,
    //     rootMargin: '0px',
    //     threshold: 1
    // }, target.current)
    //const [bool, setBool] = useState(false);

    return <div className={styles.wrapper}>
        {/* <div onClick={() => setBool(!bool)}>CLICK</div> */}
        <div className={styles.firstPage}></div>
        <div className={styles.secondPage}>
            <div ref={target} className={styles.target}>
                LOOK AT ME
            </div>
        </div>
    </div>
}

export default Intersection;