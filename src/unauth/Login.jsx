import React, {useEffect, useState} from 'react';
import {Box, Checkbox, createTheme, FormControlLabel, Grid, TextField, ThemeProvider} from "@mui/material";
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
            if(role === 0){
                navigate("/main")
            }else if(role === 2){
                navigate("/guide/main/info")
            }
        }
    },[accessToken])

    useEffect(() => {
        // 이미 로그인 상태인 경우 메인 페이지로 이동
        if (accessToken) {
            if(role === 0){
                navigate("/main")
            }else if(role === 2){
                navigate("/guide/main/info")
            }
        }
    },[])


    // 로그인
    const handleSubmit = async () => {
        const req = {
            email : email,
            password : pw,
        };
        const response = await axios.post(
            `http://localhost:8099/unauth/member/signin`, req
        ).catch((err) => {
            console.log(req)
            console.log(err)
            alert("이메일 또는 비밀번호가 다릅니다.")
            window.location.replace("/login")
        }).then((res) => {
            console.log(res);
            // 쿠키에 저장(임시)
            Cookies.set('accessToken', res.data.token)
            Cookies.set('role', res.data.role)
            dispatch(setAccessToken(res.data.token))
            // role이 0인 경우 (일반 회원인 경우)
            if(res.data.role === 0){
                // 메인페이지로 이동
                dispatch(setRole(res.data.role))
                navigate("/main")
            }else if(res.data.role === 2){
                // 가이드 페이지로 이동
                dispatch(setRole(res.data.role))
                navigate("/guide/main/info")
            }
        })
    }


    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Grid container sx={{px:{xs:"3%", md:"20%", lg:"30%"}}}>
                <Grid item xs={12} sx={{pt:"4rem"}}>
                    <p className={styles.font_body_login}>로그인</p>
                </Grid>
                <Grid item xs={12} sx={{pt:"3rem"}}>
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

                    <Box display="flex"
                         justifyContent="center"
                         alignItems="center"
                         onClick={() => handleSubmit()}
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:0,
                             background: "#1B65FF"}}>
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
                         onClick={()=>navigate("/join")}
                         sx={{ borderRadius: '10vw',
                             width:"100%", height:"2.5vw",
                             m:0, p:1,
                             border:5,
                             borderColor: "#1B65FF"}}>
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