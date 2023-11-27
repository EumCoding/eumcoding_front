import React, {useEffect} from 'react';
import {Button, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Typography from "@mui/material/Typography";
import TopBar from "../component/TopNav";
import Container from "@mui/material/Container";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function EmailConfirm(props) {

    //theme
    const theme = createTheme({
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const params = useParams();

    // value 값 가져오기
    const code  = params.value;

    // confirm api
    const confirm = async () => {
        const encodedCode = encodeURIComponent(code);
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/unauth/member/confirm-email?token=${encodedCode}`
        ).catch((err) => {
            alert("잘못된 접근입니다.")
        })
    }

    useEffect(() => {
        confirm();
    }, [])


    const navigate = useNavigate();// 페이지 이동

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBar />
            <Container component="main" maxWidth="sm" sx={{ mt: 15 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    이메일 인증
                </Typography>
                <Typography variant="h6">
                    이메일 주소가 성공적으로 인증되었습니다. 이제 모든 서비스를 이용하실 수 있습니다.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                        navigate("/login");
                    }}
                    sx={{ mt: 3, mb: 2 }}
                    // 로그인 페이지나 메인 페이지로 이동하는 로직 추가
                >
                    로그인하러 가기
                </Button>
            </Container>
        </ThemeProvider>
    );
}

export default EmailConfirm;