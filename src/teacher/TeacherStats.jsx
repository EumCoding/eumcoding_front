import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    Box,
    createTheme,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    ThemeProvider,
    Typography
} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";
import {ResponsivePie} from "@nivo/pie";
import { ResponsiveBar } from '@nivo/bar'
import dayjs from "dayjs";
import {ResponsiveLine} from "@nivo/line";

function TeacherStats(props) {
    // accessToken
    const accessToken = useSelector((state) => state.accessToken);
    // navigate
    const navigate = useNavigate();
    // theme
    // 테마
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const [totalCnt, setTotalCnt] = useState(0); // 총 강좌 수
    const [totalRating, setTotalRating] = useState(0); // 총 별점
    const [totalStudent, setTotalStudent] = useState(0); // 총 수강생 수
    // 강의 총 수익
    const [totalRevenue, setTotalRevenue] = useState(0);

    // 전체 강좌 갯수 가져오기
    const getLectureCnt = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/total-cnt`,null, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("전체강좌갯수 : " + res.data.totalLectureCnt);
            if(res && res.data){
                setTotalCnt(res.data.totalLectureCnt);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 전체 별점 가져오기
    const getTotalStar = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/total-rating`,null, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("전체 별점 : " + res.data.totalRating);
            if(res && res.data){
                setTotalRating(res.data.totalRating);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 전체 수강생 수 가져오기
    const getTotalStudent = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/total-student`,null, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("전체 수강생 수 : ")
            console.log(res.data)
            if(res && res.data){
                setTotalStudent(res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    // 강의 총 수익
    const getTotalRevenue = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/total-revenue`,null, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("강의 총 수익 : " + res.data.totalRevenue);
            if(res && res.data){
                setTotalRevenue(res.data.totalRevenue);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    // 이번달 판매 비율
    const [thisMonthSalesRatio, setThisMonthSalesRatio] = useState(null);
    // 이번달 판매 비율
    const getThisMonthSalesRatio = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/total-volume-percentage`,null, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("이번달 판매 비율...");
            console.log(res.data);
            if(res && res.data){
                // nivo에 맞게 커스텀
                let data = [];
                res.data.totalVolumePercentageDTOList.forEach((item) => {
                    data.push({
                        "id": item.lectureName,
                        "label": item.lectureName,
                        "value": item.percentage
                    })
                })
                setThisMonthSalesRatio(data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    // 강의별 수익 분포
    const [lectureRevenueDistribution, setLectureRevenueDistribution] = useState([]);
    const [lectureRevenueDistributionKeys, setLectureRevenueDistributionKeys] = useState([]);
    const [lectureRevenueDistributionPeriodOption, setLectureRevenueDistributionPeriodOption] = useState(0); // [0: 주, 1: 한달, 2: 3개월, 3: 6개월, 4: 1년
    // 강의별 수익 분포
    const getLectureRevenueDistribution = (periodOption) => {
        // public static final int WEEK = 0;
        //
        // public static final int A_MONTH = 1;
        //
        // public static final int THREE_MONTH = 2;
        //
        // public static final int SIX_MONTH = 3;
        //
        // public static final int YEAR = 4;
        axios.post(`${process.env.REACT_APP_API_URL}/stats/revenue-distribution`,{
            periodOption: periodOption,
        }, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("강의별 수익 분포...");
            console.log(res.data);
            if(res && res.data){
                // nivo에 맞게 커스텀
                let data = [];
                res.data.forEach((item, idx) => {
                    data.push({
                        "date" : item.date.toString(),
                    })
                    item.revenueDistributionDTOList.forEach((subItem) => {
                        // data(idx)에 이어서 넣기
                        (data[idx])[subItem.lectureName+"("+subItem.lectureId+")"] = subItem.revenue;
                    })
                })
                let tempKeys = [];
                res.data[0].revenueDistributionDTOList.forEach((item) => {
                    tempKeys.push(item.lectureName+"("+item.lectureId+")");
                })
                console.log(data);
                console.log(tempKeys);
                setLectureRevenueDistribution(data);
                setLectureRevenueDistributionKeys(tempKeys);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 종합 판매 추이
    const [totalSalesTrend, setTotalSalesTrend] = useState(null);
    // periodOption
    const [totalSalesTrendPeriodOption, setTotalSalesTrendPeriodOption] = useState(0); // [0: 주, 1: 한달, 2: 3개월, 3: 6개월, 4: 1년
    // 종합 판매 추이
    const getTotalSalesTrend = (periodOption) => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/sales-volume-progress`,
            {
                periodOption: periodOption,
            }, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("종합 판매 추이...");
            console.log(res.data);
            if(res && res.data){
                // nivo에 맞게 커스텀
                let data = [
                    {
                        id:"종합판매추이",
                        data:[],
                    }
                ];
                res.data.forEach((item) => {
                    data[0].data.push({
                        "x" : item.date.toString(),
                        "y" : item.salesVolume
                    })
                })
                console.log(data);
                setTotalSalesTrend(data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 비교 판매 현황
    const [compareSalesStatus, setCompareSalesStatus] = useState(null);
    // 비교 판매 현황 기간
    const [compareSalesStatusPeriodOption, setCompareSalesStatusPeriodOption] = useState(0); // [0: 주, 1: 한달, 2: 3개월, 3: 6개월, 4: 1년
    // 1번 강의 아이디
    const [firstLectureId, setFirstLectureId] = useState(null);
    // 2번 강의 아이디
    const [secondLectureId, setSecondLectureId] = useState(null);
    // 내 강의 리스트
    const [myLectureList, setMyLectureList] = useState(null);

    // 비교 판매 현황 가져오기
    const getCompareSalesStatus = (firstLectureId, secondLectureId, periodOption) => {
        axios.post(`${process.env.REACT_APP_API_URL}/stats/compare-lecture`,{
            firstLectureId: firstLectureId,
            secondLectureId: secondLectureId,
            periodOption: periodOption,

        }, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("비교 판매 현황...");
            console.log(res.data);
            if(res && res.data){
                // nivo에 맞게 커스텀
                let data = [
                    {
                        id:res.data.lectureName1,
                        data:[],
                    },
                    {
                        id:res.data.lectureName2,
                        data:[],
                    }
                ];
                res.data.compareLectureSalesVolumeDTOList.forEach((item, idx) => {
                    data[0].data.push(
                        {
                            x:item.date.toString(),
                            y:item.salesVolume1
                        }
                    );
                    data[1].data.push(
                        {
                            x:item.date.toString(),
                            y:item.salesVolume1
                        }
                    )

                })
                console.log(data);
                setCompareSalesStatus(data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 내 강의 리스트 가져오기
    const getMyLectureList = () => {
        console.log("내 강의 리스트 가져오기...");
        axios.get(`${process.env.REACT_APP_API_URL}/lecture/list`, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log(res.data);
            if(res && res.data){
                setMyLectureList(res.data);
                if(res.data>0){
                    setLectureId(res.data[0].id);
                }
                if(res.data > 1){
                    setFirstLectureId(res.data[0].id);
                    setSecondLectureId(res.data[1].id);
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    // 수강률 구간별 추이
    const [lectureSalesVolumeProgress, setLectureSalesVolumeProgress] = useState(null);
    // 강의 아이디
    const [lectureId, setLectureId] = useState(null);
    // keys
    const [lectureSalesVolumeProgressKeys, setLectureSalesVolumeProgressKeys] = useState(null);

    // 수강률 구간별 추이 가져오기
    const getLectureSalesVolumeProgress = (lectureId) => {
        console.log("수강률 구간별 추이 가져오기...");
        axios.post(`${process.env.REACT_APP_API_URL}/stats/lecture-progress`,{
            id: lectureId,
        }, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            console.log("수강률 구간별 추이...");
            console.log(res.data);
            if(res && res.data){
                // nivo에 맞게 커스텀
                let data = [];
                res.data.progress.forEach((item, idx) => {
                    const temp = (idx*10).toString() + "~" + ((idx+1) * 10).toString()
                    data.push({
                        progress: temp,
                        "진행률": item
                    })
                })
                // keys
                let tempKeys = [];
                for(let i = 0; i < 10; i++){
                    const temp = (i*10).toString() + "~" + ((i+1) * 10).toString()
                    tempKeys.push(temp);
                }
                console.log(data);
                setLectureSalesVolumeProgress(data);
                setLectureSalesVolumeProgressKeys(tempKeys);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        if(accessToken){
            // line 1
            getLectureCnt();
            getTotalRevenue()
            getTotalStudent()
            getTotalStar()

            // line 2
            getThisMonthSalesRatio();
            getLectureRevenueDistribution(0);

            // line 3
            getTotalSalesTrend(0);
            getMyLectureList();
        }
    }, [accessToken]);

    useEffect(() => {
        getLectureRevenueDistribution(lectureRevenueDistributionPeriodOption);
    }, [lectureRevenueDistributionPeriodOption]);

    useEffect(() => {
        getTotalSalesTrend(totalSalesTrendPeriodOption);
    }, [totalSalesTrendPeriodOption]);

    // 강의비교 최초 렌더링시
    useEffect(() => {
        if(myLectureList){
            if(myLectureList.length > 0){
                // 구간별 추이 가져오기
                getLectureSalesVolumeProgress(myLectureList[0].id);
            }
            if(myLectureList.length > 1) {
                getCompareSalesStatus(myLectureList[0].id, myLectureList[1].id, 0);
            }
        }
    }, [myLectureList])

    // 강의비교 값 변경 시
    useEffect(() => {
        if((firstLectureId > 0) && (secondLectureId > 0)){
            getCompareSalesStatus(firstLectureId, secondLectureId, compareSalesStatusPeriodOption)
        }
    }, [firstLectureId, secondLectureId, compareSalesStatusPeriodOption])

    // lectureId가 바뀔때
    useEffect(() => {
        if(lectureId > 0){
            getLectureSalesVolumeProgress(lectureId);
        }
    }, [lectureId])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/*Grid**/}
            <Grid container sx={{width:"100%", backgroundColor:"#EEEEEE", p:3}} spacing={3}>
                {/* line1 **/}
                {/* 총 강의 수 **/}
                <Grid xs={3} item sx={{width:"100%", aspectRatio:"1/1"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>총 강의 수</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center", height: '85%'}}>
                            <Typography sx={{fontSize:"2.5rem", color:"#8D8D8D",fontWeight:"bold", display:"flex", justifyContent:"center", alignItems:"center"}}>{totalCnt}개</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/* 별점 **/}
                <Grid xs={3} item sx={{width:"100%", aspectRatio:"1/1"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>별점</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center", height: '85%'}}>
                            <Typography sx={{fontSize:"2.5rem", color:"#8D8D8D", fontWeight:"bold", display:"flex", justifyContent:"center", alignItems:"center"}}>{totalRating.toFixed(2)}점</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/* 수강생 수 **/}
                <Grid xs={3} item sx={{width:"100%", aspectRatio:"1/1"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>총 수강생 수 </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center", height: '85%'}}>
                            <Typography sx={{fontSize:"2.5rem", color:"#8D8D8D", fontWeight:"bold", display:"flex", justifyContent:"center", alignItems:"center"}}>{totalStudent}명</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={3} item sx={{width:"100%", aspectRatio:"1/1"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>강의 총 수익</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{display:"flex", justifyContent:"center", alignItems:"center", height: '85%'}}>
                            <Typography sx={{fontSize:"2.5rem", color:"#8D8D8D", fontWeight:"bold", display:"flex", justifyContent:"center", alignItems:"center"}}>{totalRevenue.toLocaleString()}원</Typography>
                        </Grid>
                    </Grid>
                </Grid>


                {/* line2 **/}
                <Grid xs={5} item sx={{width:"100%", height:"500px"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>이번 달 판매 비율</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                            {thisMonthSalesRatio ? (
                                <ResponsivePie
                                    data={thisMonthSalesRatio}
                                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    borderWidth={1}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                0.2
                                            ]
                                        ]
                                    }}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#333333"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                2
                                            ]
                                        ]
                                    }}
                                    defs={[
                                        {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: 'rgba(255, 255, 255, 0.3)',
                                            size: 4,
                                            padding: 1,
                                            stagger: true
                                        },
                                        {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: 'rgba(255, 255, 255, 0.3)',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'ruby'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'c'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'go'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'python'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'scala'
                                            },
                                            id: 'lines'
                                        },
                                        {
                                            match: {
                                                id: 'lisp'
                                            },
                                            id: 'lines'
                                        },
                                        {
                                            match: {
                                                id: 'elixir'
                                            },
                                            id: 'lines'
                                        },
                                        {
                                            match: {
                                                id: 'javascript'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    legends={[
                                        {
                                            anchor: 'bottom-right', // 오른쪽 하단에 고정
                                            direction: 'column', // 항목을 세로로 배열
                                            justify: false,
                                            translateX: -20, // 오른쪽으로 이동
                                            translateY: -20, // 아래쪽으로 이동
                                            itemsSpacing: 0,
                                            itemWidth: 100,
                                            itemHeight: 18,
                                            itemTextColor: '#999',
                                            itemDirection: 'left-to-right',
                                            itemOpacity: 1,
                                            symbolSize: 18,
                                            symbolShape: 'circle',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemTextColor: '#000'
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            ) : (<Typography>로드중...</Typography>)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={7} item sx={{width:"100%", height:"500px"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{ justifyContent: "flex-start", alignItems: "center", display: "inline", mr: 2, lineHeight: 'normal' }}>강의별 수익 분포</Typography>
                            <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                <Select
                                    id="period-select"
                                    value={lectureRevenueDistributionPeriodOption}
                                    variant="standard"
                                    size="small"
                                    onChange={(event) => {
                                        setLectureRevenueDistributionPeriodOption(event.target.value)
                                    }}
                                >
                                    <MenuItem value={0}>최근7일</MenuItem>
                                    <MenuItem value={1}>한달</MenuItem>
                                    <MenuItem value={2}>3개월</MenuItem>
                                    <MenuItem value={3}>6개월</MenuItem>
                                    <MenuItem value={4}>1년</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center", overflow:"auto", p:"1rem"}}>
                            {(lectureRevenueDistribution.length > 0) && (lectureRevenueDistributionKeys.length > 0) ? (
                                <ResponsiveBar
                                    data={lectureRevenueDistribution}
                                    keys={lectureRevenueDistributionKeys}
                                    indexBy="date"
                                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'paired' }}
                                    defs={[
                                        {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: '#38bcb2',
                                            size: 4,
                                            padding: 1,
                                            stagger: true
                                        },
                                        {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: '#eed312',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'fries'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'sandwich'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                1.6
                                            ]
                                        ]
                                    }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'date',
                                        legendPosition: 'middle',
                                        legendOffset: 32,
                                        truncateTickAt: 0
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'price',
                                        legendPosition: 'middle',
                                        legendOffset: -40,
                                        truncateTickAt: 0
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                1.6
                                            ]
                                        ]
                                    }}
                                    legends={[
                                        {
                                            dataFrom: 'keys',
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 120,
                                            translateY: 0,
                                            itemsSpacing: 2,
                                            itemWidth: 100,
                                            itemHeight: 20,
                                            itemDirection: 'left-to-right',
                                            itemOpacity: 0.85,
                                            symbolSize: 20,
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                    role="application"
                                    ariaLabel="Nivo bar chart demo"
                                    barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
                                />
                            ) : (<Typography>로드중...</Typography>)}
                        </Grid>
                    </Grid>
                </Grid>

                {/* line 3 **/}
                <Grid xs={7} item sx={{width:"100%", height:"500px"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{ justifyContent: "space-between", alignItems: "center", display: "inline", mr: 2, lineHeight: 'normal' }}>종합 판매 추이</Typography>
                            <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                <Select
                                    id="period-select"
                                    value={totalSalesTrendPeriodOption}
                                    variant="standard"
                                    size="small"
                                    onChange={(event) => {
                                        setTotalSalesTrendPeriodOption(event.target.value)
                                    }}
                                >
                                    <MenuItem value={0}>최근7일</MenuItem>
                                    <MenuItem value={1}>한달</MenuItem>
                                    <MenuItem value={2}>3개월</MenuItem>
                                    <MenuItem value={3}>6개월</MenuItem>
                                    <MenuItem value={4}>1년</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center", overflow:"auto", p:"1rem"}}>
                            {totalSalesTrend ? (
                                <ResponsiveLine
                                    data={totalSalesTrend}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
                                    curve="linear" // 여기를 변경
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'date',
                                        legendOffset: 36,
                                        legendPosition: 'middle'
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'price',
                                        legendOffset: -40,
                                        legendPosition: 'middle'
                                    }}
                                    enableArea={true}
                                    areaBaselineValue={0}
                                    areaOpacity={0.7}
                                    colors={{ scheme: 'paired' }}
                                    pointSize={10}
                                    pointBorderWidth={2}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    // legends를 제거했다고 가정
                                />
                            ) : (<Typography>로드중...</Typography>)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={5} item sx={{width:"100%", height:"500px"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{ justifyContent: "space-between", alignItems: "center", display: "inline", mr: 2, lineHeight: 'normal' }}>비교 판매 추이</Typography>
                            {myLectureList && (myLectureList.length > 1) && (
                                <>
                                    <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                        <Select
                                            id="period-select"
                                            value={firstLectureId}
                                            variant="standard"
                                            size="small"
                                            //defaultValue={myLectureList[0].id}
                                            onChange={(event) => {
                                                if(event.target.value === secondLectureId){
                                                    alert("같은 강의를 선택할 수 없습니다.")
                                                    return;
                                                }
                                                setFirstLectureId(event.target.value)
                                            }}
                                        >
                                            {/*강의리스트... 기본값은 lectureList[0]이고 두번째 select에서 선택된 강의는 선택불가**/}
                                            {myLectureList ? (
                                                myLectureList.map((item) => {
                                                    return (
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )
                                                })
                                            ) : (<MenuItem value={0}>로드중...</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                        <Select
                                            id="period-select"
                                            value={secondLectureId}
                                            variant="standard"
                                            size="small"
                                            //defaultValue={myLectureList[1].id}
                                            onChange={(event) => {
                                                if(event.target.value === firstLectureId){
                                                    alert("같은 강의를 선택할 수 없습니다.")
                                                    return;
                                                }
                                                setSecondLectureId(event.target.value)
                                            }}
                                        >
                                            {/*강의리스트... 기본값은 lectureList[0]이고 두번째 select에서 선택된 강의는 선택불가**/}
                                            {myLectureList ? (
                                                myLectureList.map((item) => {
                                                    return (
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )
                                                })
                                            ) : (<MenuItem value={0}>로드중...</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                        <Select
                                            id="period-select"
                                            value={compareSalesStatusPeriodOption}
                                            variant="standard"
                                            size="small"
                                            onChange={(event) => {
                                                setCompareSalesStatusPeriodOption(event.target.value)
                                            }}
                                        >
                                            <MenuItem value={0}>최근7일</MenuItem>
                                            <MenuItem value={1}>한달</MenuItem>
                                            <MenuItem value={2}>3개월</MenuItem>
                                            <MenuItem value={3}>6개월</MenuItem>
                                            <MenuItem value={4}>1년</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center", overflow:"auto", p:"1rem"}}>
                            {compareSalesStatus ? (
                                <ResponsiveLine
                                    data={compareSalesStatus}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
                                    curve="natural"
                                    axisTop={null}
                                    axisRight={null}
                                    curve="linear" // 여기를 변경
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: '월',
                                        legendOffset: 36,
                                        legendPosition: 'middle'
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: '값',
                                        legendOffset: -40,
                                        legendPosition: 'middle'
                                    }}
                                    enableArea={true} // 이 부분이 영역을 활성화합니다
                                    areaBaselineValue={0}
                                    areaOpacity={0.7} // 영역의 투명도 설정
                                    colors={{ scheme: 'nivo' }}
                                    pointSize={10}
                                    pointBorderWidth={2}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    legends={[
                                        {
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 100,
                                            translateY: 0,
                                            itemsSpacing: 0,
                                            itemDirection: 'left-to-right',
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.75,
                                            symbolSize: 12,
                                            symbolShape: 'circle',
                                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            ) : (<Typography>로드중...</Typography>)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={12} item sx={{width:"100%", height:"500px"}}>
                    <Grid container sx={{width:"100%", height:"100%", backgroundColor:"#FFFFFF", boxShadow: 3}}>
                        <Grid item xs={12} sx={{borderBottom:1, borderColor:"#A2A2A2", height:"15%", display:"flex", justifyContent:"flex-start", alignItems:"center", px:2}}>
                            <Typography sx={{ justifyContent: "space-between", alignItems: "center", display: "inline", mr: 2, lineHeight: 'normal' }}>수강률 구간</Typography>
                            {myLectureList && (myLectureList.length > 0) && (
                                <FormControl sx={{ width: "100px", ml: "1rem", my: 'auto' }}>
                                    <Select
                                        id="period-select"
                                        value={lectureId}
                                        variant="standard"
                                        size="small"
                                        //defaultValue={myLectureList[0].id}
                                        onChange={(event) => {
                                            setLectureId(event.target.value)
                                        }}
                                    >
                                        {/*강의리스트... 기본값은 lectureList[0]이고 두번째 select에서 선택된 강의는 선택불가**/}
                                        {myLectureList ? (
                                            myLectureList.map((item) => {
                                                return (
                                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                                )
                                            })
                                        ) : (<MenuItem value={0}>로드중...</MenuItem>)}
                                    </Select>
                                </FormControl>
                            )}

                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center", overflow:"auto", p:"1rem"}}>
                            {(lectureSalesVolumeProgress && lectureSalesVolumeProgressKeys) ? (
                                <ResponsiveBar
                                    data={lectureSalesVolumeProgress}
                                    keys={lectureSalesVolumeProgressKeys}
                                    indexBy="progress"
                                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'paired' }}
                                    defs={[
                                        {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: '#38bcb2',
                                            size: 4,
                                            padding: 1,
                                            stagger: true
                                        },
                                        {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: '#eed312',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'fries'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'sandwich'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                1.6
                                            ]
                                        ]
                                    }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'progress',
                                        legendPosition: 'middle',
                                        legendOffset: 32,
                                        truncateTickAt: 0
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'count',
                                        legendPosition: 'middle',
                                        legendOffset: -40,
                                        truncateTickAt: 0
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                1.6
                                            ]
                                        ]
                                    }}

                                    role="application"
                                    ariaLabel="Nivo bar chart demo"
                                    barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
                                />
                            ) : (<Typography>로드중...</Typography>)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default TeacherStats;