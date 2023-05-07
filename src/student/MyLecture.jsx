import React, {useState} from 'react';
import {Box, Button, createTheme, Grid, MenuItem, Select, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import Typography from "@mui/material/Typography";

function MyLecture(props) {
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
                    },
                },
            },
        },
    });
    const [sort, setSort] = useState("최신순");

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{px:"2rem", pt:"2rem"}}>
                <Grid xs={12} item direction='flex' justifyContent='center' alignItems='center'>
                    <Select
                        onChange={(e) => setSort(e.target.value)}
                        label="정렬"
                        defaultValue={sort}
                        sx={{mr:"1.5rem"}}
                    >
                        <MenuItem value="최신순">최신순</MenuItem>
                        <MenuItem value="진행도순">진행도순</MenuItem>
                        <MenuItem value="오래된순">오래된순</MenuItem>
                    </Select>
                    <TextField variant={"outlined"} label="검색어" sx={{mr:"1rem", height:"100%", aspectRatio: "10/1"}} />
                    <Button sx={{backgroundColor: "#0B401D", height:"100%", aspectRatio: "3/1", borderRadius:"0.3vw"}}>
                        <Typography sx={{fontWeight:"900", fontSize:"1rem", color:"#FFFFFF"}}>검색</Typography>
                    </Button>
                </Grid>
                <Grid xs={3} item>

                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyLecture;