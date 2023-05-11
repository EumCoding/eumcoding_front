import React from 'react';
import {Box, Button, Checkbox, createTheme, Divider, Grid, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import Typography from "@mui/material/Typography";
import testImg from "../images/test.png";

function Basket(props) {
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
            <TopBar/>
            <Box sx={{height: 80}}/>
            <Grid container sx={{px:{xs:"5%", sm:"10%", md:"10%", lg:"20%", width:"100%"}}} spacing={3} display={"flex"} justifyContent={"center"} alignItems={"flex-start"}>
                <Grid item container md={8}>
                    <Grid container item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"} sx={{py:"2rem"}}>
                            <Typography sx={{color:"#000000", fontWeight:"900", fontSize:"2rem"}}>
                                장바구니
                            </Typography>
                        </Grid>

                        <Grid xs={12} container item display={"flex"} justifyContent={"flex-start"} alignItems={"stretch"}
                            sx={{border:1, borderColor:"#000000", borderRadius:"1vw", p:"2rem",}}
                        >
                            <Grid xs={1} item container display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Checkbox sx={{
                                    '&.Mui-checked': {
                                        color: "#3767A6",
                                    },
                                }}/>
                            </Grid>
                            <Grid xs={4} item display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Box sx={{width:"100%", aspectRatio:"16:9", overflow:"hidden", borderRadius:"1rem"}}>
                                    <img src={testImg} style={{width:"100%", objectFit:"cover"}}/>
                                </Box>
                            </Grid>
                            <Grid xs={7} item container display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{pl:"1rem"}}>
                                <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                    <Typography sx={{fontWeight:"700", color:"#000000", fontSize:"1rem"}}>
                                        무작정 따라하는 우리아이 첫 코딩교육
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                    <Typography sx={{fontWeight:"900", color:"#8D8D8D", fontSize:"1rem"}}>
                                        이지훈
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                    <Typography sx={{fontWeight:"900", color:"#000000", fontSize:"1rem"}}>
                                        6000원
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container md={4} xs={12}>
                    <Grid item container xs={12} sx={{borderRadius:"1vw", border:1, borderColor:"#000000", p:"2rem", width:"100%"}}>
                        <Grid item xs={12}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"1.3rem", color:"#000000"}}>
                                구매자 정보
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{pb:"0.5rem"}}
                        >
                            <Divider/>
                        </Grid>
                        <Grid item xs={3}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                이름
                            </Typography>
                        </Grid>
                        <Grid item xs={9}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"900", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                이지훈
                            </Typography>
                        </Grid>

                        <Grid item xs={3}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                이메일
                            </Typography>
                        </Grid>
                        <Grid item xs={9}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"900", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                dlwl2023@kyungmin.ac.kr
                            </Typography>
                        </Grid>

                        <Grid item xs={3}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                전화번호
                            </Typography>
                        </Grid>
                        <Grid item xs={9}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"900", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                01012341234
                            </Typography>
                        </Grid>

                        <Grid item xs={12}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"1.3rem", color:"#000000"}}>
                                결제 정보
                            </Typography>
                        </Grid>
                        <Grid item xs={12}
                              sx={{pb:"0.5rem"}}
                        >
                            <Divider fullWidth/>
                        </Grid>

                        <Grid item xs={6}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                선택상품금액
                            </Typography>
                        </Grid>
                        <Grid item xs={6}
                              display={"flex"} justifyContent={"flex-end"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"900", fontSize:"0.7rem", color:"#8D8D8D"}}>
                                12000원
                            </Typography>
                        </Grid>

                        <Grid item xs={6}
                              display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                                총 결제금액
                            </Typography>
                        </Grid>
                        <Grid item xs={6}
                              display={"flex"} justifyContent={"flex-end"} alignItems={"center"}
                              sx={{pb:"0.5rem"}}
                        >
                            <Typography sx={{fontWeight:"900", fontSize:"1em", color:"#000000"}}>
                                12000원
                            </Typography>
                        </Grid>
                        <Grid xs={12} item sx={{pt:"1rem", pb:"0.5rem"}}>
                            <Button sx={{backgroundColor:"#3767A6", height:"150%", borderRadius:"0.5vw", }} fullWidth>
                                <Typography sx={{fontWeight:"900", fontSize:"1em", color:"#FFFFFF"}}>
                                    결제하기
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Basket;