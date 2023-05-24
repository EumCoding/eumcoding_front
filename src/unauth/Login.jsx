import React, {useEffect, useState} from 'react';
import {Box, Checkbox, createTheme, FormControlLabel, Grid, TextField, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import styles from "./css/Login.module.css"
import kakao from "../images/kakao.svg"
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {setAccessToken, setLoggedIn} from "../redux/actions";

// 로그인 페이지
function Login(props) {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.accessToken);

    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    useEffect(() => {
        // 이미 로그인 상태인 경우 메인 페이지로 이동
        if (accessToken) {
            navigate("/main")
            return null;
        }
    },[accessToken])

    useEffect(() => {
        // 이미 로그인 상태인 경우 메인 페이지로 이동
        if (accessToken) {
            navigate("/main")
            return null;
        }
    },[])

    // 폼 제출 시의 이벤트 함수
    const handleSubmit = async () => {
        const req = {
            email: email,
            password: pw,
        };
        try {
            const response = await axios
                .post(`http://localhost:8089/unauth/member/signin`, req)
                .catch((error) => {
                    // 새로고침
                    navigate("/login", {
                        replace: true,
                        state:{fail:true}
                    })
                });
            // token 출력
            console.log(response.data.token + " 로그인 성공입니다.");
            console.log("리덕스에들어있던 토큰 " + accessToken);
            // 로그인 성공 액션 디스패치
            dispatch(setLoggedIn(true));
            dispatch(setAccessToken(response.data.token));
            navigate("/main");

        } catch (e) {
            console.log("로그인 실패")
        }
    };




    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });



    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            {/* TopBar 띄우기 위한 Box*/}
            <Grid container sx={{px:{xs:"3%", md:"10%", lg:"20%"}, py:"5rem"}}>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_login} onClick={() => {console.log(accessToken)}} >로그인</p>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>이메일</p>
                    <TextField
                        required
                        id="email"
                        label="이메일"
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>비밀번호</p>
                    <TextField
                        required
                        id="password"
                        label="비밀번호"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                    >
                    </TextField>
                </Grid>
                {props.fail === true && (
                    <Grid xs={12} item sx={{my:"0.5rem"}}>
                        <Typography>아이디나 비밀번호가 틀렸습니다.</Typography>
                    </Grid>
                )}


                <Grid item xs={12} sx={{pt:2, mb:5}}>
                    <FormControlLabel control={<Checkbox id="saveId" />} label={"아이디 저장"} />
                    <FormControlLabel control={<Checkbox id="autoLogin"/>} label={"자동 로그인"} />
                </Grid>


                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>

                    <Box display="flex"
                         justifyContent="center"
                         alignItems="center"
                         onClick={() => handleSubmit()}
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:0,
                             background: "#3767A6"}}>
                        <p className={styles.font_body_btn}>
                            <div>아이디로 로그인</div>
                        </p>
                    </Box>
                </Grid>
                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>

                    <Box display="flex"
                         justifyContent="center"
                         alignItems="center"
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:0,
                             background: "#FFE812"}}>
                        <p className={styles.font_body_kakao}>
                            <img className={styles.svg_icon_kakao} src={kakao}/>
                            <div>카카오로 로그인</div>
                        </p>
                    </Box>
                </Grid>
                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>
                    <Box display="flex"
                         justifyContent="center"
                         alignItems="center"
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:5,
                             borderColor: "#3767A6"}}>
                        <p className={styles.font_body_join}>
                                회원가입
                        </p>
                    </Box>
                </Grid>

                <Grid container
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:5}}>
                    <Grid item xs={6}>
                        <a className={styles.font_body_find}>아이디 찾기</a>
                    </Grid>
                    <Grid item xs={6}>
                        <a className={styles.font_body_find}>비밀번호 찾기</a>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Login;