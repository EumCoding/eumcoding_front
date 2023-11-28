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
    const [blockAnswerList, setBlockAnswerList] = useState([]); // 블록 답안 리스트... 이 배열의 내부에는 2차원 배열이 들어갑니다.
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
                // res.data의 길이만큼 초기화한 배열에 빈 이차원 배열로 채움
                let temp = Array(res.data.length).fill([[]]); // 모든 요소를 빈 2차원 배열로 초기화
                setBlockAnswerList(temp);
                console.log("blockAnswerList...")
                console.log(blockAnswerList);
                // res.data의 길이만츰 초기화한 배열에 빈 일차원 배열로 채워서 answerList에 넣음
                temp = Array(res.data.length).fill([]); // 모든 요소를 빈 배열로 초기화
                setAnswerList(temp);
                console.log("answerList...")
                console.log(answerList);
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

    // 2차원 배열 answerGrid의 행을 늘리는 함수
    // addRow 함수 수정
    const addRow = (questionIndex) => {
        setBlockAnswerList(prev => {
            const newBlockAnswers = [...prev];
            newBlockAnswers[questionIndex] = [...newBlockAnswers[questionIndex], []];
            return newBlockAnswers;
        });
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // 드롭되지 않은 경우
        if (!destination) {
            return;
        }

        // sourceIndex와 destinationIndex를 파싱
        const sourceIndex = source.droppableId.split('_')[1] ? parseInt(source.droppableId.split('_')[1]) : 0;
        const destIndex = destination.droppableId.split('_')[1] ? parseInt(destination.droppableId.split('_')[1]) : 0;

        // source와 destination의 리스트를 결정
        const sourceList = source.droppableId.startsWith('droppableOne')
            ? questionList[sourceIndex]?.blockList || []
            : blockAnswerList[sourceIndex]?.[parseInt(source.droppableId.split('_')[2])] || [];
        const destList = destination.droppableId.startsWith('droppableOne')
            ? questionList[destIndex]?.blockList || []
            : blockAnswerList[destIndex]?.[parseInt(destination.droppableId.split('_')[2])] || [];

        // 같은 리스트 내에서 항목이 이동하는 경우
        if (source.droppableId === destination.droppableId) {
            const items = reorder(sourceList, source.index, destination.index);

            if (source.droppableId.startsWith('droppableOne')) {
                // questionList 업데이트
                const newQuestionList = [...questionList];
                newQuestionList[sourceIndex].blockList = items;
                setQuestionList(newQuestionList);
            } else {
                // blockAnswerList 업데이트
                const newBlockAnswerList = [...blockAnswerList];
                newBlockAnswerList[sourceIndex][parseInt(source.droppableId.split('_')[2])] = items;
                setBlockAnswerList(newBlockAnswerList);
            }
        } else {
            // 다른 리스트로 항목 이동
            const result = moveItem(sourceList, destList, source, destination);

            // questionList 및 blockAnswerList 업데이트
            if (source.droppableId.startsWith('droppableOne')) {
                const newQuestionList = [...questionList];
                newQuestionList[sourceIndex].blockList = result[source.droppableId];
                if (destination.droppableId.startsWith('droppableOne')) {
                    newQuestionList[destIndex].blockList = result[destination.droppableId];
                }
                setQuestionList(newQuestionList);
            }

            if (!source.droppableId.startsWith('droppableOne') || !destination.droppableId.startsWith('droppableOne')) {
                const newBlockAnswerList = [...blockAnswerList];
                if (!source.droppableId.startsWith('droppableOne')) {
                    newBlockAnswerList[sourceIndex][parseInt(source.droppableId.split('_')[2])] = result[source.droppableId];
                }
                if (!destination.droppableId.startsWith('droppableOne')) {
                    newBlockAnswerList[destIndex][parseInt(destination.droppableId.split('_')[2])] = result[destination.droppableId];
                }
                setBlockAnswerList(newBlockAnswerList);
            }
        }
    };

// reorder 함수
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

// moveItem 함수
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
                    {question.type === 1 && // 객관식 문제일 경우
                        <Grid container sx={{ width: "100%" }}>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Grid container sx={{ width: "100%", height: "500px" }}>
                                    <Grid xs={12} item sx={{ width: "100%", height: "200px", border: 1, overflow: "auto" }}>
                                        <Droppable droppableId={`droppable_${index}`} direction="horizontal">
                                            {(provided) => (
                                                <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps} sx={{ display: "flex" }}>
                                                    {question.blockList && question.blockList.map((block, blockIndex) => (
                                                        <Draggable key={block.id} draggableId={`block_${index}_${blockIndex}`}  index={blockIndex}>
                                                            {(provided) => (
                                                                <Box
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.3rem" }}
                                                                >
                                                                    <Block code={block.block} color={getBlockColor(block.block)} text={block.value && block.value}
                                                                           isSpecial={
                                                                               ["[number]", "[String]", "[numberVal]", "[StringVal]"].includes(block.block)
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
                                    {blockAnswerList[index].map((row, rowIdx) => (
                                        <Grid xs={12} item sx={{ width: "100%", height: "200px", border: 1, overflow: "auto" }} key={rowIdx}>
                                            <Droppable droppableId={`droppable_${index}_${rowIdx}`} direction="horizontal">
                                                {(provided) => (
                                                    <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps} sx={{ display: "flex" }}>
                                                        {row.length > 0 && row.map((block, blockIndex) => (
                                                            <Draggable key={block.id} draggableId={`answer_${index}_${rowIdx}_${blockIndex}`} index={blockIndex}>
                                                                {(provided) => (
                                                                    <Box
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        sx={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.3rem" }}
                                                                    >
                                                                        <Block code={block.block} color={getBlockColor(block.block)} text={block.value && block.value}
                                                                               isSpecial={
                                                                                   ["[number]", "[String]", "[numberVal]", "[StringVal]"].includes(block.block)
                                                                               } />
                                                                    </Box>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <Button
                                                            sx={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.3rem" }}
                                                            onClick={() => addRow(index)}
                                                        >
                                                            <Block code={"[enter]"} color={getBlockColor("[enter]")} text={"줄바꿈"} />
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Droppable>
                                        </Grid>
                                    ))}
                                </Grid>
                            </DragDropContext>
                        </Grid>
                    }
                </Paper>
            ))}
        </ThemeProvider>
    );
}

export default MainTest;