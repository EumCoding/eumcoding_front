import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {Button, Slider, Box, ThemeProvider, createTheme, Tooltip} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import Grid from '@mui/material/Grid';
import DashTop from "../component/DashTop";
import axios from "axios";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import screenfull from 'screenfull';
import dayjs from "dayjs";




function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={formatTime(value)}>
            {children}
        </Tooltip>
    );
}


function Video(props) {
    const accessToken = useSelector((state) => state.accessToken)

    const [videoUrl, setVideoUrl] = useState("");

    const playerWrapperRef = useRef();
    const playerRef = useRef(null);

    const [lastView, setLastView] = useState(dayjs());


    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const handleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request(playerRef.current.wrapper);
        }
    };

    const videoId = query.get('id');
    // 비디오 정보 가져오기
    const getVideoInfo = async (id) => { // id: 강의아이디
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/view?id=${id}`,
            null,
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            console.log(res)
            if(res.data){
                // URL 객체 생성
                let urlObj = new URL(res.data.path);
                // 포트 번호 변경
                urlObj.port = "8099";
                // 다시 문자열로 변환 후 state에 저장
                setVideoUrl(urlObj.href);
                if(res.data.viewedResultResponseDTO.lastView){
                    let tempLastView = res.data.viewedResultResponseDTO.lastView;
                    let [hours, minutes, seconds] = tempLastView.split(":").map(Number);
                    setMaxPlayed(hours*3600 + minutes*60 + seconds);
                    console.log(`세팅된 max시간 = ${hours*3600 + minutes*60 + seconds}`)
                }

            }
        })
    }

    // 시청결과 전송하기
    const videoResult = async (id, paramMax) => {
        const hours = Math.floor(paramMax / 3600);
        const minutes = Math.floor((paramMax % 3600) / 60);
        const seconds = Math.floor(paramMax % 60);
        console.log(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
        const response = await axios.post(
            `http://localhost:8099/lecture/section/video/view/result`,
            {
                lastView:`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                videoId:id
            },
            {headers:{Authorization: `${accessToken}`,}}
        )
        console.log(response)
        console.log("서버에 마지막 시간 전송 완료")
    }

    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [maxPlayed, setMaxPlayed] = useState(0); // 최대로 본 시점

    const [duration, setDuration] = useState(0); // 전체영상길이
    const [currentTime, setCurrentTime] = useState(0); // 현재재생위치

    // maxplayed 변경 시 서버로 마지막 시간 전송
    useEffect(() => {
        if(maxPlayed > 1){
            videoResult(videoId,maxPlayed);
        }
    },[maxPlayed])

    // 현재 재생 위치 가져오기
    const handleTimeChange = (event, newValue) => {
        setCurrentTime(newValue);
    };

    // 전체 영상 길이 가져오기
    const handleDuration = (duration) => {
        setDuration(duration);
    };


    const handlePlayPause = () => {
        setPlaying(!playing);
    }

    const handleSeek = (_, newValue) => {
        setSeeking(false);
        // 사용자가 시크바를 이용하여 재생 위치를 변경할 때 호출
        // newValue가 최대 시간(maxPlayed)보다 작거나 같다면, 재생 위치 변경
        // 그렇지 않다면, maxPlayed 위치로 이동
        if (newValue <= maxPlayed) {
            setCurrentTime(newValue);
            playerRef.current.seekTo(newValue);
        } else {
            playerRef.current.seekTo(maxPlayed);
        }
    }

    const handleVolumeChange = (_, newValue) => {
        setVolume(newValue);
    }

    const handleProgress = () => {
        setCurrentTime(playerRef.current.getCurrentTime());
        if(currentTime > maxPlayed){

            setMaxPlayed(playerRef.current.getCurrentTime());
        }
    };

    useEffect(() => {
        if(accessToken){
            getVideoInfo(videoId)
        }
    }, [,accessToken])

    // 플레이어가 준비되면 재생위치를 옮김
    const handleReady = () => {
        playerRef.current.seekTo(maxPlayed);  // Start the video at 5 seconds
    };


    if(videoUrl === ""){
        return(<div/>)
    }

    // 전체화면 만들기
    const toggleFullScreen = (element) => {
        if (!element) {
            console.log("full스크린안됨");
            alert("풀스크린을 지원하지 않는 브라우저입니다. 이음코딩은 크롬 브라우저 최신버전을 권장합니다.")
            return;
        }
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }




    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            <Grid container sx={{width:"100%", mb:"10rem"}}>
                <Grid xs={12} item container display={"flex"} justtifyContent={"center"} alignItems={"center"}
                      sx={{py:"3rem", m:0}}
                      spacing={5}
                >
                    <Grid item container sm={12} md={8}>
                        <Grid item xs={12}>
                            {/* 변경: div 요소 추가 및 ref 연결 */}
                            <div ref={playerWrapperRef}>
                                <Box sx={{width:"100%", aspectRatio:"16/9"}}>
                                    <ReactPlayer
                                        url={videoUrl}
                                        ref={playerRef}
                                        playing={playing}
                                        controls={false}
                                        volume={volume}
                                        width={"100%"}
                                        height={"100%"}
                                        onDuration={handleDuration}
                                        onProgress={handleProgress}
                                        onReady={handleReady}
                                    />
                                </Box>
                            </div>
                        </Grid>

                        <Grid container spacing={2} alignItems="center">


                            <Grid item xs={11} display={"flex"} justifyContent="center" alignItems={"center"}>
                                <Button variant="contained" color="primary" onClick={handlePlayPause} sx={{mr:"1rem"}}>
                                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                                </Button>
                                <Slider
                                    components={{
                                        ValueLabel: ValueLabelComponent
                                    }}
                                    min={0}
                                    max={duration}
                                    step={1}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    valueLabelDisplay="auto"
                                />
                                <Button variant="contained" color="primary" onClick={() => playerWrapperRef.current && toggleFullScreen(playerWrapperRef.current)}>전체화면</Button>
                            </Grid>
                            <Grid item xs={1} display={"flex"} justifyContent="center" alignItems={"center"}>
                                <VolumeDownIcon />
                                <Slider value={volume} onChange={handleVolumeChange}
                                        min={0}
                                        max={0.999999}
                                        step={0.0001}
                                        aria-labelledby="continuous-slider" />
                                <VolumeUpIcon />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        duration : {duration} cur : {currentTime} max : {maxPlayed}
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Video;