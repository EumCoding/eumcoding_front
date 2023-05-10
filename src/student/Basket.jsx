import React from 'react';
import {Box, createTheme, Grid, ThemeProvider} from "@mui/material";
import TopBar from "../component/TopNav";
import Typography from "@mui/material/Typography";

function Basket(props) {
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


    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Box sx={{height: 80}}/>
            <Grid container sx={{px:{xs:"20vw", md:"3vw", pt:"10rem"}}} spacing={3}>
                <Grid item container md={7}>
                    <Grid container item sx={12} display={"flex"} justifyContent={"center"} alignItem={"center"}>
                        <Grid xs={12} display={"flex"} justifyContent={"flex-start"} alignItem={"center"} sx={{py:"2rem"}}>
                            <Typography sx={{color:"#000000", fontWeight:"900", fontSize:"3rem"}}>
                                장바구니
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={5}></Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Basket;