import React, {useRef, useState} from 'react';
import {Button, createTheme, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import DashTop from "../component/DashTop";
import styles from "../student/css/DashBoard.module.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function NewLecture(props) {
    const accessToken = useSelector((state) => state.accessToken); // accessToken
    const role = useSelector((state) => state.role); // role

    const navigate = useNavigate();

    const thumbInput = useRef(null);
    const handleThumbClick = () => {
        thumbInput.current.click();
    };
    const imageInput = useRef(null);
    const handleImageClick = () => {
        imageInput.current.click();
    };

    // 입력할 내용들

    const [name, setName] = useState(""); // 강의명
    const [thumb, setThumb] = useState(null); // 썸네일
    const [image, setImage] = useState(null); // 강의이미지
    const [badge, setBadge] = useState(null); // 뱃지이미지
    const [description, setDescription] = useState(""); // 강의설명
    const [grade, setGrade] = useState(0); // 학년
    const [price, setPrice] = useState(0); // 가격


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    // 강의 생성 api 호출
    const createLecture = async () => {
        try{
            const fd = new FormData();
            Object.values(badge).forEach((file) => {
                fd.append('badge', file);
            }); // 파일 임포트
            Object.values(image).forEach((file) => {
                fd.append('image', file);
            }); // 파일 임포트
            Object.values(thumb).forEach((file) => {
                fd.append('thumb', file);
            }); // 파일 임포트
            fd.append('name', name);
            fd.append('price', price);
            fd.append('description', description);
            fd.append('grade', grade);

            const response = await axios.post(
                `http://localhost:8099/lecture/create`,
                fd,
                {
                    headers:{
                        'Content-Type':`multipart/form-data`,
                        Authorization: `${accessToken}`,
                    },
                }
            )

            navigate("/teacher/dashboard");
        }catch (e) {
            console.log(e)
            alert("오류가 발생했어요. 나중에 다시 시도해주세요.")
        }
    }


    return (
        <ThemeProvider theme={theme}>
            {/* 상단바 **/}
            <DashTop/>
            <Grid container sx={{px:{xs:"5%", sm:"10%", md:"10%", lg:"20%", width:"100%"}}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Grid item container xs={12}>
                    <Grid xs={12} item sx={{mb:"3rem", mt:"3rem"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography sx={{color:"#000000", fontWeight:"900", fontSize:"2rem"}}>
                            강의등록
                        </Typography>
                    </Grid>
                    {/* 강의명 **/}
                    <Grid xs={12} item container sx={{mb:"1rem"}}>
                        <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >강의명</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                value={name}
                                required
                                id="title"
                                name="title"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '40px',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        padding: '10px 14px',
                                    },
                                }}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </TextField>
                        </Grid>
                    </Grid>
                    {/* 썸네일 **/}
                    <Grid item container xs={12} sx={{mb:"1rem"}}>
                        <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >썸네일</Typography>
                        </Grid>
                        <Grid item xs={9}>
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
                                <Typography sx={{ color: "#FFFFFF" }}>이미지등록</Typography>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setThumb(e.target.files)}
                                />
                            </Button>
                        </Grid>
                        {thumb && (
                            <Grid item container xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mt:"1rem"}}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={9}>
                                    <div style={{width:"100%", height:"auto", overflow:"hidden"}} >
                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={thumb ? URL.createObjectURL(thumb[0]) : ""} />
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    {/* 뱃지 **/}
                    <Grid item container xs={12} sx={{mb:"1rem"}}>
                        <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >뱃지</Typography>
                        </Grid>
                        <Grid item xs={9}>
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
                                <Typography sx={{ color: "#FFFFFF" }}>이미지등록</Typography>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setBadge(e.target.files)}
                                />
                            </Button>
                        </Grid>
                        {badge && (
                            <Grid item container xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mt:"1rem"}}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={9}>
                                    <div style={{width:"100%", height:"auto", overflow:"hidden"}} >
                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={badge ? URL.createObjectURL(badge[0]) : ""} />
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    {/*설명이미지**/}
                    <Grid item container xs={12} sx={{mb:"1rem"}}>
                        <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >설명이미지</Typography>
                        </Grid>
                        <Grid item xs={9}>
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
                                <Typography sx={{ color: "#FFFFFF" }}>이미지등록</Typography>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setImage(e.target.files)}
                                />
                            </Button>
                        </Grid>
                        {image && (
                            <Grid item container xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mt:"1rem"}}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={9} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <div style={{width:"100%", height:"auto", overflow:"hidden"}} >
                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={image ? URL.createObjectURL(image[0]) : ""} />
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {/* 강의 설명 **/}
                <Grid xs={12} item container sx={{mb:"1rem"}}>
                    <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >강의설명</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            value={description}
                            required
                            id="description"
                            name="description"
                            variant="outlined"
                            multiline
                            rows={10}
                            fullWidth
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                {/* 가격 **/}
                <Grid xs={12} item container sx={{mb:"1rem"}}>
                    <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >가격(원)</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            value={price}
                            required
                            id="price"
                            name="price"
                            variant="outlined"
                            type={"number"}
                            fullWidth
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '40px',
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '10px 14px',
                                },
                            }}
                            onChange={(e) => setPrice(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                {/* 추천학년 **/}
                <Grid xs={12} item container sx={{mb:"1rem"}}>
                    <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography sx={{color:"#000000", fontWeight:"700", fontSize:"1rem"}} >추천학년</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            value={grade}
                            required
                            id="grade"
                            name="grade"
                            variant="outlined"
                            type={"number"}
                            fullWidth
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '40px',
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '10px 14px',
                                },
                            }}
                            onChange={(e) => setGrade(e.target.value)}
                        >
                        </TextField>
                    </Grid>
                </Grid>
                {/* 취소 확인 **/}
                <Grid xs={12} item container sx={{mb:"1rem"}} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button
                        sx={{
                            background: '#white',
                            borderRadius: '10px',
                            border: '1px solid red', // 이 부분을 추가
                            '&:hover': {
                                background: "pink",
                            }
                        }}
                    >
                        <Typography sx={{ color: "red" }}>취소</Typography>
                    </Button>
                    <Button
                        sx={{
                            background: '#0B401D',
                            borderRadius: '10px',
                            '&:hover': {
                                background: "green",
                            },
                            ml:"1rem"
                        }}
                        onClick={() => createLecture()}
                    >
                        <Typography sx={{ color: "#FFFFFF" }}>확인</Typography>
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default NewLecture;