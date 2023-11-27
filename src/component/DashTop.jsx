import React, {useEffect} from 'react';
import {Button, createTheme, Grid, ThemeProvider} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import styles from "./css/DashTop.module.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearAccessToken} from "../redux/actions";
import Cookies from "js-cookie"


function DashTop(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.accessToken); // redux access token
    const navigate = useNavigate();

    // 로그아웃
    const logout = () => {
        dispatch(clearAccessToken()); // 리덕스에서 토큰 제거
        Cookies.remove('accessToken'); // 쿠키에 들어있던 accessToken 제거
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="sticky" sx={{background:"#0B401D", px: { xs: "5%", sm: "10%", md: "10%" }}}>
                <Toolbar sx={{height:"5rem", cursor: 'default'}}>
                    <Box flexGrow={1}>
                        <div className={styles.font_logo}>
                            <span onClick={() => navigate("/main")}>이음코딩</span> <span onClick={() => navigate("/dashboard")}>대시보드</span>
                        </div>
                    </Box>
                    <Button color="inherit"
                            sx={{
                                borderRadius:"20px", border:"2px", background:"#FFFFFF",
                                width:"8rem"
                                }}
                            onClick={() => accessToken ? logout() : navigate("/login")}
                    >
                        <div className={styles.font_menu}>
                            <Typography sx={{whiteSpace:"nowrap", color:"#000000", cursor: 'default'}}>{accessToken?"로그아웃":"로그인"}</Typography>
                        </div>
                    </Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>

        );
}

export default DashTop;