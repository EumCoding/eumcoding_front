import React from 'react';
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

    // 블럭 리스트를 저장할 state
    const [blockList, setBlockList] = React.useState([]);
    // 블럭 답안을 저장할 state
    const [answerGrid, setAnswerGrid] = React.useState([[]]);
    const [selectBlock, setSelectBlock] = React.useState("[for]"); // videoTestBlock

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

    // video test 추가용 modal
    const videoTestAddBody = (
        <Grid
            container
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                maxWidth: 800,
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 24,
                p: 7,
            }}
        >
            <Grid xs={12} item sx={{display:"flex", justifyContent:"center", alignItems:"center", py:"1rem"}}>
                <Typography sx={{fontWeight:"800", fontSize:"1.5rem"}}>
                    블록추가
                </Typography>
            </Grid>
            {/* videoTestType이 0인 경우... 객관식 보기 리스트 추가 **/}
            {blockList.map((item, idx) => {
                return(
                    <Grid xs={12} item sx={{pt:"0.3rem"}}>
                        <Typography sx={{fontWeight:"500", fontSize:"1rem", display:"flex", alignItems:"center"}}>
                            [{idx+1}]. {item} <ClearIcon onClick={() =>
                            // 해당 idx의 item만 pop
                            setBlockList(blockList.filter((item, index) => index !== idx))
                        } />
                        </Typography>
                    </Grid>
                )
            })}
            { blockList && (
                <Grid container item xs={12} spacing={2} sx={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                    {blockList.map((block, index) => (
                        <Grid item key={index} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                            <Block
                                code={block.code}
                                text={block.text}
                                color={getBlockColor(block.code)}
                                isSpecial={block.code === "[String]" || block.code === "[number]" || block.code === "[numberVal]" || block.code === "[StringVal]"}
                            />
                            <IconButton
                                onClick={() => handleDeleteBlock(index)}
                                sx={{ ml: 1 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
            )}
            {/* 블록코딩을 선택한 경우에는 블록 드랍다운 출력 **/}

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
                    {/* number 또는 text가 선택된 경우 **/}

                    <Grid xs={12} item container sx={{mt:"2rem", display:"flex", justifyContent:(selectBlock && ( selectBlock.code === "[String]" || selectBlock.code === "[number]" || selectBlock.code === "[numberVal]" || selectBlock.code === "[StringVal]")) ? "space-between" : "flex-end", alignItems:"flex-start"}}>
                        {selectBlock && (selectBlock.code === "[String]" || selectBlock.code === "[number]" || selectBlock.code === "[numberVal]" || selectBlock.code === "[StringVal]") && (
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
                                    },
                                    display: "inline",
                                    width: "80%"
                                }}
                            />
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
                                width:"15%"
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
                                temp.push({ code: selectBlock.code, text: tempValue });
                                setBlockList(temp);
                                // 추가 후 videoTestBlock 초기화
                                setSelectBlock(null);
                                document.getElementById("videoTestBlockSelect").value = "[for]";
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
        </Grid>
    )

    return (
        <ThemeProvider theme={theme}>
            <TopBar />
            <Box sx={{position:"sticky"}}>
                {/* Drawer 컴포넌트 */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 350,
                        flexShrink: 0,
                        p:2,
                        '& .MuiDrawer-paper': {
                            width: 350,
                            boxSizing: 'border-box',
                            p:2,
                        },
                    }}
                    open
                >
                    {/* Drawer 내용 */}
                    <Typography variant="h6" sx={{ padding: 2 }}>
                        사이드바
                    </Typography>
                    <Grid container sx={{width:"100%"}}>
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
                                    temp.push({ code: selectBlock.code, text: tempValue });
                                    setBlockList(temp);
                                    // 추가 후 videoTestBlock 초기화
                                    setSelectBlock(null);
                                    document.getElementById("videoTestBlockSelect").value = "[for]";
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
        </ThemeProvider>
    );
}

export default BlockCodingTest;