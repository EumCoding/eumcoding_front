import React from 'react';
import {Button, createTheme, Grid, ThemeProvider} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import styles from "./css/DashTop.module.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function DashTop(props) {
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{background:"#0B401D", px:{md:"5rem", sx:"2rem", zIndex: 9999}}}>
                <Toolbar sx={{height:"5rem"}}>
                    <Box flexGrow={1}>
                        <div className={styles.font_logo}>
                            이음코딩 대시보드
                        </div>
                    </Box>
                    <Button color="inherit"
                            sx={{
                                borderRadius:"20px", border:"2px", background:"#FFFFFF",
                                width:"8rem"
                                }}>
                        <div className={styles.font_menu}>
                            MY
                        </div>
                    </Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>

        );
}

export default DashTop;