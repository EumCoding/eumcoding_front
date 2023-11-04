import './App.css';
import React, {useEffect} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import StudentJoin from "./unauth/StudentJoin";
import TopBar from "./component/TopNav";
import Main from "./unauth/Main";
import Login from "./unauth/Login";
import Lecture from "./unauth/Lecture";
import DashBoard from "./student/DashBoard";
import MyPage from "./student/MyPage";
import MyReview from "./student/MyReview";
import MyLecture from "./student/MyLecture";
import MyQuestion from "./student/MyQuestion";
import Basket from "./student/Basket";
import PayLog from "./student/PayLog";
import LectureInfo from "./student/LectureInfo";
import Video from "./student/Video";
import {setAccessToken, setMemberId, setRole} from "./redux/actions";
import Cookies from "js-cookie"
import {useDispatch, useSelector} from "react-redux";
import Search from "./unauth/Search";
import JoinSelect from "./unauth/JoinSelect";
import ParentJoin from "./unauth/ParentJoin";
import TeacherJoin from "./unauth/TeacherJoin";
import Test from "./unauth/test";
import Curriculum from "./student/Curriculum";
import TeacherDashBoard from "./teacher/TeacherDashBoard";
import TeacherMyLectureList from "./teacher/TeacherMyLectureList";
import NewLecture from "./teacher/NewLecture";
import TeacherLectureInfo from "./teacher/TeacherLectureInfo"


function App() {


        const dispatch = useDispatch();
        const accessToken = useSelector((state) => state.accessToken);
        const navigate = useNavigate();

        // token을 리덕스로 가져옴. 이후에 refresh token 적용 시 쿠키에는 refresh token, redux에는 access token 적용하는 식으로 진행.
        useEffect(() => {
                if(Cookies.get('accessToken'))
                        dispatch(setAccessToken(Cookies.get('accessToken')));
                if(Cookies.get('role'))
                        dispatch(setRole(Cookies.get('role')));
                if(Cookies.get('memberId'))
                        dispatch(setMemberId(Cookies.get('memberId')));
                if(!accessToken && !Cookies.get('accessToken')){
                        navigate("/login");
                }
        },[])

    return (
        <Routes>
            {/*test**/}
            <Route path="/test" element={<Test/>}/>
            {/* 회원가입 */}
            <Route path="/joinSelect" element={<JoinSelect/>}/>
                {/* 학생 회원가입 */}
                <Route path="/join/student" element={<StudentJoin/>}/>
                {/* 부모 회원가입 */}
                <Route path="/join/parent" element={<ParentJoin/>}/>
                {/* 강사 회원가입 **/}
                <Route path="/join/teacher" element={<TeacherJoin/>}/>

            {/* 비로그인 메인화면 */}
            <Route path={"/main"} element={<Main />}/>
            {/* 로그인 화면 **/}
            <Route path={"/login"} element={<Login />}/>
            {/* 강의 설명 화면 **/}
            <Route path={"/lecture/:value"} element={<Lecture />}/>
            {/* 대시보드 **/}
            <Route path={"/dashboard"} element={<DashBoard />}/>
            {/* 내 프로필 **/}
            <Route path={"/my/profile"} element={<MyPage />}/>
            {/* 내가 작성한 리뷰 **/}
            <Route path={"/my/review"} element={<MyReview />}/>
            {/* 수강중인 강의 **/}
            <Route path={"/my/lectureList"} element={<MyLecture />}/>
            {/* 내가 작성한 질문 **/}
            <Route path={"/my/question"} element={<MyQuestion />}/>
            {/* 장바구니 **/}
            <Route path={"/my/basket"} element={<Basket />}/>
            {/* 결제내역 **/}
            <Route path={"/my/payLog"} element={<PayLog />}/>
            {/* 대시보드 - 강의 **/}
            <Route path={"/my/lectureInfo/:value"} element={<LectureInfo />}/>
            {/* 동영상 재생 **/}
            <Route path={"/my/lecture/video/"} element={<Video />}/>
            {/* 강의 검색 **/}
            <Route path={"/search"} element={<Search />}/>
            {/* 학생 대시보드 - 커리큘럼 **/}
            <Route path="/student/curriculum" element={<Curriculum/>}/>
                {/* 강사 대시보드 **/}
                <Route path={"/teacher/dashboard"} element={<TeacherDashBoard />}/>
            {/* 강사 올린 강의 리스트 **/}
            <Route path={"/teacher/myLectureList"} element={<TeacherMyLectureList />}/>
            {/* 강의 추가 **/}
            <Route path={"/teacher/newLecture"} element={<NewLecture />}/>
                {/* 강의 추가 **/}
                <Route path={"/teacher/lectureInfo/:value"} element={<TeacherLectureInfo />}/>

        </Routes>

    );
}

export default App;
