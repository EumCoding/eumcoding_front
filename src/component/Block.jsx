import React from 'react';
import Box from '@mui/material/Box';
import {Typography} from "@mui/material";

const Block = ({ code, text, color, isSpecial }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // 추가: 중앙 정렬
                py: 1.5,
                px:3,
                bgcolor: color,
                borderRadius: '8px', // 둥근 모서리
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 그림자
                mb: 2,
                maxWidth:200,
                minWidth:100,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                position: 'relative', // 레고 스타일을 위한 포지셔닝
            }}
        >
            {isSpecial && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        //bgcolor: 'background.paper',
                        borderRadius: '4px', // 사각형 모양
                        width: 24,
                        height: 24,
                        mr: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        bgcolor: 'rgba(255, 255, 255, 0.6)', // 반투명한 화이트 색상
                        position: 'absolute', // 절대 위치
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)', // 중앙 정렬
                    }}
                >
                    <Typography>{code}</Typography>
                </Box>
            )}
            <Typography>{text}</Typography> {/* 텍스트 위치 조정 */}
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