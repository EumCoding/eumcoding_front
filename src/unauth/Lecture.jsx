import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    createTheme,
    Divider,
    Grid,
    ThemeProvider
} from "@mui/material";
import TopBar from "../component/TopNav";
import banner from "../images/banner1.png";
import styles from "./css/Lecture.module.css";
import StarIcon from '@mui/icons-material/Star';
import desc from '../images/강의설명.jpg';
import Container from "@mui/material/Container";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaceIcon from '@mui/icons-material/Face6';
import {useParams} from "react-router-dom";
import axios from "axios";


function Lecture(props) {
    const params = useParams();

    const [result, setResult] = useState(null); // 1번 정보(첫번째 호출하는 api에서 주는 정보) 넣기

    const [teacher, setTeacher] = useState(null); // 강사 정보 넣을곳

    const [section, setSection] = useState(null);

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    // 강의 정보 가져오기 1
    const getLectureInfo = async (id) => { // id: 강의아이디
        const response = await axios.get(
            `http://localhost:8099/lecture/unauth/view?id=${id}`
        ).then((res) => {
            console.log(res)
            res.data && setResult(res.data);
        })
    }

    // 강사정보 가져오기
    const getTeacherInfo = async (id) => { // id: 강의아이디
        const response = await axios.get(
            `http://localhost:8099/unauth/profile/teacher/${id}`
        ).then((res) => {
            console.log(res)
            res.data && setTeacher(res.data);
        })
    }

    // 섹션 정보 가져오기
    const getSectionInfo = async (id) => { // id: 강의아이디
        const response = await axios.get(
            `http://localhost:8099/lecture/section/unauth/list?id=${id}`
        ).then((res) => {
            console.log(res)
            res.data && setSection(res.data);
        })
    }

    useEffect(() => {
        getLectureInfo(params.value) // 첫번째 정보 가져옴
    },[])

    useEffect(() => {
        result && getTeacherInfo(result.memberId);
        result && getSectionInfo(params.value);
    }, [result])

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            {/* TopBar 띄우기 위한 Box*/}
            <Box sx={{height: 64}}/>

            <Grid container>
                {/* 강의 이미지 **/}
                <Grid item xs={12}>
                    <div className={styles.image_banner}>
                        <img className={styles.image} src={banner} />
                    </div>
                </Grid>
                {/* 강의 요약 **/}
                <Grid container item xs={12} sx={{px:'20%', background:'#1B65FF', pt:'3rem'}}>
                    {/* 요약왼쪽 **/}
                    <Grid container item xs={6}>
                        {/* 강의 썸네일 **/}
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <div className={styles.image_thumb}>
                                <img className={styles.image} src={banner} />
                            </div>
                        </Grid>
                    </Grid>
                    {/* 요약 오른쪽 **/}
                    <Grid container item xs={6} sx={{pl:'3vw'}}>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <p className={styles.font_lecture_name}>{result && result.name}</p>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>
                            <span className={styles.font_review}>(5.0)</span>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <span className={styles.font_lecture_info_bold}>6개&nbsp;</span>
                            <span className={styles.font_lecture_info_normal}>의&nbsp;수강평&nbsp;|&nbsp;</span>
                            <span className={styles.font_lecture_info_bold}>1520명</span>
                            <span className={styles.font_lecture_info_normal}>&nbsp;의&nbsp;수강생</span>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <p className={styles.font_teacher_name}>강사 <u>{teacher && teacher.teacherName}</u></p>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <span className={styles.font_lecture_info_normal}>
                                난이도 : {result && result.grade} 학년
                            </span>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container item xs={12} sx={{px:'20%', background:'#1B65FF' ,pb:'3rem'}}>
                    {/* 수강신청하기 버튼 **/}
                    <Grid item
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{pt:5}}
                          xs={6}>
                        <Box display="flex"
                             justifyContent="center"
                             alignItems="center"
                             sx={{ borderRadius: '1vw',
                                 width:"50vw", height:"2.5vw",
                                 m:0, p:1,
                                 border:0,
                                 background: "#FFE600"}}>
                            <p className={styles.font_sugang}>
                                수강신청하기
                            </p>
                        </Box>
                    </Grid>
                    {/* 수강신청 버튼 옆 가격 **/}
                    <Grid item
                          container
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          xs={6}
                          sx={{pl:'3vw', pt:'1vw'}}
                    >
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="flex-end"
                        >
                            <span className={styles.font_price_small}>{result && result.price}</span>
                        </Grid>
                        <Grid item xs={12}>
                            <span className={styles.font_price_large}>{result && result.price / 5}</span>
                            <span className={styles.font_price_small}> 5개월 할부 시</span>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 강의소개 **/}
                <Grid container item xs={12} sx={{px:'20%', pt:0, mt:0}}>
                    {/* 이미지먼저 들어갑니다 **/}
                    <Grid
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        item xs={12}>
                        <div className={styles.image_description}>
                            <img className={styles.image} src={desc}/>
                        </div>
                    </Grid>
                    {/* 강의설명 텍스트 **/}
                    <Grid
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        item xs={12}
                        sx={{py:'7vw'}}
                    >
                        <span className={styles.font_description}>
                            {result && result.description}
                        </span>
                    </Grid>
                </Grid>

                {/* 커리큘럼 **/}
                <Grid container item xs={12} sx={{px:'20%', pt:0, mt:0, background:'#FFE600'}}>
                    <Grid item
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          xs={12}
                          sx={{pt:'7vw'}}
                    >
                        <span className={styles.font_curriculum_main}>커리큘럼</span>
                    </Grid>
                    <Grid item
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          xs={12}
                          sx={{py:'1.5vw'}}
                    >
                        <span className={styles.font_curriculum_sub}>커리큘럼은 1주 1섹션으로 제공됩니다.</span>
                    </Grid>
                    <Grid item
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          xs={12}
                          sx={{pb:'3vw'}}
                    >
                        <span className={styles.font_curriculum_sub}>
                            Section06 이후에 중간평가,
                            Section12 이후에 최종평가가 제공됩니다.
                        </span>
                    </Grid>
                    {/* 아코디언 **/}
                    <Grid item
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          xs={12}
                          sx={{pb:'7vw'}}
                    >
                        <Container>
                            {section && section.map((item, idx) => {
                                return(
                                    <Accordion >
                                        <AccordionSummary sx={{height:'3vw', backgroundColor:'#D9D9D9'}} expandIcon={<ExpandMoreIcon />}>
                                            <span className={styles.font_curriculum_title}>{item.name}</span>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <span className={styles.font_curriculum_content}>디테일</span>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })}
                        </Container>
                    </Grid>
                </Grid>
                {/* 수강평 **/}
                <Grid container item xs={12} sx={{px:'20%', pt:0, mt:0}}>
                    <Grid item xs={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="flex-end"
                          sx={{pt:'7vw'}}
                    >
                        <span className={styles.font_curriculum_main}>수강평&nbsp;</span>
                        <span className={styles.font_review_count}>총 207개</span>
                    </Grid>
                    <Grid item xs={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                          sx={{pb:'7vw', mt:'1rem'}}
                    >
                        <StarIcon sx={{ color: '#F2D857', fontSize: '3rem' }}/>
                        <StarIcon sx={{ color: '#F2D857', fontSize: '3rem' }}/>
                        <StarIcon sx={{ color: '#F2D857', fontSize: '3rem' }}/>
                        <StarIcon sx={{ color: '#F2D857', fontSize: '3rem' }}/>
                        <StarIcon sx={{ color: '#F2D857', fontSize: '3rem' }}/>
                        <span className={styles.font_review_score}>(5.0)</span>
                    </Grid>
                    {/* 리뷰 정렬 옵션 **/}
                    <Grid container item xs={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                          sx={{mb:'0.5vw'}}
                        >
                            <span className={styles.font_review_sort_selected}>최신 순</span>
                            <span className={styles.font_review_sort}>좋아요 순</span>
                            <span className={styles.font_review_sort}>높은 평점 순</span>
                            <span className={styles.font_review_sort}>낮은 평점 순</span>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{borderWidth:'0.1rem', borderColor:'#000000'}}/>
                    </Grid>
                    {/* 리뷰목록 **/}
                    <Grid
                        container
                        item xs={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{mt:'1rem'}}
                    >
                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={1} sx={{pr:'1vw'}}>
                                <FaceIcon sx={{fontSize:'4rem'}}/>
                            </Grid>
                            <Grid
                                item
                                container
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                xs={1}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="flex-end"
                                    >
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:0}}
                                >
                                    <span className={styles.font_review_nickname}>닉네임</span>
                                </Grid>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18 ♥2
                                </span>
                                <br/>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={1} sx={{pr:'1vw'}}>
                                <FaceIcon sx={{fontSize:'4rem'}}/>
                            </Grid>
                            <Grid
                                item
                                container
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                xs={1}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="flex-end"
                                >
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    sx={{pl:0}}
                                >
                                    <span className={styles.font_review_nickname}>닉네임</span>
                                </Grid>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_content}>
                                    내용내용내용내용내용내용내용
                                </span>
                            </Grid>
                            <Grid item
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  xs={12} sx={{mt:'1vw'}}>
                                <span className={styles.font_review_date}>
                                    2022-03-18 ♥2
                                </span>
                                <br/>
                            </Grid>
                            <Grid item
                                  xs={12} sx={{mt:'2vw', mb:'1vw'}}>
                                <Divider fullWidth/>
                                <br/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={12} item sx={{mt:'1vw', mb:'7vw'}}>
                        <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}>
                            <span className={styles.font_review_more}>수강평 더보기</span>
                        </Button>
                    </Grid>
                </Grid>
                {/* footer **/}
                <Grid container xs={12} sx={{mt: 10 , mb:20, background: "#FFFFFF"}}>
                    <Grid container xs={12} sx={{px: "20%"}}>
                        <Grid item xs={3}  direction='row'  justifyContent='left'>
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

export default Lecture;