import React from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";

function Curriculum(props) {

    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const navigate = useNavigate()

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: '#C3D9C9', // 버튼 클릭 시 효과 색상
                            // 클릭 효과 변경
                            '@media (hover: none)': {
                                backgroundColor: 'transparent',
                            },
                            '& .MuiTouchRipple-root': {
                                color: '#C3D9C9', // 터치 효과 색상
                            },
                        },
                        '&:hover, &:focus': {
                            borderColor: 'black',
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
        </ThemeProvider>
    );
}

export default Curriculum;