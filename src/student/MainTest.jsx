import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
    Box, Button,
    Checkbox,
    createTheme,
    FormControlLabel,
    FormGroup,
    Paper,
    Radio,
    RadioGroup,
    ThemeProvider
} from "@mui/material";
import DashTop from "../component/DashTop";
import axios from "axios";
import Typography from "@mui/material/Typography";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Grid from "@mui/material/Grid";
import Block from "../component/Block";

function MainTest(props) {
    const [blockList, setBlockList] = useState([]);
    const [answerGrid, setAnswerGrid] = useState([[]]);
    const [answerBlockGrid, setAnswerBlockGrid] = useState([]);


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

    //accessToken
    const accessToken = useSelector((state) => state.accessToken); // redux access token
    //navigate
    const navigate = useNavigate();
    //theme
    const theme = createTheme({ // Theme
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    });
    //params
    const params = useParams();

    const [questionList, setQuestionList] = useState([]); // 문제 리스트
    const [blockAnswerList, setBlockAnswerList] = useState([]); //
    const [answerList, setAnswerList] = useState([]); // 답안 리스트...

    // mainTest문제 리스트 가져오기... /lecture/section/test/view/question?mainTestId...
    const getMainTestQuestionList = async (id) => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/lecture/section/test/view/question?mainTestId=${id}`,
            {headers: {Authorization: `${accessToken}`}}
        ).then((res) => {
            if(res && res.data){
                console.log(res.data);
                setQuestionList(res.data);
                // res.data의 길이만츰 초기화한 배열에 빈 일차원 배열로 채워서 answerList에 넣음
                let temp = Array(res.data.length).fill([]); // 모든 요소를 빈 배열로 초기화
                setAnswerList(temp);
                console.log("answerList...")
                console.log(answerList);
                // res.data의 길이만큼 초기화한 배열에 모두 false로 채움
                let initializedArray = Array(res.data.length).fill(false);
                setBlockAnswerList(initializedArray)
                // res.data의 길이만큼 초기화한 빈 배열을 answerBlockGrid에 넣음
                let tempAnswerBlockGrid = Array(res.data.length).fill([]);
                setAnswerBlockGrid(tempAnswerBlockGrid);
            }
        })
    }

    const handleAnswerChange = (event, questionIndex, choice) => {
        setAnswerList(prev => {
            const newAnswers = [...prev];
            if (event.target.checked) {
                // 선택된 답변 추가
                newAnswers[questionIndex] = [...newAnswers[questionIndex], choice];
            } else {
                // 선택 해제된 답변 제거
                newAnswers[questionIndex] = newAnswers[questionIndex].filter(answer => answer !== choice);
            }
            return newAnswers;
        });
    };

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

    // 제출하고 점수받아오는 api
    const checkAnswer = async () => {
        // dto 만들기
        let temp = questionList.map((question, idx) => {
            if(question.type === 0){
                return(
                    {
                        mainTestQuestionId:question.mainTestQuestionId,
                        multipleChoiceList:answerList[idx]
                    }
                )
            }
            if(question.type === 1){
                return(
                    {
                        mainTestQuestionId:question.mainTestQuestionId,
                        blockList:answerBlockGrid[idx]
                    }
                )
            }
        })
        console.log("제출하고 점수받아오기...")
        console.log(temp);
        let temp2 = {
            logDTOList : temp,
            mainTestId : params.value
        }
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/test/question/log/scoring`,
            temp2,
            {headers: {Authorization: `${accessToken}`}}
        ).then((res) => {
            alert("점수는 " + res.data + "점 입니다.")
            // 대시보드 강의 리스트로 이동
            navigate("/my/lectureList")
        })
    }


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

    // 2차원 배열 answerGrid의 행을 늘리는 함수
    const addRow = () => {
        setAnswerGrid(answerGrid.concat([[]]));
    };



    useEffect(() => {
        if(accessToken){
            // accessToken이 있을 때만 문제 리스트 가져오기
            getMainTestQuestionList(params.value);
        }
    }, [accessToken])



    return (
        <ThemeProvider theme={theme}>
            <DashTop/>
            {questionList.map((question, index) => (
                <Paper elevation={3} style={{ margin: '16px', padding: '16px' }} key={question.mainTestQuestionId}>
                    <Typography variant="h5">문제 {index + 1}</Typography>
                    <Typography variant="body1">{question.title}</Typography>
                    {question.type === 1 && (
                        <Button
                            onClick={() =>{
                                // qustionAnswer을 temp에 깊은 복사 후 모두 false로 채움. 그 후 [index]부분만 true로 바꾸어 setQuestionAnswer
                                // 깊은 복사를 사용하여 questionAnswer 배열 복사
                                let temp = [...blockAnswerList];
                                temp.fill(false);
                                temp[index] = true;
                                setBlockAnswerList(temp);
                                // question.blockList의 내용을 blockList에 넣음(깊은복사)
                                let tempBlockList = [...question.blockList];
                                setBlockList(tempBlockList);
                                // answerGrid 2차원배열로 초기화
                                let tempAnswerGrid = [[]];
                                setAnswerGrid(tempAnswerGrid);

                            }}
                        >
                            <Typography>풀이시작하기</Typography>
                        </Button>
                    )}
                    {question.type === 0 && // 객관식 문제일 경우
                        <FormGroup>
                            {question.choices.map((choice, choiceIndex) => (
                                <FormControlLabel
                                    key={choiceIndex}
                                    control={
                                        <Checkbox
                                            checked={answerList[index].includes(choice)}
                                            onChange={(event) => handleAnswerChange(event, index, choice)}
                                        />
                                    }
                                    label={choice}
                                />
                            ))}
                        </FormGroup>
                    }
                    {question.type === 1 && blockAnswerList[index] === true && (
                        <Grid container sx={{width:"100%"}}>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Grid container sx={{width:"100%", height:"500"}}>
                                    <Grid xs={12} item sx={{width:"100%", height:"200", border:1, overflow:"auto"}}>
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
                                    {question.type === 1 && (
                                        <Button
                                            onClick={() =>{
                                                // answerBlockGrid[index]에 answerGrid를 1차원 배열로 변환해서 넣음
                                                // 2차원 배열인 answerGrid를 1차원 배열로 변환
                                                let tempArr2 = answerGrid.flat();
                                                // questionList의 길이만큼 빈 배열을 생성
                                                let tempArr1 = Array(questionList.length).fill([]);
                                                tempArr1[index] = tempArr2;
                                                setAnswerBlockGrid(tempArr1);
                                                // qustionAnswer을 temp에 깊은 복사 후 모두 false로 채움. 그 후 [index]부분만 true로 바꾸어 setQuestionAnswer
                                                // 깊은 복사를 사용하여 questionAnswer 배열 복사
                                                let temp = [...blockAnswerList];
                                                temp.fill(false);
                                                temp[index] = false;
                                                setBlockAnswerList(temp);
                                            }}
                                        >
                                            <Typography>풀이 종료</Typography>
                                        </Button>
                                    )}
                                </Grid>
                            </DragDropContext>
                        </Grid>
                    )}

                </Paper>
            ))}
            <Button
                onClick={() => {
                    checkAnswer();
                }}
            >
                <Typography>제출하기</Typography>
            </Button>
        </ThemeProvider>
    );
}

export default MainTest;