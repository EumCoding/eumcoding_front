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
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearAccessToken} from "../redux/actions";
import Cookies from "js-cookie"
import testImg from "../images/test.png"



const pages = ["강의", "블록코딩", "장바구니", "대시보드"];


export default function TopBar(props) {
    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.accessToken); // redux access token
    const role = useSelector((state) => state.role); // role
    const navigate = useNavigate();

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
                main: '#1B65FF',
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

    // 로그아웃 버튼
    const handleLogout = () => {
        // 로그아웃 처리 로직

        // 가정: 로그아웃 버튼 클릭 시 access token을 초기화한다.
        dispatch(clearAccessToken());
    };

    // 로그아웃
    const logout = () => {
        dispatch(clearAccessToken()); // 리덕스에서 토큰 제거
        Cookies.remove('accessToken'); // 쿠키에 들어있던 accessToken 제거
    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="sticky" sx={{ top: 0, px: { xs: "5%", sm: "10%", md: "10%", lg: "20%" } }}>
                <Container maxWidth="xl" sx={{padding:{xs:0, md:0}}}>
                    <Toolbar disableGutters sx={{p:0, m:0}}>
                        <Box
                            noWrap
                            component="a"
                            sx={{
                                my: 2,
                                mr: 2,
                                display: 'flex',
                                justifyContent:"flex-start",
                                alignItems: 'center',
                                height:"45px"
                            }}
                            onClick={() => navigate("/main")}
                        >
                            <img className="logoImg" src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Logo" style={{ height: "100%",objectFit: "cover" }}/>
                        </Box>

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

                                        <Typography  textAlign="center" sx={{ color: '#000000', cursor: 'default' }}
                                            onClick={() => {
                                                if(page === "대시보드") {
                                                    if(!accessToken) navigate("/login");
                                                    if(role === "0") {
                                                        navigate("/dashboard");
                                                    }
                                                    if(role === "1") {
                                                        navigate("/teacher/dashboard");
                                                    }
                                                    if(role === "3") {
                                                        navigate("/parent/dashboard");
                                                    }
                                                }
                                                if(page === "강의") {
                                                    if(!accessToken) navigate("/login");
                                                    navigate("/search?keyword=&page=1&sort=0");
                                                }
                                                if(page === "블록코딩") {
                                                    navigate("/block");
                                                }
                                                if(page === "장바구니") {
                                                    if(!accessToken) navigate("/login");
                                                    navigate("/my/basket");
                                                }
                                            }}
                                        >
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
                                    <Button display="flex"
                                         justifyContent="center"
                                         alignItems="center"
                                         onClick={() => accessToken ? logout() : navigate("/login")}
                                         sx={{
                                             borderRadius: '15vw',
                                             border: 1,
                                             borderColor: "#A2A2A2",
                                             height: "100%",
                                             m: 0,
                                             px:"1rem",
                                             py:"0.5rem",
                                             '&:hover': {
                                                 backgroundColor: 'skyblue',
                                                 transition: 'background-color 0.3s'
                                             }
                                         }}>
                                        <Typography sx={{whiteSpace:"nowrap", color:"#000000"}}>{accessToken?"로그아웃":"로그인"}</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>

    );
}
