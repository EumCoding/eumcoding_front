import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from 'react';

function Test() {
    const percentage = 66;

    return (
        <div style={{ width: "200px", height: "200px", margin:"100px" }}>
            <CircularProgressbarWithChildren value={percentage}>
                {/* 원 가운데에 넣고 싶은 컴포넌트를 여기에 넣으면 됩니다. */}
                <div style={{ fontSize: 12, marginTop: -5 }}>
                    <strong>임시강의1</strong>
                </div>
            </CircularProgressbarWithChildren>
        </div>
    );
}

export default Test;