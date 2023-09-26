import React from 'react';
import {Box, Button, createTheme, Grid, ThemeProvider, Typography} from "@mui/material";
import TopBar from "../component/TopNav";
import styles from "../student/css/DashBoard.module.css";
import {useNavigate} from "react-router-dom";

// 회원가입 타입을 선택하는 페이지
function JoinSelect(props) {

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const navigate = useNavigate();// 페이지 이동

    return (
        <ThemeProvider theme={theme}>
            {/* NavBar **/}
            <TopBar/>

            <Grid container sx={{ mt: "60px", px:"100px" }} spacing={5}
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
            >
                <Grid item xs={4}>
                    <Box sx={{border: '1px solid #A2A2A2', borderRadius: '12px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Grid container sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Box sx={{ width: "60%", aspectRatio: "1/1", overflow: "hidden", my:"30pt", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img className="studentImg" alt="studentImg" src="img/join_select_student.svg" style={{ width: "100%",objectFit: "cover" }}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center", pt:"50px"}}>
                                <Button
                                    sx={{
                                        width: "92%", mb: "1rem", height: "4rem",
                                        background: '#1B65FF', borderRadius: '10px',
                                        '&:hover': {
                                            background: "skyblue",  // 호버시 버튼 배경색
                                        }
                                    }}
                                    onClick={()=>navigate("/join/student")}
                                >
                                    <Typography sx={{color:"#FFFFFF"}}>학생으로 가입하기</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ border: '1px solid #A2A2A2', borderRadius: '12px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Grid container sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Box sx={{ width: "60%", aspectRatio: "1/1", overflow: "hidden", my:"30pt", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img className="studentImg" alt="studentImg" src="img/join_select_parent.svg" style={{ width: "100%",objectFit: "cover" }}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center", pt:"50px"}}>
                                <Button
                                    sx={{
                                        width: "92%", mb: "1rem", height: "4rem",
                                        background: '#1B65FF', borderRadius: '10px',
                                        '&:hover': {
                                            background: "skyblue",  // 호버시 버튼 배경색
                                        }
                                    }}
                                    onClick={()=>navigate("/join/parent")}
                                >
                                    <Typography sx={{color:"#FFFFFF"}}>학부모로 가입하기</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ border: '1px solid #A2A2A2', borderRadius: '12px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Grid container sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Box sx={{ width: "60%", aspectRatio: "1/1", overflow: "hidden", my:"30pt", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img className="studentImg" alt="studentImg" src="img/join_select_teacher.svg" style={{ width: "100%",objectFit: "cover" }}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center", pt:"50px"}}>
                                <Button
                                    sx={{
                                        width: "92%", mb: "1rem", height: "4rem",
                                        background: '#1B65FF', borderRadius: '10px',
                                        '&:hover': {
                                            background: "skyblue",  // 호버시 버튼 배경색
                                        }
                                    }}
                                    onClick={()=>navigate("/join/teacher")}
                                >
                                    <Typography sx={{color:"#FFFFFF"}}>선생님으로 가입하기</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

        </ThemeProvider>
        );
}

export default JoinSelect;