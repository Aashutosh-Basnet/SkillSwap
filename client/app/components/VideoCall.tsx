"use client";

import { RemoteUser, LocalUser, AgoraRTCProvider } from "agora-rtc-react";
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
        <AgoraRTCProvider client={agoraClient}>
            <Videos channelName={channel} AppID={appId} token={token} client={agoraClient} />
        </AgoraRTCProvider>
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

    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
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
        // Use the same URL detection logic as in the explore page
        let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
            if (typeof window !== 'undefined' && window.location.hostname.includes('devtunnels.ms')) {
                const tunnelPrefix = window.location.hostname.split('-')[0];
                backendUrl = `https://${tunnelPrefix}-5000.inc1.devtunnels.ms`;
            } else {
                backendUrl = 'http://localhost:5000';
            }
        }
        
        console.log('VideoCall connecting to backend:', backendUrl);
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('VideoCall socket connected');
            newSocket.emit('joinRoom', channelName);
            console.log('Joined chat room:', channelName);
        });

        newSocket.on('disconnect', () => {
            console.log('VideoCall socket disconnected');
        });

        newSocket.on('connect_error', (error) => {
            console.error('VideoCall socket connection error:', error);
        });

        newSocket.on('message', (message: { text: string; sender: string; timestamp: string }) => {
            console.log('Received chat message:', message);
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
        const handleUserPublished = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            console.log(`🎥 User published ${mediaType}:`, user.uid);
            setRemoteUsers(prevUsers => {
                // Avoid duplicating users
                if (prevUsers.find(u => u.uid === user.uid)) {
                    // Create a new array reference to trigger re-render
                    return [...prevUsers];
                }
                return [...prevUsers, user];
            });
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
            console.log(`🔇 User unpublished:`, user.uid);
            // The user object is updated in-place by the SDK, so we just need to trigger a re-render
            setRemoteUsers(prevUsers => [...prevUsers]);
        };

        const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
            console.log(`👋 User left:`, user.uid);
            setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        };
        
        const joinChannel = async () => {
            if (isJoined) {
                console.log("⚠️ Already joined, skipping joinChannel.");
                return;
            }

            console.log("Starting Agora connection effect");
            
            client.on("user-published", handleUserPublished);
            client.on("user-unpublished", handleUserUnpublished);
            client.on("user-left", handleUserLeft);

            try {
                console.log("Acquiring local tracks...");
                const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                
                setLocalMicrophoneTrack(micTrack);
                setLocalCameraTrack(camTrack);
                setMicLoading(false);
                setCamLoading(false);

                console.log(`🔗 Joining channel: ${channelName}`);
                await client.join(AppID, channelName, token, null);
                setIsJoined(true);
                console.log(`✅ Successfully joined channel: ${channelName}`);
                
                console.log("Publishing local tracks...");
                await client.publish([micTrack, camTrack]);
                console.log("✅ Successfully published tracks");

            } catch (error) {
                console.error("Agora client connection error:", error);
                setMicLoading(false);
                setCamLoading(false);
            }
        };

        joinChannel();

        return () => {
            console.log("Cleaning up Agora connection effect");
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
            client.off("user-left", handleUserLeft);

            localMicrophoneTrack?.close();
            localCameraTrack?.close();

            // Check connection state before trying to leave
            if (client.connectionState === "CONNECTED") {
                client.leave().catch(err => console.warn("Error leaving channel:", err));
            }
            // Reset joined state regardless
            setIsJoined(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AppID, channelName, client, token]); // Dependencies that re-trigger the connection

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
            
            console.log('Sending chat message:', message);
            socket.emit('sendMessage', message);
            
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: newMessage,
                sender: 'local',
                timestamp: new Date()
            }]);
            
            setNewMessage("");
        } else {
            console.log('Cannot send message:', { 
                hasMessage: !!newMessage.trim(), 
                hasSocket: !!socket, 
                socketConnected: socket?.connected 
            });
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    // Get the primary remote user to display
    const remoteUser = remoteUsers[0];

    return (
        <div className="w-full h-screen flex bg-gray-900 text-white">
            <div className="flex-1 flex flex-col">
                {/* Debug info - remove in production */}
                <div className="bg-gray-800 p-2 m-2 rounded text-xs">
                    <div>Local Cam: {localCameraTrack ? '✅' : '❌'} | Remote Users: {remoteUsers.length} | Remote Video: {remoteUser?.hasVideo ? '✅' : '❌'}</div>
                    <div>Channel: {channelName} | Joined: {isJoined ? '✅' : '❌'} | Connection: {client.connectionState}</div>
                </div>
                <div className="relative flex-1 bg-black rounded-lg m-2 overflow-hidden">
                    {remoteUser?.hasVideo ? (
                        <RemoteUser user={remoteUser} playVideo={true} key={remoteUser.uid} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V18.1a1 1 0 01-1.45.89L15 14M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-white">
                                    {isJoined ? 'Waiting for partner...' : 'Connecting...'}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isJoined && remoteUser ? 'Partner video is currently unavailable.' : "You'll see their video here when they connect."}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                        {localCameraTrack ? (
                            <LocalUser
                                videoTrack={localCameraTrack}
                                cameraOn={!isCamMuted}
                                micOn={!isMicMuted}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <div className="text-2xl mb-1">📷</div>
                                    <div className="text-xs">Camera unavailable</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 p-4 bg-gray-800 m-2 rounded-lg">
                    <button 
                        onClick={toggleMic}
                        disabled={micLoading || !localMicrophoneTrack}
                        className={`p-3 rounded-full text-white transition-colors ${
                            !localMicrophoneTrack ? 'bg-gray-600 cursor-not-allowed' :
                            isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        } disabled:opacity-50`}
                        title={!localMicrophoneTrack ? 'Microphone not available' : ''}
                    >
                        {!localMicrophoneTrack ? '🚫🎤' : isMicMuted ? '🔇' : '🎤'}
                    </button>
                    <button 
                        onClick={toggleCam}
                        disabled={camLoading || !localCameraTrack}
                        className={`p-3 rounded-full text-white transition-colors ${
                            !localCameraTrack ? 'bg-gray-600 cursor-not-allowed' :
                            isCamMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        } disabled:opacity-50`}
                        title={!localCameraTrack ? 'Camera not available' : ''}
                    >
                        {!localCameraTrack ? '🚫📷' : isCamMuted ? 'unmute' : 'mute'}
                    </button>
                    <button
                        onClick={() => setIsChatVisible(!isChatVisible)}
                        className="p-3 rounded-full text-white transition-colors bg-gray-700 hover:bg-gray-600"
                    >
                        💬
                    </button>
                    <button
                        onClick={() => {
                            console.log('🔧 DEBUG INFO:');
                            console.log('Local tracks:', { mic: localMicrophoneTrack, cam: localCameraTrack });
                            console.log('All Remote Users:', remoteUsers.map(u => ({ uid: u.uid, hasVideo: u.hasVideo, hasAudio: u.hasAudio })));
                            console.log('Client state:', client.connectionState);
                            console.log('Joined:', isJoined);
                            
                            // Try to refresh remote user subscription
                            if (remoteUser && client.connectionState === "CONNECTED") {
                                console.log('🔄 Attempting to resubscribe to remote user...');
                                client.subscribe(remoteUser, "video").then(() => {
                                    console.log('✅ Resubscribed to video');
                                    // Force re-render by creating a new array
                                    setRemoteUsers(prev => [...prev]);
                                }).catch(err => console.error('❌ Resubscribe failed:', err));
                            }
                        }}
                        className="p-3 rounded-full text-white transition-colors bg-yellow-600 hover:bg-yellow-700"
                        title="Debug video issues"
                    >
                        🔧
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