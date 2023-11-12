import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createTheme, Grid, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";

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

    // 내 커리큘럼에 해당하는 섹션 진도율 및 정보
    const getMyPlanInfo = async () => {
        const response = await axios.get(
            `http://localhost:8099/member/myplan/list/info`,
            {headers: {Authorization: `${accessToken}`}}
        ).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(accessToken){
            getMyPlanInfo();
        }
    }, [accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{width:"100%", height:"100vh", py:"1rem"}}>
                <Grid xs={4} item>
                    {/* 이번주 진행률 **/}
                </Grid>
                <Grid xs={8} item></Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Curriculum;