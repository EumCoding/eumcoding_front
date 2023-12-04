import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {Button, Slider, Box, ThemeProvider, createTheme, Tooltip, Modal, RadioGroup, Radio, Paper} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import Grid from '@mui/material/Grid';
import DashTop from "../component/DashTop";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import screenfull from 'screenfull';
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {CheckBox} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Block from "../component/Block";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1500,
    height:800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius : '20px',
    boxShadow: 24,
    p: 4,
};


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

    const getBlockColor = (code) => {
        switch (code) {
            case "[for]": return "#6495ED"; // 옥스퍼드 블루
            case "[if]": return "#32CD32"; // 라임 그린
            case "[print]": return "#FFA07A"; // 라이트 살몬
            case "[scan]": return "#FF6347"; // 토마토
            case "[+]": return "#FFD700"; // 골드
            case "[-]": return "#ADD8E6"; // 라이트 블루
            case "[*]": return "#DB7093"; // 페일 바이올렛 레드
            case "[/]": return "#9370DB"; // 미디엄 퍼플
            case "[number]": return "#90EE90"; // 라이트 그린
            case "[String]": return "#D2B48C"; // 탄
            case "[=]": return "#CBAACB"; // 라벤더
            default: return "#D3D3D3"; // 라이트 그레이
        }
    };

    const [blockList, setBlockList] = useState([]);
    const [answerGrid, setAnswerGrid] = useState([[]]);

    // 리스트 내 항목 순서 변경
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

// 다른 리스트로 항목 이동
    const moveItem = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // 드롭되지 않은 경우
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                source.droppableId === 'droppableOne' ? blockList : answerGrid[parseInt(source.droppableId.split('_')[1])],
                source.index,
                destination.index
            );

            if (source.droppableId === 'droppableOne') {
                setBlockList(items);
            } else {
                const newAnswerGrid = Array.from(answerGrid);
                newAnswerGrid[parseInt(source.droppableId.split('_')[1])] = items;
                setAnswerGrid(newAnswerGrid);
            }
        } else {
            const sourceList = source.droppableId === 'droppableOne' ? blockList : answerGrid[parseInt(source.droppableId.split('_')[1])];
            const destList = destination.droppableId === 'droppableOne' ? blockList : answerGrid[parseInt(destination.droppableId.split('_')[1])];
            const result = moveItem(
                sourceList,
                destList,
                source,
                destination
            );

            if (source.droppableId === 'droppableOne') {
                setBlockList(result[source.droppableId]);
                setAnswerGrid(prev => {
                    const newGrid = Array.from(prev);
                    newGrid[parseInt(destination.droppableId.split('_')[1])] = result[destination.droppableId];
                    return newGrid;
                });
            } else {
                setAnswerGrid(prev => {
                    const newGrid = Array.from(prev);
                    newGrid[parseInt(source.droppableId.split('_')[1])] = result[source.droppableId];
                    newGrid[parseInt(destination.droppableId.split('_')[1])] = result[destination.droppableId];
                    return newGrid;
                });
            }
        }
    };


    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const accessToken = useSelector((state) => state.accessToken)

    const [videoUrl, setVideoUrl] = useState("");

    const playerWrapperRef = useRef();
    const playerRef = useRef(null);

    const [lastView, setLastView] = useState(dayjs());

    const [chgValue, setChgValue] = useState(true);

    const [videoTest, setVideoTest] = useState(null); // videoTest 들어갈 곳

    const [testArr, setTestArr] = useState([]); // videoTest와 함께 돌아가는 배열로 해당 테스트를 완료했는지 체크함

    const [videoTestIdx, setVideoTestIdx] = useState(0); // modal 창에서 사용할 videoTestIdx입니다.

    const [answer, setAnswer] = useState(0); // modal창에서 선택한 객관식 문제의 답변입니다.

    const [blocks, setBlocks] = useState([]); // 블럭 목록이 들어갈 곳입니다.

    const [blockAnswer, setBlockAnswer] = useState(Array(5).fill(Array(0).fill(null))); // 답안을 넣기 위한 2차원 배열입니다.

    const [selectBlock, setSelectBlock] = useState(""); // 선택한 블럭이 들어갈 곳입니다.
    const [selectBlockIdx, setSelectBlockIdx] = useState(0); // 선택한 블럭의 인덱스가 들어갈 곳입니다.



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
            `${process.env.REACT_APP_API_URL}/lecture/section/video/view?id=${id}`,
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
                    setCurrentTime(hours*3600 + minutes*60 + seconds)
                    console.log(`세팅된 max시간 = ${hours*3600 + minutes*60 + seconds}`)
                }

            }
        })
    }

    // 비디오 테스트 정보 가져오기
    const getVideoTest = async (id) => { // id: 강의아이디
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/video/test/list`,
            {
                id:id
            },
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            console.log(res)
            if(res.data){ // 데이터가 있을 때
                setVideoTest(res.data); // state에 할당
                // 블럭 접근 방법 -> setVideoTest[idx].blockResponseDTOList[idx]
                // 테스트 여부 배열
                const tempArr = [];
                for(let i = 0; i < res.data.length ; i++){
                    let [hours, minutes, seconds] = (res.data)[i].testTime.split(":").map(Number);
                    let calcTime = (hours*3600 + minutes*60 + seconds);
                    if(calcTime > maxPlayed){
                        // maxPlayed보다 이후에 나올 문제일 경우
                        tempArr.push({check:false, time:calcTime});
                    }else{
                        // 이전에 나오는 문제일 경우
                        tempArr.push({check:true, time:calcTime});
                    }
                }
                setTestArr(tempArr);
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
            `${process.env.REACT_APP_API_URL}/lecture/section/video/view/result`,
            {
                lastView:`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                videoId:id
            },
            {headers:{Authorization: `${accessToken}`,}}
        )
        console.log(response)
        console.log("서버에 마지막 시간 전송 완료")
    }

    // video test 결과 전송하기
    // 시청결과 전송하기
    const videoTestResult = async (answer, id) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/video/test/log/add`,
            {
                subAnswer : answer.toString(),
                videoTestId : id,
            },
            {headers:{Authorization: `${accessToken}`,}}
        )
        console.log(response)
        console.log("서버에 문제답변 전송 완료")
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
            // if(chgCount < 1){
            //     if (playerRef && playerRef.current) {
            //         console.log(`최초 시작지점 설정 : ${maxPlayed}`)
            //         setCurrentTime(maxPlayed-1)
            //         playerRef.current.seekTo(maxPlayed-1);
            //         chgCount++;
            //     }
            // }
            videoResult(videoId,maxPlayed);
            // maxplayed 보다 테스트 시간이 크면 테스트 했는지 체크합니다.
            if(videoTest !== null && testArr){
                for(let i = 0 ; i < videoTest.length ; i++){
                    // 해당하는 인덱스의 testArr(문제풀이 체크용 배열)을 false 상태인지 확인합니다.(maxplayed보다 같거나 작은 경우에 문제가 안풀린 경우만 표시합니다)
                    console.log("문제풀이 시간 체크");
                    if(testArr[i].check === false && testArr[i].time <= maxPlayed){
                        // 영상 재생을 멈추고 modal창을 켭니다.
                        setVideoTestIdx(i); // 몇번째 문제를 불러올지 modal에 알려줍니다.
                        setPlaying(false);
                        // 문제 타입이 블럭코딩 타입인 경우 블럭을 세팅합니다.
                        setBlocks(videoTest[i].blockResponseDTOList); // setting
                        setBlockList(videoTest[i].blockResponseDTOList); // setting(new)
                        console.log(videoTest[i].blockResponseDTOList)
                        handleOpen();
                    }
                }
            }
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
        // 시간 변경 시 마다 문제 체크
        if (newValue <= maxPlayed) {
            console.log(`handleSeek ${newValue}`)
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
        if(chgValue === true){
            setChgValue(false);
            playerRef.current.seekTo(currentTime);
        }else{
            setCurrentTime(playerRef.current.getCurrentTime());
        }
        if(currentTime > maxPlayed){
            setMaxPlayed(playerRef.current.getCurrentTime());
        }
    };

    useEffect(() => {
        if(accessToken){
            getVideoInfo(videoId)
        }
    }, [,accessToken])

    // video정보 가져온 후 테스트 정보 가져오기
    useEffect(() => {
        if(videoUrl !== null){
            getVideoTest(videoId)
        }
    }, [videoUrl])

    // 플레이어가 준비되면 재생위치를 옮김
    const handleReady = () => {
        playerRef.current.seekTo(maxPlayed);
    };

    // 객관식 테스트 결과 전송하기
    // const multipleChoiceResult = async(answer, id)



    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(blocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setBlocks(items);
    };

    const handleClick = () => {
        const json = JSON.stringify(blocks);
        console.log(json);
    };

    // 2차원 배열 answerGrid의 행을 늘리는 함수
    const addRow = () => {
        setAnswerGrid(answerGrid.concat([[]]));
    };
    // 2차원 배열 answerGrid의 행을 줄이는 함수
    const deleteRow = () => {
        setAnswerGrid(answerGrid.slice(0, -1));
    };


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

    // 블록코딩 답안 저장 후 채점
    const saveBlockAnswer = async (list, id) => {
        console.log("블록코딩 답안 전송")
        console.log(
            {
                blockList: list,
                videoTestId: id
            }
        )
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/video/test/block/result`,
            {
                blockList: list,
                videoTestId: id
            },
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            console.log(res)
            if(res.data === true){
                alert("정답입니다.")
            }else{
                alert("틀렸습니다.")
            }
        }).catch((err) => {
            alert("문법이 틀렸습니다.")
        })
    }

    // 객관식 답안 저장 후 채점
    const saveMultipleAnswer = async (answer, id) => {
        console.log("객관식 답안 전송")
        console.log(
            parseInt(answer)
        )
        console.log({
            answerList: [parseInt(answer)],
            videoTestId: id
        })
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/video/test/multiple_list/result`,
            {
                answerList: [parseInt(answer)],
                videoTestId: id
            },
            {headers:{Authorization: `${accessToken}`,}}
        ).then((res) => {
            if(res.data === true){
                alert("정답입니다.")
            }else{
                alert("틀렸습니다.")
            }
        }).catch((err) => {
            alert("전송실패")
        })
    }

    useEffect(() => {
        if(currentTime > 1 && currentTime === duration){
            alert("시청을 마쳤습니다.")
            navigate(-1);
        }
    },[currentTime])

    useEffect(() => {
        console.log(answerGrid)
    },[answerGrid])



    // videoUrl이 없으면 빈화면 출력(아직 로드되지 않은 경우)
    if(videoUrl === ""){
        return(<div/>)
    }

    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {/* 문제풀이용 Modal **/}
            {videoTest && videoTest.length >0 && (
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize:"1.5rem", fontWeight:"700", py:"1rem", color:"#0B401D"}}>
                            문제!
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize:"1.5rem", fontWeight:"700", py:"1rem"}}>
                            {videoTest[videoTestIdx].title}
                        </Typography>
                        {videoTest[videoTestIdx].type === 0 && (
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <RadioGroup onChange={(e) => {
                                    console.log(e.target.value)
                                    setAnswer(e.target.value)
                                }}>
                                    { videoTest[videoTestIdx].videoTestMultipleListDTOs.map((item, subIdx) => {
                                        return(
                                            <Typography>
                                                <Radio value={subIdx + 1} />{subIdx + 1}번. {item.content}
                                            </Typography>
                                        )
                                    })}
                                </RadioGroup>
                            </Typography>
                        )}
                        {videoTest[videoTestIdx].type === 1 && (
                            <Grid container sx={{width:"100%"}}>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Grid container sx={{width:"100%", height:"500"}}>
                                        <Grid xs={12} item sx={{width:"100%", height:"200", border:1, overflow:"auto"}}>
                                            <Typography>블럭목록</Typography>
                                            <Droppable droppableId="droppableOne" direction="horizontal">
                                                {(provided) => (
                                                    <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps} sx={{display:"flex"}}>
                                                            {blockList.map((block, index) => (
                                                                <Draggable key={block.id} draggableId={block.id.toString()} index={index} >
                                                                    {(provided) => (
                                                                        <Box
                                                                             ref={provided.innerRef}
                                                                             {...provided.draggableProps}
                                                                             {...provided.dragHandleProps}
                                                                             sx={{display:"flex", alignItems:"center", justifyContent:"flex", m:"0.3rem"}}
                                                                        >
                                                                            <Block code={block.block} color={getBlockColor(block.block)} text={block.value && block.value}
                                                                                   isSpecial={
                                                                                       (block.block === "[number]" || block.block === "[String]" || block.block === "[numberVal]" || block.block === "[StringVal]")
                                                                                   } />
                                                                        </Box>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                    </Grid>
                                                )}
                                            </Droppable>
                                        </Grid>
                                        <Typography>답안</Typography>
                                        {answerGrid && answerGrid.map((row, idx) => {
                                            return(
                                                <Grid xs={12} item sx={{width:"100%", height:"200", border:1, overflow:"auto"}}>
                                                    <Droppable droppableId={"droppable_" + idx} direction="horizontal">
                                                        {(provided) => (
                                                            <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps} sx={{display:"flex"}}>
                                                                {answerGrid[idx].length > 0 && answerGrid[idx].map((block, index) => (
                                                                    <Draggable key={block.id} draggableId={"answer" + block.id.toString()} index={index}>
                                                                        {(provided) => (
                                                                            <Box
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                sx={{display:"flex", alignItems:"center", justifyContent:"flex", m:"0.3rem"}}
                                                                            >
                                                                                <Block code={block.block} color={getBlockColor(block.block)} text={block.value && block.value}
                                                                                       isSpecial={
                                                                                           (block.block === "[number]" || block.block === "[String]" || block.block === "[numberVal]" || block.block === "[StringVal]")
                                                                                       } />
                                                                            </Box>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                                <Button
                                                                    sx={{display:"flex", alignItems:"center", justifyContent:"flex", m:"0.3rem"}}
                                                                    onClick={() => {
                                                                        // answerGrid의 행을 늘립니다.
                                                                        addRow();
                                                                    }}
                                                                >
                                                                    <Block code={"[enter]"} color={getBlockColor("[enter]")} text={"줄바꿈"} />
                                                                </Button>
                                                            </Grid>
                                                        )}
                                                    </Droppable>
                                                </Grid>
                                                )
                                        })}
                                    </Grid>
                                </DragDropContext>
                            </Grid>
                        )}
                        <Button sx={{mt:"1rem"}} onClick={() => {
                            // 1. 서버에 결과를 제출
                            if(videoTest[videoTestIdx].type === 0) {
                                saveMultipleAnswer(answer, videoTest[videoTestIdx].id)
                            }else {
                                // 블록코딩인 경우
                                // 1. 깊은복사 (내용 없는 줄 제거)
                                const tempArr = blockAnswer.filter(subArray => subArray.length !== 0);
                                console.log(`깊은 복사 직후 : ${tempArr}`)
                                // 3. 서버에 전송
                                // 전송전에 문제가 틀린지 맞는지 알려주기
                                // 2차원 배열인 answerGrid를 1차원 배열로 변환
                                let tempArr2 = answerGrid.flat();
                                console.log(`tempArr2 : ${JSON.stringify(tempArr2)}`)
                                saveBlockAnswer(tempArr2, videoTest[videoTestIdx].id)
                            }

                            // 2. testArr에 해당 index 푼걸로 표시하기
                            const tempArr = JSON.parse(JSON.stringify(testArr)) // 깊은복사
                            tempArr[videoTestIdx].check = true
                            setTestArr(tempArr);
                            // 3. modal 닫기
                            handleClose();
                        }}>
                            제출하기
                        </Button>
                    </Box>
                </Modal>
            )}


            <Grid container sx={{width:"100%", mb:"10rem"}}>
                <Grid xs={12} item container display={"flex"} justifyContent={"center"} alignItems={"center"}
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
                                <Button variant="contained" color="primary" onClick={() => playerWrapperRef.current && toggleFullScreen(playerWrapperRef.current)}>Full</Button>
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
                        {/*duration : {duration} cur : {currentTime} max : {maxPlayed}*/}
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Video;