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
import DashTop from "../component/DashTop";
import styles from "../unauth/css/Lecture.module.css";
import testImg from "../images/test.png"
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Container from "@mui/material/Container";
import EditIcon from "@mui/icons-material/Edit";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useSelector} from "react-redux";


function LectureInfo(props) {
    const navigate = useNavigate();

    const accessToken = useSelector((state) => state.accessToken);

    const params = useParams();

    const [result, setResult] = useState(null); // 1번 정보(첫번째 호출하는 api에서 주는 정보) 넣기

    const [teacher, setTeacher] = useState(null); // 강사 정보 넣을곳

    const [section, setSection] = useState(null);

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


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    useEffect(() => {
        getLectureInfo(params.value) // 첫번째 정보 가져옴
    },[])

    useEffect(() => {
        result && getTeacherInfo(result.memberId);
        result && getSectionInfo(params.value);
    }, [result])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* TopBar 띄우기 위한 Box*/}
            <Grid container sx={{width:"100%", mb:"10rem"}}>
                <Grid xs={12} item container display={"flex"} justtifyContent={"center"} alignItems={"stretch"}
                    sx={{backgroundColor:"#1B65FF", px:{xs:"3vw", md:"10vw", lg:"20vw"},  py:"3rem", m:0}}
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
                                <img className={styles.image} src={result && result.thumb} />
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
                            <p className={styles.font_lecture_name}>{result && result.name}</p>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            {result && result.score > 0 && <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>}
                            {result && result.score > 1 && <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>}
                            {result && result.score > 2 && <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>}
                            {result && result.score > 3 && <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>}
                            {result && result.score > 4 && <StarIcon sx={{ color: '#FFE600', fontSize: '2.5rem' }}/>}
                            <span className={styles.font_review}>({result && result.score})</span>
                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <span className={styles.font_lecture_info_bold}>{result && result.totalReview}개&nbsp;</span>
                            <span className={styles.font_lecture_info_normal}>의&nbsp;수강평&nbsp;|&nbsp;</span>
                            <span className={styles.font_lecture_info_bold}>{result && result.totalStudent}명</span>
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
                                난이도 : {result && result.grade}학년
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
                                     background: "#FFE600"}}>
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
                                     background: "#FFE600"}}>
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
                        {section && section.map((item, idx) => {
                            return(
                                <Accordion>
                                    <AccordionSummary sx={{height:'3vw', backgroundColor:'#D9D9D9'}} expandIcon={<ExpandMoreIcon />}>
                                        <span className={styles.font_curriculum_title}>{item.name}</span>
                                    </AccordionSummary>
                                    {item.videoDTOList && item.videoDTOList.map((subItem, idx) => {
                                        return(
                                            <AccordionDetails>
                                                <Grid container sx={{width:"100%"}}>
                                                    <Grid item xs={9} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                                        <div style={{display: 'flex', alignItems: 'center', flexGrow: 1, width:"60%"}}>
                                                            <Box position="relative" sx={{width:"100px", aspectRatio:"16/9", overflow:"hidden"}}>
                                                                <img src={subItem.thumb} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                                                            </Box>
                                                            <span className={styles.font_curriculum_content}>{subItem.name}</span>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                                                        <Button variant="outlined" color="primary" sx={{borderColor:"#000000"}}
                                                                onClick={() => {
                                                                    if(accessToken){
                                                                        navigate(`/my/lecture/video?id=${subItem.id}`)
                                                                    }else{
                                                                        //로그인 안된 상태면 alert
                                                                        alert("로그인이 필요한 서비스입니다.")
                                                                    }
                                                                }}
                                                        >
                                                            <Typography sx={{color:"#000000"}}>시청하기</Typography>
                                                        </Button>
                                                    </Grid>
                                                </Grid>

                                            </AccordionDetails>
                                        )
                                    }) }
                                </Accordion>
                            )
                        })}
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