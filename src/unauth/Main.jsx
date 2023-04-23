import React from 'react';
import {Box, createTheme, Grid, ThemeProvider, Typography} from "@mui/material";
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


function Main(props) {
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

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            {/* TopBar 띄우기 위한 Box*/}
            <Box sx={{height: 64}}/>
            <Grid container>
                {/* Banner **/}
                <Grid item xs={12} sx={{px: 27}}>
                    <Slider {...settings}>
                        <div className={styles.image_banner}>
                            <img
                                src={banner1}
                                className={styles.image_thumbnail}
                                alt={'banner1'}
                            />
                        </div>
                        <div className={styles.image_banner}>
                            <img
                                src={banner1}
                                className={styles.image_thumbnail}
                                alt={'banner2'}
                            />
                        </div>
                        <div className={styles.image_banner}>
                            <img
                                src={banner1}
                                className={styles.image_thumbnail}
                                alt={'banner3'}
                            />
                        </div>
                    </Slider>
                </Grid>
                {/* 인기강의 **/}
                <Grid container xs={12} sx={{mt: 10, pt:20 , background: "#3767A6"}}>
                    <Grid container xs={12} sx={{px: 27}}>
                        {/* 인기강의 타이틀 **/}
                        <Grid container item xs={12} sx={{mb:20}}>
                            <Grid item xs={5}
                                  sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center"
                                  }}
                            >
                                <Typography variant={'h1'} align={'right'}
                                            sx={{verticalAlign: "middle", color: "#F2D857"}}
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
                                            sx={{verticalAlign: "middle", color: "#F2D857"}}>
                                    <b className={styles.font_bold}>강의</b>
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* 인기강의 slider **/}
                        <Grid item xs={12} sx={{mb:30}}>
                            <Slider {...midSettings}>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                            </Slider>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 신규강의 **/}
                <Grid container xs={12} sx={{mt: 10, pt:5 , background: "#FFFFFF"}}>
                    <Grid container xs={12} sx={{px: 27}}>
                        {/* 신규강의 타이틀 **/}
                        <Grid item xs={12}
                              sx={{mb:20,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center"}}
                        >
                            <p className={styles.font_bold}>신규강의</p>
                            <p className={styles.font_small}>최신 트랜드 반영!! 따끈따끈한 신규 강좌를 만나보세요.</p>
                        </Grid>

                        {/* 인기강의 slider **/}
                        <Grid item xs={12} sx={{mb:20}}>
                            <Slider {...midSettings}>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.image_mid_outer}>
                                    <div className={styles.image_mid}>
                                        <img
                                            src={banner1}
                                            className={styles.image_thumbnail}
                                            alt={'banner1'}
                                        />
                                    </div>
                                </div>
                            </Slider>
                        </Grid>
                    </Grid>
                </Grid>
                {/* 학년별 강의 **/}
                <Grid container xs={12} sx={{mt: 10, pt:20 , background: "#F2D857"}}>
                    <Grid container xs={12} sx={{px: 27}}>
                        {/* 학년별 강의 타이틀 **/}
                        <Grid item xs={12}
                              sx={{mb:20,
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
                            item xs={12} sx={{mb:20}}>
                            <Box display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{ borderRadius: '10vw',
                                     width:"50%", height:"10vw",
                                     m:0, p:1,
                                     background: "#3767A6"}}>
                                <Grid container className={styles.font_login}>
                                    <Grid item xs={10}>
                                        로그인하고 확인하기
                                    </Grid>
                                    <Grid item xs={2} direction='row' justifyContent='center'
                                    sx={{display: 'flex', alignItems: 'center'}}
                                    >
                                        <ArrowCircleRightRoundedIcon sx={{fontSize:'6rem'}}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* footer **/}
                <Grid container xs={12} sx={{mt: 10 , mb:20, background: "#FFFFFF"}}>
                    <Grid container xs={12} sx={{px: 27}}>
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