"use client";

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';

const VideoCall = dynamic(() => import('../components/VideoCall'), { ssr: false });

const ExplorePage = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [matchFound, setMatchFound] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('matchFound', async ({ roomId }: { roomId: string }) => {
            console.log('Match found in room:', roomId);
            setRoomId(roomId);
            
            try {
                console.log('Fetching token from:', `${backendUrl}/api/explore/token`);
                const response = await fetch(`${backendUrl}/api/explore/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ channelName: roomId }),
                });
                
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error:', response.status, errorText);
                    return;
                }
                
                // Check content type before parsing as JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const responseText = await response.text();
                    console.error('Non-JSON response:', responseText);
                    return;
                }
                
                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                    setMatchFound(true);
                    setIsSearching(false);
                } else {
                    console.error('Failed to get token');
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleFindMatch = () => {
        if (socket) {
            console.log('Finding match...');
            setIsSearching(true);
            socket.emit('findMatch');
        }
    };

    const handleEndCall = () => {
        if (socket && roomId) {
            socket.emit('leaveRoom', roomId);
        }
        setMatchFound(false);
        setRoomId(null);
        setToken(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            {!matchFound ? (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Find a Partner to Chat With</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Click the button below to get matched with someone.</p>
                    <button
                        onClick={handleFindMatch}
                        disabled={isSearching}
                        className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSearching ? 'Searching...' : 'Find a Match'}
                    </button>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <VideoCall
                        appId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
                        channel={roomId!}
                        token={token!}
                    />
                    <button onClick={handleEndCall} className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
