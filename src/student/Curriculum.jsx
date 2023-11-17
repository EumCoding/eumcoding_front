import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, createTheme, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";
import dayjs from "dayjs";
import {ResponsivePie} from "@nivo/pie";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

function Curriculum(props) {

    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const navigate = useNavigate()

    // 오늘날짜 dayjs로
    const today = dayjs();

    // 오늘
    const [planTodayResult, setPlanTodayResult] = useState(null); // 학습 계획 결과
    // 3일
    const [plan3DayResult, setPlan3DayResult] = useState(null); // 학습 계획 결과
    // 일주일
    const [planWeekResult, setPlanWeekResult] = useState(null); // 학습 계획 결과
    // 조회한 학습 계획 결과
    const [planResult, setPlanResult] = useState(null); // 학습 계획 결과

    // 오늘 진행률
    const [todayProgress, setTodayProgress] = useState(0);
    // 3일 진행률
    const [threeDayProgress, setThreeDayProgress] = useState(0);
    // 일주일 진행률
    const [weekProgress, setWeekProgress] = useState(0);
    // 조회한 학습 계획 진행률
    const [progress, setProgress] = useState(0);


    // 오늘 진행률 for nivo
    const[todayProgressData, setTodayProgressData] = useState(null);

    // 검색 진행률 for nivo
    const[progressData, setProgressData] = useState(null);


    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today.add(1, 'day'));

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


    // 테마
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

    // 커리큘럼 정보 가져오기
    const getPlan = async (start, end) => {
        const tempStart = start.format('YYYY-MM-DDT00:00:00');
        const tempEnd = end.format('YYYY-MM-DDT00:00:00');
        console.log(`URL: http://localhost:8099/member/myplan/list/info?startDateStr=${tempStart}&endDateStr=${tempEnd}`);

        try {
            const response = await axios.post(
                `http://localhost:8099/member/myplan/list/info?startDateStr=${tempStart}&endDateStr=${tempEnd}`,
                null,
                { headers: { Authorization: `${accessToken}` } }
            );
            return response; // 여기서 응답을 반환
        } catch (err) {
            console.log(err);
            return null; // 오류가 발생한 경우 null 반환
        }
    };

    useEffect(() => {
        if(accessToken){
            getPlan(today, today.add(1, 'day')).then((res) => {
                console.log("오늘 진행률")
                console.log(res)
                res && res.data && setPlanTodayResult(res.data)
                // 진행률 계산
                if (res && res.data) {
                    console.log("진행률 계산... 시작")
                    let validProgressCount = 0;
                    const progressSum = res.data.reduce((acc, cur) => {
                        if (cur.sectionDTOList && cur.sectionDTOList.length > 0 && cur.sectionDTOList[0].progress !== undefined) {
                            validProgressCount++;
                            return acc + cur.sectionDTOList[0].progress;
                        }
                        return acc;
                    }, 0);

                    const progress = validProgressCount > 0 ? Math.round(progressSum / validProgressCount) : 0;
                    console.log("오늘 진행률", progress);
                    setTodayProgress(progress);
                    const tempData = [
                        {
                            id: "진행중",
                            value: progress
                        },
                        {
                            id: "남은강의",
                            value: 100 - progress
                        }
                    ];
                    setTodayProgressData(tempData);
                }
            })
            getPlan(today, today.add(3, 'day')).then((res) => {
                res && res.data && setPlan3DayResult(res.data)
                console.log("3일 진행률")
                console.log(res)
                // 진행률 계산
                if (res && res.data) {
                    console.log("진행률 계산... 시작")
                    let validProgressCount = 0;
                    const progressSum = res.data.reduce((acc, cur) => {
                        if (cur.sectionDTOList && cur.sectionDTOList.length > 0 && cur.sectionDTOList[0].progress !== undefined) {
                            validProgressCount++;
                            return acc + cur.sectionDTOList[0].progress;
                        }
                        return acc;
                    }, 0);

                    const progress = validProgressCount > 0 ? Math.round(progressSum / validProgressCount) : 0;
                    console.log("오늘 진행률", progress);
                    setThreeDayProgress(progress);
                }
            })
            getPlan(today, today.add(7, 'day')).then((res) => {
                res && res.data && setPlanWeekResult(res.data)
                console.log("일주일 진행률")
                console.log(res)
                // 진행률 계산
                if (res && res.data) {
                    console.log("진행률 계산... 시작")
                    let validProgressCount = 0;
                    const progressSum = res.data.reduce((acc, cur) => {
                        if (cur.sectionDTOList && cur.sectionDTOList.length > 0 && cur.sectionDTOList[0].progress !== undefined) {
                            validProgressCount++;
                            return acc + cur.sectionDTOList[0].progress;
                        }
                        return acc;
                    }, 0);

                    const progress = validProgressCount > 0 ? Math.round(progressSum / validProgressCount) : 0;
                    console.log("오늘 진행률", progress);
                    setWeekProgress(progress);
                }
            })
        }
    }, [accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{width:"100%", py:"1rem", px:25, alignItems:"center"}} spacing={0}>
                <Grid xs={4} item container sx={{p:2}}>
                    {/* 오늘 진행률 **/}
                    <Grid xs={12} container item sx={{border:1, borderColor:"#8D8D8D", borderRadius:"20px", width:"100%", height:"40vh", display:"flex", alignItems:"flex-start", p:5}}>
                        <Grid xs={12} item sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"1.7rem"}}>
                                오늘 진행률
                            </Typography>
                        </Grid>
                        {/* 날짜 **/}
                        <Grid xs={12} item sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                            <Typography sx={{fontWeight:"500", fontSize:"1.3rem"}}>
                                {today.format('YYYY월 MM월 DD일')}
                            </Typography>
                        </Grid>
                        {todayProgressData && (

                                <Grid xs={12} item sx={{height:"70%", position: 'relative'}}>
                                    <ResponsivePie
                                        data={todayProgressData}
                                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                        enableArcLabels={false}
                                        enableArcLinkLabels={false}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        colors={{ scheme: 'nivo' }}
                                        borderWidth={1}
                                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                        enableRadialLabels={false}
                                        enableSlicesLabels={false}
                                        isInteractive={true}
                                    />
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '2rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {todayProgress}%
                                        </div>
                                </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid xs={8} item container sx={{px:3, py:0, m:0}}>
                    {/* 오늘 들을 강의들 **/}
                    <Grid xs={12} container item sx={{border:1, borderColor:"#8D8D8D", borderRadius:"20px", width:"100%", height:"40vh", display:"flex", alignItems:"flex-start", p:5, overflowY: "auto"}}>
                        <Grid item xs={12}>
                            <Typography sx={{fontWeight:"900", fontSize:"1.7rem"}} >오늘 들을 강의</Typography>
                        </Grid>
                        {planTodayResult && planTodayResult.map((item, idx) => {
                        return (
                            <Grid xs={12} container item sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"
                                // 호버 시 회색으로
                                , "&:hover": {
                                    backgroundColor: "#EAEAEA"
                                }
                                // 테두리 둥글게
                                , borderRadius:"20px"
                                , p:2
                            }}>
                                <Grid xs={9} item>
                                    <Typography sx={{fontWeight:"600", fontSize:"1rem", display:"flex"}}>
                                        {item.sectionDTOList && item.sectionDTOList[0].lectureName}({item.sectionDTOList && item.sectionDTOList[0].sectionName})
                                    </Typography>
                                    <Typography sx={{fontWeight:"600", fontSize:"0.7rem", color:"#8D8D8D", display:"flex"}}>
                                        기간 : {dayjs(item.date,  "YYYY-MM-DD HH:mm:ss").format("YYYY년 MM월DD일")} ~ {dayjs(item.date,  "YYYY-MM-DD HH:mm:ss").add(parseInt(item.sectionDTOList[0].timetaken), 'day').format("YYYY년 MM월DD일")}
                                    </Typography>
                                </Grid>
                                <Grid xs={3} item sx={{display:'flex', justifyContent:"flex-end"}}>
                                    <Typography sx={{fontWeight:"600", fontSize:"0.7rem", color:"#8D8D8D", display:"flex"}}>
                                        진행률 : {item.sectionDTOList && item.sectionDTOList[0].progress}  %
                                    </Typography>
                                </Grid>
                            </Grid>
                        )
                        })}
                    </Grid>
                </Grid>
                <Grid container item xs={12} sx={{p:2}}>
                    {/* 기간선택강의 **/}
                    <Grid xs={12} container item sx={{border:1, borderColor:"#8D8D8D", borderRadius:"20px", width:"100%", height:"40vh", display:"flex", alignItems:"center", p:5}}>
                        <Grid item xs={12} sx={{display:"flex", alignItems:"center"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    size={"small"}
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
                                        // 출발일은 오늘보다 이전 날짜가 될 수 없게
                                        if (e < today) {
                                            setStartDate(today);
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params} sx={{
                                            height: 40,
                                            '.MuiInputBase-input': { height: '1.1876em', padding: '10px 12px' }, // Input 요소에 대한 스타일
                                        }} />
                                }
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    size={"small"}
                                    label="종료일"
                                    inputFormat="MM/DD/YYYY"
                                    value={endDate}
                                    minDate={startDate}
                                    disablePast
                                    sx={{ml:"1rem"}}
                                    onChange={(e) => {
                                        console.log(e);
                                        if (startDate <= e) {
                                            console.log("여기걸림")
                                            setEndDate(e);
                                        }else {
                                            setEndDate(startDate);
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params} sx={{
                                            height: 40,
                                            '.MuiInputBase-input': { height: '1.1876em', padding: '10px 12px' }, // Input 요소에 대한 스타일
                                        }} />
                                }
                                />
                            </LocalizationProvider>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                // 기간 조회
                                getPlan(startDate, endDate).then((res) => {
                                    console.log("기간 조회")
                                    console.log(res)
                                    res && res.data && setPlanResult(res.data)
                                    // 진행률 계산
                                    if (res && res.data) {
                                        console.log("진행률 계산... 시작")
                                        let validProgressCount = 0;
                                        const progressSum = res.data.reduce((acc, cur) => {
                                            if (cur.sectionDTOList && cur.sectionDTOList.length > 0 && cur.sectionDTOList[0].progress !== undefined) {
                                                validProgressCount++;
                                                return acc + cur.sectionDTOList[0].progress;
                                            }
                                            return acc;
                                        }, 0);

                                        const progress = validProgressCount > 0 ? Math.round(progressSum / validProgressCount) : 0;
                                        console.log("오늘 진행률", progress);
                                        setProgress(progress);
                                        // nivo
                                        const tempData = [
                                            {
                                                id: "진행중",
                                                value: progress
                                            },
                                            {
                                                id: "남은강의",
                                                value: 100 - progress
                                            }
                                        ];
                                        setProgressData(tempData);
                                    }
                                })
                            }
                                sx={{
                                    backgroundColor: '#3767A6', // 버튼의 배경 색상
                                    '&:hover': {
                                        backgroundColor: '#2a4d69', // 호버 시의 배경 색상
                                    },
                                    color: '#ffffff', // 글자 색상
                                    padding: '10px 20px', // 패딩
                                    borderRadius: '20px', // 둥근 모서리
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // 그림자 효과
                                    ml:"1rem"
                                }}
                            >
                                기간 조회
                            </Button>
                        </Grid>
                        {/* 검색결과 **/}
                        {!planResult && (
                            <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center", height:"70%"}}>
                                <Typography sx={{fontWeight:"700", fontSize:"1.5"}}>일정이 없습니다.</Typography>
                            </Grid>
                        )}
                        {planResult && progressData && (
                            <Grid item container xs={12} sx={{height:"100%", width:"100%", mt:'2rem'}}>
                                {/* 진행률 **/}
                                <Grid xs={3} item sx={{height:"70%", position: 'relative', display:"flex", justifyContent:"flex-start", alignItems:'center'}}>
                                    <ResponsivePie
                                        data={progressData}
                                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                        enableArcLabels={false}
                                        enableArcLinkLabels={false}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        colors={{ scheme: 'accent' }}
                                        borderWidth={1}
                                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                        enableRadialLabels={false}
                                        enableSlicesLabels={false}
                                        isInteractive={true}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {progress}%
                                    </div>
                                </Grid>
                                <Grid xs={9} item sx={{maxHeight:"80%", overflowY: "auto"}}>
                                    {planResult && planResult.map((item, idx) => {
                                        return (
                                            <Grid container item sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", width:"100%"
                                                // 호버 시 회색으로
                                                , "&:hover": {
                                                    backgroundColor: "#EAEAEA"
                                                }
                                                // 테두리 둥글게
                                                , borderRadius:"20px"
                                                , p:2
                                            }}>
                                                <Grid xs={9} item>
                                                    <Typography sx={{fontWeight:"600", fontSize:"1rem", display:"flex"}}>
                                                        {item.sectionDTOList && item.sectionDTOList[0].lectureName}({item.sectionDTOList && item.sectionDTOList[0].sectionName})
                                                    </Typography>
                                                    <Typography sx={{fontWeight:"600", fontSize:"0.7rem", color:"#8D8D8D", display:"flex"}}>
                                                        기간 : {dayjs(item.date,  "YYYY-MM-DD HH:mm:ss").format("YYYY년 MM월DD일")} ~ {dayjs(item.date,  "YYYY-MM-DD HH:mm:ss").add(parseInt(item.sectionDTOList[0].timetaken), 'day').format("YYYY년 MM월DD일")}
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3} item sx={{display:'flex', justifyContent:"flex-end"}}>
                                                    <Typography sx={{fontWeight:"600", fontSize:"0.7rem", color:"#8D8D8D", display:"flex"}}>
                                                        진행률 : {item.sectionDTOList && item.sectionDTOList[0].progress}  %
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Curriculum;