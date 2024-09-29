import React from 'react';
import SpikePng from './assets/spike.png';

function checkMark() {
    return (<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.4">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.9427 19.0572L25.3333 6.66666L27.2189 8.55227L12.9427 22.8284L5.33325 15.2189L7.21887 13.3333L12.9427 19.0572Z" fill="white" />
        </g>
    </svg>);
}

export default function Spike({ start, end, y, progress, woodWidth }: { start: number, end: number, y: number, progress: number, woodWidth: number }) {
    // const calculatePositionFromProgress = () => ((end - start) * (progress || 0) + start - 62) / innerWidth * 100;
    if (progress > 1) progress = 1;
    const calculatePositionFromProgress = () => woodWidth - (257 * progress);

    // console.log(progress, calculatePositionFromProgress(), end, start, end - start);

    return (<div style={{ display: "flex", alignItems: "center", position: "absolute", top: y, right: calculatePositionFromProgress() }}>
        { progress >= 1 && checkMark()}
        <img src={SpikePng} />
    </div>)
}
