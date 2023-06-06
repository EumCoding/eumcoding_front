import React, {useEffect, useState} from 'react';
import TopBar from "../component/TopNav";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Button, createTheme, Grid, MenuItem, Select, TextField, ThemeProvider} from "@mui/material";
import Typography from "@mui/material/Typography";
import lectureThumb from "../images/강의썸네일.png";
import axios from "axios";

const itemsPerPage = 12;  // 페이지 당 표시할 항목의 개수


function Search(props) {
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.accessToken)

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [keyword, setKeyword] = useState(queryParams.get('keyword'));

    const [result, setResult] = useState(null);

    const [sort, setSort] = useState(0);

    const [page, setPage] = useState(queryParams.get("page")) // 현재 페이지

    const [pageArr, setPageArr] = useState([]) // 페이징 넘버링을 관리할 곳

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const [newKeyword, setNewKeyword] = useState("");

    // 검색 api 호출
    const search = async (pageParam, keywordParam) => {
        const response = await axios.get(
            `http://localhost:8099/unauth/search/lecture?searchKeyword=${keywordParam}&size=12&page=${pageParam}`
        ).then((res) => {
            console.log(res.data);
            setResult(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    const [endPage, setEndPage] = useState(10);


    const goToPrevPage = () => {
        if ( page > 1 && page < 11) {
            setPage(page - 1);
            search(page-1, keyword)
        }
        if(page >= 11){
            setPage(page - 10)
            search(page - 10, keyword)
        }
    }

    const goToNextPage = () => {
        if (endPage < Math.ceil(result.count / itemsPerPage)) {
            setPage(page + 10);
            search(page+10, keyword)
        }
    }

    const pageNum = () => {
        if (result && result.count) {
            let startPage = Math.floor((page - 1) / 10) * 10 + 1;
            let newEndPage = startPage + 9;
            if (newEndPage > Math.ceil(result.count / itemsPerPage)) newEndPage = Math.ceil(result.count / itemsPerPage);

            let pageNumbers = [];
            for (let i = startPage; i <= newEndPage; i++) {
                pageNumbers.push(i);
            }
            setPageArr(pageNumbers);
            setEndPage(newEndPage);
        }
    }

    // page state가 바뀔 때
    useEffect(() => {
        // 페이지와 api 호출 결과값이 바뀔 때마다 아래의 페이지 넘버 체킹
        pageNum();
    }, [,page,result])

    // 결과가 바뀔 때
    useEffect(() => {
        // 키워드 값 재설정
        setKeyword(queryParams.get('keyword'));
        setPage(queryParams.get('page'));
    }, [result])

    useEffect(() => {
        search(page, keyword);
    },[])

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Grid container sx={{pt:"2rem", px:{xs:"5%", sm:"10%", md:"10%", lg:"20%"}}}>
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
                    <TextField variant={"outlined"} label="검색어" sx={{mr:"1rem", height:"100%", aspectRatio: "10/1"}}
                        onChange={(e) => setNewKeyword(e.target.value)}
                    />
                    <Button sx={{backgroundColor: "#0B401D", height:"100%", aspectRatio: "3/1", borderRadius:"0.3vw"}}
                        onClick={() => {
                            navigate(`/search?keyword=${newKeyword}&page=1`)
                            search(1, newKeyword)
                        }}
                    >
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#FFFFFF"}}>검색</Typography>
                    </Button>
                </Grid>
                <Grid xs={12} container item display='flex' justifyContent='flex-start' alignItems='center' sx={{width:"100%"}}
                      spacing={2}
                >
                    {/* items **/}
                    {result && result.content.map((item) => {
                        return(
                            <Grid xs={4} container item sx={{width:"100%"}}
                                onClick={() => navigate(`/lecture/${item.lectureId}`)}
                            >
                                <Grid xs={12} item sx={{width:"100%"}}>
                                    <div style={{width:"100%", aspectRatio: "8:5", overflow:"hidden"}}>
                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={lectureThumb} />
                                    </div>
                                </Grid>
                                <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{mt:"0.2rem"}}>
                                    <Typography sx={{fontWeight:"900", fontSize:"1rem"}}>
                                        {item.lectureName}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{pt:"0.5rem"}}>
                                    <Typography sx={{fontWeight:"900", fontSize:"0.5rem", color:"#8D8D8D"}}>
                                        {item.teacherName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )
                    })}

                    <Grid xs={4} container item sx={{width:"100%"}}>
                        <Grid xs={12} item sx={{width:"100%"}}>
                            <div style={{width:"100%", aspectRatio: "8:5", overflow:"hidden"}}>
                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={lectureThumb} />
                            </div>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{mt:"0.2rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"1rem"}}>
                                무작정 따라하는 우리아이 첫 코딩교육
                            </Typography>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{pt:"0.5rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"0.5rem", color:"#8D8D8D"}}>
                                진행률 : 50%
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={4} container item sx={{width:"100%"}}>
                        <Grid xs={12} item sx={{width:"100%"}}>
                            <div style={{width:"100%", aspectRatio: "8:5", overflow:"hidden"}}>
                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={lectureThumb} />
                            </div>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{mt:"0.2rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"1rem"}}>
                                무작정 따라하는 우리아이 첫 코딩교육
                            </Typography>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{pt:"0.5rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"0.5rem", color:"#8D8D8D"}}>
                                진행률 : 50%
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={4} container item sx={{width:"100%"}}>
                        <Grid xs={12} item sx={{width:"100%"}}>
                            <div style={{width:"100%", aspectRatio: "8:5", overflow:"hidden"}}>
                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={lectureThumb} />
                            </div>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{mt:"0.2rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"1rem"}}>
                                무작정 따라하는 우리아이 첫 코딩교육
                            </Typography>
                        </Grid>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} item sx={{pt:"0.5rem"}}>
                            <Typography sx={{fontWeight:"900", fontSize:"0.5rem", color:"#8D8D8D"}}>
                                진행률 : 50%
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid xs={12} container item display='flex' justifyContent='center' alignItems='center' sx={{width:"100%", py:"3rem"}}>
                    <Grid xs={1} item>
                        <Button sx={{border:0}} disabled={page === 1} onClick={goToPrevPage}>
                            <Typography >◁</Typography>
                        </Button>
                    </Grid>
                    {/* 총 검색결과에서 현재페이지 **/}
                    {pageArr && pageArr.map((item, idx) => {
                        return(
                            <Grid xs={1} item>
                                <Button sx={{border:0}}
                                        onClick={(e) => {
                                            navigate(`/search?keyword=${keyword}&page=${item}`);
                                            setPage(item)
                                            search(item, keyword)
                                        }}
                                >
                                    <Typography sx={{color:"#000000", fontWeight : item == page ? "900" : "500"}} >{item}</Typography>
                                </Button>
                            </Grid>
                        )
                    })}
                    <Grid xs={1} item >
                        <Button sx={{border:0}} disabled={endPage >= Math.ceil((result ? result.count : 0)/ itemsPerPage)}
                                onClick={goToNextPage}
                        >
                            <Typography >▷</Typography>

                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Search;