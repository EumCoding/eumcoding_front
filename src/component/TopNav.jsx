import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import {Button, createTheme, Grid, MenuItem, ThemeProvider} from "@mui/material";
import styles from './css/TopNav.module.css';


const pages = ["강의", "테마별 강의", "소개", "검색"];


export default function TopBar() {


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo-Variable',
        },
        palette: {
            primary: {
                main: '#FFFFFF',
            },
            secondary: {
                main: '#1E90FF',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                        @font-face {
                          font-family: 'NanumSquareNeo-Variable';
                          font-style: normal;
                          font-display: swap;
                          font-weight: normal;
                          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2') format('woff2');
                          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
                        }
                      `,
            },
            MuiToolbar: {
                styleOverrides: {
                    dense: {
                        height: 64,
                        minHeight: 64
                    }
                }
            }
        },
    });

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{px:{xs:"5%", sm:"10%", md:"10%", lg:"20%"}}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                my: 2,
                                mr: 2,
                                display: 'flex',
                                color: '#3767A6',
                                textDecoration: 'none',
                                alignItems: 'center',
                            }}
                        >
                            <b className={styles.font_logo}>이음코딩</b>
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}} justifyContent={"flex-end"}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center" sx={{color:'#000000'}}>{page}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" sx={{color:'#000000'}}>로그인</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Box direction="row"
                             justifyContent="center"
                             alignItems="center"
                             sx={{flexGrow: 1, height:'100%', display: {xs: 'none', md: 'flex', alignItems: 'center'}}}>
                            {/*{pages.map((page) => (*/}
                            {/*    <Button*/}
                            {/*        direction="row"*/}
                            {/*        key={page}*/}
                            {/*        onClick={handleCloseNavMenu}*/}
                            {/*        sx={{my: 2, color: 'white', display: 'block'}}*/}
                            {/*    >*/}
                            {/*        <Typography textAlign="center" sx={{color:'#000000'}}>{page}</Typography>*/}
                            {/*    </Button>*/}
                            {/*))}*/}
                            <Grid container justifyContent="center" alignItems="center" spacing={0} sx={{flexGrow:1, height:'100%'}}>
                                {pages.map((page) => (
                                    <Grid item md={12/(pages.length+1)}>
                                        <Typography  textAlign="center" sx={{color:'#000000'}}>
                                            <b className={styles.font_menu}>{page}</b>
                                        </Typography>
                                    </Grid>
                                ))}
                                <Grid
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    item
                                    md={12/(pages.length+1)}
                                    sx={{p:0, height:'100%'}}>
                                    <Box display="flex"
                                         justifyContent="center"
                                         alignItems="center"
                                         sx={{ borderRadius: '15vw', border:1, borderColor:"#000000", height:"100%", m:0, p:1, aspectRatio:"4:1" }}>
                                        <b className={styles.font_menu}>로그인</b>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>

    );
}
