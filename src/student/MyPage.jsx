import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, Collapse, createTheme, Divider, Grid, TextField, ThemeProvider} from "@mui/material";
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
import kakao from "../images/kakao.svg"
import IconButton from "@mui/material/IconButton";



function MyPage(props) {
    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰
    const role = useSelector((state) => state.role); // 역할

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

    // 학부모만 사용하는 state
    const [childList, setChildList] = useState([]); // 자녀 리스트
    const [isChild, setIsChild] = useState(false); // 자녀가 있는지 없는지 판별
    const [isParent, setIsParent] = useState(false); // 학부모인지 아닌지 판별


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
            `${process.env.REACT_APP_API_URL}/member/updateaddress`, {address: addr}, {
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
            `${process.env.REACT_APP_API_URL}/member/updatetel`, {tel: tel}, {
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
            `${process.env.REACT_APP_API_URL}/member/info`,
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
            `${process.env.REACT_APP_API_URL}/member/updatenickname`, {nickname: nickname}, {
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
            `${process.env.REACT_APP_API_URL}/member/updatepw`, {chgPw: chgPw1, curPw: curPw}, {
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

    // 학부모인 경우 호출할 자녀 리스트 api
    const getChildList = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/parent/children/list`, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                setChildList(res.data);
                setIsChild(true); // 자녀가 있음
                console.log(res);
            }
        ).catch((err) => {
            setIsChild(false)
            console.log(err);
        })
    }

    // 이메일 인증번호 요청
    const sendConfirmEmail = async (paramEmail) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/parent/request?childEmail=${paramEmail}`,null, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                alert("자녀의 이메일로 인증번호를 보냈습니다.");
            }
        ).catch((err) => {
            alert("가입되지 않았거나 이미 등록된 자녀입니다.")
        })
    }

    // 인증번호 인증하기
    const confirmEmail = async (paramEmail, paramCode) => {
        // 인코딩
        const tempEmail = encodeURIComponent(paramEmail);
        const tempCode = encodeURIComponent(paramCode);
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/parent/verify?childEmail=${tempEmail}&verificationNumber=${tempCode}`,null, {
                headers:{'Authorization': `${accessToken}`,}
            }
        ).then((res) => {
                alert("인증되었습니다.");
                // 자녀리스트 다시 가져오기
                getChildList();
            }
        ).catch((err) => {
            alert("인증번호가 틀렸습니다.")
        })
    }

    const handleKakaoLogin = () => {
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_MY_URL}/oauth/callback/kakao&response_type=code`;
        window.location.href = KAKAO_AUTH_URL; // 리디렉션 방식
        // 또는
        // window.open(KAKAO_AUTH_URL, "카카오 로그인", "width=500, height=500"); // 팝업 방식
    };

    useEffect(() => {
        if(role === "3"){
            console.log("학부모... 자녀리스트 호출...")
            getChildList();
            setIsParent(true);
        }
    }, [role]);

    const uploadImage = (file) => {
        const formData = new FormData();

        // 이미지 파일이 선택된 경우
        if (file) {
            formData.append('profileImgRequest', file);
        }else{
            alert("이미지를 선택해주세요")
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/member/updateProfileImg`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${accessToken}`,
            }
        }).then(response => {
            // 이미지 업로드 성공 시 처리
            console.log(response.data);
            alert('이미지 업로드 성공');
        }).catch(error => {
            // 에러 처리
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 실패');
        });
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };



    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid justifyContent='center' container sx={{px:'20%', pt:"2rem"}}>
                <Grid item xs={5}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                >
                    {profile && profile.profile ? (
                        <Avatar src={profile.profile} sx={{ width: '5rem', height: '5rem' }}/>
                    ) : (
                        <Avatar sx={{ width: '5rem', height: '5rem' }} />
                    )}
                    <input
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={handleImageChange}
                        id="upload-profile-image"
                    />
                    <label htmlFor="upload-profile-image">
                        <IconButton component="span">
                            <EditIcon />
                        </IconButton>
                    </label>
                </Grid>
                <Grid item xs={7}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems={"center"}
                >
                    <Typography sx={{fontWeight:'900', fontSize:'2rem'}}>
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
                <Grid item xs={12} sx={{py:'1rem'}}><Divider/></Grid>
                {/* 이메일 **/}
                <Grid item xs={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pt:'1rem', pb:"0.5rem"}}
                >
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>이메일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                >
                    <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#8D8D8D'}}>
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
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>이름</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:'3rem'}}
                >
                    <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#8D8D8D'}}>
                        {profile && profile.name}
                    </Typography>
                </Grid>
                {/* 비밀번호 **/}
                <Grid xs={12} item container sx={{width:"100%"}}>
                    <Grid item xs={4} display={"flex"} justifyContent="center" alignItems={"center"}
                          sx={{pb:"3rem"}}
                    >
                        <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>비밀번호</Typography>
                    </Grid>
                    <Grid item xs={8} display={"flex"} justifyContent="flex-start" alignItems={"center"}
                          sx={{pb:"3rem"}}
                    >
                        <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}
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
                                <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>비밀번호 확인</Typography>
                            </Grid>
                            <Grid item xs={8} display={"flex"} justifyContent="flex-start"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}
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
                                <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>현재 비밀번호</Typography>
                            </Grid>
                            <Grid item xs={8} display={"flex"} justifyContent="flex-start"
                                  alignItems={"center"}
                                  sx={{pb:"3rem"}}
                            >
                                <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}
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
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>가입일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#8D8D8D'}}>
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
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>생일</Typography>
                </Grid>
                <Grid item xs={8}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{pb:"3rem"}}
                >
                    <Typography sx={{fontWeight:'800', fontSize:'1rem', color:'#8D8D8D'}}>
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
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>주소</Typography>
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
                        sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}>
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
                    <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>전화번호</Typography>
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
                        sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}>
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

                {/* 자녀가 없는 경우 자녀를 등록함 **/}
                {isParent && (
                    <Grid item container xs={12}>
                        <Grid item xs={4}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{pb:"3rem"}}
                        >
                            <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>자녀등록</Typography>
                        </Grid>
                        <Grid item container xs={8}
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              sx={{pb:"3rem"}}
                        >
                            <Grid item xs={9}>
                                <TextField fullWidth size={"small"} label={"자녀이메일"} type={"email"} id={"childEmail"}/>
                            </Grid>
                            <Grid item xs={3} sx={{pl:"1rem"}}>
                                <Button variant={"contained"} color={"primary"} fullWidth id={"sendConfirmEmail"}
                                onClick={() => {
                                    const childEmail = document.getElementById("childEmail").value;
                                    sendConfirmEmail(childEmail).then((res) => {
                                        // 성공 시 childEmail textfiled 잠그기
                                        document.getElementById("childEmail").disabled = true;
                                        // 버튼도 잠그기
                                        document.getElementById("sendConfirmEmail").disabled = true;
                                    })
                                }}
                                >인증번호 보내기</Button>
                            </Grid>
                            <Grid item xs={9} sx={{mt:"1rem"}}>
                                <TextField fullWidth size={"small"} label={"인증번호"} id={"confirmNumber"}/>
                            </Grid>
                            <Grid item xs={3} sx={{pl:"1rem", mt:"1rem"}} type={"number"}>
                                <Button variant={"contained"} color={"primary"} fullWidth
                                onClick={() => {
                                    const childEmail = document.getElementById("childEmail").value;
                                    const confirmNumber = document.getElementById("confirmNumber").value;
                                    confirmEmail(childEmail, confirmNumber);
                                }}
                                >인증하기</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {/* 자녀가 있는 경우 자녀를 출력함 **/}
                {isChild && (
                    <Grid item container xs={12}>
                        <Grid item xs={4}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{pb:"3rem"}}
                        >
                            <Typography sx={{fontWeight:'800', fontSize:'1.5rem'}}>자녀리스트</Typography>
                        </Grid>
                        <Grid item container xs={8}
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              sx={{pb:"3rem", display:"flex", alignItems:"center"}}
                        >
                                {childList.rci.map((child) => (
                                        <Typography
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            sx={{fontWeight:'800', fontSize:'1rem', color:'#000000'}}>
                                            {child.name}({child.email})
                                        </Typography>
                                ))}
                        </Grid>
                    </Grid>
                )}
                <Grid item xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{pb:"3rem"}}>
                    {profile && profile.kakaoConnect === "카카오 계정이랑 연동" ? (
                        <Box
                            sx={{
                                borderRadius: '10vw',
                                width: "100%",
                                m: 0,
                                p: 1,
                                border: 0,
                                background: "#FFE812",
                                '& p': {
                                    color: '#000000',
                                },
                                justifyContent:"center",
                            }}
                        >
                            <Box sx={{
                                fontFamily: 'NanumSquareNeo',
                                fontWeight: "900",
                                fontSize: "1.5rem",
                                textAlign: "center",
                                color: "#000000",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img src={kakao} alt="Kakao" style={{
                                    marginRight: "1rem",
                                    width: "2rem",
                                    textAlign: "left"
                                }}/>
                                <Typography display={"inline"}>카카오 연동 완료</Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Button
                            onClick={handleKakaoLogin}
                            sx={{
                                borderRadius: '10vw',
                                width: "100%",
                                height: "2.5vw",
                                m: 0,
                                p: 1,
                                border: 0,
                                background: "#FFE812",
                                '& p': {
                                    color: '#000000',
                                },
                                '&:hover': {
                                    background: "skyblue",
                                }
                            }}
                        >
                            <Box sx={{
                                fontFamily: 'NanumSquareNeo',
                                fontWeight: "900",
                                fontSize: "1.5rem",
                                textAlign: "center",
                                color: "#000000",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img src={kakao} alt="Kakao" style={{
                                    marginRight: "1rem",
                                    width: "2rem",
                                    textAlign: "left"
                                }}/>
                                <Typography display={"inline"}>카카오 연동하기</Typography>
                            </Box>
                        </Button>
                    )}

                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MyPage;