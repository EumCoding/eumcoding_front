import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {setAccessToken, setRole} from "../redux/actions";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";

const KakaoRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();// redux dispatch


    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            axios.get(`${process.env.REACT_APP_API_URL}/member/kakao/auth/kakao/login?code=${code}`)
                .then(res => {
                    // 성공 처리 로직
                    // 쿠키에 저장(임시)
                    Cookies.set('accessToken', res.data.token, { sameSite: 'lax' })
                    Cookies.set('role', res.data.role, { sameSite: 'lax' })
                    Cookies.set('memberId', res.data.id, { sameSite: 'lax' });
                    dispatch(setAccessToken(res.data.token))
                    // role이 0인 경우 (일반 회원인 경우)
                    if(res.data.role === 0){
                        // 메인페이지로 이동
                        dispatch(setRole(res.data.role))
                        navigate("/main")
                    }else if(res.data.role === 1){
                        // 강사 대시보드로 이동
                        dispatch(setRole(res.data.role))
                        navigate("/guide/main/info")
                    }else if(res.data.role === 3){
                        // 부모 대시보드로 이동
                        dispatch(setRole(res.data.role))
                        navigate("/parent/dashboard");
                }})
                .catch(error => {
                    // 에러 처리 로직
                    console.error('서버 에러:', error);
                    // 에러 페이지로 리디렉션
                        alert("카카오 로그인에 실패했습니다.")
                });
        }
    }, [navigate]);

    // 로딩 페이지 또는 스피너 표시
    return <div>Loading...</div>;
};

export default KakaoRedirect;