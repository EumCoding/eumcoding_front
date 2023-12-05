import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";

const KakaoRedirect = () => {
    const navigate = useNavigate();

    const accessToken = useSelector((state) => state.accessToken); // 엑세스 토큰

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && accessToken) {
            sendCodeToBackend(code);
        }
    }, [accessToken]);

    const sendCodeToBackend = async (code) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/member/kakao/createUser?code=${code}`,
                null,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                },
            )
            // 백엔드에서의 응답 처리
            console.log(response.data);
            // 로그인 처리 후 메인 페이지로 리디렉션
            navigate('/my/profile');
        } catch (error) {
            console.error("카카오 로그인 에러:", error);
            // 에러 처리 로직
            alert("카카오 로그인에 실패했습니다.")
            navigate('/login');
        }
    };

    return (
        <div>카카오 로그인 처리 중...</div>
    );
};

export default KakaoRedirect;