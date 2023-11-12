import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, createTheme, Divider, Grid, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import Typography from "@mui/material/Typography";
import testImg from "../images/test.png";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Basket(props) {

    const accessToken = useSelector((state) => state.accessToken);

    const navigate = useNavigate();

    const [price, setPrice] = useState(0);

    const [result, setResult] = useState(null);

    // 장바구니 내용 가져오기
    const getBasket = async () => {
        const response = await axios.post(
            `http://localhost:8099/basket/list?page=1`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            console.log(res);
            if(res.data){
                setResult(res.data)
                let temp = 0;
                res.data.map((item) => temp += item.price)
                // 총액설정
                setPrice(temp);
            }
        })
    }

    // 장바구니에서 제거
    const delBasket = async (id) => {
        const response = await axios.post(
            `http://localhost:8099/basket/delete?basketId=${id}`,
            null,
            {
                headers: {Authorization: `${accessToken}`,}
            }
        )
        getBasket();
    }

    // 결제
    const pay = async () => {
        if(result && result.length > 0){
            const response = await axios.post(
                `http://localhost:8099/payment/ok?basketId=${result[0].basketId}`,
                null,
                {
                    headers: {Authorization: `${accessToken}`,}
                }
            ).then((res) => {
                alert("결제가 완료되었습니다.");
            })
        }else {
            alert("장바구니가 비어있습니다.");
        }
    }

    useEffect(() => {
        if(accessToken){
            getBasket()
        }
    },[,accessToken])

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
                        {result && result.map((item, idx) => {
                            return(
                                <Grid xs={12} container item display={"flex"} justifyContent={"flex-start"} alignItems={"stretch"}
                                      sx={{border:1, borderColor:"#A2A2A2", borderRadius:"1vw", p:"2rem", mt:"1rem"}}
                                >

                                    <Grid xs={1} item container display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        {/*<Checkbox sx={{
                                            '&.Mui-checked': {
                                                color: "#3767A6",
                                            },
                                        }}/>*/}
                                        <Button onClick={() => delBasket(item.basketId)}>
                                            X
                                        </Button>
                                    </Grid>
                                    <Grid xs={4} item display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        <Box sx={{width:"100%", aspectRatio:"16:9", overflow:"hidden", borderRadius:"1rem"}}
                                            onClick={() => navigate(`/lecture/${item.lectureId}`)}
                                        >
                                            <img src={`${item.thumb}`} style={{width:"100%", objectFit:"cover"}}/>
                                        </Box>
                                    </Grid>
                                    <Grid xs={7} item container display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{pl:"1rem"}}>
                                        <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                            <Typography sx={{fontWeight:"700", color:"#000000", fontSize:"1rem"}}>
                                                {item.lectureName}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                            <Typography sx={{fontWeight:"900", color:"#8D8D8D", fontSize:"1rem"}}>
                                                {item.teacherName}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12} item display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                            <Typography sx={{fontWeight:"900", color:"#000000", fontSize:"1rem"}}>
                                                {item.price}원
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })}

                    </Grid>
                </Grid>
                <Grid item container md={4} xs={12}>
                    <Grid item container xs={12} sx={{borderRadius:"1vw", border:1, borderColor:"#A2A2A2", p:"2rem", width:"100%"}}>
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
                                {price}원
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
                                {price}원
                            </Typography>
                        </Grid>
                        <Grid xs={12} item sx={{pt:"1rem", pb:"0.5rem"}}>
                            <Button sx={{backgroundColor:"#3767A6", height:"150%", borderRadius:"0.5vw", }} fullWidth
                                onClick={() => pay().then((res) => {
                                    // 다시 로드하기
                                    getBasket();
                                })}
                            >
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