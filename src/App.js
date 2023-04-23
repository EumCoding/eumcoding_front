import './App.css';
import React from 'react';
import {Route, Routes} from "react-router-dom";
import Join from "./student/Join";
import TopBar from "./component/TopNav";
import Main from "./unauth/Main";
import Login from "./unauth/Login";
import Lecture from "./unauth/Lecture";

function App() {
    return (
        <Routes>
            <Route path="/join" element={<Join/>}/>
            <Route path="/test" element={<TopBar/>}/>
            {/* 비로그인 메인화면 */}
            <Route path={"/unauth/main"} element={<Main />}/>
            {/* 로그인 화면 **/}
            <Route path={"/unauth/login"} element={<Login />}/>
            {/* 강의 설명 화면 **/}
            <Route path={"/lecture"} element={<Lecture />}/>
        </Routes>

    );
}

export default App;
