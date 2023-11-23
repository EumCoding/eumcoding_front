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


function TeacherDashBoard(props) {
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const [profile, setProfile] = useState(null); // 프로필 저장될 부분

    const navigate = useNavigate()

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    // 최초 정보 가져오기
    const getProfile = async () => {
        const response = await axios.post(
            `http://localhost:8099/member/info`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            res.data && setProfile(res.data)
            console.log(res)
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        getProfile();
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

                {/* 최근 등록 강의 **/}
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
                            <span className={styles.font_main}>최근 등록 강의</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    무작정 따라하는 우리아이 첫 코딩교육
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    등록일 : 등록일이 들어갑니다
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a} onClick={() => navigate("/teacher/newLecture")} >
                                    강의등록
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                onClick={() => navigate("/teacher/myLectureList")}
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                            >
                                <span className={styles.font_btn} >내 강의 목록</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 통계 **/}
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
                            <span className={styles.font_main}>통계</span>
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
                                    통계가 표시됩니다
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
                                onClick={() => navigate("/teacher/stats")}
                            >
                                <span className={styles.font_btn}>전체 통계 보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            {/* 최근 답변 **/}
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
                            <span className={styles.font_main}>최근 답변</span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={10} sx={{ pt: "1rem"}}>
                                <span className={styles.font_normal}>
                                    Q. 1강에 1번 문제가 이상해요
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    A. 안이상해요
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a}>
                                    답글이 달렸어요!
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
                                    Q. 1강에 1번 문제가 이상해요
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    잘 몰?루 겠어요
                                </span>
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
                                    무작정 따라하는 우리아이 첫 코딩교육
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pl:0, pt: "0"}}>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
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

export default TeacherDashBoard;