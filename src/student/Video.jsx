import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {Button, Slider, Box, ThemeProvider, createTheme, Tooltip} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import Grid from '@mui/material/Grid';
import DashTop from "../component/DashTop";



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

    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });

    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [maxPlayed, setMaxPlayed] = useState(0);
    const playerRef = useRef(null);

    const [duration, setDuration] = useState(0); // 전체영상길이
    const [currentTime, setCurrentTime] = useState(0); // 현재재생위치

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
                            <Box sx={{width:"100%", aspectRatio:"16/9"}}>
                                <ReactPlayer
                                    url='https://www.youtube.com/watch?v=vPVc4v5-eq0'
                                    ref={playerRef}
                                    playing={playing}
                                    controls={false}
                                    volume={volume}
                                    width={"100%"}
                                    height={"100%"}
                                    onDuration={handleDuration}
                                    onProgress={handleProgress}
                                />
                            </Box>
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