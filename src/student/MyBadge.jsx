import React, {useEffect, useState} from 'react';
import {Badge, Box, createTheme, Grid, Paper, ThemeProvider} from "@mui/material";
import axios from "axios";
import DashTop from "../component/DashTop";
import {useSelector} from "react-redux";


function MyBadge(props) {
    // theme
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const [results, setResults] = useState(null); // 결과담을 state

    // accessToken
    const accessToken = useSelector((state) => state.accessToken);

    // 뱃지 리스트 가져오기... /member/payment/lecture/badge
    const getBadgeList = async() => {
        console.log("뱃지 리스트를 가져옵니다...")
        console.log(`${process.env.REACT_APP_API_URL}/member/payment/lecture/badge`)
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/member/payment/lecture/badge`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        ).then((res) => {
            if(res && res.data){
                console.log(res);
                setResults(res.data.payLectureBadgeDTO)
            }
        }).catch((err) => console.log(err))
        return response;
    }

    useEffect(() => {
        getBadgeList();
    },[accessToken])

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container justifyContent="center" spacing={2} sx={{width:"100%", mt:"1rem", justifyContent:"flex-start", px:"2rem"}}>
                {results && results.map((result, index) => (
                    <Grid item key={index} xs={2} sx={{p:10}}>
                        <Paper elevation={4}>
                            <Box>
                                <Box
                                    id={`lecture-${result.lecutreId}`}
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={result.badgeCount}
                                    sx={{width:"100%", aspectRatio:"1/1", overflow:"hidden"}}
                                >
                                    <img src={result.badge} alt={`강의 뱃지 ${result.lecutreId}`} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </ThemeProvider>
    );
}

export default MyBadge;