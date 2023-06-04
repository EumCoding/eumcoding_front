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


function DashBoard(props) {
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
                headers:{Authorization: `Bearer ${accessToken}`,}
            }
        ).then((res) => {
            res.data && setProfile(res.data)
            console.log(res)
        }).catch((err) => console.log(err))

    }

    useEffect(() => {
        if(!accessToken){
            navigate("/login");
        }
        getProfile();
    },[])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Box sx={{height: 80}}/>

            <Grid container justifyContent='center' sx={{px: "5rem"}}>
                <Grid item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
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
                            <FaceIcon sx={{fontSize: '4rem'}}/>
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
                                onClick={() => navigate("/my/profile")}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 최근 학습 강의 **/}
                <Grid item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
                        border: 1,
                        borderColor: "#A2A2A2",
                        borderRadius: "10px",
                        px: "1.5rem",
                        paddingBottom: '40%',
                        position: "relative"
                    }}>
                        <Grid item xs={12} sx={{pt: "2rem"}}>
                            <span className={styles.font_main}>최근 학습 강의</span>
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
                                    진도율 : 1강 / 12강 (5%)
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_a}>
                                    전체 보기
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
                            >
                                <span className={styles.font_btn}>이어서 수강하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>


                {/* 뱃지 **/}
                <Grid id='badge' item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
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
                              xs={12} sx={{pt: "1rem", position:'absolute', bottom:'50%', width: "92%"}}>
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
                                    보유중인 뱃지가 없어요!
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
                            >
                                <span className={styles.font_btn}>뱃지 고르러 가기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 학습 계획 **/}
                <Grid item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
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
                                    2023년 3월 25일
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
                                <span className={styles.font_gray}>
                                    무작정 따라하는 우리아이 ... 1강 : 5%
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
                            >
                                <span className={styles.font_btn}>전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 최근 질문 **/}
                <Grid id='recent' item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
                            >
                                <span className={styles.font_btn}>전체보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 최근 리뷰 **/}
                <Grid id='review' item container xs={4} sx={{p: "1.5rem"}}>
                    <Grid item container xs={12} sx={{
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
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0
                                }}
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