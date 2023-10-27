import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme, Grid, MenuItem, Select, TextField, ThemeProvider, Modal} from "@mui/material";
import TopBar from "../component/TopNav";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import testImg from "../images/test.png";
import axios from "axios";
import {useSelector} from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import {useNavigate} from "react-router-dom";



// modal에 적용할 style
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:"1vw",
};

function PayLog(props) {

    // modal용 state
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [reviewType, setReviewType] = useState(false); // f:일반리뷰 t:가이드리뷰

    const [star, setStar] = useState(5); // 별갯수

    const accessToken = useSelector((state) => state.accessToken);

    const navigate = useNavigate();

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

    const [result, setResult] = useState(null); // 결과담을 state

    const [startDate, setStartDate] = useState(dayjs().subtract(6, 'month')); // 초기값은 현재시간 - 6개월로
    const [endDate, setEndDate] = useState(dayjs()); // 종료일

    const [page, setPage] = useState(0); // 현재 페이지

    const [more, setMore] = useState(true); // 더 가져올 데이터가 있는지

    const [load, setLoad] = useState(false); // 로드중인지



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

    // 결제내역 가져오기
    const getPayLog = async (pageParam) => {
        try {
            const startParam = startDate.format('YYYY-MM-DDT00:00:00');
            const endParam = endDate.format('YYYY-MM-DDT00:00:00');

            console.log("시작일 " + startParam);

            const url = `http://localhost:8099/payment/myPayment?size=10&page=${pageParam}`;

            const response = await axios.post(url,
            {
                startDateStr:startParam,
                endDateStr:endParam
            },{
                headers: {
                    Authorization: `${accessToken}`,
                }
            });

            console.log(response);

            if (response.data && response.data.length < 10) {
                setMore(false);
            }

            if(pageParam !== 0){ // 1페이지가 아닌 경우
                // 깊은복사
                const temp = JSON.parse(JSON.stringify(result))
                response && response.data && setResult(temp.concat(response.data));
            }else{ // 1페이지인 경우
                setResult(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPayLog(0); // 최초 로드 시 0페이지 로드
    }, []);

    useEffect(() => {
        if(page > 0){
            getPayLog(page)
        }
    }, [page])

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} >
                    <Grid container sx={{width:"100%"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mb:"2rem"}}>
                            {reviewType === false && (
                                <Typography id="modal-modal-description" fullWidth sx={{ fontSize:"1.5rem", fontWeight:"900" }}>
                                    여행리뷰
                                </Typography>
                            )}
                            {reviewType === true && (
                                <Typography id="modal-modal-description" fullWidth sx={{ fontSize:"1.5rem", fontWeight:"900" }}>
                                    가이드 리뷰
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Typography sx={{fontSize:"1rem", fontWeight:"700"}}>
                                여행이름
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mb:"1rem"}}>
                            <Typography sx={{fontSize:"0.7rem", fontWeight:"700", fontColor:"#8D8D8D"}}>
                                가이드명
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mb:"2rem"}}>
                            <StarIcon sx={{ color: star > 0 ? "#6CB0FF" : "#888888", fontSize: '2rem' }} onClick={() => setStar(1)}/>
                            <StarIcon sx={{ color: star > 1 ? "#6CB0FF" : "#888888", fontSize: '2rem' }} onClick={() => setStar(2)}/>
                            <StarIcon sx={{ color: star > 2 ? "#6CB0FF" : "#888888", fontSize: '2rem' }} onClick={() => setStar(3)}/>
                            <StarIcon sx={{ color: star > 3 ? "#6CB0FF" : "#888888", fontSize: '2rem' }} onClick={() => setStar(4)}/>
                            <StarIcon sx={{ color: star > 4 ? "#6CB0FF" : "#888888", fontSize: '2rem' }} onClick={() => setStar(5)}/>
                        </Grid>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <TextField
                                multiline
                                rows={7}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mt:"2rem"}}>
                            <Button fullWidth sx={{backgroundColor:"#6CB0FF", border:0, borderRadius:"2vw", height:"200%"}}>
                                <Typography sx={{color:"#FFFFFF"}}>
                                    작성완료
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Box sx={{height: 80}}/>
            <Grid container sx={{px:{xs:"5%", sm:"10%", md:"10%", lg:"20%", width:"100%"}}} spacing={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"} sx={{pt:"2rem"}}>
                    <Typography sx={{color:"#000000", fontWeight:"900", fontSize:"2rem"}}>
                        결제내역
                    </Typography>
                </Grid>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
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
                    <Button onClick={() => {
                        setPage(0);
                        getPayLog(0);
                    }} >검색</Button>
                </Grid>
                <Grid container item xs={12} sx={{pb:"2rem"}} display={"flex"} justifyContent={"center"} alignItems={"stretch"}>
                    {result && result.map((item) => {
                        return(
                            <Grid item container xs={12}>
                                <Grid item xs={12}>
                                    <Typography>{item.date}</Typography>
                                </Grid>
                                {/* 내용물 **/}
                                {item.lectureDTOList && item.lectureDTOList.map((subItem) => {
                                    return(
                                        <Grid item container xs={12}>
                                            <Grid container item
                                                  display={"flex"}
                                                  justifyContent={"center"}
                                                  alignItems={"center"}
                                                  xs={12} sx={{border: 1,borderRadius:"1vw", borderColor: "#DDDDDD", overflow: 'hidden', p:0, mb:"2rem"}}>
                                                <Grid xs={3} item
                                                      display={"flex"}
                                                      justifyContent={"center"}
                                                      alignItems={"center"}
                                                      sx={{height:"100%"}}
                                                >
                                                    <Box sx={{width:"100%", height:"100%", display: "flex", overflow:"hidden", p:0}} onClick={() => navigate(`/lectureInfo/${subItem.id}`)} >
                                                        <img src={subItem.lectureImg} style={{width:"100%", height: "100%", objectFit:"cover", objectPosition:"center center"}}/>
                                                    </Box>
                                                </Grid>
                                                <Grid xs={6} item container
                                                      display={"flex"}
                                                      justifyContent={"flex-start"}
                                                      alignItems={"center"}
                                                      sx={{pl:"1rem"}}
                                                >
                                                    <Grid xs={12} item sx={{mb:"1rem"}} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                                                        <span style={{fontFamily: 'NanumSquareNeo', fontWeight:"700", fontSize:"1.3rem", marginRight:"1rem"}}>결제완료</span>
                                                        <span style={{fontFamily: 'NanumSquareNeo',color:"#888888", fontSize:"1rem"}}>5월 13일 ~ 5월 17일</span>
                                                    </Grid>
                                                    <Grid xs={12} item>
                                                        <Typography sx={{fontSize:"1.3rem", fontWeight:"700"}}>{subItem.name}</Typography>
                                                    </Grid>
                                                    <Grid xs={12} item sx={{mt:"1rem"}}>
                                                        <Typography sx={{fontWeight:"700"}}>결제금액 : {subItem.price}원</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={3} item container
                                                      display={"flex"}
                                                      justifyContent={"flex-end"}
                                                      alignItems={"center"}
                                                      spacing={2}
                                                >
                                                    <Grid item xs={12} sx={{ px:"3rem"}}>
                                                        {subItem.reviewStatus !== "리뷰작성완료" && (
                                                            <Button variant={"outlined"} sx={{borderColor:"#DDDDDD"}} fullWidth onClick={() => {
                                                                setReviewType(false);
                                                                handleOpen();
                                                            }}>
                                                                <Typography sx={{color:"#000000"}}>리뷰 작성</Typography>
                                                            </Button>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        )
                                })}
                            </Grid>
                            )

                    })}
                    <Grid xs={12} container item display='flex' justifyContent='center' alignItems='center' sx={{width:"100%", py:"3rem"}}>
                        {more === true && (
                            <Grid xs={12} item
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center">
                                <Button fullWidth variant="outlined" sx={{borderRadius:"0.5vw", backgroundColor:"#FFFFFF", borderColor:"#000000", py:"1rem",}}
                                        onClick={() => setPage(page+1)}
                                >
                                    <Typography sx={{fontWeight:"700", fontSize:"1rem", color:"#000000"}}>
                                        더보기
                                    </Typography>
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default PayLog;