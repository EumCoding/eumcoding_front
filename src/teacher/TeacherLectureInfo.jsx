import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    createTheme,
    Divider, FormControlLabel,
    Grid, Modal, Radio, RadioGroup, TextField,
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
import CheckIcon from '@mui/icons-material/Check'; // 확인 아이콘
import ClearIcon from '@mui/icons-material/Clear'; // 취소 아이콘
import AddCircleIcon from '@mui/icons-material/AddCircle'; // 증가
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

// 강사 side의 강의 정보를 표시하고 수정합니다.
function TeacherLectureInfo(props) {
    const [newSectionName, setNewSectionName] = useState(""); // 새로운 Section 이름

    const navigate = useNavigate();

    const accessToken = useSelector((state) => state.accessToken);

    const params = useParams();

    const [result, setResult] = useState(null); // 1번 정보(첫번째 호출하는 api에서 주는 정보) 넣기

    const [teacher, setTeacher] = useState(null); // 강사 정보 넣을곳

    const [section, setSection] = useState(null);

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

    // Video 추가용 state들
    const [videoName, setVideoName] = useState(""); // Video 이름
    const [videoFile, setVideoFile] = useState(null); // Video 파일
    const [videoDescription, setVideoDescription] = useState(""); // Video 설명
    const [videoThumb, setVideoThumb] = useState(null); // Video 썸네일
    const [preview, setPreview] = useState(0); // video 미리보기 가능 여부... 0:false 1:true

    // Video 수정용 modal
    const [videoEditOpen, setVideoEditOpen] = useState(false);

    // section 수정용 sectionId
    const [sectionId, setSectionId] = useState(0);

    // 아코디언의 확장 상태 관리
    const [expanded, setExpanded] = useState([]);

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
                        <FormControlLabel checked={preview === 1} value={1} control={<Radio />} label="가능" onChange={(e) => setPreview(e.target.value)}/>
                        <FormControlLabel checked={preview === 0} value={0} control={<Radio />} label="불가능" onChange={(e) => setPreview(e.target.value)}/>
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
                            onChange={(e) => setVideoFile(e.target.files)}
                        />
                    </Button>
                </Grid>
            </Grid>
            <Box mt={2}>
                <Button color="primary"
                        onClick={() => {
                            if(videoName !== "" && videoDescription !== "" && videoThumb !== null && videoFile !== null){
                                addVideo(sectionId, videoName, videoDescription, videoThumb, videoFile).then((res) => {
                                    getSectionInfo(params.value); // Section 정보 다시 불러옴
                                    setVideoName(""); // 입력값 초기화
                                    setVideoDescription(""); // 입력값 초기화
                                    setVideoThumb(null); // 입력값 초기화
                                    setVideoFile(null); // 입력값 초기화
                                    handleVideoClose(); // 완료시 닫음
                                })
                            }
                        }}
                >확인</Button>
                <Button onClick={handleVideoClose} color="secondary" sx={{ ml: 1 }}>취소</Button>
            </Box>
        </Box>
    );


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
            res.data && setSection(res.data);
            // Section의 갯수만큼 expanded에 false 넣기
            const array = new Array(res.data.length).fill(false); // 배열생성
            setExpanded(array); // expanded state에 할당
            setEditTimetaken(array) // editTimetaken state 에 할당
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

    // 영상추가
    const addVideo = async(sectionId, name, description, thumb, video) => {
        const fd = new FormData();
        fd.append("sectionId", sectionId);
        fd.append("name", name);
        fd.append("description", description);
        fd.append("preview", parseInt(preview)); // preview여부
        Object.values(thumb).forEach((file) => {
            fd.append("thumb", file);
        }); // 파일 임포트
        Object.values(video).forEach((file) => {
            fd.append("video", file);
        }); // 파일 임포트
        const response = await axios.post(
            `http://localhost:8099/lecture/video/add`,
            fd,
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
                {sectionNameEditBody}
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
                            <span className={styles.font_lecture_info_normal}>&nbsp;의&nbsp;수강생</span>
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
                                    {item.videoDTOList && item.videoDTOList.map((subItem, idx) => {
                                        return(

                                                <Grid item container sx={{width:"100%"}}>
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

export default TeacherLectureInfo;