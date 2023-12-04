import React, {useState} from 'react';
import {
    Box,
    Button,
    createTheme, Drawer,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    RadioGroup, Select, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import BlockList from "../component/BlockList";
import ClearIcon from "@mui/icons-material/Clear";
import Block from "../component/Block";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import TopBar from "../component/TopNav";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";

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
        default: return "#D3D3D3"; // 라이트 그레이
    }
};

function BlockCodingTest(props) {

    const [blockId, setBlockId] = useState(0);

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

    // 블럭 리스트를 저장할 state
    const [blockList, setBlockList] = React.useState([]);
    // 블럭 답안을 저장할 state
    const [answerGrid, setAnswerGrid] = React.useState([[]]);
    const [selectBlock, setSelectBlock] = React.useState("[for]"); // videoTestBlock

    // answerGrid를 1차원 배열로 변환 후 {block: block.code, value: block.text} 형식으로 변환 한 후에 /lecture/section/test/question/block/block-convert로 전송하는 함수
    const handleSubmit = () => {
        const answer = answerGrid.map((row) => {
            return row.map((block) => {
                return {block: block.code, value: block.text};
            });
        });
        let temp = answer.flat();
        console.log(temp);
        //서버에 전송
        const response = axios.post(
            `${process.env.REACT_APP_API_URL}/lecture/section/test/question/block/block-convert`,
            temp
        ).then((res) => {
            alert(res.data);}
        ).catch((err) => {
            alert("문법이 잘못됐어요! 다시 확인해주세요!");
        })

    }

    // 블록 삭제 함수
    const handleDeleteBlock = (index) => {
        setBlockList(blockList.filter((_, i) => i !== index));
    };

    // theme
    const theme = createTheme({
        typography: {
            fontFamily: 'NanumSquareNeo',
        },
    })

    // 리스트 내 항목 순서 변경
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    // 2차원 배열 answerGrid의 행을 늘리는 함수
    const addRow = () => {
        setAnswerGrid(answerGrid.concat([[]]));
    };
    // 2차원 배열 answerGrid의 행을 줄이는 함수
    const deleteRow = () => {
        setAnswerGrid(answerGrid.slice(0, -1));
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

    return (
        <ThemeProvider theme={theme}>
            <TopBar />
            <Grid container sx={{position:"sticky"}}>
                <Box sx={{width:"20%"}}> {/* 사이드바 영역 */}
                    {/* Drawer 컴포넌트 */}
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: "20%",
                            flexShrink: 0,
                            p: 2,
                            '& .MuiDrawer-paper': {
                                width: "20%",
                                boxSizing: 'border-box',
                                p: 2,
                                pt:"5rem"
                            },

                        }}
                        open
                    >
                        {/* Drawer 내용 */}
                        <Grid container>
                            <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                <Grid xs={12} item>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="videoTestBlockLabel">블록선택</InputLabel>
                                        <Select
                                            labelId="blockLabel"
                                            id="blockSelect"
                                            value={selectBlock}
                                            onChange={(e) => {
                                                //선택한 MenuItem의 값을 videoTestBlock state에 할당
                                                setSelectBlock(e.target.value);
                                                console.log(e.target.value);
                                            }}
                                            label="블록선택" // 여기에 라벨을 지정
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 48 * 4.5, // 드롭다운 메뉴의 최대 높이
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '& .MuiSelect-select': {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                },
                                            }}
                                        >
                                            {BlockList.map((blockItem, blockIdx) => (
                                                <MenuItem key={blockIdx} value={blockItem}>
                                                    {blockItem.text}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item container sx={{mt:"2rem", display:"flex", justifyContent:"flex-end", alignItems:"flex-start"}}>
                                {selectBlock && (selectBlock.code === "[String]" || selectBlock.code === "[number]" || selectBlock.code === "[numberVal]" || selectBlock.code === "[StringVal]") && (
                                    <Grid item xs={12}>
                                        <TextField
                                            id="videoTestBlockInput"
                                            type={selectBlock.code === "[number]" ? "number" : "text"}
                                            fullWidth
                                            label="보기"
                                            size="small"
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // 대괄호를 포함하고 있는지 검사
                                                if (newValue.includes('[') || newValue.includes(']')) {
                                                    // 대괄호를 제거하고 값을 업데이트
                                                    e.target.value = newValue.replace(/[\[\]]/g, '');
                                                    // helperText를 통해 사용자에게 안내 메시지 표시
                                                    e.target.nextSibling.textContent = '대괄호 [ ]는 입력할 수 없습니다.';
                                                } else {
                                                    // 대괄호가 없으면 안내 메시지 제거
                                                    e.target.nextSibling.textContent = '';
                                                }
                                            }}
                                            helperText="대괄호 [ ]는 입력할 수 없습니다."
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '40px',
                                                    width:"100%"
                                                },
                                                width: "100%"
                                            }}
                                        />
                                    </Grid>
                                )}
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon sx={{ color: "#FFFFFF" }} />}
                                    sx={{
                                        height: '40px', // 버튼 높이를 TextField와 동일하게 설정
                                        background: '#4caf50',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            background: "#388e3c",
                                        },
                                        width:"100%"
                                    }}

                                    onClick={() => {
                                        // videoTestBlock 없을때 예외처리
                                        if(!selectBlock){
                                            alert("블록을 선택해주세요");
                                            return;
                                        }
                                        // [number] 또는 [String]가 선택된 경우에는 textfield에서 값을 가져와서 tempValue에 넣음
                                        let tempValue = "";
                                        if(selectBlock.code === "[String]" || selectBlock.code === "[number]" || selectBlock.code === "[StringVal]" || selectBlock.code === "[numberVal]" ) {
                                            tempValue = document.getElementById("videoTestBlockInput").value;
                                        }else {
                                            // 아닌 경우에는 videoTestBlock에 할당된 값을 tempValue에
                                            tempValue = selectBlock.text;
                                        }
                                        // { code: videoTestBlock, text: tempValue } 양식에 맞추어서 blockData state에 추가
                                        // blockData state에 추가
                                        const temp = JSON.parse(JSON.stringify(blockList)); // 깊은복사
                                        temp.push({ code: selectBlock.code, text: tempValue, id: blockId });
                                        setBlockId(blockId + 1);
                                        setBlockList(temp);
                                        // 추가 후 videoTestBlock 초기화
                                        setSelectBlock(null);
                                        // 추가 후 input 초기화([number] 또는 [String]의 경우에만)
                                        if(selectBlock.code === "[String]" || selectBlock.code === "[number]" || selectBlock.code === "[StringVal]" || selectBlock.code === "[numberVal]") {
                                            document.getElementById("videoTestBlockInput").value = "";
                                        }
                                    }}
                                >
                                    <Typography sx={{ color: "#FFFFFF" }}>추가</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Drawer>
                </Box>
                <Box sx={{display:"flex", justifyContent:"center", alignItems:"flex-start", width:"80%"}}> {/* 본문 영역 */}
                    {/* 본문 내용 */}
                    <Box sx={{ p: 2, width:"100%" }}>
                        <Typography variant="h5" sx={{mt:"2rem"}}>블럭 목록</Typography>
                        <Grid item xs={12} container sx={{width:"100%"}}>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Grid container sx={{width:"100%"}}>
                                    <Grid xs={12} item sx={{width: "100%",
                                        height: "80px", // 'px'가 자동으로 적용됩니다
                                        border: 1,
                                        overflow: "auto",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 효과 추가
                                        borderRadius: "4px", // 모서리 둥글게 처리
                                        borderColor: "primary.main", // 테두리 색상 설정 (테마의 primary 색상 사용)
                                        alignItems:"center"
                                    }}>
                                        <Droppable droppableId="droppableOne" direction="horizontal">
                                            {(provided) => (
                                                <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps} sx={{display:"flex"}}>
                                                    {blockList && blockList.map((block, index) => (
                                                        <Draggable key={block.id} draggableId={block.id.toString()} index={index} >
                                                            {(provided) => (
                                                                <Box
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{display:"flex", alignItems:"center", justifyContent:"flex", m:"0.3rem"}}
                                                                >
                                                                    <Block code={block.code} color={getBlockColor(block.code)} text={block.text && block.text}
                                                                           isSpecial={
                                                                               (block.code === "[number]" || block.code === "[String]" || block.code === "[numberVal]" || block.code === "[StringVal]")
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
                                    <Typography variant="h5" sx={{mt:"2rem"}}>코딩블럭</Typography>
                                    {answerGrid && answerGrid.map((row, idx) => {
                                        return(
                                            <Grid xs={12} item sx={{
                                                width: "100%",
                                                height: "85px", // 'px'가 자동으로 적용됩니다
                                                border: 1,
                                                overflowX: "auto",
                                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // 그림자 효과 추가
                                                borderRadius: "4px", // 모서리 둥글게 처리
                                                borderColor: "primary.main", // 테두리 색상 설정 (테마의 primary 색상 사용)
                                                alignItems:"center"
                                            }}>
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
                                                                            <Block code={block.code} color={getBlockColor(block.code)} text={block.text && block.text}
                                                                                   isSpecial={
                                                                                       (block.code === "[number]" || block.code === "[String]" || block.code === "[numberVal]" || block.code === "[StringVal]")
                                                                                   } />
                                                                        </Box>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                            <Button
                                                                sx={{display:"flex", alignItems:"center", justifyContent:"flex", m:"0.3rem"}}
                                                                onClick={() => {
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
                        {/* 제출하기 버튼 **/}
                        <Grid item xs={12} sx={{width:"100%", display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => {
                                    handleSubmit();
                                }}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                제출하기
                            </Button>
                        </Grid>
                    </Box>
                </Box>

            </Grid>
        </ThemeProvider>
    );
}

export default BlockCodingTest;