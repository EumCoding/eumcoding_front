import React from 'react';
import Box from '@mui/material/Box';
import {Typography} from "@mui/material";
import BlockList from "./BlockList";

const Block = ({ code, text, color, isSpecial }) => {
    // BlockList를 이용해 들어온 code와 비교해 BlockList 내의 text를 리턴하는 함수
    const getText = (code) => {
        for (let i = 0; i < BlockList.length; i++) {
            if (BlockList[i].code === code) {
                return BlockList[i].text;
            }
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1.5,
                px: 4,
                bgcolor: color,
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                minHeight:"2rem",
                mb: 2,
                width: 'auto', // 너비 자동 조절
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                position: 'relative',
            }}
        >
            {isSpecial ? (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            p: 0.4,
                            mr: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            position: 'relative',
                        }}
                    >
                        <Typography sx={{ fontWeight: "300", fontSize: "0.6rem", color: "#000000" }}>
                            {code.replace(/\[|\]/g, '')}
                        </Typography>
                    </Box>
                    <Typography>{text}</Typography>
                </>
            ) : (
                <Typography>{code?getText(code):"알수없음"}</Typography>
            )}
            <Box
                sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    bgcolor: 'rgba(255, 255, 255, 0.6)', // 반투명한 화이트 색상
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%', // 원형
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    bgcolor: 'rgba(255, 255, 255, 0.6)', // 반투명한 화이트 색상
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%', // 원형
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    bgcolor: 'rgba(255, 255, 255, 0.6)', // 반투명한 화이트 색상
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%', // 원형
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 5,
                    left: 5,
                    bgcolor: 'rgba(255, 255, 255, 0.6)', // 반투명한 화이트 색상
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%', // 원형
                }}
            />
        </Box>
    );
};

export default Block;