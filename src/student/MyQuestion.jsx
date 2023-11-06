import React, {useEffect, useState} from 'react';
import {Button, Collapse, createTheme, Divider, Fade, Grid, Link, Modal, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../unauth/css/Lecture.module.css";
import StarIcon from "@mui/icons-material/Star";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function MyQuestion(props) {
    const accessToken = useSelector((state) => state.accessToken);
    const role = useSelector((state) => state.role);
    const navigate = useNavigate();

    const [result, setResult] = useState(null); // 결과담을 state
    const [more, setMore] = useState(true); // 더 결과가 있는지

    const [answerResult, setAnswerResult] = useState([]); // 답변리스트 결과


    // question collapse state
    const [isQuestionCollapseOpen, setIsQuestionCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    // answer Fade state
    const [isAnswerFadeOpen, setIsAnswerFadeOpen] = useState([]); // Fade 제어를 위한 상태

    // answer collapse state
    const [isAnswerCollapseOpen, setIsAnswerCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    const handleAnswerCollapseToggle = (idx) => {
        // 해당 idx의 상태값만 반대값으로 변경
        const newIsAnswerCollapseOpen = [...isAnswerCollapseOpen];
        newIsAnswerCollapseOpen[idx] = !newIsAnswerCollapseOpen[idx];
        setIsAnswerCollapseOpen(newIsAnswerCollapseOpen);
    }

    const handleQuestionCollapseToggle = (idx) => {
        // 해당 idx의 상태값만 반대값으로 변경
        const newIsQuestionCollapseOpen = [...isQuestionCollapseOpen];
        newIsQuestionCollapseOpen[idx] = !newIsQuestionCollapseOpen[idx];
        setIsQuestionCollapseOpen(newIsQuestionCollapseOpen);
    };

    const defaultSize = 10;
    const [page, setPage] = useState(1);

    // 질문 수정용 modal 디자인
    const [open, setOpen] = useState(false);
    const [questionId, setQuestionId] = useState(0);
    const [questionTitle, setQuestionTitle] = useState(""); // 수정용 title
    const [questionContent, setQuestionContent] = useState("");
    const handleOpen = (id, content, title) => {
        setQuestionId(id);
        setQuestionContent(content);
        setQuestionTitle(title);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    // modal에 들어갈 Box
    const modalBox = (
        <Grid
            container
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}
        >
            <Grid xs={12} item sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Typography id="modal-modal-title" sx={{fontWeight:"800", fontSize:"1.5rem"}}>
                    질문 수정
                </Typography>
            </Grid>
            {/* 제목 **/}
            <Grid xs={12} ite sx={{display:"flex", justifyContent:"center", alignItems:"center", mt:'2rem'}}>
                <TextField
                    label="제목"
                    id={"editQuestionTitle"}
                    defaultValue={questionTitle}
                    fullWidth
                    size={"small"}
                />
            </Grid>
            <Grid xs={12} item sx={{display:"flex", justifyContent:"center", alignItems:"center", mt:'2rem'}}>
                <TextField
                    label="내용"
                    id="editQuestionContent"
                    multiline
                    rows={4}
                    variant="outlined"
                    defaultValue={questionContent}
                    sx={{width:"100%"}}
                />
            </Grid>
            <Grid xs={12} item sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt:'1rem' }}>
                <Button
                    variant="contained"
                    sx={{
                        px:3,
                        py:1,
                        backgroundColor: 'grey.400', // 회색 배경
                        color: 'white', // 흰색 텍스트
                        '&:hover': {
                            backgroundColor: 'grey.500', // 호버 시 더 어두운 회색
                        },
                        '&:active': {
                            backgroundColor: 'grey.600', // 클릭 시 더 어두운 회색
                        },
                        fontSize: "0.7rem",
                        mt: "1rem",
                        mr: "1rem", // 오른쪽 버튼과의 간격
                    }}
                    onClick={() => {
                        // 닫기 메서드
                        handleClose();
                    }}
                >
                    <Typography sx={{ fontSize: "1rem" }}>닫기</Typography>
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        px:3,
                        py:1,
                        backgroundColor: '#2196F3', // 파란색 배경
                        color: 'white', // 흰색 텍스트
                        '&:hover': {
                            backgroundColor: '#1976D2', // 호버 시 더 어두운 파란색
                        },
                        '&:active': {
                            backgroundColor: '#1565C0', // 클릭 시 더 어두운 파란색
                        },
                        fontSize: "0.7rem",
                        mt: "1rem"
                    }}
                    onClick={() => {
                        // 수정 메서드
                        updateQuestion(questionId, document.getElementById("editQuestionContent").value, document.getElementById("editQuestionTitle").value).then(
                            (res) => {
                                handleClose();
                            }
                        )
                    }}
                >
                    <Typography sx={{ fontSize: "1rem" }}>수정</Typography>
                </Button>
            </Grid>
        </Grid>
    )


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

    const [endDate, setEndDate] = useState(dayjs());
    //startDate는 6개월 전으로 설정
    const [startDate, setStartDate] = useState(dayjs().subtract(6, "month"));

    // 내 질문 목록 가져오기
    const getMyQuestion = async (end, start, page, size) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/question/mylist?page=${page}&size=${size}&end=${end.format("YYYY-MM-DD").toString()}&start=${start.format("YYYY-MM-DD").toString()}`,
            {},
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            console.log(res)
            if(res && res.data){
                // page가 1보다 크면 기존 데이터에 추가
                if(page > 1){
                    // 깊은복사
                    const temp = JSON.parse(JSON.stringify(result))
                    setResult(temp.concat(res.data));
                    // collapse 관리 state 이어붙이기
                    const tempArr = Array(res.data.length).fill(false);
                    // 기존의 isQuestionCollapseOpen에 이어붙이기
                    setIsQuestionCollapseOpen(prev => prev.concat(tempArr));
                }else{
                    setResult(res.data);
                    // collapse 관리 state 초기화
                    const tempArr = Array(res.data.length).fill(false);
                    setIsQuestionCollapseOpen(tempArr);
                }

                if(res.data.length < defaultSize){
                    setMore(false);
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

    // 질문삭제
    const deleteQuestion = async (id) => {
        try{
            const response = await axios.post(
                `http://localhost:8099/lecture/question/delete?questionId=${id}`,
                {
                },
                {
                    headers:{
                        Authorization: `${accessToken}`,
                    }
                }
            )
            // 1페이지부터 현재 페이지까지 다시 불러오기
            for(let i = 0 ; i < page ; i++){
                getMyQuestion(endDate, startDate, i+1, defaultSize);
            }

        }catch (e) {
            alert("질문 삭제 실패");
        }
    }

    // 질문수정
    const updateQuestion = async (id, title, content) => {
        const data = {
            questionId: id,
            title: title,
            content: content,
        }
        console.log(data);

        try{
            {/* formdata로 보내기 **/}
            const formData = new FormData();
            formData.append("questionId", id);
            formData.append("title", title);
            formData.append("content", content);
            const response = await axios.post(
                `http://localhost:8099/lecture/question/update`,
                formData,
                {
                    headers:{
                        Authorization: `${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            // 1페이지부터 현재 페이지까지 다시 불러오기
            for(let i = 0 ; i < page ; i++){
                getMyQuestion(endDate, startDate, i+1, defaultSize);
            }

        }catch (e) {
            alert("질문 수정 실패");
        }
    }

    // 날짜체크
    const dateCheck = (t, e) => {
        let check = null;
        if(t === null){
            check = startDate;
        }else{
            check = t;
        }
        //선택한 endDate가 startDate보다 같거나 이전이면 false
        console.log(
            `e.year = ${e.get("year")} , startDay.year = ${check.get("year")}`
        );
        console.log(
            `e.month = ${e.get("month")} , startDay.month = ${check.get("month")}`
        );
        console.log(
            `e.day = ${e.get("date")} , startDay.day = ${check.get("date")}`
        );
        if (e.get("year") < check.get("year")) {
            return false;
        }
        if (e.get("month") < check.get("month")) {
            return false;
        }
        if (e.get("date") < check.get("date")) {
            return false;
        }
        console.log('검사문제없음');
        return true;
    };

    useEffect(() => {
        if(accessToken === ""){
            navigate("/login");
        }


    },[])

    useEffect(() => {
        // 내 질문 목록 최초 가져옴
        getMyQuestion(endDate, startDate, 1, defaultSize);
    },[accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* 질문 수정용 modal **/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {modalBox}
            </Modal>
            <Grid container sx={{pr:{xs:"0rem", md:"2rem"}, pl:{xs:"2rem", md:"2rem"} , py:"2rem"}}>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            sx={{mr:"2rem"}}
                            label="출발일"
                            inputFormat="MM-DD-YYYY"
                            value={startDate}
                            onChange={(e) => {
                                if (dateCheck(e, endDate)) {
                                    setStartDate(e);
                                }else {
                                    setStartDate(e);
                                    setEndDate(e);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="종료일"
                            inputFormat="MM/DD/YYYY"
                            value={endDate}
                            minDate={startDate} // 출발일 이후의 날짜만 선택 가능하도록 설정
                            disablePast // 출발일 이전의 날짜는 선택할 수 없도록 설정
                            onChange={(e) => {
                                console.log(e);
                                if (startDate <= e) {
                                    console.log("여기걸림")
                                    setEndDate(e);
                                }else {
                                    setEndDate(startDate);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    {/* 검색버튼 **/}
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius:"0.5vw",
                            backgroundColor:"#FFFFFF",
                            borderColor:"#000000",
                            ml:"1rem",
                            py:"1rem",
                        }}
                        onClick={() => {
                            // 날짜가 올바르게 들어왔는지 체크합니다.
                            if (startDate > endDate) {
                                alert("날짜를 다시 선택해주세요.");
                                return;
                            }
                            getMyQuestion(endDate, startDate, 1, defaultSize);
                            setPage(1);
                        }}
                    >
                        <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                            검색
                        </Typography>
                    </Button>
                </Grid>
                <Grid container item xs={12}>
                    {/* 질문리스트 **/}
                    {result && result.map((item, idx) => {
                        return(
                            <Grid xs={12} item container
                                  sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"2rem"}}
                            >
                                <Grid item container xs={12} sx={{justifyContent:"space-between",pl:"1rem", alignItems:"center"}}
                                      onClick={() => {
                                          handleQuestionCollapseToggle(idx)
                                          // answer가 0이 아니고 해당 collapse가 true가 아닐때
                                          if(item.answer !== 0 && !isQuestionCollapseOpen[idx]){
                                              console.log("답변리스트 가져오기 getAnswerList + qnaId : " + item.qnaId)
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
                                    <Grid item xs={6} sx={{
                                        p: "5px",
                                        transition: '0.3s',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                            cursor: 'pointer',
                                        },
                                        '&:active': {
                                            backgroundColor: 'action.selected',
                                            boxShadow: 'none',
                                        },
                                    }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 상위 이벤트 전파 중지
                                            // 해당 강의로 이동
                                            navigate(`/lecture/${item.lectureId}`)
                                        }}
                                    >
                                        <Link to={`/lecture/${item.lectureId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{
                                                width: 100, // 고정 가로 크기
                                                aspectRatio: '16 / 9', // 비율 유지
                                                overflow: 'hidden',
                                                borderRadius: '10px',
                                                marginRight: 2
                                            }}>
                                                <img src={item.lectureThumb} alt="강의썸네일" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                            </Box>
                                            <Typography sx={{ display: 'inline', fontWeight: "700", fontSize: "1rem" }}>{item.lectureName}▶</Typography>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={6} sx={{display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#4CAF50', // CSS 색상 코드로 초록색 배경
                                                color: 'white', // 흰색 텍스트
                                                '&:hover': {
                                                    backgroundColor: '#43A047', // 호버 시 더 밝은 초록색
                                                },
                                                '&:active': {
                                                    backgroundColor: '#388E3C', // 클릭 시 더 어두운 초록색
                                                },
                                                fontSize: "0.7rem",
                                                marginLeft: "8px" // 버튼 간의 간격 조정
                                            }}
                                            startIcon={<EditIcon />} // 수정 아이콘 추가
                                            onClick={(e) => {
                                                e.stopPropagation(); // 상위 이벤트 전파 중지
                                                // 리뷰 수정용 modal 열기
                                                handleOpen(item.qnaId, item.content, item.title);
                                            }}
                                        >
                                            <Typography sx={{fontSize:"0.7rem"}}>수정</Typography>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                ml:"1rem",
                                                backgroundColor: 'grey.400', // 회색 배경
                                                color: 'white', // 흰색 텍스트
                                                '&:hover': {
                                                    backgroundColor: 'grey.500', // 호버 시 더 어두운 회색
                                                },
                                                '&:active': {
                                                    backgroundColor: 'grey.600', // 클릭 시 더 어두운 회색
                                                },
                                                fontSize: "0.7rem"
                                            }}
                                            startIcon={<DeleteIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation(); // 상위 이벤트 전파 중지
                                                //삭제 메서드
                                                deleteQuestion(item.qnaId);
                                            }}
                                        >
                                            <Typography sx={{fontSize:"0.7rem"}}>삭제</Typography>
                                        </Button>
                                    </Grid>
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
                                                                        <Typography sx={{fontSize: "1rem", fontWeight: "500"}}>
                                                                            {subItem.content}
                                                                        </Typography>
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
                                            <Grid item xs={12} sx={{pr:"4rem", width:"100%", display:"flex" ,justifyContent:"flex-start"}}>
                                                <TextField
                                                    id={"answerTextField" + item.qnaId}
                                                    variant="outlined"
                                                    multiline
                                                    placeholder="여기에 작성"  // 안내 문자 추가
                                                    rows={4}
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
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            bottom: '-11px',
                                                            left: '19px',
                                                            borderLeft: '11px solid transparent',
                                                            borderRight: '11px solid transparent',
                                                            borderTop: '11px solid #A2A2A2',
                                                        },
                                                        '&::after': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            bottom: '-10px',
                                                            left: '20px',
                                                            borderLeft: '10px solid transparent',
                                                            borderRight: '10px solid transparent',
                                                            borderTop: '10px solid #F7F7F7',
                                                        },
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: "none",
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Collapse>
                                        {/* answercollapse가 열렸을 때만 답변을 작성할 textfield를 보여줍니다. **/}
                                        {/*내가 작성한 질문 일때만 노출... 이 아니지**/}
                                        
                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", mt:"1rem"}}>
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
                                        
                                    </Grid>
                                </Collapse>
                                <Grid item xs={12} sx={{pt:"2rem"}}>
                                    <Divider/>
                                </Grid>
                            </Grid>
                        )
                    })}
                    {/* 더 있을때만 표시 **/}
                    {more && (
                        <Grid item xs={12} sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, pt:"5rem",}}>
                            <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}
                                    onClick={() => {
                                        // 내 질문리스트 가져옴
                                        getMyQuestion(endDate, startDate, page+1, defaultSize);
                                        setPage(page+1);
                                    }}
                            >
                                <span className={styles.font_review_more}>질문 더보기</span>
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyQuestion;