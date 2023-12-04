import React from 'react';

function RenderText({ text }) {
    return (
        <div>
            {text.split('<br/>').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index !== text.split('<br/>').length - 1 && <br />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default RenderText;
