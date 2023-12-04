import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    createTheme, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    ThemeProvider
} from "@mui/material";
import DashTop from "../component/DashTop";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";

function Exam(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const accessToken = useSelector((state) => state.accessToken); // redux access token

    const navigate = useNavigate();

    const [childList, setChildList] = useState([]); // 자식 목록
    const [child, setChild] = useState(0); // 자식 선택

    const [page, setPage] = useState(1); // 페이지
    const [more, setMore] = useState(false); // 더 불러올 수 있는지

    const [result, setResult] = useState([]); // 결과

    const getChild = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/parent/children/list`, {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        ).catch((err) => {
            console.log(err);
        }).then((res) => {
            console.log(res);
            if(res && res.data){
                if(res.data.rci.length === 0){
                    alert("자식이 없습니다.")
                    navigate("/parent/dashboard")
                }
                setChildList(res.data.rci)
            }
        })
    }

    const getExam = async (id, page) => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/parent/children/lecture/info?page=${page}&childId=${id}`, {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        ).catch((err) => {
            console.log(err);
        }).then((res) => {
            console.log(res);
            if(res && res.data){
                if(page === 1){
                    console.log(res.data)
                    setResult(res.data)
                    setMore(true);
                }else{
                    setResult(result.concat(res.data))
                    if(res.data.length < 10){
                        setMore(false)
                    }
                }

            }
        })

    }



    useEffect(() => {
        if(accessToken){
            getChild();
        }
    }, [accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{width:"100%", px:'3rem'}}>
                {/* 자녀 선택할 select **/}
                <Grid item xs={12} sx={{mt:"3rem", justifyContent:"flex-start"}}>
                    <FormControl sx={{ m: 1, minWidth: 200 }}> {/* 너비를 늘려줍니다 */}
                        <InputLabel id="demo-simple-select-label">자녀선택</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={child}
                            label="교육선택"
                            onChange={(e) => {
                                setChild(e.target.value)
                            }}
                        >
                            {childList && childList.map((item, idx) => (
                                <MenuItem key={idx} value={item.memberId}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        <Button
                            sx={{
                                mt:"1rem",
                                backgroundColor: 'green',
                                ':hover': {
                                    backgroundColor: 'deepskyblue',
                                },
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                display: 'block', // 버튼을 블록 요소로 만들어 전체 너비를 차지하게 합니다.
                            }}
                            onClick={() => {
                                getExam(child, page)
                            }}
                        >
                            <Typography>성적 보기</Typography>
                        </Button>
                    </FormControl>
                </Grid>
                <Grid xs={12} item>
                    {result && result.map((item, idx) => {
                        return(
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Box sx={{width:"100%", aspectRatio:"8/5", overflow:"hidden"}}>
                                        <img src={item.thumb} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                                    </Box>
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>{item.lectureName}</Typography>
                                    <Divider sx={{my:"0.5rem"}}/>
                                    <Typography variant="body1">중간총점: {item.mainTestScoreDTOs[0].scoringResponseDTO.perfectScore}</Typography>
                                    <Typography variant="body1">받은 점수: {item.mainTestScoreDTOs[0].scoringResponseDTO.score}</Typography>
                                    <Divider sx={{my:"0.5rem"}}/>
                                    <Typography variant="body1">최종총점: {item.mainTestScoreDTOs[1].scoringResponseDTO.perfectScore}</Typography>
                                    <Typography variant="body1">받은 점수: {item.mainTestScoreDTOs[1].scoringResponseDTO.score}</Typography>
                                </Paper>
                            </Grid>
                            )
                    })}
                </Grid>
                {more && (
                    <Grid item xs={12} sx={{mt:"3rem"}}>
                        <Button
                            sx={{
                                mt:"1rem",
                                backgroundColor: 'green',
                                ':hover': {
                                    backgroundColor: 'deepskyblue',
                                },
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                display: 'block', // 버튼을 블록 요소로 만들어 전체 너비를 차지하게 합니다.
                            }}
                            onClick={() => {
                                setPage(page+1)
                                getExam(child, page+1)
                            }}
                        >
                            <Typography>더 불러오기</Typography>
                        </Button>
                    </Grid>
                )}
            </Grid>
        </ThemeProvider>
    );
}

export default Exam;