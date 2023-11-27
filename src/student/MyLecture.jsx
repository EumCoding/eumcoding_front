import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme, Grid, MenuItem, Select, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import Typography from "@mui/material/Typography";
import lectureThumb from "../images/강의썸네일.png";
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function MyLecture(props) {
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
    const [sort, setSort] = useState(0);
    const [page, setPage] = useState(1);
    const [result, setResult] = useState(null); // 결과담을 state
    const [more, setMore] = useState(true); // 더 결과가 있는지

    // 서버에서 결과 받아오기
    const getMyLecture = async (pageParam) => { // pageParam : 가져올 page
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/member/mylecture/list?page=${pageParam}&sort=1&size=12`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).catch((err) => {
            console.log(err)
        }).then((res) => {
            console.log(res)
            if(pageParam > 1){ // 1페이지가 아닌경우
                // 깊은복사
                const temp = JSON.parse(JSON.stringify(result))
                res && res.data && setResult(temp.concat(res.data));
            }else{
                res && res.data && setResult(res.data);
            }
            if(res && (res.data.length < 12)){
                setMore(false);
            }
        })
    }

    useEffect(() => {
        getMyLecture(1); // 최초 1페이지 가져옴
    },[, accessToken])

    useEffect(() => {
        if(page > 1){
            getMyLecture(page);
        }
    }, [page])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{px:"5rem", pt:"2rem", width:"100vw"}} spacing={2}>
                <Grid xs={12} item display='flex' justifyContent='flex-start' alignItems='center' sx={{mb:"2rem"}}>
                    <Select
                        onChange={(e) => setSort(e.target.value)}
                        label="정렬"
                        defaultValue={sort}
                        sx={{mr:"1.5rem"}}
                    >
                        <MenuItem value="0">최신순</MenuItem>
                        <MenuItem value="1">진행도순</MenuItem>
                        <MenuItem value="2">오래된순</MenuItem>
                    </Select>
                    <TextField variant={"outlined"} label="검색어" sx={{mr:"1rem", height:"100%", aspectRatio: "10/1"}} />
                    <Button sx={{backgroundColor: "#0B401D", height:"100%", aspectRatio: "3/1", borderRadius:"0.3vw"}}>
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#FFFFFF"}}>검색</Typography>
                    </Button>
                </Grid>
                <Grid xs={12} container item display='flex' justifyContent='flex-start' alignItems='center' sx={{width:"100%"}}
                    spacing={2}
                >
                    {/* item **/}
                    {result && result.map((item, idx) => {
                        return(
                            <Grid xs={3} container item sx={{width:"100%"}} onClick={() => navigate(`/my/lectureInfo/${item.lectureId}`)}>
                                <Grid xs={12} item sx={{width:"100%"}} >
                                    <div style={{width:"100%", aspectRatio: "8:5", overflow:"hidden"}} >
                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item.thumb} />
                                    </div>
                                </Grid>
                                <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{mt:"0.2rem"}}>
                                    <Typography sx={{fontWeight:"900", fontSize:"1rem"}}>
                                        {item.lectureName}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{pt:"0.5rem"}}>
                                    <Typography sx={{fontWeight:"900", fontSize:"0.5rem", color:"#8D8D8D"}}>
                                        진행률 : {item.progress}%
                                    </Typography>
                                </Grid>
                            </Grid>
                            )
                    })}

                </Grid>
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
        </ThemeProvider>
    );
}

export default MyLecture;