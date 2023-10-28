import React, {useEffect, useState} from 'react';
import {Button, Collapse, createTheme, Divider, Grid, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../unauth/css/Lecture.module.css";
import StarIcon from "@mui/icons-material/Star";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function MyQuestion(props) {
    const accessToken = useSelector((state) => state.accessToken);
    const role = useSelector((state) => state.role);
    const navigate = useNavigate();

    const [result, setResult] = useState(null); // 결과담을 state
    const [more, setMore] = useState(true); // 더 결과가 있는지

    // question collapse state
    const [isQuestionCollapseOpen, setIsQuestionCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    const handleQuestionCollapseToggle = (idx) => {
        // 해당 idx의 상태값만 반대값으로 변경
        const newIsQuestionCollapseOpen = [...isQuestionCollapseOpen];
        newIsQuestionCollapseOpen[idx] = !newIsQuestionCollapseOpen[idx];
        setIsQuestionCollapseOpen(newIsQuestionCollapseOpen);
    };

    const defaultSize = 10;
    const [page, setPage] = useState(1);

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

    const [endDate, setEndDate] = useState(dayjs());
    //startDate는 6개월 전으로 설정
    const [startDate, setStartDate] = useState(dayjs().subtract(6, "month"));

    // 내 질문 목록 가져오기
    const getMyQuestion = async (end, start, page, size) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/question/mylist?page=${page}&size=${size}&end=${end.format("YYYY-MM-DD").toString()}&start=${start.format("YYYY-MM-DD").toString()}`,
            {},
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            console.log(res)
            if(res && res.data){
                // page가 1보다 크면 기존 데이터에 추가
                if(page > 1){
                    // 깊은복사
                    const temp = JSON.parse(JSON.stringify(result))
                    setResult(temp.concat(res.data));
                    // collapse 관리 state 이어붙이기
                    const tempArr = Array(res.data.length).fill(false);
                    // 기존의 isQuestionCollapseOpen에 이어붙이기
                    setIsQuestionCollapseOpen(prev => prev.concat(tempArr));
                }else{
                    setResult(res.data);
                    // collapse 관리 state 초기화
                    const tempArr = Array(res.data.length).fill(false);
                    setIsQuestionCollapseOpen(tempArr);
                }

                if(res.data.length < defaultSize){
                    setMore(false);
                }
            }

        })
    }

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

    useEffect(() => {
        if(accessToken === ""){
            navigate("/login");
        }
        // 내 질문 목록 최초 가져옴
        getMyQuestion(endDate, startDate, 1, defaultSize);

    },[])

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
                    {/* 검색버튼 **/}
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius:"0.5vw",
                            backgroundColor:"#FFFFFF",
                            borderColor:"#000000",
                            ml:"1rem",
                            py:"1rem",
                        }}
                        onClick={() => {
                            // 날짜가 올바르게 들어왔는지 체크합니다.
                            if (startDate > endDate) {
                                alert("날짜를 다시 선택해주세요.");
                                return;
                            }
                            getMyQuestion(endDate, startDate, 1, defaultSize);
                            setPage(1);
                        }}
                    >
                        <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                            검색
                        </Typography>
                    </Button>
                </Grid>
                <Grid container item xs={12}>
                    {/* result가 있을 때만 질문 목록을 출력합니다.**/}
                    {/* 질문리스트 **/}
                    {result && result.map((item, idx) => {
                        return(
                            <Grid xs={12} item container
                                  sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem"}}
                            >
                                <Grid item container xs={12} sx={{justifyContent:"space-between"}} onClick={() => handleQuestionCollapseToggle(idx)}>
                                    <Box sx={{fontWeight:"700", fontSize:"1.3rem", display:"inline", pl:"1rem"}}>
                                        <Typography sx={{fontWeight:"700", fontSize:"1.3rem"}}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#A2A2A2"}}>
                                            작성자 : {item.nickname}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D", display:"inline", pr:"1rem"}}>
                                        {item.date} | {item.answer === 0 ? "미답변" : "답변완료"}
                                    </Typography>
                                </Grid>
                                <Collapse in={isQuestionCollapseOpen[idx]} sx={{ width: '100%' }}>
                                    <Grid item container xs={12} sx={{px: "2rem", py: "2rem", display: "flex", width: '100%'}}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                border: 1,
                                                borderRadius: "15px", // 라운드를 약간 더 높임
                                                borderColor: "#A2A2A2",
                                                p: "1.5rem", // 패딩 조정
                                                backgroundColor: "#F7F7F7", // 배경색 추가
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" // 그림자 추가
                                            }}
                                        >
                                            <Typography sx={{fontSize: "1rem", fontWeight: "500"}}>
                                                {item.content}
                                            </Typography>
                                        </Box>

                                        {item.answer !== 0 && (
                                            <Typography>
                                                답변: {item.answer}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Collapse>
                                <Grid item xs={12} sx={{pt:"2rem"}}>
                                    <Divider/>
                                </Grid>
                            </Grid>
                        )
                    })}
                    {/* 더 있을때만 표시 **/}
                    {more && (
                        <Grid item xs={12} sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"5rem",}}>
                            <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}
                                    onClick={() => {
                                        // 질문리스트 가져옴
                                        getMyQuestion(endDate, startDate, page+1, defaultSize);
                                        setPage(page+1);

                                    }}
                            >
                                <span className={styles.font_review_more}>질문 더보기</span>
                            </Button>
                        </Grid>
                    )}


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