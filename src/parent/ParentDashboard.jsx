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
import Typography from "@mui/material/Typography";


function DashBoard(props) {
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const role = useSelector((state) => state.role); // 역할

    const [profile, setProfile] = useState(null); // 프로필 저장될 부분

    const [childList, setChildList] = useState(null); // 자녀 목록 저장될 부분

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

    // 자녀 리스트 가져오기
    const getChildList = async () => {
        console.log("자녀 리스트 가져오기...");
        const response = await axios.get(
            `http://localhost:8099/parent/children/list`,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            console.log(res)
            setChildList(res.data);
        }).catch((err) => {
                // 자녀가 등록되어 있지 않다는 alert 띄우고 확인 누르면 이동
            if (window.confirm("자녀가 등록되어 있지 않습니다. 자녀를 등록하시겠습니까?")) {
                navigate("/my/profile");
            }
            })
    }

    useEffect(() => {
        if(accessToken){
            getProfile();
            getChildList();
        }

    },[,accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>

            <Grid container sx={{px: { xs: "5%", sm: "10%", md: "10%" }, mt:"30px"}}>
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

                {/* 자녀 커리큘럼 관리 **/}
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
                            <span className={styles.font_main}>자녀 커리큘럼 관리</span>
                        </Grid>
                        {/*자녀 목록 출력하기**/}
                        {childList && (
                            <Grid item
                                  container
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{pt: "1rem", display:"flex", alignItems:"center"}}>
                                <Grid xs={12} item>
                                    <Typography sx={{fontWeight:"800", fontSize:"1.5rem", display:"flex"}}>
                                        자녀목록
                                    </Typography>
                                </Grid>
                                {childList && childList.rci.map((child) => (
                                    <Grid item xs={12}>
                                        <Typography
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            sx={{fontWeight:'700', fontSize:'1rem', color:'#000000'}}>
                                            {child.name}({child.email})
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {
                            !childList && (
                                <Grid item
                                      display="flex"
                                      justifyContent="flex-start"
                                      alignItems="center"
                                      xs={12} sx={{pt: "1rem"}}>
                                        <Typography
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            sx={{fontWeight:'700', fontSize:'1rem', color:'#000000'}}>
                                            자녀가 등록되어 있지 않습니다.
                                        </Typography>
                                </Grid>
                            )
                        }
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                onClick={() => navigate("/parent/curriculum")}
                                sx={{
                                    width: "92%", mb: "1rem", height: "4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0,
                                    '&:hover': {
                                        background: "green",  // 호버시 버튼 배경색
                                    }
                                }}
                            >
                                <span className={styles.font_btn} >진행률 보기</span>
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
                            <span className={styles.font_main}>자녀 학습통계</span>
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
                                  xs={12}
                                  sx={{mt:'1rem'}}
                            >
                                <span className={styles.font_normal}>
                                    자녀학습통계...
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
                            >
                                <span className={styles.font_btn}>자세히보기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default DashBoard;