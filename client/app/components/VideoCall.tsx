"use client";

import {
    AgoraRTCProvider,
    useRTCClient,
    useRemoteUsers,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    RemoteUser,
    LocalUser,
} from "agora-rtc-react";
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useState, useEffect } from "react";

interface VideoCallProps {
    appId: string;
    channel: string;
    token: string;
}

const VideoCall = ({ appId, channel, token }: VideoCallProps) => {
    const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

    return (
        <AgoraRTCProvider client={agoraClient}>
            <div className="flex flex-col items-center justify-center w-full h-screen bg-black p-4">
                <Videos channelName={channel} AppID={appId} token={token} />
            </div>
        </AgoraRTCProvider>
    );
};

interface VideosProps {
    channelName: string;
    AppID: string;
    token: string;
}

const Videos = (props: VideosProps) => {
    const { AppID, channelName, token } = props;
    const remoteUsers = useRemoteUsers();
    const { localMicrophoneTrack, isMuted: isMicMuted, mute: muteMic, unmute: unmuteMic } = useLocalMicrophoneTrack();
    const { localCameraTrack, isMuted: isCamMuted, mute: muteCam, unmute: unmuteCam } = useLocalCameraTrack();
    const [isJoined, setIsJoined] = useState(false);
    const agoraClient = useRTCClient();

    useEffect(() => {
        const join = async () => {
            if (token) {
                await agoraClient.join(AppID, channelName, token, null);
                setIsJoined(true);
            }
        };
        join();
        
        return () => {
            if (isJoined) {
                agoraClient.leave();
            }
        };
    }, [token, AppID, channelName, agoraClient]);


    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full h-full bg-gray-700 rounded-lg overflow-hidden relative">
                     <LocalUser
                        cameraOn={!isCamMuted}
                        micOn={!isMicMuted}
                        videoTrack={localCameraTrack}
                        audioTrack={localMicrophoneTrack}
                        >
                        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">You</div>
                    </LocalUser>
                </div>
                {remoteUsers.map((user: IAgoraRTCRemoteUser) => (
                    <div key={user.uid} className="w-full h-full bg-gray-700 rounded-lg overflow-hidden relative">
                        <RemoteUser user={user} playVideo={true} playAudio={true} />
                        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">Partner</div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-4">
                <button onClick={() => isMicMuted ? unmuteMic() : muteMic()} className={`p-3 rounded-full text-white ${isMicMuted ? 'bg-red-500' : 'bg-gray-600'}`}>
                    {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                </button>
                <button onClick={() => isCamMuted ? unmuteCam() : muteCam()} className={`p-3 rounded-full text-white ${isCamMuted ? 'bg-red-500' : 'bg-gray-600'}`}>
                    {isCamMuted ? 'Start Cam' : 'Stop Cam'}
                </button>
            </div>
        </div>
    );
};

export default VideoCall; 