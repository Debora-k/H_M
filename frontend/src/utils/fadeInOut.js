import { useState, useEffect, useCallback, useRef } from "react";
import "../page/SearchPage/style/search.style.css";

export default function InfiniteLooper({
    speed,
    direction,
    children,
}) {
    const [looperInstances, setLooperInstances] = useState(1);
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const setupInstances = useCallback(() => {
        if (!innerRef?.current || !outerRef?.current) return;
        const {width} = innerRef.current.getBoundingClientRect();
        const {width: parentWidth} = outerRef.current.getBoundingClientRect();
        const instanceWidth = width / innerRef.current.children.lenth;

        if(width < parentWidth + instanceWidth) {
            setLooperInstances(looperInstances + Math.ceil(parentWidth / width));
        }
        resetAnimation();
    }, [looperInstances]);

    useEffect(() => {
        setupInstances();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", setupInstances);

        return () => {
            window.removeEventListener("resize", setupInstances);
        };
    }, []);


    function resetAnimation () {
        if (innerRef?.current) {
            innerRef.current.setAttribute("data-animate", "false");

            setTimeout(() => {
                if (innerRef?.current) {
                    innerRef.current.setAttribute("data-animate", "true");
                }
            }, 50);
        }
    }

    return (
        <div className="search-home-hints" ref={outerRef}>
            <div className="button-lines-wrapper" ref={innerRef}>
                {[...Array(looperInstances)].map((_, ind) => {
                    <div
                        key={ind}
                        className="looper__listInstance"
                        style={{
                            animationDuration: `${speed}s`,
                            animationDirection: direction === "right" ? "reverse" : "normal",
                        }}
                    >
                        {children}
                    </div>
                })}
        </div>
    </div>
    );
}
