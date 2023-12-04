import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

function CustomTextField() {
    const [text, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };

    return (
        <TextField
            multiline
            rows={10}
            value={text}
            onChange={handleChange}
            variant="outlined"
            fullWidth
        />
    );
}

export default CustomTextField;
