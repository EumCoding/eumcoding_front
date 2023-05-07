import './App.css';
import React from 'react';
import {Route, Routes} from "react-router-dom";
import Join from "./unauth/Join";
import TopBar from "./component/TopNav";
import Main from "./unauth/Main";
import Login from "./unauth/Login";
import Lecture from "./unauth/Lecture";
import DashBoard from "./student/DashBoard";
import MyPage from "./student/MyPage";
import MyReview from "./student/MyReview";
import MyLecture from "./student/MyLecture";

function App() {
    return (
        <Routes>
            {/* 회원가입 */}
            <Route path="/join" element={<Join/>}/>
            <Route path="/test" element={<TopBar/>}/>
            {/* 비로그인 메인화면 */}
            <Route path={"/unauth/main"} element={<Main />}/>
            {/* 로그인 화면 **/}
            <Route path={"/unauth/login"} element={<Login />}/>
            {/* 강의 설명 화면 **/}
            <Route path={"/lecture"} element={<Lecture />}/>
            {/* 대시보드 **/}
            <Route path={"/dashboard"} element={<DashBoard />}/>
            {/* 내 프로필 **/}
            <Route path={"/my/profile"} element={<MyPage />}/>
            {/* 내가 작성한 리뷰 **/}
            <Route path={"/my/review"} element={<MyReview />}/>
            {/* 수강중인 강의 **/}
            <Route path={"/my/lecture"} element={<MyLecture />}/>
        </Routes>

    );
}

export default App;
