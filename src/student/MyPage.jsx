import React from 'react';
import {Box, Button, createTheme, Divider, Grid, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';

function MyPage(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: '#C3D9C9', // 버튼 클릭 시 효과 색상
                            // 클릭 효과 변경
                            '@media (hover: none)': {
                                backgroundColor: 'transparent',
                            },
                            '& .MuiTouchRipple-root': {
                                color: '#C3D9C9', // 터치 효과 색상
                            },
                        },
                        '&:hover, &:focus': {
                            borderColor: 'black',
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Box sx={{height: 80}}/>
            <Grid justifyContent='center' container sx={{px:'20%'}}>
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      >
                    <FaceIcon sx={{fontSize: '10rem'}}/>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'3rem'}}>
                        응애코딩 1998
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'3rem'}}><Divider/></Grid>
                {/* 이메일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>이메일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        dlwl2023@kyungmin.ac.kr
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>
                {/* 이름 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>이름</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        이지*
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>
                {/* 가입일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>이메일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        2023-03-01
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>
                {/* 생일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>생일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        1998-02-14
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>
                {/* 주소 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>주소</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}>
                        경민대학교<EditIcon />
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>

                {/* 전화번호 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>전화번호</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}>
                        01000000000<EditIcon />
                    </Typography>
                </Grid>

                {/* 비밀번호 변경 **/}
                <Grid item xs={12} display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{mt:"2rem"}}
                >
                    <Button fullWidth variant="outlined" sx={{borderRadius:"0.5vw", backgroundColor:"#FFFFFF", borderColor:"#000000", py:"1rem",}}>
                        <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                            비밀번호 변경
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyPage;