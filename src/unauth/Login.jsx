import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, createTheme, FormControlLabel, Grid, TextField, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import styles from "./css/Login.module.css"
import kakao from "../images/kakao.svg"
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {setAccessToken, setRole} from "../redux/actions";
import Cookies from "js-cookie"


// 로그인 페이지
function Login(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_API_URL}/oauth/callback/kakao&response_type=code`

    const navigate = useNavigate();// 페이지 이동

    const dispatch = useDispatch();// redux dispatch
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰
    const role = useSelector((state) => state.role); // role

    const [email, setEmail] = useState(""); // 이메일
    const [pw, setPw] = useState(""); // 비밀번호


    // function


    useEffect(() => {
        // 이미 로그인 상태인 경우 메인 페이지로 이동
        if (accessToken) {
            navigate("/main")
        }
    },[accessToken])

    useEffect(() => {
        // 이미 로그인 상태인 경우 메인 페이지로 이동
        if (accessToken) {
            navigate("/main")
        }
    },[])


    // 로그인
    const handleSubmit = async () => {
        const req = {
            email : email,
            password : pw,
        };
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/unauth/member/signin`, req
        ).catch((err) => {
            console.log(req)
            console.log(err)
            alert("이메일 또는 비밀번호가 다릅니다.")
            window.location.replace("/login")
        }).then((res) => {
            // 쿠키에 저장(임시)
            Cookies.set('accessToken', res.data.token, { sameSite: 'lax' })
            Cookies.set('role', res.data.role, { sameSite: 'lax' })
            Cookies.set('memberId', res.data.id, { sameSite: 'lax' });
            dispatch(setAccessToken(res.data.token))
            // role이 0인 경우 (일반 회원인 경우)
            if(res.data.role === 0){
                // 메인페이지로 이동
                dispatch(setRole(res.data.role))
                navigate("/main")
            }else if(res.data.role === 1){
                // 강사 대시보드로 이동
                dispatch(setRole(res.data.role))
                navigate("/guide/main/info")
            }else if(res.data.role === 3){
                // 부모 대시보드로 이동
                dispatch(setRole(res.data.role))
                navigate("/parent/dashboard");
            }
        })
    }

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: `${process.env.REACT_APP_MY_URL}/oauth/login/kakao`
        });
    };


    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Grid container sx={{px:{xs:"3%", md:"20%", lg:"30%"}}}>
                <Grid item xs={12} sx={{pt:"3rem"}}>
                    <p className={styles.font_body_login}>로그인</p>
                </Grid>
                <Grid item xs={12} sx={{pt:"1rem"}}>
                    <p className={styles.font_body_menu}>이메일</p>
                    <TextField
                        required
                        id="email"
                        label="이메일"
                        name="email"
                        variant="outlined"
                        fullWidth
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
                        onChange={(e) => setPw(e.target.value)}
                    >
                    </TextField>
                </Grid>

                <Grid item xs={12} sx={{pt:2, mb:5}}>
                    <FormControlLabel control={<Checkbox id="saveId" />} label={"아이디 저장"} />
                    <FormControlLabel control={<Checkbox id="autoLogin"/>} label={"자동 로그인"} />
                </Grid>


                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>

                    <Button
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => handleSubmit()}
                        sx={{
                            borderRadius: '10vw',
                            width: "100%",
                            height: "2.5vw",
                            m: 0,
                            p: 1,
                            border: 0,
                            background: "#1B65FF",
                            '& p': {
                                color: 'white',  // 기본 글자색
                            },
                            '&:hover': {
                                background: "skyblue",  // 호버시 버튼 배경색
                            }
                        }}
                    >
                        <p className={styles.font_body_btn}>
                            <div>아이디로 로그인</div>
                        </p>
                    </Button>
                </Grid>
                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>

                    <Button display="flex"
                            onClick={() => {
                                handleKakaoLogin()
                            }}
                         justifyContent="center"
                         alignItems="center"
                            sx={{
                                borderRadius: '10vw',
                                width: "100%",
                                height: "2.5vw",
                                m: 0,
                                p: 1,
                                border: 0,
                                background: "#FFE812",
                                '& p': {
                                    color: '#000000',  // 기본 글자색
                                },
                                '&:hover': {
                                    background: "skyblue",  // 호버시 버튼 배경색
                                }
                            }}>
                        <p className={styles.font_body_kakao}>
                            <img className={styles.svg_icon_kakao} src={kakao}/>
                            <div>카카오로 로그인</div>
                        </p>
                    </Button>
                </Grid>
                <Grid item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      xs={12} sx={{pt:2}}>
                    <Button display="flex"
                         justifyContent="center"
                         alignItems="center"
                         onClick={()=>navigate("/joinSelect")}
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:5,
                             borderColor: "#1B65FF",
                             '& p': {
                                 color: '#000000',  // 기본 글자색
                             },
                             '&:hover': {
                                 background: "skyblue",  // 호버시 버튼 배경색
                             }}}>
                        <p className={styles.font_body_join}>
                            회원가입
                        </p>
                    </Button>
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