"use client";

import { RemoteUser, LocalUser } from "agora-rtc-react";
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    IMicrophoneAudioTrack,
    ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    text: string;
    sender: 'local' | 'remote';
    timestamp: Date;
}

interface VideoCallProps {
    appId: string;
    channel: string;
    token: string;
}

const agoraClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });

const VideoCall = ({ appId, channel, token }: VideoCallProps) => {
    return (
        <Videos channelName={channel} AppID={appId} token={token} client={agoraClient} />
    );
};

interface VideosProps {
    channelName: string;
    AppID: string;
    token: string;
    client: IAgoraRTCClient;
}

const Videos = (props: VideosProps) => {
    const { AppID, channelName, token, client } = props;
    
    const [localMicrophoneTrack, setLocalMicrophoneTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [localCameraTrack, setLocalCameraTrack] = useState<ICameraVideoTrack | null>(null);
    const [micLoading, setMicLoading] = useState(true);
    const [camLoading, setCamLoading] = useState(true);

    const [remoteUser, setRemoteUser] = useState<IAgoraRTCRemoteUser | undefined>();
    const [isJoined, setIsJoined] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamMuted, setIsCamMuted] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(true);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.emit('joinRoom', channelName);

        newSocket.on('message', (message: { text: string; sender: string; timestamp: string }) => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: message.text,
                sender: 'remote',
                timestamp: new Date(message.timestamp)
            }]);
        });

        return () => {
            newSocket.emit('leaveRoom', channelName);
            newSocket.disconnect();
        };
    }, [channelName]);

    useEffect(() => {
        const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            await client.subscribe(user, mediaType);
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
            setRemoteUser(user);
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
             setRemoteUser(undefined);
        };
        
        const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
            setRemoteUser(undefined);
        };

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
        client.on("user-left", handleUserLeft);

        const joinAndPublish = async () => {
            try {
                setMicLoading(true);
                setCamLoading(true);

                const [micTrack, camTrack] = await Promise.all([
                    AgoraRTC.createMicrophoneAudioTrack(),
                    AgoraRTC.createCameraVideoTrack(),
                ]);
                
                setLocalMicrophoneTrack(micTrack);
                setLocalCameraTrack(camTrack);
                setMicLoading(false);
                setCamLoading(false);
                
                await client.join(AppID, channelName, token, null);
                await client.publish([micTrack, camTrack]);
                setIsJoined(true);
            } catch (error) {
                console.error("Agora client connection error:", error);
            }
        };

        if (token) {
            joinAndPublish();
        }

        return () => {
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
            client.off("user-left", handleUserLeft);

            localMicrophoneTrack?.close();
            localCameraTrack?.close();

            client.leave();
        };
    }, [client, AppID, channelName, token]);

    const toggleMic = async () => {
        if (localMicrophoneTrack) {
            const newMutedState = !isMicMuted;
            await localMicrophoneTrack.setMuted(newMutedState);
            setIsMicMuted(newMutedState);
        }
    };

    const toggleCam = async () => {
        if (localCameraTrack) {
            const newMutedState = !isCamMuted;
            await localCameraTrack.setMuted(newMutedState);
            setIsCamMuted(newMutedState);
        }
    };

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            const message = {
                text: newMessage,
                sender: 'local',
                timestamp: new Date().toISOString(),
                room: channelName
            };
            
            socket.emit('sendMessage', message);
            
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: newMessage,
                sender: 'local',
                timestamp: new Date()
            }]);
            
            setNewMessage("");
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    return (
        <div className="w-full h-screen flex bg-gray-900 text-white">
            <div className="flex-1 flex flex-col">
                <div className="relative flex-1 bg-black rounded-lg m-2 overflow-hidden">
                    {remoteUser?.videoTrack ? (
                        <RemoteUser user={remoteUser as any} playVideo={true} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V18.1a1 1 0 01-1.45.89L15 14M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-white">Waiting for partner</h3>
                                <p className="mt-1 text-sm text-gray-500">You'll see their video here when they connect.</p>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                        {localCameraTrack && (
                            <LocalUser
                                videoTrack={localCameraTrack as any}
                                cameraOn={!isCamMuted}
                                micOn={!isMicMuted}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 p-4 bg-gray-800 m-2 rounded-lg">
                    <button 
                        onClick={toggleMic}
                        disabled={micLoading}
                        className={`p-3 rounded-full text-white transition-colors ${
                            isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        } disabled:opacity-50`}
                    >
                        {isMicMuted ? '🔇' : '🎤'}
                    </button>
                    <button 
                        onClick={toggleCam}
                        disabled={camLoading}
                        className={`p-3 rounded-full text-white transition-colors ${
                            isCamMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        } disabled:opacity-50`}
                    >
                        {isCamMuted ? 'unmute' : 'mute'}
                    </button>
                    <button
                        onClick={() => setIsChatVisible(!isChatVisible)}
                        className="p-3 rounded-full text-white transition-colors bg-gray-700 hover:bg-gray-600"
                    >
                        💬
                    </button>
                </div>
            </div>

            <div className={`w-full md:w-96 bg-gray-800 flex flex-col transition-all duration-300 ${isChatVisible ? 'max-w-md' : 'max-w-0'}`} style={{ overflow: 'hidden' }}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Chat</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'local' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg ${
                                    message.sender === 'local'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-white'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-end"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall; 