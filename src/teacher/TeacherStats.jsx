import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Box, createTheme, Grid, ThemeProvider, Typography} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";
import {ResponsivePie} from "@nivo/pie";
import { ResponsiveBar } from '@nivo/bar'
import dayjs from "dayjs";

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
        axios.post("http://localhost:8099/stats/total-cnt",null, {
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
        axios.post("http://localhost:8099/stats/total-rating",null, {
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
        axios.post("http://localhost:8099/stats/total-student",null, {
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
        axios.post("http://localhost:8099/stats/total-revenue",null, {
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
        axios.post("http://localhost:8099/stats/total-volume-percentage",null, {
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
        axios.post("http://localhost:8099/stats/revenue-distribution",{
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

    // 총 강좌 수 가져오기
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
        }
    }, [accessToken]);

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
                            <Typography sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>강의별 수익 분포</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{height:"85%", display:"flex", justifyContent:"flex-start", alignItems:"center", overflow:"auto"}}>
                            {(lectureRevenueDistribution.length > 0) && (lectureRevenueDistributionKeys.length > 0) ? (
                                <ResponsiveBar
                                    data={lectureRevenueDistribution}
                                    keys={lectureRevenueDistributionKeys}
                                    indexBy="country"
                                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'nivo' }}
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
                                        legend: 'country',
                                        legendPosition: 'middle',
                                        legendOffset: 32,
                                        truncateTickAt: 0
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'food',
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
            </Grid>
        </ThemeProvider>
    );
}

export default TeacherStats;