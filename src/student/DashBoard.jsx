import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme, Grid, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import styles from "./css/DashBoard.module.css";
import FaceIcon from "@mui/icons-material/Face6";
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import StarIcon from '@mui/icons-material/Star';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";


function DashBoard(props) {
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const [profile, setProfile] = useState(null); // 프로필 저장될 부분

    const [planResult, setplainResult] = useState(null); // 학습 계획 결과

    const [lectureResult, setLectureResult] = useState(null); // 내 강의 목록 결과

    const [questionResult, setQuestionResult] = useState(null); // 질문 목록 결과

    const [reviewResult, setReviewResult] = useState(null); // 리뷰 목록 결과

    const [badgeCount, setBadgeCount] = useState(0); // 뱃지 목록 결과


    const navigate = useNavigate()

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    // 최초 정보 가져오기
    const getProfile = async () => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/member/info`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            res.data && setProfile(res.data)
            console.log(res)
        }).catch((err) => console.log(err))
    }

    // 커리큘럼 정보 가져오기
    const getPlan = async () => {
        //endDate는 오늘날짜에서 시간만 23:59:59로 바꾸고 startDate는 오늘날짜에서 시간만 00:00:00
        const startDate = dayjs().format('YYYY-MM-DDT') + '00:00:00'
        const endDate = dayjs().format('YYYY-MM-DDT') + '23:59:59'
        console.log(`${process.env.REACT_APP_API_URL}/member/myplan/detail`)
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/member/myplan/detail`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            console.log("커리큘럼 정보 가져오기...");
            res && res.data && setplainResult(res.data)
            console.log(res)
        }).catch((err) => console.log(err))

    }

    // 내 강의 목록 1페이지 불러오기
    const getMyLecture = async (pageParam) => { // pageParam : 가져올 page
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/member/mylecture/list?page=${pageParam}&sort=1&size=12`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            if(res.data.length > 0){
                setLectureResult(res.data[0])
            }
        })
    }

    // 질문 목록 가져오기
    // 내 질문 목록 가져오기
    const getMyQuestion = async (end, start, page, size) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/question/mylist?page=${page}&size=${size}&end=${end.format("YYYY-MM-DD").toString()}&start=${start.format("YYYY-MM-DD").toString()}`,
            {},
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            console.log(res)
            if(res && res.data){
                console.log("질문 목록 가져오기...")
                console.log(res)
                setQuestionResult(res.data[0])
            }

        })
    }

    // 리뷰목록 가져오는 api 호출
    const getReviewList = async (startDate,endDate, pageParam) => {
        // endDate와 startDate를 yyyy-mm-dd hh:mm:ss 에 맞게 포맷팅
        const end = endDate.format('YYYY-MM-DD 23:59:59');
        const start = startDate.format('YYYY-MM-DD 00:00:00');
        const data = {
            endDate : end,
            startDate : start
        }
        console.log("리뷰목록 가져오기...")
        console.log(data);
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/review/my_list?page=${pageParam}`, // defaultSize가 10이므로 따로 보내지 않음
            data,
            {
                headers: {
                    Authorization: `${accessToken}`,
                },
            }
        ).then((res) => {
            if(res && res.data){
                console.log("리뷰 목록 가져오기...")
                console.log(res)
                setReviewResult(res.data[0])
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 뱃지목록 가져오기 ... /member/payment/lecture/badge
    const getBadgeList = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/member/payment/lecture/badge`,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            if(res && res.data){
                console.log("뱃지 목록 가져오기...")
                console.log(res)
                console.log(res.data.count)
                setBadgeCount(parseInt(res.data.count))
            }
        })

    }

    useEffect(() => {
        if(accessToken){
            getProfile();
            getPlan();
            getMyLecture(1);
            // 1년치 질문을 가져와야 함
            const end = dayjs();
            const start = end.subtract(1, 'year');
            getMyQuestion(end, start, 1, 1);
            // 1년치 리뷰를 가져와야 함
            const endDate = dayjs();
            const startDate = endDate.subtract(1, 'year');
            getReviewList(startDate, endDate, 1);
            // 뱃지
            getBadgeList();
        }
    },[,accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>

            <Grid container sx={{px: { xs: "5%", sm: "10%", md: "10%" }, mt:"5px"}}>
                <Grid item container xs={4} sx={{pr:"10px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>프로필</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={2} sx={{pt: "1rem"}}>
                            <FaceIcon sx={{fontSize: '3rem'}}/>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={10} sx={{pl: '1rem', pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    <b className={styles.font_name}>{profile && profile.nickname}</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    {profile && profile.email}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    가입일 : {profile && profile.joinDay}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                                onClick={() => navigate("/my/profile")}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 최근 학습 강의 **/}
                <Grid item container xs={4} sx={{px:"20px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>최근 결제 강의</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    {lectureResult ? lectureResult.lectureName :  "결제한 강의가 없습니다."}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    {lectureResult && "진행률 : " + lectureResult.progress + "%"}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a}
                                    onClick={() => navigate("/my/payLog")}
                                >
                                    결제내역
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                onClick={() => navigate("/my/lectureList")}
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                            >
                                <span className={styles.font_btn} >전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 뱃지 **/}
                <Grid id='badge' item container xs={4} sx={{pl:"10px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>뱃지</span>
                        </Grid>
                        <Grid item
                              container
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem", position:'absolute', bottom:'45%', width: "92%"}}>
                            <Grid item
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  xs={12}>
                                <LocalPoliceIcon sx={{fontSize: '4rem', color: '#8D8D8D'}}/>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  xs={12}
                                  sx={{mt:'1rem'}}
                            >
                                <span className={styles.font_normal}>
                                    {
                                        badgeCount > 0 ? badgeCount + "개의 뱃지를 보유하고 있습니다." : "보유한 뱃지가 없습니다."
                                    }
                                </span>
                            </Grid>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                                onClick={() => navigate("/my/badge")}
                            >
                                <span className={styles.font_btn}>뱃지 고르러 가기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            {/* 학습 계획 **/}
            <Grid container  sx={{px: { xs: "5%", sm: "10%"}, mt:"5px"}}>

                <Grid item container xs={4} sx={{pr:"10px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>학습 계획</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    {dayjs().year()}년 {dayjs().month()}월 {dayjs().day()}일
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    오늘 수강할 강의
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                            {planResult?.slice(0, 3).map((item, idx) => (
                                <span className={styles.font_gray}>
                                    {item.sectionDTOList[0].lectureName} ( {item.sectionDTOList[0].sectionName} ) : {item.sectionDTOList[0].progress}%
                                </span>
                            ))}
                            {!planResult && (
                                <span className={styles.font_gray}>
                                    수강할 강의가 없습니다.
                                        </span>
                                )}
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                                onClick={() => navigate("/student/curriculum")}
                            >
                                <span className={styles.font_btn}>전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 최근 질문 **/}
                <Grid id='recent' item container xs={4}  sx={{px:"20px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>최근 질문</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={10} sx={{ pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    {questionResult ? "Q. " + questionResult.title : "질문이 없습니다."}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    {/* 20자까지만 잘라서 출력하기 **/}
                                    {questionResult && questionResult.content && (questionResult.content.length > 20 ? questionResult.content.slice(0, 20) + "..." : questionResult.content)}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a}>
                                    {questionResult && questionResult.answer === 1 && "답변이 달렸어요!"}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                                onClick={() => navigate("/my/question")}
                            >
                                <span className={styles.font_btn}>전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 최근 리뷰 **/}
                <Grid id='review' item container xs={4} sx={{pl:"10px"}}>
                    <Grid item xs={12} container sx={{
                        width:"100%",
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>최근 리뷰</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    {reviewResult ? reviewResult.content : "리뷰가 없습니다."}
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pl:0, pt: "0"}}>
                            {reviewResult && reviewResult.rating > 0 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                            {reviewResult && reviewResult.rating > 1 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                            {reviewResult && reviewResult.rating > 2 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                            {reviewResult && reviewResult.rating > 3 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                            {reviewResult && reviewResult.rating > 4 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a}>
                                    답변이 달렸어요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                                onClick={() => navigate("/my/review")}
                            >
                                <span className={styles.font_btn}>전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default DashBoard;