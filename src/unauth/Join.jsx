import React, {useState} from 'react';
import TopBar from "../component/TopNav";
import {
    Box,
    Button,
    createTheme,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    ThemeProvider
} from "@mui/material";
import styles from "./css/Login.module.css";
import dayjs from 'dayjs';
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import Typography from "@mui/material/Typography";


function Join(props) {
    const [pw, setPw] = useState(''); // 비밀번호
    const [checkPw, setCheckPw] = useState(false); // 비밀번호확인용
    const [birth, setBirth] = useState(dayjs(new Date())); // 생일
    const [gender, setGender] = useState(0);
    const [address1, setAddress1] = useState(''); // 큰주소
    const [address2, setAddress2] = useState(''); // 작은주소
    const [file, setFile] = useState(null); // 파일
    const [img, setImg] = useState('');


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    // 실시간 비밀번호 매칭 채크
    const checkingPW = (event) => {
        if (pw === event.target.value) {
            setCheckPw(true);
        } else {
            setCheckPw(false);
        }
    };

    // Daum post

    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        setAddress1(data.address); // 사용자가 선택한 주소를 넣어줌
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            {/* TopBar 띄우기 위한 Box*/}
            <Box sx={{height: 64}}/>

            <Grid container sx={{px:"30vw"}}>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_login}>회원가입</p>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>이메일</p>
                    <TextField
                        required
                        id="email"
                        label="이메일"
                        name="email"
                        variant="outlined"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>비밀번호</p>
                    <TextField
                        required
                        id="password"
                        label="비밀번호"
                        name="password"
                        variant="outlined"
                        type="password"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>비밀번호 확인</p>
                    <TextField
                        required
                        id="passwordChk"
                        label="비밀번호 확인"
                        name="passwordChk"
                        variant="outlined"
                        type="password"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>이름</p>
                    <TextField
                        required
                        id="name"
                        label="이름"
                        name="name"
                        variant="outlined"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>닉네임</p>
                    <TextField
                        required
                        id="nickname"
                        label="닉네임"
                        name="passwordChk"
                        variant="outlined"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>전화번호</p>
                    <TextField
                        required
                        id="tel"
                        label="전화번호"
                        name="passwordChk"
                        variant="outlined"
                        type="tel"
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>생일</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            fullWidth
                            label="출발일"
                            inputFormat="MM/DD/YYYY"
                            value={birth}
                            onChange={(e) => {
                                console.log(e.format("YYYY-MM-DD'T'HH:mm:ss"));
                                setBirth(e);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sx={{pt:2}}>
                    <p className={styles.font_body_menu}>성별</p>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="남"
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                    setGender(e.target.value);
                                }
                            }}
                        />
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="여"
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                    setGender(e.target.value);
                                }
                            }}
                        />
                    </RadioGroup>
                </Grid>
                <Grid item container xs={12} sx={{pt:2}}>
                    <Grid item xs="12">
                        <p className={styles.font_body_menu}>주소</p>
                    </Grid>
                    <Grid item container xs="12">
                        <Grid xs="8">
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={address1}
                                disabled
                            ></TextField>
                        </Grid>
                        <Grid xs="4" sx={{ pl: 1 }}>
                            <Button
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                variant="contained"
                                fullWidth
                                sx={{ border: 0, backgroundColor: '#3767A6', height:"100%" }}
                                onClick={handleClick}
                            >
                                <Typography
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    color="#FFFFFF" variant={"h5"}>주소검색</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} sx={{pt:2}}>
                        <Grid item xs="12">
                            <p className={styles.font_body_menu}>프로필</p>
                        </Grid>
                        <Grid item xs="6">
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ borderColor: '#3767A6', border: 1, height:"100%" }}
                                size="small"
                            >
                                <Typography>파일 첨부</Typography>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setFile(e.target.files)}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
                            {file === null && img === '' && (
                                <Typography>선택된 파일 없음</Typography>
                            )}
                            {file !== null && (
                                <div className={styles.image_box}>
                                    <img
                                        src={URL.createObjectURL(file[0])}
                                        alt="썸네일"
                                        loading="lazy"
                                        className={styles.image_thumbnail}
                                    />
                                </div>
                            )}
                            {file === null && img !== '' && (
                                <div className={styles.image_box}>
                                    <img
                                        src={img}
                                        alt="썸네일"
                                        loading="lazy"
                                        className={styles.image_thumbnail}
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    item xs={12} sx={{pt:10, pb:20}}>
                    <Button
                        fullWidth
                        sx={{ backgroundColor: '#3767A6', height: '120%' }}
                    >
                        <Typography
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            color="#FFFFFF" variant={'h4'}>
                            회원가입
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
        );
}

export default Join;