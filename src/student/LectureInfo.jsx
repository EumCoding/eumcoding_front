import React from 'react';
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
import DashTop from "../component/DashTop";
import styles from "../unauth/css/Lecture.module.css";
import testImg from "../images/test.png"
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Container from "@mui/material/Container";
import EditIcon from "@mui/icons-material/Edit";


function LectureInfo(props) {

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* TopBar 띄우기 위한 Box*/}
            <Grid container sx={{width:"100%", mb:"10rem"}}>
                <Grid xs={12} item container display={"flex"} justtifyContent={"center"} alignItems={"stretch"}
                    sx={{backgroundColor:"#3767A6", px:{xs:"3vw", md:"10vw", lg:"20vw"},  py:"3rem", m:0}}
                      spacing={5}
                >
                    {/* 요약왼쪽 **/}
                    <Grid container item xs={6}>
                        {/* 강의 썸네일 **/}
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <div className={styles.image_thumb}>
                                <img className={styles.image} src={testImg} />
                            </div>
                        </Grid>
                    </Grid>
                    {/* 요약 오른쪽 **/}
                    <Grid container item xs={6}>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <p className={styles.font_lecture_name}>무작정 따라하는 우리아이 첫 코딩교육</p>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2.5rem' }}/>
                            <StarIcon sx={{ color: '#F2D857', fontSize: '2.5rem' }}/>
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
                            <p className={styles.font_teacher_name}>강사 <u>이지훈</u></p>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <span className={styles.font_lecture_info_normal}>
                                난이도 : 초등 1학년 ~ 3학년
                            </span>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={5}>
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
                                     background: "#FFE812"}}>
                                <p className={styles.font_sugang}>
                                    이어서 수강하기
                                </p>
                            </Box>
                        </Grid>
                        {/* 질문하기 버튼 **/}
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
                                     background: "#FFE812"}}>
                                <p className={styles.font_sugang}>
                                    질문하기
                                </p>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{py:"5rem"}}
                >
                    <Typography sx={{fontWeight:"900", fontSize:"3rem", color:"#000000"}}>
                        내 커리큘럼
                    </Typography>
                </Grid>
                <Grid item xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}}}
                >
                    <Container>
                        <Accordion>
                            <AccordionSummary sx={{height:'3vw', backgroundColor:'#D9D9D9'}} expandIcon={<ExpandMoreIcon />}>
                                <span className={styles.font_curriculum_title}>Section 01. 시작하기</span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container sx={{width:"100%", pt:"0.5rem"}}>
                                    <Grid item xs={9}>
                                        <Typography sx={{fontWeight:"700", fontSize:"1.5rem"}}>
                                            소요시간 설정
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                                        <Typography sx={{fontWeight:"700", fontSize:"1.3rem", textDecoration:"underline"}}>
                                            3일
                                        </Typography>
                                        <EditIcon />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                            <Divider fullWidth />
                            <AccordionDetails>
                                <Grid container sx={{width:"100%", pl:"3rem", pt:"0.5rem"}}>
                                    <Grid item xs={2}>
                                        <Box sx={{width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:"1vw"}}>
                                            <img src={testImg} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={7} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                                        sx={{pl:"1rem"}}
                                    >
                                        <Typography sx={{fontWeight:"700", fontSize:"1.5rem"}}>
                                            시작하기
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                                        <Typography sx={{fontWeight:"700", color:"#8D8D8D",fontSize:"1.5rem"}}>
                                            05:03/03:50
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>

                            <Divider fullWidth />
                            <AccordionDetails>
                                <Grid container sx={{width:"100%", pl:"3rem", pt:"0.5rem"}}>
                                    <Grid item xs={2}>
                                        <Box sx={{width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:"1vw"}}>
                                            <img src={testImg} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={7} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}
                                          sx={{pl:"1rem"}}
                                    >
                                        <Typography sx={{fontWeight:"700", fontSize:"1.5rem"}}>
                                            시작하기2
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                                        <Typography sx={{fontWeight:"700", color:"#8D8D8D",fontSize:"1.5rem"}}>
                                            03:50
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary sx={{height:'3vw', backgroundColor:'#D9D9D9'}} expandIcon={<ExpandMoreIcon />}>
                                <span className={styles.font_curriculum_title}>Section 02. 끝내기</span>
                            </AccordionSummary>
                            <AccordionDetails >
                                <span className={styles.font_curriculum_content}>디테일</span>
                            </AccordionDetails>
                        </Accordion>
                    </Container>
                </Grid>

                <Grid item xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{py:"5rem"}}
                >
                    <Typography sx={{fontWeight:"900", fontSize:"3rem", color:"#000000"}}>
                        최근 질문
                    </Typography>
                </Grid>
                <Grid xs={12} item
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}}}
                >
                    <Divider fullWidth sx={{border:2, borderColor:"#000000"}}/>
                </Grid>

                <Grid xs={12} item container
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem",}}
                >
                    <Grid item xs={9} sx={{pl:"2rem"}}
                        display={"flex"} justtifyContent={"flex-start"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"700", fontSize:"1.3rem"}}>
                            어제 저녁 뭐 드셨어요?
                        </Typography>
                    </Grid>
                    <Grid item xs={3}
                          sx={{pr:"2rem", }}
                          display={"flex"} justifyContent={"flex-end"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                            2022-03-18
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{pt:"2rem"}}>
                        <Divider/>
                    </Grid>
                </Grid>

                <Grid xs={12} item container
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem",}}
                >
                    <Grid item xs={9} sx={{pl:"2rem"}}
                          display={"flex"} justtifyContent={"flex-start"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"700", fontSize:"1.3rem"}}>
                            어제 저녁 뭐 드셨어요?
                        </Typography>
                    </Grid>
                    <Grid item xs={3}
                          sx={{pr:"2rem", }}
                          display={"flex"} justifyContent={"flex-end"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                            2022-03-18
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{pt:"2rem"}}>
                        <Divider/>
                    </Grid>
                </Grid>

                <Grid xs={12} item container
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem",}}
                >
                    <Grid item xs={9} sx={{pl:"2rem"}}
                          display={"flex"} justtifyContent={"flex-start"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"700", fontSize:"1.3rem"}}>
                            어제 저녁 뭐 드셨어요?
                        </Typography>
                    </Grid>
                    <Grid item xs={3}
                          sx={{pr:"2rem", }}
                          display={"flex"} justifyContent={"flex-end"} alignItems={"center"}
                    >
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D"}}>
                            2022-03-18
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{pt:"2rem"}}>
                        <Divider/>
                    </Grid>
                </Grid>
                
                <Grid item xs={12} sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"5rem",}}>
                    <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}>
                        <span className={styles.font_review_more}>수강평 더보기</span>
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default LectureInfo;