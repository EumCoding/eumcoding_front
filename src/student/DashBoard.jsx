import React from 'react';
import {Box, Button, createTheme, Grid, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import styles from "./css/DashBoard.module.css";
import FaceIcon from "@mui/icons-material/Face6";

function DashBoard(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Box sx={{height: 80}}/>

            <Grid container justifyContent='center' sx={{px: "5rem"}} >
                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>



                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>



                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>




                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>





                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>





                <Grid item container xs={4} sx={{p:"1.5rem"}}>
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
                                    <b className={styles.font_name}>응애코딩1998</b>님<br></br>반가워요!
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_gray}>
                                    dlwl2023@kyungmin.ac.kr
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              xs={12} sx={{pt: "2rem"}}>
                                <span className={styles.font_black}>
                                    자기소개가 없습니다.
                                </span>
                        </Grid>
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              xs={12} sx={{pt: "1rem"}}>
                            <Button
                                sx={{
                                    width:"92%", mb:"1rem", height:"4rem",
                                    background: '#0B401D', borderRadius: '10px', position: 'absolute', bottom: 0}}
                            >
                                <span className={styles.font_btn}>프로필 수정하기</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </ThemeProvider>
    );
}

export default DashBoard;