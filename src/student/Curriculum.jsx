import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createTheme, Grid, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";
import dayjs from "dayjs";

function Curriculum(props) {

    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const navigate = useNavigate()

    // 오늘날짜 dayjs로
    const today = dayjs();

    // 오늘
    const [planTodayResult, setPlanTodayResult] = useState(null); // 학습 계획 결과
    // 3일
    const [plan3DayResult, setPlan3DayResult] = useState(null); // 학습 계획 결과
    // 일주일
    const [planWeekResult, setPlanWeekResult] = useState(null); // 학습 계획 결과

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

    // 커리큘럼 정보 가져오기
    const getPlan = async (start, end) => {
        const tempStart = start.format('YYYY-MM-DDT00:00:00');
        const tempEnd = end.format('YYYY-MM-DDT00:00:00');
        console.log(`http://localhost:8099/member/myplan/list/info?startDateStr=${tempStart}&endDateStr=${tempEnd}`)
        const response = await axios.post(
            `http://localhost:8099/member/myplan/list/info?startDateStr=${tempStart}&endDateStr=${tempEnd}`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            console.log(res)
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        if(accessToken){
            getPlan(today, today.add(1, 'day')).then((res) => {
                res && res.data && setPlanTodayResult(res.data)
            })
            getPlan(today, today.add(3, 'day')).then((res) => {
                res && res.data && setPlan3DayResult(res.data)
            })
            getPlan(today, today.add(7, 'day')).then((res) => {
                res && res.data && setPlanWeekResult(res.data)
            })
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