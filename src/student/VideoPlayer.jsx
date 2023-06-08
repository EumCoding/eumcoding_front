import React, {useEffect, useRef} from 'react';
import videojs from "video.js";
import 'video.js/dist/video-js.css';


function VideoPlayer({ options, onProgress }) {
    const videoNode = useRef(null);
    const player = useRef(null);

    const lastTime = useRef(0);

    useEffect(() => {
        player.current = videojs(videoNode.current, options, function onPlayerReady() {
            console.log('Player is ready');
        });

        player.current.on('timeupdate', function() {
            const currentTime = player.current.currentTime();

            // 사용자가 마지막으로 본 지점을 넘어갔는지 확인
            if (currentTime > lastTime.current + 1) {
                player.current.currentTime(lastTime.current);
            } else {
                lastTime.current = currentTime;
                onProgress(currentTime);
            }
        });

        return () => {
            if (player.current) {
                player.current.dispose();
            }
        };
    }, [options]);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <div data-vjs-player>
                <video ref={videoNode} className="video-js vjs-fluid" />
            </div>
        </div>
    );
}

export default VideoPlayer;