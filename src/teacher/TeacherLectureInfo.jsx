import React, {useEffect, useRef, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    createTheme,
    Divider, FormControlLabel,
    Grid, Modal, Radio, RadioGroup, TextField,
    ThemeProvider,
    LinearProgress, Collapse, Fade, keyframes, FormControl, InputLabel, Select, MenuItem
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
import CheckIcon from '@mui/icons-material/Check'; // 확인 아이콘
import ClearIcon from '@mui/icons-material/Clear'; // 취소 아이콘
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // 증가
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReactPlayer from "react-player";
import {ChangeCircle} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import FaceIcon from "@mui/icons-material/Face6";
import dayjs from "dayjs";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from '@mui/icons-material/Add';
import BlockList from "../component/BlockList";


// @emotion/react의 keyframes를 사용하여 애니메이션 정의
const heartBurst = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
`;


// modal에 적용할 style
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:"1vw",
};


// 강사 side의 강의 정보를 표시하고 수정합니다.
function TeacherLectureInfo(props) {

    const [newSectionName, setNewSectionName] = useState(""); // 새로운 Section 이름

    const navigate = useNavigate();

    const inputRef = useRef(null);


    const accessToken = useSelector((state) => state.accessToken);

    const params = useParams();

    const [result, setResult] = useState(null); // 1번 정보(첫번째 호출하는 api에서 주는 정보) 넣기

    const [teacher, setTeacher] = useState(null); // 강사 정보 넣을곳

    const [section, setSection] = useState(null);

    const [review, setReview] = useState(null);

    const [more, setMore] = useState(false);


    // 질문 목록 보기위한 state
    const [questionResult, setQuestionResult] = useState(null); // 질문리스트 결과
    const [answerResult, setAnswerResult] = useState([]); // 답변리스트 결과
    const [questionMore, setQuestionMore] = useState(true); // 더 결과가 있는지
    const [questionPage, setQuestionPage] = useState(1); // 더 결과가

    const [reviewPage, setReviewPage] = useState(0);

    // question collapse state
    const [isQuestionCollapseOpen, setIsQuestionCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    // answer Fade state
    const [isAnswerFadeOpen, setIsAnswerFadeOpen] = useState([]); // Fade 제어를 위한 상태

    // answer collapse state
    const [isAnswerCollapseOpen, setIsAnswerCollapseOpen] = useState([]); // Collapse 제어를 위한 상태

    //  문제 리스트
    const [videoTestList, setVideoTestList] = useState([]);

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

    // 수정하기 위한 state들
    const [price, setPrice] = useState(0); // 가격
    const [name, setName] = useState(""); // 가격
    const [grade, setGrade] = useState(0); // 학년

    // 수정 여부 state들 ...
    const [editPrice, setEditPrice] = useState(false); // 가격
    const [editName, setEditName] = useState(false); // 강의명
    const [editGrade, setEditGrade] = useState(false); // 난이도(학년)
    const [editThumb, setEditThumb] = useState(false); // 썸네일
    const [editImage, setEditImage] = useState(false); // 이미지
    const [editDescription, setEditDescription] = useState(false); // 강의설명

    const [editTimetaken, setEditTimetaken] = useState([]); // 소요시간 수정
    const [newTimeTaken, setNewTimeTaken] = useState(0); // 소요시간 수정

    // section 추가용 modal
    const [sectionOpen, setSectionOpen] = useState(false);

    // section 수정용 modal
    const [sectionNameEditOpen, setSectionNameEditOpen] = useState(false);

    // Video 추가용 modal
    const [videoOpen, setVideoOpen] = useState(false);

    // Video 추가용 진행률 상태
    const [progress, setProgress] = useState(0); // 진행률 상태 관리

    // Video 추가용 state들 - Video 수정에서도 사용함
    const [videoName, setVideoName] = useState(""); // Video 이름
    const [videoFile, setVideoFile] = useState(null); // Video 파일
    const [videoDescription, setVideoDescription] = useState(""); // Video 설명
    const [videoThumb, setVideoThumb] = useState(null); // Video 썸네일
    const [preview, setPreview] = useState("0"); // video 미리보기 가능 여부... 0:false 1:true
    const [fileName, setFileName] = useState(''); // 파일명을 저장할 state

    // Video 수정용 state들
    const [videoId, setVideoId] = useState(""); // Video 아이디
    const [videoResult, setVideoResult] = useState(null); // 동영상 정보 담을 곳

    // Video 정보 수정용 state들...
    const [editVideoName, setEditVideoName] = useState(false); // Video 이름 수정 활성화 여부
    const [editVideoDescription, setEditVideoDescription] = useState(false); // Video 설명 수정 활성화 여부
    const [editVideoThumb, setEditVideoThumb] = useState(false); // Video 썸네일 수정 활성화 여부

    // 리뷰 답변 작성 collpase용 state
    const [reviewCollapse, setReviewCollapse] = useState(false);


    // Video 수정용 modal
    const [videoEditOpen, setVideoEditOpen] = useState(false);

    // section 수정용 sectionId
    const [sectionId, setSectionId] = useState(0);

    // 아코디언의 확장 상태 관리
    const [expanded, setExpanded] = useState([]);

    const [uploadProgress, setUploadProgress] = useState(0);

    const [liked, setLiked] = useState(false);

    const [likedCount, setLikedCount] = useState(0); // 좋아요 갯수

    const [videoTestCollapse, setVideoTestCollapse] = useState([]); // 문제리스트 collapse

    // video test 용 문제 type
    const [videoTestType, setVideoTestType] = useState(0);

    // video test용 block 또는 보기 리스트
    const [videoTestBlockList, setVideoTestBlockList] = useState([]);

    // video test용 modal state
    const [videoTestAddOpen, setVideoTestAddOpen] = useState(false);

    // video test add용 block
    const [videoTestBlock, setVideoTestBlock] = useState("");

    // video test용 modal state의 함수
    const handleVideoTestAddOpen = () => setVideoTestAddOpen(true);
    const handleVideoTestAddClose = () => setVideoTestAddOpen(false);

    // 아코디언 모두 닫기
    const closeExpanded = () => {
        const array = new Array(8).fill(false); // 배열생성
        setExpanded(array); // expanded state에 할당
    }

    // 특정 아코디언 상태변경
    const chgExpanded = (idx) => {
        const temp = JSON.parse(JSON.stringify(expanded)); // 깊은복사
        // 해당 index의 값을 반대로 변경
        temp[idx] = !temp[idx];
        // state에 할당
        setExpanded(temp);
    }

    // 강의 썸네일 수정
    const updateLectureThumb = async (id, files) => { // id: 강의아이디, thumb: 썸네일
        const fd = new FormData();
        fd.append('id', id);
        Object.values(files).forEach((file1) => {
            fd.append('thumb', file1);
        }); // 파일 임포트
        const response = await axios.post(
            `http://localhost:8099/lecture/update/thumb`,
            fd,
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

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

    // 좋아요 갯수 가져오기
    const getLikeCount = async (id) => {
        console.log("좋아요 갯수 가져오기(비회원)...")
        const response = await axios.get(
            `http://localhost:8099/lecture/heart/unauth/view?id=${id}`
        ).then((res) => {
            console.log(res)
            if(res && res.data){
                setLiked(false) // t,f
                setLikedCount(res.data.interestCnt)
            }
        })
    }

    // 좋아요 갯수 가져오기(회원)
    const getLikeCountMember = async (id) => {
        console.log("좋아요 갯수 가져오기(회원)...")
        const response = await axios.get(
            `http://localhost:8099/lecture/heart/auth/view?id=${id}`,
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            console.log(res)
            if(res && res.data){
                setLiked(res.data.interest) // t,f
                setLikedCount(res.data.interestCnt)
            }
        })
    }

    // 좋아요 추가
    const addLike = async (id) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/heart/add`,
            {
                lectureId:id
            },
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            // 좋아요 갯수 다시 가져오기
            getLikeCountMember(id);
        })
    }

    // 좋아요 삭제
    const deleteLike = async (id) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/heart/delete`,
            {
                lectureId:id
            },
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            // 좋아요 갯수 다시 가져오기
            getLikeCountMember(id);
        })
    }

    const handleLikeClick = () => {
        //setLiked(!liked);
        // 여기서 애니메이션 상태를 관리하거나 트리거 할 수 있습니다.

        // accessToken이 없는 경우 alert로 로그인 필요하다고 알려주기
        if(!accessToken){
            alert("로그인이 필요한 서비스입니다.")
            navigate("/login")
        }

        // liked true인 경우 좋아요 삭제
        if(liked){
            console.log(params.value + "번 강의 좋아요 삭제")
            deleteLike(params.value);
        }
        // liked false인 경우 좋아요 추가
        else{
            console.log(params.value + "번 강의 좋아요 추가")
            addLike(params.value);
        }
    };

    const handleSectionOpen = () => {
        setSectionOpen(true);
    };

    const handleSectionClose = () => {
        setSectionOpen(false);
    };

    const handleSectionNameEditOpen = () => {
        setSectionNameEditOpen(true);
    }

    const handleSectionNameEditClose = () => {
        setSectionNameEditOpen(false);
    }

    const handleVideoOpen = () => {
        setVideoOpen(true);
    }

    const handleVideoClose = () => {
        setVideoOpen(false);
    }

    const handleVideoEditOpen = () => {
        setVideoEditOpen(true);
    }

    const handleVideoEditClose = () => {
        setVideoEditOpen(false);
    }

    const handleReviewCollapseToggle = (idx) => {
        // 해당하는 idx의 collapse의 상태값을 반대로
        const temp = JSON.parse(JSON.stringify(reviewCollapse));
        temp[idx] = !temp[idx];
        setReviewCollapse(temp);
    }

    const sectionModalBody = (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 400,
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 24,
                p: 3,
            }}
        >
            <h2>Section 추가하기</h2>
            <TextField fullWidth label="입력" variant="standard" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
            <Box mt={2}>
                <Button color="primary"
                    onClick={() => {
                        if(section && !newSectionName !== ""){
                            let seq = section.length;
                            addSection(parseInt(params.value), newSectionName, seq, 1).then((res) => {
                                getSectionInfo(params.value); // Section 정보 다시 불러옴
                                handleSectionClose(); // 완료시 닫음
                                setNewSectionName(""); // 입력값 초기화
                            })
                        }
                    }}
                >확인</Button>
                <Button onClick={handleSectionClose} color="secondary" sx={{ ml: 1 }}>취소</Button>
            </Box>
        </Box>
    );

    const sectionNameEditBody = (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 400,
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 24,
                p: 3,
            }}
        >
            <h2>Section명 수정</h2>
            <TextField fullWidth label="입력" variant="standard" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
            <Box mt={2}>
                <Button color="primary"
                        onClick={() => {
                            if(section && !newSectionName !== ""){
                                updateSectionName(sectionId, newSectionName).then((res) => {
                                    getSectionInfo(params.value); // Section 정보 다시 불러옴
                                    handleSectionNameEditClose(); // 완료시 닫음
                                    setNewSectionName(""); // 입력값 초기화
                                })
                            }
                        }}
                >확인</Button>
                <Button onClick={() => handleSectionNameEditClose()} color="secondary" sx={{ ml: 1 }}>취소</Button>
            </Box>
        </Box>
    );
    // Video add modal body
    const newVideoBody = (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 400,
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 24,
                p: 3,
            }}
        >
            <h2>영상 추가</h2>
            <Grid container sx={{width:"100%"}}>
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>영상 제목</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <TextField fullWidth label="입력" variant="standard" value={videoName} onChange={(e) => setVideoName(e.target.value)} />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>미리보기 여부</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel checked={preview === "1"} value={"1"} control={<Radio />} label="가능" onChange={(e) => setPreview(e.target.value)}/>
                        <FormControlLabel checked={preview === "0"} value={"0"} control={<Radio />} label="불가능" onChange={(e) => setPreview(e.target.value)}/>
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>영상 설명</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <TextField fullWidth label="입력" variant="standard" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>영상 썸네일</Typography>
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
                            onChange={(e) => setVideoThumb(e.target.files)}
                        />
                    </Button>
                </Grid>
                {videoThumb && (
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                        <Box sx={{width:"50%", aspectRatio:"16/9", overflow:"hidden"}}>
                            <img src={URL.createObjectURL(videoThumb[0])} style={{width:"100%", height:"100%", objectFit:"cover", objectPosition: "center center"}} />
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography>영상 파일</Typography>
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
                            accept={"video/*"}
                            type="file"
                            hidden
                            onChange={(e) => {
                                setVideoFile(e.target.files);
                                setFileName(e.target.files[0].name); // 파일 이름 설정
                            }}
                        />
                    </Button>
                    <div>
                        {uploadProgress > 0 && (
                            <div>
                                <progress value={uploadProgress} max="100"></progress>
                                {uploadProgress}% uploaded
                            </div>
                        )}
                    </div>
                </Grid>
                {fileName &&
                    (
                        <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                            <Typography variant="body2" sx={{ marginTop: 2 }}>{fileName}</Typography>
                        </Grid>
                    )
                }
            </Grid>
            <Grid item xs={12}>
                {progress > 0 && progress < 100 && (
                    <LinearProgress variant="determinate" value={progress} />
                )}
            </Grid>
            <Box mt={2}>
                <Button color="primary"
                        onClick={() => {
                            console.log(videoFile);
                            console.log("동영상업로드 수행...")
                            if(videoFile && videoName !== "" && videoDescription !== "" && videoThumb !== null && videoFile !== null){
                                addVideo(sectionId,videoName ,preview, videoDescription, videoThumb, videoFile).then((res) => {
                                    const array = JSON.parse(JSON.stringify(expanded)); // 깊은복사
                                    getSectionInfo(params.value).then((res) => {
                                        // Section 정보 불러온 후 다시 아코디언 확장
                                        setExpanded(array); // expanded state에 할당
                                        setVideoName(""); // 입력값 초기화
                                        setVideoDescription(""); // 입력값 초기화
                                        setVideoThumb(null); // 입력값 초기화
                                        setVideoFile(null); // 입력값 초기화
                                        handleVideoClose(); // 완료시 닫음
                                    })

                                }).catch((res) => {alert("동영상 업로드 실패")})
                                
                            }else if(!videoFile) {
                                alert("동영상 파일을 선택해주세요")
                            }
                        }}
                >확인</Button>
                <Button onClick={handleVideoClose} color="secondary" sx={{ ml: 1 }}>취소</Button>
            </Box>
        </Box>
    );

    // Video edit modal body
    const editVideoBody = (
        <Box sx={modalStyle} >
            {videoResult && (
                <Grid container sx={{width:"100%"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mb:"2rem"}}>
                        <Typography id="modal-modal-description" fullWidth sx={{ fontSize:"1.5rem", fontWeight:"900" }}>
                            {!editVideoName && videoResult && videoResult.name}
                        </Typography>
                        {editVideoName && (
                            <TextField variant={"standard"} size={"small"} value={videoName} onChange={(e) => setVideoName(e.target.value)} />
                        )}
                        {!editVideoName && (
                            <EditIcon onClick={() => setEditVideoName(true)} />
                        )}
                        {editVideoName && (
                            <CheckIcon />
                        )}
                        {editVideoName && (
                            <ClearIcon onClick={() => {
                                if(videoResult){
                                    setEditVideoName(false);
                                    setVideoName(videoResult.name); // 취소 시 원래 이름으로
                                }
                            }} />)
                        }
                    </Grid>
                    <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{pt:"3rem"}}
                          sx={{width:"100%", aspectRatio:"16/9"}}
                    >
                        <ReactPlayer url={videoResult.path} playing controls={true} width='100%' height="100%"/>
                    </Grid>
                    <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"} sx={{mb:"2rem"}}>
                        <Typography id="modal-modal-description" fullWidth sx={{ fontSize:"1rem", fontWeight:"700" }}>
                            {!editVideoDescription && videoResult && videoResult.description}
                        </Typography>
                        {editVideoDescription && (
                            <TextField fullWidth variant={"outlined"} size={"small"} value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} multiline />
                        )}
                        {!editVideoDescription && (
                            <EditIcon onClick={() => setEditVideoDescription(true)} />
                        )}
                        {editVideoDescription && (
                            <CheckIcon />
                        )}
                        {editVideoDescription && (
                            <ClearIcon onClick={() => {
                                if(videoResult){
                                    setEditVideoDescription(false);
                                    setVideoDescription(videoResult.description); // 취소 시 원래 설명으로 변경
                                }
                            }} />)
                        }
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                        <Typography>미리보기 여부</Typography>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel checked={preview === "1"} value={"1"} control={<Radio />} label="가능" onChange={(e) => setPreview(e.target.value)}/>
                            <FormControlLabel checked={preview === "0"} value={"0"} control={<Radio />} label="불가능" onChange={(e) => setPreview(e.target.value)}/>
                        </RadioGroup>
                    </Grid>
                </Grid>
            )}
        </Box>
    );

    // video test 추가용 modal
    const videoTestAddBody = (
        <Grid
            container
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 800,
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 24,
                p: 7,
            }}
        >
            <Grid xs={12} item sx={{display:"flex", justifyContent:"center", alignItems:"center", py:"1rem"}}>
                <Typography sx={{fontWeight:"800", fontSize:"1.5rem"}}>
                    문제추가
                </Typography>
            </Grid>
            {/* 문제 type **/}
            <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <RadioGroup
                    row // 이 속성을 추가하여 라디오 버튼들이 가로로 표시되도록 함
                    id="addVideoTestRadio"
                    value={videoTestType.toString()} // videoTestType 상태를 문자열로 변환
                    onChange={(e) => {
                        // int형으로 변환해 videoTestType state에 할당
                        setVideoTestType(parseInt(e.target.value));
                        // 바뀔 때 마다 videoTestBlockList 초기화
                        setVideoTestBlockList([]);
                        // 답도 초기화
                        document.getElementById("videoTestAnswerInput").value = "";
                    }}
                >
                    {/* 객관식... value 0 */}
                    <FormControlLabel value="0" control={<Radio />} defaultValue label="객관식"/>
                    {/* 블럭코딩... value 1 */}
                    <FormControlLabel value="1" control={<Radio />} label="블럭코딩"/>
                </RadioGroup>
            </Grid>
            {/* 문제제목 **/}
            <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <TextField
                    id="videoTestTitleInput"
                    fullWidth
                    label="문제 제목"
                    size="small"
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '40px', // TextField 높이 설정
                        },
                        display:"inline",
                    }}
                />
            </Grid>
            {/* 답 **/}
            <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <TextField
                    id="videoTestAnswerInput"
                    fullWidth
                    label="답"
                    size="small"
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '40px', // TextField 높이 설정
                        },
                        display:"inline",
                    }}
                    type={videoTestType === 0 ? "number" : "text"}
                />
            </Grid>
            <Grid xs={12} item sx={{mt:"2rem"}}>
                <Typography sx={{fontWeight:"700", fontSize:"1rem"}}>
                    [{videoTestType === 0 ? "보기" : "블럭"}]
                </Typography>
            </Grid>
            {/* videoTestType이 0인 경우... 객관식 보기 리스트 추가 **/}
            {videoTestType === 0 && videoTestBlockList.map((item, idx) => {
                return(
                    <Grid xs={12} item sx={{pt:"0.3rem"}}>
                        <Typography sx={{fontWeight:"500", fontSize:"1rem", display:"flex", alignItems:"center"}}>
                            [{idx+1}]. {item} <ClearIcon onClick={() =>
                                // 해당 idx의 item만 pop
                                setVideoTestBlockList(videoTestBlockList.filter((item, index) => index !== idx))
                            } />
                        </Typography>
                    </Grid>
                )
            })}
            {videoTestType === 0 && (
                <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <TextField
                            id="videoTestBlockInput"
                            fullWidth
                            label="보기"
                            size="small"
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '40px', // TextField 높이 설정
                                },
                                display:"inline",
                                width:"80%"
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon sx={{ color: "#FFFFFF" }} />}
                            sx={{
                                height: '40px', // 버튼 높이를 TextField와 동일하게 설정
                                background: '#4caf50',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    background: "#388e3c",
                                },
                                width:"15%"
                            }}
                            onClick={() => {
                                // 추가 버튼 클릭 시 실행될 로직
                                // videoTestBlockList state에 추가
                                const temp = JSON.parse(JSON.stringify(videoTestBlockList)); // 깊은복사
                                // 값이 없을때에 대한 예외처리
                                if(document.getElementById("videoTestBlockInput").value === ""){
                                    alert("값을 입력해주세요");
                                    return;
                                }
                                temp.push(document.getElementById("videoTestBlockInput").value);
                                setVideoTestBlockList(temp);
                                // 추가 후 input 초기화
                                document.getElementById("videoTestBlockInput").value = "";
                            }}
                        >
                            <Typography sx={{ color: "#FFFFFF" }}>추가</Typography>
                        </Button>
                </Grid>
            )}
            {/* 블록코딩을 선택한 경우에는 블록 드랍다운 출력 **/}
            {videoTestType === 1 && (
                <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <FormControl fullWidth>
                        <InputLabel id={"videoTestBlockLabel"} >블록선택</InputLabel>
                        {/* 블록리스트 **/}
                        <Select
                            labelId={"videoTestBlockLabel"}
                            id={"videoTestBlockSelect"}
                            label={"블록선택"}
                            onChange={(e) => {
                                // 선택한 블록을 리스트에 추가
                            }}
                            onClick={() => console.log(BlockList)}
                        >
                            {BlockList.map((blockItem, blockIdx) => {
                                return(
                                    <MenuItem value={blockItem.code} >
                                        {blockItem.text}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            )}
        </Grid>
    )


    // Section 이름 수정
    const updateSectionName = async (id, name) => { // id: 강의아이디, name: 강의명
        const response = await axios.post(
            `http://localhost:8099/lecture/section/update/name`,
            {
                id: id,
                name: name,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }


    // 강의 정보 가져오기 1
    const getLectureInfo = async (id) => { // id: 강의아이디
        const response = await axios.get(
            `http://localhost:8099/lecture/unauth/view?id=${id}`
        ).then((res) => {
            console.log(res)
            if(res.data){
                setResult(res.data);
                setPrice(res.data.price); // 가격저장
                setName(res.data.name); // 강의명
                setGrade(res.data.grade); // 학년
            }
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
            if(res.data){
                res.data && setSection(res.data);
                // Section의 갯수만큼 expanded에 false 넣기
                const array = new Array(res.data.length).fill(false); // 배열생성
                setExpanded(array); // expanded state에 할당
                setEditTimetaken(array) // editTimetaken state 에 할당
                // [section의 갯수][video의 갯수]의 2차원 배열 생성 후 전부 false로 채우기
                // 각 섹션별 비디오 개수에 따라 2차원 배열 생성 후 모든 값을 false로 초기화
                const videoStatusArray = res.data.map((section, idx) =>
                    new Array(section.videoDTOList.length).fill(false)
                );
                // video test
                const videoTestArray = res.data.map((section, idx) =>
                    new Array(section.videoDTOList.length).fill(null)
                );
                setVideoTestCollapse(videoStatusArray);
                setVideoTestList(videoTestArray);
            }
        })
    }

    // 강의명 수정하기
    const updateLectureName = async (id, name) => { // id: 강의아이디, name: 강의명
        const response = await axios.post(
            `http://localhost:8099/lecture/update/name`,
            {
                id: id,
                name: name,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }

    // 가격 수정하기
    const updateLecturePrice = async (id, price) => { // id: 강의아이디, price: 가격
        const response = await axios.post(
            `http://localhost:8099/lecture/update/price`,
            {
                id: id,
                price: price,
                },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }

    // 강의 상태 수정
    const updateLectureState = async (id, state) => { // id: 강의아이디, price: 가격
        const response = await axios.post(
            `http://localhost:8099/lecture/update/state`,
            {
                id: id,
                state: state,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }

    // 강의 학년
    const updateLectureGrade = async (id, grade) => { // id: 강의아이디, price: 가격
        const response = await axios.post(
            `http://localhost:8099/lecture/update/grade`,
            {
                id: id,
                grade: grade,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }

    // 강의 설명 수정
    const updateLectureDescription = async (id, description) => { // id: 강의아이디, price: 가격
        const response = await axios.post(
            `http://localhost:8099/lecture/update/description`,
            {
                id: id,
                description: description,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                },
            }
        )
    }

    // Section 추가하기
    const addSection = async (id, name, seq, timeTaken) => { // id: 강의아이디, price: 가격
        const response = await axios.post(
            `http://localhost:8099/lecture/section/add`,
            {
                lectureId: id,
                name: name,
                sequence: seq,
                timeTaken: timeTaken,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // Section 삭제하기
    const delSection = async(sectionId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/delete`,
            {
                id: sectionId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // Section up
    const upSection = async(sectionId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/sequence/up`,
            {
                id: sectionId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // Section down
    const downSection = async(sectionId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/sequence/down`,
            {
                id: sectionId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // timetaken 수정
    const editSectionTimeTaken = async(sectionId, timeTaken) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/update/time_taken`,
            {
                id: sectionId,
                timeTaken: timeTaken
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
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



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentLoaded = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentLoaded);
            }
        };

        reader.onloadend = () => {
            setVideoFile(file);
            setFileName(file.name);
        };

        reader.readAsDataURL(file);
    };

    // 동영상 업로드 함수
    const addVideo = async (sectionId, name, preview,videoDescription, videoThumb, videoFile) => {
        const formData = new FormData();
        formData.append('sectionId', sectionId);
        formData.append('name', name);
        formData.append('videoDescription', videoDescription);
        formData.append('preview', parseInt(preview));
        formData.append('description', videoDescription);
        Object.values(videoThumb).forEach((file1) => {
            formData.append('thumb', file1);
        }); // 파일 임포트
        console.log("videoFile 임포트 시작")
        console.log(videoFile);
        console.log(typeof videoFile)
        Object.values(videoFile).forEach((file) => {
            formData.append('videoFile', file);
        }); // 파일 임포트

        const config = {
            // 업로드 중의 진행 상황을 추적하는 이벤트 핸들러
            onUploadProgress: function(progressEvent) {
                // progressEvent.loaded: 현재까지 업로드된 바이트
                // progressEvent.total: 전체 업로드할 바이트
                // 위 두 값을 사용하여 업로드 진행률을 백분율로 계산
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                // setProgress 함수로 업로드 진행률을 상태에 업데이트
                setProgress(percentCompleted);
            },
            headers: {
                // 요청 헤더에 'multipart/form-data' 타입을 지정하여,
                // 서버에 파일과 함께 다른 데이터도 전송할 수 있도록 설정
                'Content-Type': 'multipart/form-data',

                // Authorization 헤더에 토큰 값을 포함시켜 인증 정보를 전송
                Authorization: `${accessToken}`
            }
        };

        try {
            console.log(formData.get('videoFile'));
            const response = await axios.post(`http://localhost:8099/lecture/section/video/uploadWithProgress`, formData, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // 영상 삭제
    const delVideo = async(videoId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/delete`,
            {
                id: videoId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // 영상 위로
    const upVideo = async(videoId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/sequence/up`,
            {
                id: videoId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // 영상 아래로
    const downVideo = async(videoId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/sequence/down`,
            {
                id: videoId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // 영상 정보 불러오기
    const getVideoInfo = async(videoId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/view?id=${videoId}`,
            {},
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        ).then((res) => {
            console.log(res);
            if(res.data){
                setVideoResult(res.data);
                setVideoName(res.data.name)
                setVideoDescription(res.data.description)
                setVideoThumb(res.data.thumb)
            }
        })
    }

    // 영상 제목 수정
    const updateVideoName = async(videoId, name) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/update/name`,
            {
                id: videoId,
                name: name,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // 리뷰 가져오기
    const getReviewList = async (id, paramPage) => {
        const response = await axios.get(
            `http://localhost:8099/lecture/review/unauth/list?id=${id}&page=${paramPage}`
        ).then((res) => {
            console.log("리뷰가져옴")
            console.log(res)
            if(paramPage > 0){
                // 깊은복사
                const temp = JSON.parse(JSON.stringify(review))
                setReview(temp.concat(res.data))
                // 리뷰 답변 작성용 state에도 추가
                const array = new Array(res.data.length).fill(false); // 배열생성
                setReviewCollapse(reviewCollapse.concat(array)); // editReviewComment state에 할당
            }else{
                res.data && setReview(res.data);
                // 리뷰 답변 작성용 state도 초기화
                const array = new Array(res.data.length).fill(false); // 배열생성
                setReviewCollapse(array); // editReviewComment state에 할당
            }
            res.data && (res.data.length < 10) ? setMore(false) : setMore(true);
        })
    }

    // 리뷰 답변 작성
    const addReviewComment = async (reviewId, content) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/review/comment/write`,
            {
                reviewId: reviewId,
                content: content,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // 리뷰 답변 삭제
    const delReviewComment = async (commentId) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/review/comment/delete`,
            {
                id: commentId,
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        )
    }

    // video test list 가져오는 api
    const getVideoTestList = async (videoId, idx, subIdx) => {
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/test/list`,
            {
                id:videoId
            },
            {
                headers:{
                    Authorization: `${accessToken}`,
                }
            }
        ).then((res) => {
            console.log(res)
            if(res.data){
                // state의 해당하는 [idx][subIdx]에 할당
                const temp = JSON.parse(JSON.stringify(videoTestList));
                temp[idx][subIdx] = res.data;
                setVideoTestList(temp);
            }
        })
    }


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    useEffect(() => {
        getLectureInfo(params.value) // 첫번째 정보 가져옴
        // 첫번째 페이지의 질문리스트 가져옴
        getQuestionList(params.value, 1);
        // 첫번째 페이지의 리뷰리스트 가져옴
        getReviewList(params.value, 0);
    },[])

    useEffect(() => {
        result && getTeacherInfo(result.memberId);
        result && getSectionInfo(params.value);
    }, [result])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>

            {/* New Section Modal **/}
            <Modal
                open={sectionOpen}

                onClose={handleSectionClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {sectionModalBody}
            </Modal>

            {/* Edit Section Modal **/}
            <Modal
                open={sectionNameEditOpen}

                onClose={handleSectionNameEditClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {sectionNameEditBody}
            </Modal>

            {/* New Video Modal **/}
            <Modal
                open={videoOpen}

                onClose={handleVideoClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {newVideoBody}
            </Modal>

            {/* Edit Video Modal **/}
            <Modal
                open={videoEditOpen}

                onClose={handleVideoEditClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {editVideoBody}
            </Modal>

            {/* add Video test Modal **/}
            <Modal
                open={videoTestAddOpen}

                onClose={handleVideoTestAddClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {videoTestAddBody}
            </Modal>

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
                            <Box sx={{
                                width: "100%",
                                aspectRatio: "16/9",
                                background: "#cccccc",
                                overflow: "hidden",
                                borderRadius: "1vw",
                                position: "relative", // 추가
                                '&:hover img': { // 이미지 어두워지는 효과 추가
                                    opacity: 0.5,
                                    transition: "opacity 0.3s"
                                }
                            }}
                                 onClick={() => {
                                     // inputRef를 사용하여 input 요소를 클릭하는 것처럼 트리거함
                                     inputRef.current.click();
                                 }}
                            >
                                <img loading={"lazy"} src={result && result.thumb} style={{width:"100%", height:"100%", top:"0", left:"0", objectFit:"cover",
                                    position: "absolute" // 추가된 부분
                                }} />
                                <input type="file"
                                       ref={inputRef} // useRef를 사용하여 input에 참조를 부여
                                       accept={"image/*"} hidden onChange={(e) => {
                                        updateLectureThumb(parseInt(params.value), e.target.files).then((res) => {
                                            // 강의정보 다시 로드
                                            getLectureInfo(params.value);
                                        })
                                }} />
                            </Box>
                        </Grid>
                    </Grid>
                    {/* 요약 오른쪽 **/}
                    <Grid container item xs={6}>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.8rem", fontWeight:"900", color:"#FFFFFF"}}>
                                {/* 강의명 **/}
                                {!editName && (
                                    <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.8rem", fontWeight:"900", color:"#FFFFFF"}}>
                                        {result && result.name}
                                    </Typography>
                                )}
                                {editName && (
                                    <TextField
                                        variant="standard"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{
                                            color: "#FFFFFF", // 글자색 변경
                                            "& .MuiInput-underline:before": {
                                                borderBottomColor: "#FFFFFF", // 기본 테두리색 변경
                                            },
                                            "& .MuiInput-underline:after": {
                                                borderBottomColor: "#FFFFFF", // 포커스 시 테두리색 변경
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "#FFFFFF", // 입력된 값의 글자색 변경
                                            },
                                            "& label.Mui-focused": {
                                                color: "#FFFFFF", // 포커스 시 라벨 색상 변경
                                            },
                                            "& label": {
                                                color: "#FFFFFF", // 라벨 색상 변경
                                            }
                                        }}
                                    />
                                )}


                                {editName && (
                                    <ClearIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditName(false)}} />
                                )}
                                {editName && (
                                    <CheckIcon sx={{color:"#FFFFFF"}} onClick={() => {
                                        updateLectureName(parseInt(params.value), name).then((res)=>{
                                            getLectureInfo(params.value); // 강의정보 다시 가져오기
                                                setEditName(false);  // 수정모드 끄기
                                        }
                                        )
                                    }} />
                                )}
                                {!editName && (
                                    <EditIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditName(true)}} />
                                )}


                            </Typography>
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
                            <span className={styles.font_lecture_info_normal}>&nbsp;의&nbsp;수강생&nbsp;|&nbsp;</span>
                            <FavoriteIcon
                                onClick={handleLikeClick}
                                sx={{
                                    color: liked ? 'error.main' : 'grey.A400',
                                    fontSize: '2.5rem',
                                    animation: liked ? `${heartBurst} 0.5s ease-out` : 'none', // liked 상태가 true일 때만 애니메이션 적용
                                    ml:"1rem"
                                }}
                            />
                            <span className={styles.font_lecture_info_bold}>{likedCount}</span> {/* 좋아요 갯수 */}
                        </Grid>
                        <Grid item xs={12}
                              sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}
                        >
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.5rem", fontWeight:"700", color:"#FFFFFF"}}>

                                {/* 가격 **/}
                                {!editPrice && (
                                    <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.5rem", fontWeight:"700", color:"#FFFFFF"}}>
                                    가격 : {result && result.price}원
                                    </Typography>
                                )}
                                {editPrice && (
                                    <TextField
                                        type="number"
                                        variant="standard"
                                        size="small"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        sx={{
                                            color: "#FFFFFF", // 글자색 변경
                                            "& .MuiInput-underline:before": {
                                                borderBottomColor: "#FFFFFF", // 기본 테두리색 변경
                                            },
                                            "& .MuiInput-underline:after": {
                                                borderBottomColor: "#FFFFFF", // 포커스 시 테두리색 변경
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "#FFFFFF", // 입력된 값의 글자색 변경
                                            },
                                            "& label.Mui-focused": {
                                                color: "#FFFFFF", // 포커스 시 라벨 색상 변경
                                            },
                                            "& label": {
                                                color: "#FFFFFF", // 라벨 색상 변경
                                            }
                                        }}
                                    />
                                )}


                                {editPrice && (
                                    <ClearIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditPrice(false)}} />
                                )}
                                {editPrice && (
                                    <CheckIcon sx={{color:"#FFFFFF"}} onClick={() => {
                                        updateLecturePrice(parseInt(params.value), price).then((res)=>{
                                                getLectureInfo(params.value); // 강의정보 다시 가져오기
                                                setEditPrice(false);  // 수정모드 끄기
                                            }
                                        )
                                    }} />
                                )}
                                {!editPrice && (
                                    <EditIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditPrice(true)}} />
                                )}


                            </Typography>


                        </Grid>
                        <Grid item xs={12}
                              display="flex"
                              justifyContent="left"
                              alignItems="center"
                        >
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.5rem", fontWeight:"700", color:"#FFFFFF"}}>
                                {/* 난이도 **/}
                                {!editGrade && (
                                    <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", fontSize:"1.5rem", fontWeight:"700", color:"#FFFFFF"}}>
                                        난이도 : {result && result.grade}학년
                                    </Typography>
                                )}
                                {editGrade && (
                                    <TextField
                                        type="number"
                                        variant="standard"
                                        size="small"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        sx={{
                                            color: "#FFFFFF", // 글자색 변경
                                            "& .MuiInput-underline:before": {
                                                borderBottomColor: "#FFFFFF", // 기본 테두리색 변경
                                            },
                                            "& .MuiInput-underline:after": {
                                                borderBottomColor: "#FFFFFF", // 포커스 시 테두리색 변경
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "#FFFFFF", // 입력된 값의 글자색 변경
                                            },
                                            "& label.Mui-focused": {
                                                color: "#FFFFFF", // 포커스 시 라벨 색상 변경
                                            },
                                            "& label": {
                                                color: "#FFFFFF", // 라벨 색상 변경
                                            }
                                        }}
                                    />
                                )}


                                {editGrade && (
                                    <ClearIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditGrade(false)}} />
                                )}
                                {editGrade && (
                                    <CheckIcon sx={{color:"#FFFFFF"}} onClick={() => {
                                        updateLectureGrade(parseInt(params.value), grade).then((res)=>{
                                                getLectureInfo(params.value); // 강의정보 다시 가져오기
                                                setEditGrade(false);  // 수정모드 끄기
                                            }
                                        )
                                    }} />
                                )}
                                {!editGrade && (
                                    <EditIcon sx={{color:"#FFFFFF"}} onClick={() => {setEditGrade(true)}} />
                                )}


                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sx={{m:0, p:0}}>
                        {/* 수강신청하기 버튼 **/}
                        <Grid item
                              sx={{pt:5, pr:3, mx:0, display:"flex", justifyContent:"flex-start", alignItems:"center"}}
                              xs={6}>
                            <Button display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{ borderRadius: '1vw',
                                     width:"100%", height:"3vw",
                                     '&:hover': {
                                         backgroundColor: "#FFD700"  // 마우스 오버 시 변경될 배경색
                                     },
                                     '&:active': {
                                         backgroundColor: "#FFC300"  // 클릭 시 변경될 배경색
                                     },
                                     m:0,
                                     border:0,
                                     background: "#FFE600"}}
                                 onClick={() => {
                                     // 강의삭제
                                     updateLectureState(parseInt(params.value), 2).then((res) => {
                                             getLectureInfo(params.value); // 강의정보 다시 가져오기
                                         }
                                     )
                                 }}
                            >
                                <p className={styles.font_sugang}>
                                    강의삭제하기
                                </p>
                            </Button>
                        </Grid>
                        {/* 질문하기 버튼 **/}
                        <Grid item
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{pt:5, pl:3, mx:0, display:"flex", justifyContent:"flex-start", alignItems:"center"}}
                              xs={6}>
                            <Button display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                    onClick={() => {
                                        // 강의 상태 변경
                                        if(result && result.state === 0){
                                            updateLectureState(parseInt(params.value), 1).then((res)=>{
                                                    getLectureInfo(params.value); // 강의정보 다시 가져오기
                                                }
                                            )
                                        }else{
                                            updateLectureState(parseInt(params.value), 0).then((res)=>{
                                                    getLectureInfo(params.value); // 강의정보 다시 가져오기
                                                }
                                            )
                                        }
                                    }}
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
                                    {result && result.state === 0 && (
                                        "강의오픈하기"
                                    )}
                                    {result && result.state === 1 && (
                                        "강의닫기"
                                    )}
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
                        커리큘럼
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
                                <Accordion expanded={expanded[idx]} >
                                    <AccordionSummary sx={{height:'3vw', backgroundColor:'#D9D9D9'}} expandIcon={<ExpandMoreIcon />} onClick={() => chgExpanded(idx)}>
                                        <span className={styles.font_curriculum_title}>{item.name}</span>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container sx={{width:"100%", mb:"0.8rem"}} >
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    delSection(item.id).then((res) => {
                                                        getSectionInfo(params.value); // Section 정보 다시 불러옴
                                                    })
                                                }}
                                                sx={{
                                                    backgroundColor: "#1B65FF",
                                                    mr:2,
                                                    '&:hover': {
                                                        backgroundColor: "#145bd1",  // 약간 어둡게 설정
                                                    },
                                                    color: "#FFFFFF",               // 텍스트 색상을 흰색으로
                                                    boxShadow: '0 3px 5px 2px rgba(27, 101, 255, .3)', // 버튼의 그림자 효과
                                                    borderRadius: '4px',           // 버튼 모서리 둥글게
                                                    fontWeight: 'bold',            // 글씨 굵게
                                                }}
                                            >
                                                Section삭제
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setSectionId(item.id);
                                                    handleSectionNameEditOpen();
                                                }}
                                                sx={{
                                                    backgroundColor: "#1B65FF",
                                                    mr:2,
                                                    '&:hover': {
                                                        backgroundColor: "#145bd1",  // 약간 어둡게 설정
                                                    },
                                                    color: "#FFFFFF",               // 텍스트 색상을 흰색으로
                                                    boxShadow: '0 3px 5px 2px rgba(27, 101, 255, .3)', // 버튼의 그림자 효과
                                                    borderRadius: '4px',           // 버튼 모서리 둥글게
                                                    fontWeight: 'bold',            // 글씨 굵게
                                                }}
                                            >
                                                Section명수정
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setSectionId(item.id);
                                                    handleVideoOpen(); // 영상추가 modal open
                                                }}
                                                sx={{
                                                    backgroundColor: "#1B65FF",
                                                    mr:2,
                                                    '&:hover': {
                                                        backgroundColor: "#145bd1",  // 약간 어둡게 설정
                                                    },
                                                    color: "#FFFFFF",               // 텍스트 색상을 흰색으로
                                                    boxShadow: '0 3px 5px 2px rgba(27, 101, 255, .3)', // 버튼의 그림자 효과
                                                    borderRadius: '4px',           // 버튼 모서리 둥글게
                                                    fontWeight: 'bold',            // 글씨 굵게
                                                }}
                                            >
                                                영상추가
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    upSection(item.id).then((res) => {
                                                        getSectionInfo(params.value); // Section 정보 다시 불러옴
                                                        closeExpanded(); // 아코디언 모두 닫기
                                                    })
                                                }}
                                                sx={{
                                                    backgroundColor: "#1B65FF",
                                                    mr:2,
                                                    '&:hover': {
                                                        backgroundColor: "#145bd1",  // 약간 어둡게 설정
                                                    },
                                                    color: "#FFFFFF",               // 텍스트 색상을 흰색으로
                                                    boxShadow: '0 3px 5px 2px rgba(27, 101, 255, .3)', // 버튼의 그림자 효과
                                                    borderRadius: '4px',           // 버튼 모서리 둥글게
                                                    fontWeight: 'bold',            // 글씨 굵게
                                                }}
                                            >
                                                위로이동
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    downSection(item.id).then((res) => {
                                                        getSectionInfo(params.value); // Section 정보 다시 불러옴
                                                        closeExpanded(); // 아코디언 모두 닫기
                                                    })
                                                }}
                                                sx={{
                                                    backgroundColor: "#1B65FF",
                                                    '&:hover': {
                                                        backgroundColor: "#145bd1",  // 약간 어둡게 설정
                                                    },
                                                    color: "#FFFFFF",               // 텍스트 색상을 흰색으로
                                                    boxShadow: '0 3px 5px 2px rgba(27, 101, 255, .3)', // 버튼의 그림자 효과
                                                    borderRadius: '4px',           // 버튼 모서리 둥글게
                                                    fontWeight: 'bold',            // 글씨 굵게
                                                }}
                                            >
                                                아래로이동
                                            </Button>
                                        </Grid>
                                        <Grid container sx={{width:"100%", mb:"0.8rem",
                                            display:"flex", justifyContent:"flex-start", alignItems:"center"
                                        }} >
                                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                소요시간 :
                                            </Typography>
                                            {editTimetaken[idx] && (
                                                <TextField type={"number"} variant={"standard"} value={newTimeTaken} onChange={(e) => setNewTimeTaken(e.target.value)} />
                                            )}
                                            {!editTimetaken[idx] && (
                                                <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>{item.timeTaken}</Typography>
                                            )}
                                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>주
                                                {!editTimetaken[idx] && (
                                                    <EditIcon
                                                        onClick={() => {
                                                            // 클릭시 해당 idx의 editTimetaken을 true로 변경
                                                            let array = JSON.parse(JSON.stringify(editTimetaken)); // 깊은 복사
                                                            array[idx] = true;
                                                            setEditTimetaken(array);
                                                            setNewTimeTaken(item.timeTaken); // newTimetaken를 기존의 timeTaken으로 초기화
                                                        }}
                                                    />
                                                )}
                                                {editTimetaken[idx] && (
                                                    <ClearIcon
                                                        onClick={() => {
                                                            // 클릭시 해당 idx의 editTimetaken을 true로 변경
                                                            let array = JSON.parse(JSON.stringify(editTimetaken)); // 깊은 복사
                                                            array[idx] = false;
                                                            setEditTimetaken(array);
                                                        }}
                                                    />
                                                )}
                                                {editTimetaken[idx] && (
                                                    <CheckIcon
                                                        onClick={() => {
                                                            editSectionTimeTaken(item.id, newTimeTaken).then((res) => {
                                                                getSectionInfo(params.value); // Section 정보 다시 불러옴
                                                            }
                                                            )
                                                        }}
                                                    />
                                                )}

                                            </Typography>
                                        </Grid>
                                    {item.videoDTOList && item.videoDTOList.map((subItem, subIdx) => {
                                        return(

                                                <Grid item container sx={{width:"100%"}}>
                                                    <Grid item xs={4} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                                        <div style={{display: 'flex', alignItems: 'center', flexGrow: 1, width:"60%"}}>
                                                            <Box position="relative" sx={{width:"100px", aspectRatio:"16/9", overflow:"hidden"}}>
                                                                <img loading={"lazy"} src={subItem.thumb} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                                                            </Box>
                                                            <span className={styles.font_curriculum_content}>{subItem.name}</span>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={8} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                // 해당하는 video의 test list를 가져옴
                                                                getVideoTestList(subItem.id, idx, subIdx).then((res) => {
                                                                    // 문제수정 collpase open
                                                                    let array = JSON.parse(JSON.stringify(videoTestCollapse)); // 깊은 복사
                                                                    array[idx][subIdx] = !array[idx][subIdx];
                                                                    setVideoTestCollapse(array);
                                                                })
                                                            }}
                                                            startIcon={<EditIcon sx={{ color: "#FFFFFF" }} />} // 아이콘의 색상을 흰색으로 설정
                                                            sx={{
                                                                background: '#2196f3', // 파란색 계열의 배경색
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
                                                                height: '40px', // 높이 설정
                                                                '&:hover': {
                                                                    background: "#1976d2", // 호버 시 더 어두운 파란색
                                                                }
                                                            }}
                                                        >
                                                            <Typography noWrap sx={{ color: "#FFFFFF" }}>문제수정</Typography>
                                                        </Button>

                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                ml:3,
                                                                background: '#4caf50', // Greenish color for upwards movement
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                                width:"40px",
                                                                height: '40px',
                                                                '&:hover': {
                                                                    background: "#388e3c", // Darker green on hover
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                // 위로 이동하는 로직
                                                                upVideo(subItem.id).then((res) => {
                                                                    // 기존의 section 확장 배열을 기억
                                                                    let array = JSON.parse(JSON.stringify(expanded)); // 깊은 복사
                                                                    getSectionInfo(params.value).then((res) => {
                                                                        // section 정보 다시 불러온 뒤 section 아코디언 다시 확장
                                                                        setExpanded(array);
                                                                    })
                                                                })
                                                            }}
                                                        ><ArrowUpwardIcon sx={{ color: "#FFFFFF" }} /></Button>

                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                ml:1,
                                                                background: '#4caf50', // Greenish color for upwards movement
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                                width:"40px",
                                                                height: '40px',
                                                                '&:hover': {
                                                                    background: "#388e3c", // Darker green on hover
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                // 아래로 이동하는 로직
                                                                downVideo(subItem.id).then((res) => {
                                                                    // 기존의 section 확장 배열을 기억
                                                                    let array = JSON.parse(JSON.stringify(expanded)); // 깊은 복사
                                                                    getSectionInfo(params.value).then((res) => {
                                                                        // section 정보 다시 불러온 뒤 section 아코디언 다시 확장
                                                                        setExpanded(array);
                                                                    })
                                                                })
                                                            }}
                                                        ><ArrowDownwardIcon sx={{ color: "#FFFFFF" }} /></Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                // 해당 Video의 정보를 가져옴
                                                                getVideoInfo(subItem.id).then((res) => {
                                                                    handleVideoEditOpen(); // Video 수정용 Modal open
                                                                })
                                                            }}
                                                            startIcon={<EditIcon sx={{ color: "#FFFFFF" }} />} // 아이콘의 색상을 흰색으로 설정
                                                            sx={{
                                                                ml:1,
                                                                background: '#ffa726',
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
                                                                height: '40px', // 높이 설정
                                                                '&:hover': {
                                                                    background: "#ff8f00",
                                                                }
                                                            }}
                                                        >
                                                            <Typography sx={{ color: "#FFFFFF" }}>수정</Typography>
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => {
                                                                delVideo(subItem.id).then((res) => {
                                                                    // 기존의 section 확장 배열을 기억
                                                                    let array = JSON.parse(JSON.stringify(expanded)); // 깊은 복사
                                                                    getSectionInfo(params.value).then((res) => {
                                                                        // section 정보 다시 불러온 뒤 section 아코디언 다시 확장
                                                                        setExpanded(array);
                                                                    })
                                                                })
                                                            }}
                                                            sx={{
                                                                ml:1,
                                                                background: '#e53935',
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 그림자 추가
                                                                height: '40px', // 높이 설정
                                                                '&:hover': {
                                                                    background: "#b71c1c",
                                                                }
                                                            }}
                                                        >
                                                            <Typography sx={{ color: "#FFFFFF" }}>삭제</Typography>
                                                        </Button>
                                                    </Grid>
                                                    {/* videoTest Collpase **/}
                                                        <Collapse in={videoTestCollapse[idx][subIdx]} sx={{ width: '100%' }}>
                                                            <Grid container item xs={12} sx={{px:"2rem", py:"2rem", display: "flex", width: '100%'}}>
                                                                {/* video test list **/}
                                                                {subItem.videoTestDTOList && subItem.videoTestDTOList.map((testItem, testIdx) => {
                                                                    return(
                                                                        <Grid item container xs={12}>
                                                                            {/* 문제 title **/}
                                                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                                                <Typography>
                                                                                    제목 : {testItem.title}
                                                                                </Typography>
                                                                            </Grid>
                                                                            {/* 노출시간 **/}
                                                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                                                <Typography>
                                                                                    노출시간 : {testItem.testTime}
                                                                                </Typography>
                                                                            </Grid>
                                                                            {/* 문제타입 **/}
                                                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                                                <Typography>
                                                                                    문제타입 : {testItem.type === 0 ? "객관식" : "코드블럭"}
                                                                                </Typography>
                                                                            </Grid>
                                                                            {/* 객관식인 경우의 보기 **/}
                                                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                                                <Typography>{testItem.type === 0 ? "보기" : "블럭목록"}</Typography>
                                                                                {testItem.type === 0 && testItem.videoTestMultipleListDTOs.map((multipleItem, multipleIdx) => {
                                                                                            return(
                                                                                                <Typography id={`multipleTypography${multipleItem.id}`}>
                                                                                                    {multipleItem.sequence} : {multipleItem.content}
                                                                                                </Typography>
                                                                                            )
                                                                                        })
                                                                                }
                                                                                {testItem.type === 1 && testItem.blockResponseDTOList.map((blockItem, blockIdx) => {
                                                                                    return(
                                                                                        <Box
                                                                                            sx={{
                                                                                                padding: 2, // 내부 여백
                                                                                                margin: 1, // 외부 여백
                                                                                                backgroundColor: '#f5f5f5', // 배경색
                                                                                                borderRadius: '10px', // 모서리 둥글게
                                                                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 효과
                                                                                                maxWidth: 300, // 최대 너비
                                                                                                textAlign: 'center' // 텍스트 중앙 정렬
                                                                                            }}
                                                                                        >
                                                                                            <Typography variant="h6" color="textPrimary">
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )
                                                                                })

                                                                                }
                                                                            </Grid>
                                                                            {/* 답 **/}
                                                                            <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                                                <Typography id={"testAnswer_" + testItem.testAnswerDTO.id} >
                                                                                    답 : {testItem.testAnswerDTO.answer}
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                }
                                                                )}
                                                                <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
                                                                    {/* 여기에 들어갈 버튼 만들어 줘 **/}
                                                                    <Button
                                                                        variant="contained"
                                                                        startIcon={<AddIcon sx={{ color: "#FFFFFF" }} />}
                                                                        sx={{
                                                                            background: '#4caf50',
                                                                            borderRadius: '10px',
                                                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                                            '&:hover': {
                                                                                background: "#388e3c",
                                                                            }
                                                                        }}
                                                                        onClick={() => {
                                                                            // video id를 state에 올림
                                                                            setVideoId(subItem.id);
                                                                            // video test 추가 modal open
                                                                            handleVideoTestAddOpen();
                                                                        }}
                                                                    >
                                                                        <Typography sx={{ color: "#FFFFFF" }}>문제 추가</Typography>
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Collapse>
                                                </Grid>


                                        )
                                    }) }
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </Container>
                </Grid>
                <Grid item xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{px:{xs:"3vw", md:"10vw", lg:"20vw"}, mt:"3rem"}}
                >
                    <Button
                        sx={{
                            width:"50%",
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
                        onClick={(e) => handleSectionOpen()}
                    >
                        Section 추가하기
                    </Button>
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
                                                                    <IconButton onClick={() => {
                                                                        // 삭제 후 답변 목록 다시 불러옴
                                                                        deleteAnswer(subItem.id).then((res) => {
                                                                            getAnswerList(item.qnaId, idx).catch((err) => alert("답변 목록 다시 불러오기 실패"))
                                                                        }).catch((err) => alert("답변 삭제 실패"))
                                                                        }}
                                                                    >
                                                                        <CloseIcon />
                                                                    </IconButton>
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
                                                                        {item.content}
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
                {/* 수강평 **/}
                <Grid container item xs={12} sx={{px:'20%', pt:0, mt:0}}>
                    <Grid item xs={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="flex-end"
                          sx={{pt:'7vw'}}
                    >
                        <Typography sx={{fontWeight:"900", fontSize:"2.5rem", display:"flex", alignItems:"flex-end"}}>수강평&nbsp;</Typography>
                        <Typography sx={{fontWeight:"900", fontSize:"1.5rem", color:"#8D8D8D", display:"flex", alignItems:"flex-end"}}>총 {result && result.totalReview}개</Typography>
                    </Grid>
                    <Grid item xs={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                          sx={{pb:'7vw', mt:'1rem'}}
                    >
                        {result && result.score > 0 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                        {result && result.score > 1 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                        {result && result.score > 2 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                        {result && result.score > 3 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}
                        {result && result.score > 4 && (<StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>)}

                        <span className={styles.font_review_score}>({result && result.score})</span>
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
                        {/* items **/}
                        {review && review.map((item, idx) => {
                            return(
                                <Grid container item xs={12} sx={{mt:1}}>
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
                                        justifyContent="space-between"
                                        alignItems="center"
                                        xs={11}
                                    >
                                        <Box>
                                            <Box
                                                display="flex"
                                                justifyContent="flex-start"
                                                alignItems="flex-end"
                                            >
                                                {item.rating > 0 && <StarIcon sx={{ color: '#FFE600', fontSize: '1.5rem' }}/>}
                                                {item.rating > 1 && <StarIcon sx={{ color: '#FFE600', fontSize: '1.5rem' }}/>}
                                                {item.rating > 2 && <StarIcon sx={{ color: '#FFE600', fontSize: '1.5rem' }}/>}
                                                {item.rating > 3 && <StarIcon sx={{ color: '#FFE600', fontSize: '1.5rem' }}/>}
                                                {item.rating > 4 && <StarIcon sx={{ color: '#FFE600', fontSize: '1.5rem' }}/>}

                                            </Box>
                                            <Box
                                                display="flex"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                                sx={{pl:0}}
                                            >
                                                {/* 추후 클릭시 해당 멤버 페이지로 이동하도록 함 **/}
                                                <span className={styles.font_review_nickname}>{item.nickname}</span>
                                            </Box>
                                        </Box>
                                        {!item.listCommentResponseDTO && (
                                            <Box
                                                display="flex"
                                                justifyContent="flex-start"
                                                alignItems="flex-end"
                                            >

                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        console.log("reviewId : " + item.id + " 답변작성 collapse toggle"); // 리뷰아이디
                                                        // 해당하는 index의 collpase 열기
                                                        handleReviewCollapseToggle(idx);
                                                    }}
                                                    startIcon={<AddCommentIcon/>}
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
                                                    {/* 답변 toggle이 열려있으면 답변작성, 아니면 답변닫기 출력 **/}
                                                    {reviewCollapse[idx] ? "답변닫기" : "답변작성"}
                                                </Button>
                                            </Box>
                                        )}

                                    </Grid>
                                    <Grid item
                                          display="flex"
                                          justifyContent="flex-start"
                                          alignItems="center"
                                          xs={12} sx={{mt:3}}>
                                <span className={styles.font_review_content}>
                                    {item.content}
                                </span>
                                    </Grid>
                                    <Grid item
                                          display="flex"
                                          justifyContent="flex-start"
                                          alignItems="center"
                                          xs={12} sx={{mt:3}}>
                                <span className={styles.font_review_date}>
                                    {dayjs(item.createdDay).format('YYYY년MM월DD일 HH시mm분ss초')} ♥{item.heart}
                                </span>
                                        <br/>
                                    </Grid>
                                    {/* 답변작성용 collapse **/}
                                    <Collapse in={reviewCollapse[idx]} sx={{ width: '100%', mt:"1rem"}}>
                                        <Grid
                                            container
                                            sx={{
                                                width:"100%",
                                                display:"flex",
                                                justifyContent:"flex-end"
                                            }}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{display:"flex", justifyContent:"flex-end"}}
                                            >
                                                <TextField
                                                    id={"reviewCommentTextField" + item.id}
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
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{display:"flex", justifyContent:"flex-end", mt:"1rem"}}
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        console.log(`${item.id} 리뷰에 답변작성`);
                                                        addReviewComment(item.id, document.getElementById("reviewCommentTextField" + item.id).value).then((res) => {
                                                            // 성공 시 리뷰 리스트 1페이지부터 현재 페이지까지 다시 불러옴
                                                            for(let i = 0 ; i < reviewPage + 1 ; i++){
                                                                getReviewList(params.value, i).catch((err) => alert("리뷰 목록 다시 불러오기 실패"))
                                                            }
                                                        }
                                                        ).catch((err) => alert("답변작성에 실패했습니다."))
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
                                            </Grid>
                                        </Grid>
                                        {/* 작성완료버튼 **/}
                                    </Collapse>


                                    {item.listCommentResponseDTO && (
                                        <Grid xs={12} item sx={{width:"100%", display:"flex", justifyContent:"flex-end", alignItems:"center", mt:"1.5rem"}}>
                                            <Box
                                                sx={{
                                                    width:"80%",
                                                    position: 'relative',
                                                    backgroundColor: 'grey.300',
                                                    borderRadius: '4px',
                                                    padding: '8px',
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // 사각형 그림자
                                                    '&:before': { // 가짜 삼각형
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 10,
                                                        left: '30px',
                                                        width: 0,
                                                        height: 0,
                                                        border: '10px solid transparent',
                                                        borderBottomColor: 'grey.300',
                                                        borderTop: '0',
                                                        marginLeft: '-10px',
                                                        marginTop: '-20px',
                                                    },
                                                    '&:after': { // 가짜 삼각형 그림자
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 10,
                                                        left: '30px',
                                                        width: 0,
                                                        height: 0,
                                                        border: '10px solid transparent',
                                                        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
                                                        borderTop: '0',
                                                        marginLeft: '-10px',
                                                        marginTop: '-20px',
                                                        zIndex: -1, // 사각형 뒤로 보내기
                                                        filter: 'blur(3px)', // 부드러운 그림자 효과
                                                    }
                                                }}
                                            >
                                                <Grid container sx={{width:"100%", pb:"1rem", px:"1rem"}}>
                                                    {/* 날짜 **/}
                                                    <Grid item xs={12} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                                        <Typography sx={{fontSize:"0.8rem", color:"#8D8D8D"}}>{dayjs(item.listCommentResponseDTO.commentDay).format("YYYY년 MM월 DD일 HH:mm:ss")}</Typography>
                                                        {/* x아이콘 추가 **/}
                                                        <IconButton onClick={() => {
                                                            // 삭제 후 리뷰 목록 다시 불러옴
                                                            delReviewComment(item.listCommentResponseDTO.id).then((res) => {
                                                                for(let i = 0 ; i < reviewPage + 1 ; i++){
                                                                    getReviewList(params.value, i).catch((err) => alert("리뷰 목록 다시 불러오기 실패"))
                                                                }
                                                            }
                                                            ).catch((err) => alert("답변 삭제에 실패했습니다."))
                                                        }}>
                                                            <CloseIcon sx={{fontSize:"1rem"}}/>
                                                        </IconButton>
                                                    </Grid>
                                                    {/* 강사프로필이미지 + 강사명 **/}
                                                    <Grid item xs={12} sx={{display:"flex", alignItems:"center", mt:"1rem"}}>
                                                        <Box sx={{width:"50px", aspectRatio:"1/1", borderRadius:"50%", overflow:"hidden", display:"inline-block", mr:"0.5rem"}}>
                                                            <img src={item.listCommentResponseDTO.profileImg} alt="강사프로필이미지" style={{width:"100%", height:"100%", objectFit:"cover"}} />
                                                        </Box>
                                                        <Typography sx={{fontSize:"1rem", fontWeight:"700", display:"inline"}}>
                                                            {item.listCommentResponseDTO.nickname}
                                                        </Typography>
                                                    </Grid>
                                                    {/*내용**/}
                                                    <Grid item xs={12} sx={{display:'flex', alignItems:'center', mt:"1rem"}}>
                                                        <Typography sx={{fontSize:"1rem"}}>
                                                            {item.listCommentResponseDTO.content}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    )}
                                    <Grid item
                                          xs={12} sx={{mt:3, mb:1}}>
                                        <Divider fullWidth/>
                                        <br/>
                                    </Grid>
                                </Grid>
                            )
                        })}

                    </Grid>
                    <Grid xs={12} item sx={{mt:'1vw', mb:'7vw'}}>
                        {more === true && (
                            <Button variant="outlined" fullWidth sx={{borderColor:'#000000', borderRadius:'10px'}}
                                    onClick={() => {
                                        // 다음페이지 로드
                                        getReviewList(params.value, reviewPage+1).then((res) => {
                                            setReviewPage(reviewPage+1);
                                        });
                                    }
                            }
                            >
                                <span className={styles.font_review_more}>수강평 더보기</span>
                            </Button>
                        )}

                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );

}

export default TeacherLectureInfo;