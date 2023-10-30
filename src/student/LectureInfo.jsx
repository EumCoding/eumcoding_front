import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button, Collapse,
    createTheme,
    Divider, Fade, FormControlLabel,
    Grid, LinearProgress, Modal, Radio, RadioGroup, TextField,
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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CheckIcon from "@mui/icons-material/Check";


function LectureInfo(props) {
    const navigate = useNavigate();

    const accessToken = useSelector((state) => state.accessToken);

    const params = useParams();

    const [result, setResult] = useState(null); // 1번 정보(첫번째 호출하는 api에서 주는 정보) 넣기

    const [teacher, setTeacher] = useState(null); // 강사 정보 넣을곳

    const [section, setSection] = useState(null);

    const [file, setFile] = useState(null); // 파일 올릴 state

    // 질문 목록 보기위한 state
    const [questionResult, setQuestionResult] = useState(null); // 질문리스트 결과
    const [answerResult, setAnswerResult] = useState([]); // 답변리스트 결과
    const [questionMore, setQuestionMore] = useState(true); // 더 결과가 있는지
    const [questionPage, setQuestionPage] = useState(1); // 더 결과가 있는지

    // question collapse state
    const [isQuestionCollapseOpen, setIsQuestionCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    // answer Fade state
    const [isAnswerFadeOpen, setIsAnswerFadeOpen] = useState([]); // Fade 제어를 위한 상태

    // answer collapse state
    const [isAnswerCollapseOpen, setIsAnswerCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    const handleQuestionCollapseToggle = (idx) => {
        // 해당 idx의 상태값만 반대값으로 변경
        const newIsQuestionCollapseOpen = [...isQuestionCollapseOpen];
        newIsQuestionCollapseOpen[idx] = !newIsQuestionCollapseOpen[idx];
        setIsQuestionCollapseOpen(newIsQuestionCollapseOpen);
    };

    const handleAnswerCollapseToggle = (idx) => {
        // 해당 idx의 상태값만 반대값으로 변경
        const newIsAnswerCollapseOpen = [...isAnswerCollapseOpen];
        newIsAnswerCollapseOpen[idx] = !newIsAnswerCollapseOpen[idx];
        setIsAnswerCollapseOpen(newIsAnswerCollapseOpen);
    }

    // modal state
    const [openWriteQuestionModal, setOpenWriteQuestionModal] = useState(false); // 질문작성 모달

    const openWriteQuestionModalHandler = () => {
        setOpenWriteQuestionModal(true);
    }

    const closeWriteQuestionModalHandler = () => {
        setOpenWriteQuestionModal(false);
    }

    // 질문 작성하기
    const writeQuestion = async(id, title, content, image) => {
        // form data에 data 로드
        const fd = new FormData();
        fd.append('title', title);
        fd.append('content', content);
        fd.append('lectureId', id);
        Object.values(image).forEach((file) => {
            fd.append('imgRequest', file);
        });
        // api 호출...
        const response = await axios.post(
            `http://localhost:8099/lecture/question/write`,
            fd,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        )
    }

    // 질문작성 state
    // 질문 작성 Modal Body
    const writeQuestionModalBody = (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 450,
                bgcolor: 'background.default',
                border: '1px solid #e0e0e0',
                borderRadius: 4,
                boxShadow: "0 8px 20px 0 rgba(0, 0, 0, 0.12)",
                p: 4,
            }}
        >
            <h2>질문 작성</h2>
            <Grid container sx={{width:"100%"}}>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>제목</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <TextField id={'writeQuestionTitle'} fullWidth  variant="standard" />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center" sx={{mt:2}}>
                    <Typography>내용</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <TextField fullWidth rows={6} multiline variant="outlined" id={'writeQuestionContent'} />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center" sx={{mt:2}}>
                    <Typography>이미지 업로드</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            background: '#0B401D',
                            borderRadius: '10px',
                            '&:hover': {
                                background: "green",
                            }
                        }}
                    >
                        <Typography sx={{ color: "#FFFFFF" }}>파일업로드</Typography>
                        <input
                            accept={"image/*"}
                            type="file"
                            hidden
                            onChange={(e) => setFile(e.target.files)}
                        />
                    </Button>
                </Grid>
                {file && (
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                        <Box sx={{width:"50%", aspectRatio:"16/9", overflow:"hidden"}}>
                            <img src={URL.createObjectURL(file[0])} style={{width:"100%", height:"100%", objectFit:"cover", objectPosition: "center center"}} />
                        </Box>
                    </Grid>
                )}
            <Box mt={2}>
                <Button color="primary"
                    onClick={() => {
                        // 각 요소의 id를 이용해 값을 가져옵니다.
                        const title = document.getElementById('writeQuestionTitle').value;
                        const content = document.getElementById('writeQuestionContent').value;
                        console.log(title + " , " + content + " 의 내용을 전송합니다.")
                        writeQuestion(parseInt(params.value), title, content, file).then((res) => {
                            // 성공 시 질문 리스트 다시 불러옴
                            getQuestionList(params.value, 1);
                            // state 초기화
                            setFile(null);
                            setQuestionPage(1);
                            // 모달 닫음
                            closeWriteQuestionModalHandler();
                        }).catch((err) => {
                            alert("작성 실패. 잠시 후 다시 시도해 주세요.")
                        })
                    }}
                >확인</Button>
                <Button onClick={() => closeWriteQuestionModalHandler()} color="secondary" sx={{ ml: 1 }}>취소</Button>
            </Box>
            </Grid>
        </Box>
    );
    // 질문리스트 가져오기
    const getQuestionList = async (id, page) => {
        const response = await axios.get(
            `http://localhost:8099/lecture/question/unauth/list?lectureId=${id}&page=${page}`
        ).then((res) => {
            console.log("질문리스트..")
            console.log(res)
            if(res && res.data){
                // 페이징처리
                if(page > 1){ // 1페이지가 아닌경우
                    // 깊은복사
                    const temp = JSON.parse(JSON.stringify(questionResult))
                    if(questionResult){
                        setQuestionResult(temp.concat(res.data));
                    }
                    // collapse 관리 state 이어붙이기
                    const tempArr = Array(res.data.length).fill(false);
                    // 기존의 isQuestionCollapseOpen에 이어붙이기
                    setIsQuestionCollapseOpen(prev => prev.concat(tempArr));
                    // 기존의 isAnswerCollapseOpen에 이어붙이기
                    setIsAnswerCollapseOpen(prev => prev.concat(tempArr));
                    // fade
                    setIsAnswerFadeOpen(prev => prev.concat(tempArr));
                    // 총 길이만큼 빈 답변 리스트 이어붙이기
                    setAnswerResult(prev => prev.concat(Array(res.data.length).fill([])));

                }else{
                    setQuestionResult(res.data);
                    // collapse 관리 state 초기화
                    const tempArr = Array(res.data.length).fill(false);
                    setIsQuestionCollapseOpen(tempArr);
                    // fade 초기화
                    setIsAnswerFadeOpen(tempArr);
                    // answer collapse 초기화
                    setIsAnswerCollapseOpen(tempArr);
                    // 답변 리스트 초기화
                    setAnswerResult(Array(res.data.length).fill([]));
                }
                if(res.data.length < 10){
                    setQuestionMore(false); // 더이상 가져올 데이터가 없음
                }
            }
        })
    }

    // 답변 리스트 가져오기
    const getAnswerList = async (id, idx) => {
        const response = await axios.get(
            `http://localhost:8099/lecture/question/comment/auth/list?questionId=${id}`,
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        ).then((res) => {
            console.log("답변리스트..")
            console.log(res)
            if(res && res.data){
                console.log(res);
                // 해당하는 인덱스의 답변리스트 넣기
                const temp = JSON.parse(JSON.stringify(answerResult)); // 깊은복사
                temp[idx] = res.data;
                setAnswerResult(temp);
                // 로드가 완료되면 해당하는 인덱스의 fade를 true로
                const tempFade = JSON.parse(JSON.stringify(isAnswerFadeOpen)); // 깊은복사
                // console.log("기존의 isAnswerFadeOpen")
                // console.log(isAnswerFadeOpen);
                tempFade[idx] = true;
                // console.log("setIsAnswerFadeOpen")
                // console.log(tempFade);
                setIsAnswerFadeOpen(tempFade);
            }
        }).catch((err) => {console.log(err)})
    }

    // 답변 삭제하기
    const deleteAnswer = async (id) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/question/comment/delete`,
            {
                questionCommentId: id,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        ).catch((err) => console.log(err))
    }

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

    // 답변달기
    const addAnswer = async(questionId, content) => {
        console.log("답변달기")
        console.log(questionId)
        console.log(content)
        const response = await axios.post(
            `http://localhost:8099/lecture/question/comment/write`,
            {
                questionId:parseInt(questionId),
                content:content
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    useEffect(() => {
        getLectureInfo(params.value) // 첫번째 정보 가져옴
        // 질문리스트 가져옴
        getQuestionList(params.value, 1);
    },[])

    useEffect(() => {
        result && getTeacherInfo(result.memberId);
        result && getSectionInfo(params.value);
    }, [result])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* New Question Modal **/}
            <Modal
                open={openWriteQuestionModal}

                onClose={() => closeWriteQuestionModalHandler()}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {writeQuestionModalBody}
            </Modal>

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
                            <Button display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{ borderRadius: '1vw',
                                     width:"100%", height:"3vw",
                                     m:0,
                                     border:0,
                                     background: "#FFE600",
                                     '&:hover': {
                                         backgroundColor: "#FFD700"  // 마우스 오버 시 변경될 배경색
                                     },
                                     '&:active': {
                                         backgroundColor: "#FFC300"  // 클릭 시 변경될 배경색
                                     }
                                 }}>
                                <p className={styles.font_sugang}>
                                    이어서 수강하기
                                </p>
                            </Button>
                        </Grid>
                        {/* 질문하기 버튼 **/}
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{pt:5}}
                              xs={6}>
                            <Button display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                    onClick={() => openWriteQuestionModalHandler()}
                                 sx={{ borderRadius: '1vw',
                                     width:"100%", height:"3vw",
                                     m:0,
                                     border:0,
                                     background: "#FFE600",
                                     '&:hover': {
                                         backgroundColor: "#FFD700"  // 마우스 오버 시 변경될 배경색
                                     },
                                     '&:active': {
                                         backgroundColor: "#FFC300"  // 클릭 시 변경될 배경색
                                     }
                                 }}>
                                <p className={styles.font_sugang}>
                                    질문하기
                                </p>
                            </Button>
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
                {/* 질문리스트 **/}
                {questionResult && questionResult.map((item, idx) => {
                    return(
                        <Grid xs={12} item container
                              sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem"}}
                        >
                            <Grid item container xs={12} sx={{justifyContent:"space-between",pl:"1rem", alignItems:"center"}}
                                  onClick={() => {
                                      handleQuestionCollapseToggle(idx)
                                      // answer가 0이 아니고 해당 collapse가 true가 아닐때
                                      if(item.answer !== 0 && !isQuestionCollapseOpen[idx]){
                                          console.log("getAnswerList + " + item.qnaId)
                                          getAnswerList(item.qnaId, idx) // 답변리스트 가져오기
                                      }
                                  }
                                  }
                            >
                                <Box sx={{fontWeight:"700", fontSize:"1.3rem", display:"inline", }}>
                                    <Typography sx={{fontWeight:"700", fontSize:"1.3rem"}}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#A2A2A2"}}>
                                        작성자 : {item.nickname}
                                    </Typography>
                                </Box>
                                <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#8D8D8D", display:"inline", pr:"1rem", alignItems:"center"}}>
                                    {item.date} | {item.answer === 0 ? "미답변" : "답변완료"}
                                </Typography>
                            </Grid>
                            <Collapse in={isQuestionCollapseOpen[idx]} sx={{ width: '100%' }}>
                                <Grid item container xs={12} sx={{px: "2rem", py:"2rem", display: "flex", width: '100%'}}>
                                    <Grid item xs={12} sx={{pr:"4rem", display: "flex", width: '100%', justifyContent:"flex-start"}}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: "80%",
                                                border: 1,
                                                borderRadius: "15px",
                                                borderColor: "#A2A2A2",
                                                p: "1.5rem",
                                                backgroundColor: "#F7F7F7",
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                overflow: "visible",
                                                '&::before': {  // 대표적인 border색 삼각형
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '-11px',  // 삼각형 위치를 약간 조정
                                                    left: '19px',
                                                    borderLeft: '11px solid transparent',
                                                    borderRight: '11px solid transparent',
                                                    borderTop: '11px solid #A2A2A2',
                                                },
                                                '&::after': {  // 배경색 삼각형
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '-10px',
                                                    left: '20px',
                                                    borderLeft: '10px solid transparent',
                                                    borderRight: '10px solid transparent',
                                                    borderTop: '10px solid #F7F7F7',
                                                }
                                            }}
                                        >
                                            <Typography sx={{fontSize: "1rem", fontWeight: "500"}}>
                                                {item.content}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {/* 해당하는 인덱스의 fade가 true가 되었을때 fade를 열도록 합니다. 내용은 답변 리스트를 출력합니다. **/}
                                    <Fade in={isAnswerFadeOpen[idx]} sx={{width: '100%', mt:"1rem", display:"flex", justifyContent:"flex-end"}}>
                                        <Grid container sx={{width:"100%"}}>
                                            {answerResult[idx] && answerResult[idx].map((subItem, subIdx) => {
                                                return(
                                                    <Grid item container xs={12} sx={{width:"100%"}}>
                                                        {/*isWriter가 0인경우 노란말풍선**/}
                                                        {subItem.isWriter === 0 && (
                                                            <Grid item container xs={12} sx={{width:"100%", display:"flex" ,justifyContent:"flex-end", mt:"1rem"}}>
                                                                <Box sx={{width:"20%", display:"flex", justifyContent:"flex-end",alignItems:"flex-end", pr:2}}>
                                                                    <Typography
                                                                        sx={{display:"flex", justifyContent:"flex-end", fontSize:"0.8rem", fontWeight:"300", alignItems:"flex-end"}}
                                                                    >
                                                                        {subItem.createDay}
                                                                    </Typography>
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex', // flexbox 사용
                                                                        justifyContent: 'space-between', // 내용을 양쪽 끝에 배치
                                                                        alignItems: 'center', // 내용을 수직으로 가운데 정렬
                                                                        width: "70%",
                                                                        alignSelf: "flex-end",
                                                                        position: 'relative',
                                                                        borderRadius: "15px",
                                                                        borderColor: "#A2A2A2",
                                                                        p: "1.5rem",
                                                                        backgroundColor: "#FFE066",
                                                                        border: "1px solid #A2A2A2",
                                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            bottom: '-11px',
                                                                            right: '19px',
                                                                            borderLeft: '11px solid transparent',
                                                                            borderRight: '11px solid transparent',
                                                                            borderTop: '11px solid #A2A2A2',
                                                                        },
                                                                        '&::after': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            bottom: '-10px',
                                                                            right: '20px',
                                                                            borderLeft: '10px solid transparent',
                                                                            borderRight: '10px solid transparent',
                                                                            borderTop: '10px solid #FFE066',
                                                                        }
                                                                    }}
                                                                >
                                                                    <Typography sx={{fontSize: "1rem", fontWeight: "500"}}>{subItem.content}</Typography>
                                                                </Box>
                                                            </Grid>
                                                        )}
                                                        {/*isWriter가 1인경우 회색 왼쪽 말풍선**/}
                                                        {subItem.isWriter === 1 && (
                                                            <Grid item container xs={12} sx={{display: "flex", width: '100%', justifyContent:"flex-start", mt:"1rem"}}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex', // flexbox 사용
                                                                        justifyContent: 'space-between', // 내용을 양쪽 끝에 배치
                                                                        alignItems: 'center', // 내용을 수직으로 가운데 정렬
                                                                        position: 'relative',
                                                                        width: "70%",
                                                                        border: 1,
                                                                        borderRadius: "15px",
                                                                        borderColor: "#A2A2A2",
                                                                        p: "1.5rem",
                                                                        backgroundColor: "#F7F7F7",
                                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                                        overflow: "visible",
                                                                        '&::before': {  // 대표적인 border색 삼각형
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            bottom: '-11px',  // 삼각형 위치를 약간 조정
                                                                            left: '19px',
                                                                            borderLeft: '11px solid transparent',
                                                                            borderRight: '11px solid transparent',
                                                                            borderTop: '11px solid #A2A2A2',
                                                                        },
                                                                        '&::after': {  // 배경색 삼각형
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            bottom: '-10px',
                                                                            left: '20px',
                                                                            borderLeft: '10px solid transparent',
                                                                            borderRight: '10px solid transparent',
                                                                            borderTop: '10px solid #F7F7F7',
                                                                        }
                                                                    }}
                                                                >
                                                                    {subItem.isMyComment === 1 && (
                                                                        <IconButton onClick={() => {
                                                                            // 삭제 후 답변 목록 다시 불러옴
                                                                            deleteAnswer(subItem.id).then((res) => {
                                                                                getAnswerList(item.qnaId, idx).catch((err) => alert("답변 목록 다시 불러오기 실패"))
                                                                            }).catch((err) => alert("답변 삭제 실패"))
                                                                        }}
                                                                        >
                                                                            <CloseIcon />
                                                                        </IconButton>
                                                                    )}
                                                                    <Typography sx={{fontSize: "1rem", fontWeight: "500"}}>
                                                                        {subItem.content}
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{width:"20%", display:"flex", justifyContent:"flex-start",alignItems:"flex-end", pl:2}}>
                                                                    <Typography
                                                                        sx={{display:"flex", justifyContent:"flex-start", fontSize:"1rem", fontWeight:"300", alignItems:"flex-end"}}
                                                                    >
                                                                        {subItem.createDay}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                )

                                            })
                                            }
                                        </Grid>
                                    </Fade>
                                    {/* collapse와 답변작성 필드들 **/}
                                    <Collapse in={isAnswerCollapseOpen[idx]} sx={{ width: '100%', mt:"1rem"}}>
                                        <Grid item xs={12} sx={{pl:"4rem", width:"100%", display:"flex" ,justifyContent:"flex-end"}}>
                                            <TextField
                                                id={"answerTextField" + item.qnaId}
                                                variant="outlined"
                                                multiline
                                                placeholder="여기에 작성"  // 안내 문자 추가
                                                rows={4}
                                                sx={{
                                                    width:"80%",
                                                    position: 'relative',
                                                    borderRadius: "15px",
                                                    borderColor: "#A2A2A2",
                                                    p: "1.5rem",
                                                    backgroundColor: "#FFE066", // 노란색 계열로 변경
                                                    border: "1px solid #A2A2A2", // 테두리 선 추가
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 그림자 추가
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: "none",  // 기존의 outlined 선을 없애줍니다.
                                                    },
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: '-11px',
                                                        right: '19px',  // 삼각형을 오른쪽으로 이동
                                                        borderLeft: '11px solid transparent',
                                                        borderRight: '11px solid transparent',
                                                        borderTop: '11px solid #A2A2A2',
                                                    },
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: '-10px',
                                                        right: '20px',  // 삼각형을 오른쪽으로 이동
                                                        borderLeft: '10px solid transparent',
                                                        borderRight: '10px solid transparent',
                                                        borderTop: '10px solid #FFE066',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Collapse>
                                    {/* answercollapse가 열렸을 때만 답변을 작성할 textfield를 보여줍니다. **/}
                                    {/*내가 작성한 질문 일때만 노출**/}
                                    {item.isMyQuestion === 1 && (
                                        <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-end", mt:"1rem"}}>
                                            {/* 답변달기 버튼을 노출합니다. **/}
                                            <Button
                                                variant="contained"
                                                startIcon={isAnswerCollapseOpen[idx] ? <ClearIcon/> : <QuestionAnswerIcon/>}
                                                sx={{
                                                    width: "10rem",
                                                    height: "3rem",
                                                    background: "#FFFFFF",
                                                    borderColor: "#007BFF",  // 파란계열 테두리
                                                    color: "#007BFF",       // 파란계열 글씨
                                                    border: "1px solid",
                                                    '&:hover': {
                                                        backgroundColor: "#007BFF",  // hover 시 파란색계열 배경
                                                        color: "#FFFFFF",           // hover 시 흰색 글씨
                                                    },
                                                    '&:active': {
                                                        backgroundColor: "#0056b3",  // 클릭 시 더 진한 파란색계열 배경
                                                        color: "#FFFFFF",           // 클릭 시 흰색 글씨
                                                    }
                                                }}
                                                onClick={() => {
                                                    handleAnswerCollapseToggle(idx);
                                                }}
                                            >
                                                {isAnswerCollapseOpen[idx] ? "답변취소" : "답변달기"}
                                            </Button>
                                            {/* 작성완료 버튼을 노출합니다. **/}
                                            {isAnswerCollapseOpen[idx] && (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        console.log(item.qnaId);
                                                        console.log(document.getElementById("answerTextField" + item.qnaId).value);
                                                        // 답변 작성
                                                        addAnswer(item.qnaId, document.getElementById("answerTextField" + item.qnaId).value).then((res1) => {
                                                            // 성공 시 해당 인덱스의 답변리스트 다시 불러옴
                                                            getAnswerList(item.qnaId, idx).then((res2) => {
                                                                handleAnswerCollapseToggle(idx); // 답변작성 collapse 닫기
                                                                // 기존 textfield의 값 초기화
                                                                document.getElementById("answerTextField" + item.qnaId).value = "";
                                                            }).catch((err) => {alert("답변목록 불러오기에 실패했습니다.")})
                                                        }).catch((err) => {alert("답변작성에 실패했습니다.")})
                                                    }}
                                                    startIcon={<CheckIcon/>}
                                                    sx={{
                                                        ml:"1rem",
                                                        width: "10rem",
                                                        height: "3rem",
                                                        background: "#FFFFFF",
                                                        borderColor: "#007BFF",  // 파란계열 테두리
                                                        color: "#007BFF",       // 파란계열 글씨
                                                        border: "1px solid",
                                                        '&:hover': {
                                                            backgroundColor: "#007BFF",  // hover 시 파란색계열 배경
                                                            color: "#FFFFFF",           // hover 시 흰색 글씨
                                                        },
                                                        '&:active': {
                                                            backgroundColor: "#0056b3",  // 클릭 시 더 진한 파란색계열 배경
                                                            color: "#FFFFFF",           // 클릭 시 흰색 글씨
                                                        }
                                                    }}
                                                >
                                                    작성완료
                                                </Button>
                                            )}
                                        </Grid>
                                    )}
                                </Grid>
                            </Collapse>
                            <Grid item xs={12} sx={{pt:"2rem"}}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    )
                })}
                {/* 더 있을때만 표시 **/}
                {questionMore && (
                    <Grid item xs={12} sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"5rem",}}>
                        <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}
                                onClick={() => {
                                    // 질문리스트 가져옴
                                    getQuestionList(params.value, questionPage+1).then((res) => {
                                        //page 증가
                                        setQuestionPage(questionPage+1);
                                    });

                                }}
                        >
                            <span className={styles.font_review_more}>질문 더보기</span>
                        </Button>
                    </Grid>
                )}
            </Grid>
        </ThemeProvider>
    );
}

export default LectureInfo;