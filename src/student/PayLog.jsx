import React, {useState} from 'react';
import {Box, Button, createTheme, Grid, MenuItem, Select, TextField, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import testImg from "../images/test.png";


function PayLog(props) {

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

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    // 날짜체크
    const dateCheck = (t, e) => {
        let check = null;
        if(t === null){
            check = startDate;
        }else{
            check = t;
        }
        //선택한 endDate가 startDate보다 같거나 이전이면 false
        console.log(
            `e.year = ${e.get("year")} , startDay.year = ${check.get("year")}`
        );
        console.log(
            `e.month = ${e.get("month")} , startDay.month = ${check.get("month")}`
        );
        console.log(
            `e.day = ${e.get("date")} , startDay.day = ${check.get("date")}`
        );
        if (e.get("year") < check.get("year")) {
            return false;
        }
        if (e.get("month") < check.get("month")) {
            return false;
        }
        if (e.get("date") < check.get("date")) {
            return false;
        }
        console.log('검사문제없음');
        return true;
    };

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Box sx={{height: 80}}/>
            <Grid container sx={{px:{xs:"5%", sm:"10%", md:"10%", lg:"20%", width:"100%"}}} spacing={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"} sx={{pt:"2rem"}}>
                    <Typography sx={{color:"#000000", fontWeight:"900", fontSize:"2rem"}}>
                        결제내역
                    </Typography>
                </Grid>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            sx={{mr:"2rem"}}
                            label="출발일"
                            inputFormat="MM-DD-YYYY"
                            value={startDate}
                            onChange={(e) => {
                                if (dateCheck(e, endDate)) {
                                    setStartDate(e);
                                }else {
                                    setStartDate(e);
                                    setEndDate(e);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="종료일"
                            inputFormat="MM/DD/YYYY"
                            value={endDate}
                            minDate={startDate} // 출발일 이후의 날짜만 선택 가능하도록 설정
                            disablePast // 출발일 이전의 날짜는 선택할 수 없도록 설정
                            onChange={(e) => {
                                console.log(e);
                                if (startDate <= e) {
                                    console.log("여기걸림")
                                    setEndDate(e);
                                }else {
                                    setEndDate(startDate);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid container item xs={12} sx={{pb:"2rem"}} display={"flex"} justifyContent={"center"} alignItems={"stretch"}>
                    <Grid container item xs={12} sx={{border:1, borderRadius:"1vw", borderColor:"#8D8D8D", p:"1rem"}}>
                        <Grid xs={12} item sx={{pb:"1rem", pl:"0rem"}}>
                            <Typography sx={{color:"#8D8D8D", fontWeight:"700", fontSize:"1rem"}}>
                                주문번호 : 000000
                            </Typography>
                        </Grid>
                        <Grid xs={4} md={3} lg={2} item sx={{width:"100%"}}>
                            <Box sx={{width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:"1vw"}}>
                                <img src={testImg} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={9} lg={10} item container sx={{pl:"1rem"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Grid item xs={12}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", textDecoration:"underline"}}>
                                    무작정 따라하는 우리아이 코딩교육
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{fontWeight:"700", fontSize:"1rem"}}>
                                    2023-03-28
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={9} lg={10}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", fontColor:"#8D8D8D"}}>
                                    결제완료
                                </Typography>
                            </Grid>
                            <Grid xs={12} md={3} lg={2} item container sx={{pl:"1rem"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Typography sx={{fontWeight:"900", fontSize:"1.3rem",}}>
                                    6000원
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default PayLog;