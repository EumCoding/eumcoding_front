import React, {useState} from 'react';
import {Button, createTheme, Divider, Grid, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../unauth/css/Lecture.module.css";
import StarIcon from "@mui/icons-material/Star";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function MyQuestion(props) {
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
            <DashTop/>
            <Grid container sx={{pr:{xs:"0rem", md:"2rem"}, pl:{xs:"2rem", md:"2rem"} , py:"2rem"}}>
                <Grid item xs={12}>
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
                <Grid container item xs={12} sx={{pt:"3rem", mt:0, px:{xs:"5%", md:"20%"}}}>

                    {/* 리뷰목록 **/}
                    <Grid
                        container
                        item xs={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{mt:'1rem'}}
                    >
                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item xs={12} display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                <Box item
                                     display="flex"
                                     justifyContent="flex-start"
                                     alignItems="center"
                                     sx={{pr:'1vw'}}>
                                    <FaceIcon sx={{fontSize:'4rem'}}/>
                                </Box>
                                <Grid
                                    container
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:"1rem"}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        sx={{pl:0}}
                                    >
                                        <span className={styles.font_review_nickname}>닉네임</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'1vw'}}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                                    무료강의 1
                                </Typography>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'0.5vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18
                                </span>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item xs={12} display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                <Box item
                                     display="flex"
                                     justifyContent="flex-start"
                                     alignItems="center"
                                     sx={{pr:'1vw'}}>
                                    <FaceIcon sx={{fontSize:'4rem'}}/>
                                </Box>
                                <Grid
                                    container
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:"1rem"}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        sx={{pl:0}}
                                    >
                                        <span className={styles.font_review_nickname}>닉네임</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'1vw'}}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                                    무료강의 1
                                </Typography>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'0.5vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18
                                </span>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item xs={12} display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                <Box item
                                     display="flex"
                                     justifyContent="flex-start"
                                     alignItems="center"
                                     sx={{pr:'1vw'}}>
                                    <FaceIcon sx={{fontSize:'4rem'}}/>
                                </Box>
                                <Grid
                                    container
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:"1rem"}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        sx={{pl:0}}
                                    >
                                        <span className={styles.font_review_nickname}>닉네임</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'1vw'}}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                                    무료강의 1
                                </Typography>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'0.5vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18
                                </span>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item xs={12} display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                <Box item
                                     display="flex"
                                     justifyContent="flex-start"
                                     alignItems="center"
                                     sx={{pr:'1vw'}}>
                                    <FaceIcon sx={{fontSize:'4rem'}}/>
                                </Box>
                                <Grid
                                    container
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:"1rem"}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        sx={{pl:0}}
                                    >
                                        <span className={styles.font_review_nickname}>닉네임</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'1vw'}}>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                                    무료강의 1
                                </Typography>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt:'0.5vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18
                                </span>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>

                        {/* 답변 **/}
                        <Grid container item xs={12} sx={{mt:'0.3vw', pl:{xs:"3rem", md:"5rem"}}}>
                            <Grid item xs={12} display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                <Box item
                                     display="flex"
                                     justifyContent="flex-start"
                                     alignItems="center"
                                     sx={{pr:'1vw'}}>
                                    <FaceIcon sx={{fontSize:'4rem'}}/>
                                </Box>
                                <Grid
                                    container
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:"1rem"}}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        sx={{pl:0}}
                                    >
                                        <span className={styles.font_review_nickname}>답변자</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18
                                </span>
                                <br/>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button fullWidth variant="outlined" sx={{borderRadius:"0.5vw", backgroundColor:"#FFFFFF", borderColor:"#000000", py:"1rem",}}>
                        <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                            더보기
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyQuestion;