import React, {useEffect, useState} from 'react';
import {Box, Button, Collapse, createTheme, Divider, Grid, TextField, ThemeProvider} from "@mui/material";
import DashTop from "../component/DashTop";
import FaceIcon from "@mui/icons-material/Face6";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from "js-cookie"
import {postcodeScriptUrl} from "react-daum-postcode/lib/loadPostcode";
import {useDaumPostcodePopup} from "react-daum-postcode";


function MyPage(props) {
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    const [profile, setProfile] = useState(null); // 프로필 저장될 부분

    const navigate = useNavigate()

    const [name, setName] = useState(""); // 이름
    const [nickname, setNickname] = useState("") // 닉네임
    const [email, setEmail] = useState("") // 이메일
    const [curPw, setCurPw] = useState("") // 현재 비밀번호(입력받기)
    const [chgPw1, setChgPw1] = useState("") // 변경할 비밀번호
    const [chgPw2, setChgPw2] = useState("") // 변경할 비밀번호(확인용)
    const [tel, setTel] = useState("01000000000"); // 전화번호

    const [address, setAddress] = useState("");

    const [nameEdit, setNameEdit] = useState(false); // 이름 편집 시 true
    const [nickEdit, setNickEdit] = useState(false);
    const [pwEdit, setPwEdit] = useState(false); // 비밀번호 편집 시 true
    const [telEdit, setTelEdit] = useState(false); // 전화번호 편집 시 true


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

    // Daum post

    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        setAddress(data.address); // 사용자가 선택한 주소를 넣어줌
        updateAddress(data.address);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    // 주소 변경
    const updateAddress = async (addr) => {
        const response = await axios.post(
            `http://localhost:8099/member/updateaddress`, {address: addr}, {
                headers:{'Authorization': `Bearer ${accessToken}`,}
            }
        ).then((res) => {
                // 회원정보 재요청
                getProfile();
                // 관련 state 초기화
                setAddress("");
            }
        ).catch((err) => {
            alert("실패해쓰요")
            console.log(err);
        })
    }

    // 전화번호 변경
    const updateTel = async () => {
        const response = await axios.post(
            `http://localhost:8099/member/updatetel`, {tel: tel}, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                // 회원정보 재요청
                getProfile();
                // 닉네임 변경 관련 state 초기화
                setTelEdit(false);
            }
        ).catch((err) => {
            alert("이미 같은 전화번호가 있어요.")
        })
    }

    // 전화번호 변경 시 숫자만 들어가게
    const handleTelChange = (e) => {
        const value = e.target.value;

        // 입력된 값이 숫자인지 확인
        if (!isNaN(value)) {
            setTel(value);
        }
    }

    // 최초 정보 가져오기
    const getProfile = async () => {
        const response = await axios.post(
            `http://localhost:8099/member/info`,
            null,
            {
                headers:{Authorization: `${accessToken}`,}
            }
        ).then((res) => {
            res.data && setProfile(res.data)
            console.log(res)
        }).catch((err) => console.log(err))

    }

    // 닉네임 변경
    const updateNickname = async () => {
        const response = await axios.post(
            `http://localhost:8099/member/updatenickname`, {nickname: nickname}, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                // 회원정보 재요청
                getProfile();
                // 닉네임 변경 관련 state 초기화
                setNickEdit(false);
            }
        ).catch((err) => {
            alert("이미 같은 닉네임이 있어요")
        })
    }

    useEffect(() => {
        if(!accessToken && !Cookies.get('accessToken')){
            navigate("/login");
        }
        getProfile();
    },[,accessToken])

    // 비밀번호 변경
    const updatePw = async () => {
        if(chgPw1 !== chgPw2){
            alert("비밀번호가 일치하지 않습니다.")
            return;
        }
        const response = await axios.post(
            `http://localhost:8099/member/updatepw`, {chgPw: chgPw1, curPw: curPw}, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                // 회원정보 재요청
                getProfile();
                // 닉네임 변경 관련 state 초기화
                setPwEdit(false);
                setChgPw2(false);
                setChgPw1(false);
            }
        ).catch((err) => {
            alert("비밀번호를 확인해주세요.")
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Box sx={{height: 80}}/>
            <Grid justifyContent='center' container sx={{px:'20%'}}>
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      >
                    <FaceIcon sx={{fontSize: '10rem'}}/>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems={"center"}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'3rem'}}>
                        {nickEdit === false && profile && profile.nickname}
                        {nickEdit === true && (
                            <TextField variant="standard" sx={{mr: "1rem",
                                '& .MuiInputBase-root': {
                                    fontSize: '3rem',
                                },
                            }}
                                       value={nickname} onChange={(e) => setNickname(e.target.value)}
                            />
                        )}
                        {/* 편집 버튼 눌렀을 시에는 TextField로 변환 **/}
                        {nickEdit === true && (
                            <CloseIcon onClick={() => setNickEdit(false)} />
                        )}
                        {nickEdit === true && (
                            <CheckIcon onClick={() => nickname !== "" ? updateNickname() : alert("닉네임을 써주세요")}/>
                        )}
                        {nickEdit === false && (
                            <EditIcon onClick={() => setNickEdit(true)}/>
                        )}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'3rem'}}><Divider/></Grid>
                {/* 이메일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>이메일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        {profile && profile.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{py:'1rem'}}></Grid>
                {/* 이름 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:'3rem'}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>이름</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:'3rem'}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        {profile && profile.name}
                    </Typography>
                </Grid>
                {/* 비밀번호 **/}
                <Grid xs={12} item container sx={{width:"100%"}}>
                    <Grid item xs={4} display={"flex"} justifyContent="center" alignItems={"center"}
                          sx={{pb:"3rem"}}
                    >
                        <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>비밀번호</Typography>
                    </Grid>
                    <Grid item xs={8} display={"flex"} justifyContent="flex-start" alignItems={"center"}
                          sx={{pb:"3rem"}}
                    >
                        <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}
                                    display={"flex"} justifyContent="flex-start" alignItems={"center"}
                        >
                            {pwEdit === false && "**********"}
                            {pwEdit === true && (
                                <TextField variant="standard" sx={{mr: "1rem"}} type={"password"} value={chgPw1} onChange={(e) => setChgPw1(e.target.value)}/>
                            )}
                            {/* 편집 버튼 눌렀을 시에는 TextField로 변환 **/}
                            {pwEdit === false && (
                                <EditIcon onClick={() => pwEdit === true ? setPwEdit(false) : setPwEdit(true)}/>
                            )}
                            {chgPw1 !== chgPw2 && "비밀번호가 일치하지 않습니다."}
                        </Typography>
                    </Grid>
                </Grid>

                {/* 비밀번호 확인 - 비밀번호 옆 편집 버튼 눌렀을 시에만 활성화**/}
                <Grid xs={12} container item>
                    <Collapse in={pwEdit} sx={{width:"100%"}}>
                        <Grid xs={12} item container>
                            <Grid item xs={4} display={"flex"} justifyContent="center"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>비밀번호 확인</Typography>
                            </Grid>
                            <Grid item xs={8} display={"flex"} justifyContent="flex-start"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}
                                            display={"flex"} justifyContent="flex-start" alignItems={"center"}
                                >
                                    <TextField variant="standard" sx={{mr: "1rem"}} type={"password"} value={chgPw2} onChange={(e) => setChgPw2(e.target.value)}/>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item container>
                            <Grid item xs={4} display={"flex"} justifyContent="center"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>현재 비밀번호</Typography>
                            </Grid>
                            <Grid item xs={8} display={"flex"} justifyContent="flex-start"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}
                                            display={"flex"} justifyContent="flex-start" alignItems={"center"}
                                >
                                    <TextField variant="standard" sx={{mr: "1rem"}} type={"password"} value={curPw} onChange={(e) => setCurPw(e.target.value)}/>
                                    {pwEdit === true && (
                                        <CloseIcon onClick={() => setPwEdit(false)}/>
                                    )}
                                    <CheckIcon onClick={() => updatePw()}/>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
                {/* 가입일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>가입일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        {profile && profile.joinDay}
                    </Typography>
                </Grid>
                {/* 생일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>생일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1rem', color:'#8D8D8D'}}>
                        {profile && profile.birthDay}
                    </Typography>
                </Grid>
                {/* 주소 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>주소</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}>
                        {profile && profile.address}<EditIcon onClick={handleClick} />
                    </Typography>
                </Grid>

                {/* 전화번호 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'1.7rem'}}>전화번호</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{fontWeight:'900', fontSize:'1rem', color:'#000000'}}>
                        {telEdit === false && profile && profile.tel}
                        {telEdit === true && (
                            <TextField variant="standard" sx={{mr: "1rem"}}
                                       value={tel} onChange={handleTelChange}
                            />
                        )}
                        {/* 편집 버튼 눌렀을 시에는 TextField로 변환 **/}
                        {telEdit === true && (
                            <CloseIcon onClick={() => setTelEdit(false)} />
                        )}
                        {telEdit === true && (
                            <CheckIcon onClick={() => updateTel()}/>
                        )}
                        {telEdit === false && (
                            <EditIcon onClick={() => setTelEdit(true)}/>
                        )}
                    </Typography>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyPage;