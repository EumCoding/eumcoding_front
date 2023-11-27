import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme, Grid, ThemeProvider, Typography} from "@mui/material";
import TopBar from "../component/TopNav";
import styles from './css/Main.module.css';
import Slider from 'react-slick';
import banner1 from '../images/banner1.png'
import banner2 from '../images/banner2.png'
import banner3 from '../images/banner3.png'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import top5 from '../images/top5.svg';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import {useSelector} from "react-redux";
import testImg from "../images/test.png"
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {getHourNumbers} from "@mui/x-date-pickers/TimeClock/ClockNumbers";
import './css/SlickSlider.css'; // 임포트!



function Main(props) {

    const accessToken = useSelector((state) => state.accessToken)

    const navigate = useNavigate();

    const [popular, setPopular] = useState(null);

    const [newest, setNewest]  = useState(null);

    // image slider settings
    const settings = {
        infinite: false,
        dots: true,
        fade: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        adaptiveHeight: false,
        arrows: false,
    };

    const midSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        adaptiveHeight: false,
        arrows: true
    }

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
        palette: {
            primary: {
                main: '#FFFFFF',
            },
            secondary: {
                main: '#1E90FF',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                        @font-face {
    font-family: 'NanumSquareNeo';
    font-weight: 300;
    font-style: normal;
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-aLt.eot');
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-aLt.eot?#iefix') format('embedded-opentype'),
         url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-aLt.woff2') format('woff2'),
    font-display: swap;
} 
@font-face {
    font-family: 'NanumSquareNeo';
    font-weight: 400;
    font-style: normal;
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-bRg.eot');
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-bRg.eot?#iefix') format('embedded-opentype'),
         url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-bRg.woff2') format('woff2'),
    font-display: swap;
} 
@font-face {
    font-family: 'NanumSquareNeo';
    font-weight: 700;
    font-style: normal;
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-cBd.eot');
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-cBd.eot?#iefix') format('embedded-opentype'),
         url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-cBd.woff2') format('woff2'),
    font-display: swap;
} 
@font-face {
    font-family: 'NanumSquareNeo';
    font-weight: 800;
    font-style: normal;
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-dEb.eot');
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-dEb.eot?#iefix') format('embedded-opentype'),
         url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-dEb.woff2') format('woff2'),
    font-display: swap;
} 
@font-face {
    font-family: 'NanumSquareNeo';
    font-weight: 900;
    font-style: normal;
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-eHv.eot');
    src: url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-eHv.eot?#iefix') format('embedded-opentype'),
         url('https://webfontworld.github.io/NanumSquareNeo/NanumSquareNeo-eHv.woff2') format('woff2'),
    font-display: swap;
} 
                      `,
            },
        },
    });

    // 인기강의 연결
    const getPopular = async () => {
        const response = await axios.get(
            `http://localhost:8099/unauth/main/popular`,
        ).then((res) => {
            console.log(res);
            if(res.data){
                setPopular(res.data)
            }
        })
    }

    // 신규강의 연결
    const getNewest = async () => {
        const response = await axios.get(
            `http://localhost:8099/unauth/main/new`,
        ).then((res) => {
            console.log(res);
            if(res.data){
                setNewest(res.data)
            }
        })
    }

    useEffect(() => {
        getPopular();
        getNewest();
    },[])

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            {/* TopBar 띄우기 위한 Box*/}
            <Grid container sx={{width:"100%"}}>
                {/* Banner **/}
                <Grid item xs={12} sx={{px:{xs:"3%", md:"5%", lg:"20%"}, width:"100%", pb:"30px",}}>
                    <Slider {...settings}>
                        {popular && popular.map((item, idx) => {
                            return(
                                <div className={styles.image_banner}
                                    onClick={() => navigate(`/lecture/${item.lectureId}`)}
                                >
                                    <img
                                        src={item.lectureThumb}
                                        className={styles.image_thumbnail}
                                        alt={'banner1'}
                                    />
                                </div>
                            )
                        })}
                    </Slider>
                </Grid>
                {/* 인기강의 **/}
                <Grid container xs={12} sx={{ background: "#1B65FF", px:{xs:"3%", md:"5%", lg:"20%"}, width:"100%", py:"10px"}}>
                    <Grid container xs={12}>
                        {/* 인기강의 타이틀 **/}
                        <Grid item container xs={12} sx={{width:"100%", pt:"1rem", mt:"1rem",my:10,
                            backgroundColor:"#1B65FF",
                        }}>
                            <Grid item xs={5}
                                  sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center"
                                  }}
                            >
                                <Typography variant={'h1'} align={'right'}
                                            sx={{verticalAlign: "middle", color: "#FFE600"}}
                                >
                                    <b className={styles.font_bold}>인기</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}
                                  sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center"
                                  }}
                            >
                                <div className={styles.image_top5}>
                                    <img src={top5} className={styles.image_thumbnail}></img>
                                </div>
                            </Grid>
                            <Grid item xs={5}
                                  sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center"
                                  }}
                            >
                                <Typography variant={'h1'} align={'left'}
                                            sx={{verticalAlign: "middle", color: "#FFE600"}}>
                                    <b className={styles.font_bold}>강의</b>
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* 인기강의 slider **/}
                        <Grid item xs={12} sx={{mb:15}}>
                            <Slider {...midSettings}>
                                {popular && popular.map((item, idx) => {
                                    return(
                                        <Grid container sx={{width:"100%"}}>
                                            <Grid item xs={12}
                                                  display="flex"
                                                  justifyContent="center"
                                                  alignItems="center"
                                            >
                                                <Box sx={{width:"80%", aspectRatio:"16/9"}}
                                                     onClick={() => navigate(`/lecture/${item.lectureId}`)}
                                                >
                                                    <img
                                                        src={item.lectureThumb}
                                                        className={styles.image_thumbnail}
                                                        alt={'banner1'}
                                                    />
                                                    <Typography sx={{color:"#FFFFFF", fontWeight:"700", fontSize:"1rem"}}>{item.lectureName}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Slider>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 신규강의 **/}
                <Grid container xs={12} sx={{ background: "#FFFFFF", px:{xs:"3%", md:"5%", lg:"20%"}, width:"100%"}}>
                    <Grid container xs={12}>
                        {/* 신규강의 타이틀 **/}
                        <Grid item xs={12}
                              sx={{my:10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center"}}
                        >
                            <p className={styles.font_bold}>신규강의</p>
                            <p className={styles.font_small}>최신 트랜드 반영!! 따끈따끈한 신규 강좌를 만나보세요.</p>
                        </Grid>

                        {/* 신규강의 slider **/}
                        <Grid item xs={12} sx={{mb:15}}>
                            <Slider {...midSettings}>
                                {newest && newest.map((item, idx) => {
                                    return(
                                    <Grid container sx={{width:"100%"}}>
                                        <Grid item xs={12}
                                              display="flex"
                                              justifyContent="center"
                                              alignItems="center"
                                        >
                                            <Box sx={{width:"80%", aspectRatio:"16/9"}}
                                                 onClick={() => navigate(`/lecture/${item.lectureId}`)}
                                            >
                                                <img
                                                    src={item.lectureThumb}
                                                    className={styles.image_thumbnail}
                                                    alt={'banner1'}
                                                />
                                                <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}}>{item.lectureName}</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    )
                                })}
                            </Slider>
                        </Grid>
                    </Grid>
                </Grid>
                {/* 학년별 강의 **/}
                <Grid container xs={12} sx={{py:"1rem" , background: "#FFE600", px:{xs:"3%", md:"5%", lg:"20%"}, width:"100%"}}>
                    <Grid container xs={12}>
                        {/* 학년별 강의 타이틀 **/}
                        <Grid item xs={12}
                              sx={{my:10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center"}}
                        >
                            <p className={styles.font_bold}>학년별 강의</p>
                            <p className={styles.font_small}>지금 우리 아이에게 맞는 강의를 찾아보세요.</p>
                        </Grid>

                        {/* 학년별 강의 로그인 버튼 **/}
                        <Grid
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            item xs={12} sx={{mb:15}}>
                            <Button
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                position="relative" // 이 부분 추가
                                sx={{
                                    borderRadius: '10vw',
                                    width: "60%",
                                    py: "2rem",
                                    background: "#1B65FF",
                                    '&:hover': {
                                        backgroundColor: 'skyblue',
                                        transition: 'background-color 0.3s'
                                    }
                                }}
                                onClick={() => alert("준비중입니다.")}
                            >
                                <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        <Typography sx={{fontWeight:"900", fontSize:"2rem", color:"#FFFFFF"}}>
                                            확인하기
                                        </Typography>
                                    </Grid>
                                    {/* 아이콘 위치 변경 */}
                                    <ArrowCircleRightRoundedIcon
                                        sx={{
                                            fontSize:'4rem',
                                            color:"#FFFFFF",
                                            position: 'absolute',
                                            right: '8%',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                </Grid>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* footer **/}
                <Grid container xs={12} sx={{py:"10rem", px:{xs:"3%", md:"5%", lg:"20%"}}}>
                    <Grid container xs={12}>
                        <Grid item xs={3}  direction='row'  justifyContent='center'>
                            <p className={styles.font_footer_logo}>이음코딩</p>
                        </Grid>
                        <Grid container item xs={9}>
                            <Grid item xs={3}>
                                <p className={styles.font_footer_menu}>이음코딩 이용약관</p>
                            </Grid>
                            <Grid item xs={3}>
                                <p className={styles.font_footer_menu}>개인정보 처리방침</p>
                            </Grid>
                            <Grid item xs={3}>
                                <p className={styles.font_footer_menu}>책임의 한계와 법적 고지</p>
                            </Grid>
                            <Grid item xs={3}>
                                <p className={styles.font_footer_menu}>커뮤니티 가이드라인</p>
                            </Grid>

                            <Grid item xs={12}>
                                <p className={styles.font_footer_description}>
                                    이음코딩은 LatteIs에서 서비스하는 상업 교육 플랫폼입니다.
                                </p>
                            </Grid>
                            <Grid item xs={12}>
                                <p className={styles.font_footer_description}>
                                    (주)라떼는 | 대표자 : 이상훈 | 사업자번호 : 아직없음
                                </p>
                            </Grid>
                            <Grid item xs={12}>
                                <p className={styles.font_footer_description}>
                                    주소 : 경기 의정부시 가능동 562-6 경민대학교 효행관 404호 들어와서 왼쪽
                                </p>
                            </Grid>
                            <Grid item xs={12}>
                                <p className={styles.font_footer_description}>
                                    ©LATTEIS. ALL RIGHTS RESERVED.
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Main;