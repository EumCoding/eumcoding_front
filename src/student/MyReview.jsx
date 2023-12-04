import React, {useEffect, useState} from 'react';
import {Button, createTheme, Divider, Grid, Link, Modal, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../unauth/css/Lecture.module.css";
import StarIcon from "@mui/icons-material/Star";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



function MyReview(props) {
    const defaultSize = 10; // 한 페이지에 보여줄 리뷰 개수

    const accessToken = useSelector((state) => state.accessToken);

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
    // startDate는 endDate보다 6개월 전
    const [startDate, setStartDate] = useState(dayjs().subtract(6, 'month'));

    const [more, setMore] = useState(false); // 결과가 더 있는지

    const [result, setResult] = useState(null); // 리뷰목록

    const [page, setPage] = useState(0); // 현재 페이지

    // 리뷰목록 가져오는 api 호출
    const getReviewList = async (pageParam) => {
        // endDate와 startDate를 yyyy-mm-dd hh:mm:ss 에 맞게 포맷팅
        const end = endDate.format('YYYY-MM-DD 23:59:59');
        const start = startDate.format('YYYY-MM-DD 00:00:00');
        const data = {
            endDate : end,
            startDate : start
        }
        console.log("리뷰목록 가져오기...")
        console.log(data);
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/review/my_list?page=${pageParam}`, // defaultSize가 10이므로 따로 보내지 않음
            data,
            {
                headers: {
                    Authorization: `${accessToken}`,
                },
            }
        ).then((res) => {
            console.log(res);
            if(pageParam < 1){
                setResult(res.data);
                if(res.data.length < defaultSize) {
                    setMore(false);
                }else{
                    setMore(true);
                }
            }else{
                setResult(result.concat(res.data));
                if(res.data.length < defaultSize) {
                    setMore(false);
                }else{
                    setMore(true);
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 리뷰삭제
    const deleteReview = async (reviewId) => {
        console.log("리뷰삭제하기...")
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/lecture/review/delete`,
                {
                    id: reviewId,
                },
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                }
            )
            // 삭제 후 리뷰목록 다시 가져오기
            for(let i = 0 ; i < page + 1 ; i++){
                await getReviewList(i);
            }
        }catch (e) {
            alert("리뷰삭제에 실패했습니다.")
        }
    }

    // 리뷰수정
    const updateReview = async (reviewId, reviewContent, rating) => {
        console.log("리뷰수정하기...")
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/lecture/review/update`,
                {
                    id: reviewId,
                    content: reviewContent,
                    rating : rating
                },
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                }
            )
            // 수정 후 리뷰목록 다시 가져오기
            for(let i = 0 ; i < page + 1 ; i++){
                await getReviewList(i);
            }
            handleClose();
        }catch (e) {
            alert("리뷰수정에 실패했습니다.")
        }
    }

    // 리뷰 수정용 modal 디자인
    const [open, setOpen] = useState(false);
    const [reviewContent, setReviewContent] = useState(null);
    const [reviewId, setReviewId] = useState(null);
    const [rating, setRating] = useState(5); // 별점

    const handleOpen = (reviewId, reviewContent, reviewRating) => {
        setReviewId(reviewId);
        setReviewContent(reviewContent);
        setOpen(true);
        setRating(parseInt(reviewRating));
    }

    const handleClose = () => {
        setOpen(false);
    }

const body = (
    <Box sx={{
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
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    }}>
        <Typography sx={{fontSize:"1.5rem", fontWeight:"800"}} >리뷰수정</Typography>
        {/* 별모양 아이콘들 **/}
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", mt:"1rem"}}>
            {rating >0 && (
                <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
            )}
            {rating >1 && (
                <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
            )}
            {rating >2 && (
                <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
            )}
            {rating >3 && (
                <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
            )}
            {rating >4 && (
                <StarIcon sx={{ color: '#F2D857', fontSize: '2rem' }}/>
            )}
        </Box>
        <TextField
            sx={{mt:"3rem"}}
            multiline
            rows={4}
            defaultValue={reviewContent}
            variant="outlined"
            fullWidth
            onChange={(e) => {
                setReviewContent(e.target.value);
            }
            }
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: "2rem" }}>
            {/* 취소 버튼 */}
            <Button
                variant="outlined"
                sx={{
                    px: "3rem",
                    py: "0.3rem",
                    mx:"1rem",
                    borderRadius: "20px",
                    borderColor: 'error.main', // 빨간색 계열 테두리
                    color: 'error.main', // 빨간색 계열 텍스트
                    '&:hover': {
                        bgcolor: 'error.light', // 호버 시 배경 살짝 빨간색
                        borderColor: 'error.dark', // 호버 시 테두리 색상 더 진한 빨간색
                    },
                    textTransform: 'none',
                }}
                onClick={() => {
                    // 취소 로직...
                    handleClose();
                }}
            >
                취소
            </Button>

            {/* 수정 버튼 */}
            <Button
                variant="contained"
                sx={{
                    px: "3rem",
                    py: "0.3rem",
                    mx:"1rem",
                    borderRadius: "20px",
                    bgcolor: 'primary.main', // 파란색 계열 배경
                    '&:hover': {
                        bgcolor: 'primary.dark', // 호버 시 더 진한 파란색
                    },
                    textTransform: 'none',
                }}
                onClick={() => {
                    // 수정 로직...
                    updateReview(reviewId, reviewContent, rating);
                }}
            >
                수정
            </Button>
        </Box>
    </Box>
);


    useEffect(() => {
        if(accessToken){
            getReviewList(0);
        }
    }, [accessToken]);


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

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* 리뷰 수정용 modal **/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                sx={{display:"flex", justifyContent:"center", alignItems:"center"}}
            >
                {body}
            </Modal>

            <Grid container sx={{pr:{xs:"0rem", md:"2rem"}, pl:{xs:"2rem", md:"2rem"} , py:"2rem"}}>
                {/*<Grid item xs={12}>*/}
                {/*    <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                {/*        <DesktopDatePicker*/}
                {/*            label="출발일"*/}
                {/*            inputFormat="MM-DD-YYYY"*/}
                {/*            value={startDate}*/}
                {/*            onChange={(e) => {*/}
                {/*                if (dateCheck(e, endDate)) {*/}
                {/*                    setStartDate(e);*/}
                {/*                }else {*/}
                {/*                    setStartDate(e);*/}
                {/*                    setEndDate(e);*/}
                {/*                }*/}
                {/*            }}*/}
                {/*            renderInput={(params) => <TextField {...params} />}*/}
                {/*        />*/}
                {/*    </LocalizationProvider>*/}
                {/*    <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                {/*        <DesktopDatePicker*/}
                {/*            label="종료일"*/}
                {/*            inputFormat="MM/DD/YYYY"*/}
                {/*            value={endDate}*/}
                {/*            minDate={startDate}*/}
                {/*            disablePast*/}
                {/*            sx={{ml:"1rem"}}*/}
                {/*            onChange={(e) => {*/}
                {/*                console.log(e);*/}
                {/*                if (startDate <= e) {*/}
                {/*                    console.log("여기걸림")*/}
                {/*                    setEndDate(e);*/}
                {/*                }else {*/}
                {/*                    setEndDate(startDate);*/}
                {/*                }*/}
                {/*            }}*/}
                {/*            renderInput={(params) => <TextField {...params} />}*/}
                {/*        />*/}
                {/*    </LocalizationProvider>*/}
                {/*    <Button*/}
                {/*        variant="contained"*/}
                {/*        sx={{*/}
                {/*            py:"1rem",*/}
                {/*            mx:"1rem",*/}
                {/*            bgcolor: 'primary.main', // 버튼 배경색*/}
                {/*            '&:hover': {*/}
                {/*                bgcolor: 'primary.dark', // 호버 시 배경색 변경*/}
                {/*            },*/}
                {/*        }}*/}
                {/*        onClick={() => {*/}
                {/*            // 검색 버튼 클릭 시 로직...*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        검색*/}
                {/*    </Button>*/}
                {/*</Grid>*/}
                <Grid container item xs={12} sx={{pt:"3rem", mt:0, px:{xs:"5%", md:"20%"}}}>


                    {/* 리뷰목록 **/}
                    <Grid
                        container
                        item xs={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{mt:'1rem'}}
                    >

                        {/* 리뷰목록 map **/}
                        {result && result.map((item, idx) => {
                            return(
                                <Grid container item xs={12} sx={{mt:'0.3vw'}}>
                                    <Grid item xs={12} container display="flex" justifyContent={"flex-start"} alignContent={"center"}>
                                        <Grid item xs={12} sx={{
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
                                            }
                                        }}>
                                            <Link to={`/lecture/${item.lectureId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{
                                                    width: 100, // 고정 가로 크기
                                                    aspectRatio: '16 / 9', // 비율 유지
                                                    overflow: 'hidden',
                                                    borderRadius: '10px',
                                                    marginRight: 2
                                                }}>
                                                    <img src={item.lectureThumbnail} alt="강의썸네일" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                                </Box>
                                                <Typography sx={{ display: 'inline', fontWeight: "700", fontSize: "1rem" }}>{item.lectureName}▶</Typography>
                                            </Link>
                                        </Grid>
                                        <Grid
                                            container
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            sx={{mt:"0.5rem"}}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="flex-end"
                                            >
                                                <Box display="flex" alignItems="center">
                                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                                    <StarIcon sx={{ color: '#F2D857', fontSize: '1.5rem' }}/>
                                                    <Typography sx={{ml: '1rem', color: "#8D8D8D"}}>{dayjs(item.createdDay).format("YYYY년 MM월 DD일 HH:mm:ss")}</Typography>
                                                </Box>
                                                <Box display ="flex" alignItems={"center"}>
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
                                                        onClick={() => {
                                                            // 리뷰 수정용 modal 열기
                                                            handleOpen(item.id, item.content, item.rating);
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
                                                    onClick={() => {
                                                        //삭제 메서드
                                                        deleteReview(item.id);
                                                    }}
                                                >
                                                    <Typography sx={{fontSize:"0.7rem"}}>삭제</Typography>
                                                </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item
                                          display="flex"
                                          justifyContent="flex-start"
                                          alignItems="center"
                                          xs={12} sx={{mt:'1vw', pl:"0.3rem"}}>
                                <span className={styles.font_review_content}>
                                    {item.content}
                                </span>
                                    </Grid>
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
                                                <Grid container sx={{width:"100%", p:"1rem"}}>
                                                    {/* 날짜 **/}
                                                    <Grid item xs={12} sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                                                        <Typography sx={{fontSize:"0.8rem", color:"#8D8D8D"}}>{dayjs(item.listCommentResponseDTO.commentDay).format("YYYY년 MM월 DD일 HH:mm:ss")}</Typography>
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
                                          xs={12} sx={{mt:'2rem'}}>
                                        <Divider fullWidth/>
                                        <br/>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                    {more && (
                        <Button
                            onClick={() => {
                                const tempPage = page;
                                setPage(tempPage + 1)
                                getReviewList(tempPage + 1); // 다음페이지 불러오기
                            }}
                            fullWidth variant="outlined" sx={{borderRadius:"0.5vw", backgroundColor:"#FFFFFF", borderColor:"#000000", py:"0.5rem",}}>
                            <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                                더보기
                            </Typography>
                        </Button>
                    )}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyReview;