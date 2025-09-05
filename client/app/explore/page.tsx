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
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    const [backendUrl, setBackendUrl] = useState<string>('');

    useEffect(() => {
        // Auto-detect backend URL based on current environment
        let detectedBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!detectedBackendUrl) {
            // If we're running on a dev tunnel, try to use a common port forward pattern
            if (typeof window !== 'undefined' && window.location.hostname.includes('devtunnels.ms')) {
                // Extract the prefix and create server URL
                const tunnelPrefix = window.location.hostname.split('-')[0];
                detectedBackendUrl = `https://${tunnelPrefix}-5000.inc1.devtunnels.ms`;
            } else {
                detectedBackendUrl = 'http://localhost:5000';
            }
        }
        
        detectedBackendUrl = detectedBackendUrl.replace(/\/$/, '');
        setBackendUrl(detectedBackendUrl);
        console.log('🔗 Connecting to backend:', detectedBackendUrl);
        
        const newSocket = io(detectedBackendUrl, {
            transports: ['websocket', 'polling'],
            timeout: 10000,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
            setConnectionStatus('connected');
            setError(null);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnectionStatus('disconnected');
            setIsSearching(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setConnectionStatus('disconnected');
            setError('Failed to connect to server. Please try again.');
        });

        newSocket.on('matchFound', async ({ roomId }: { roomId: string }) => {
            console.log('Match found in room:', roomId);
            setRoomId(roomId);
            setError(null);
            
            try {
                console.log('Fetching token from Next.js API route');
                const response = await fetch('/api/explore/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ channelName: roomId }),
                });
                
                console.log('Token response status:', response.status);
                
                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error:', response.status, errorText);
                    setError(`Failed to get video token: ${response.status}`);
                    return;
                }
                
                // Check content type before parsing as JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const responseText = await response.text();
                    console.error('Non-JSON response:', responseText);
                    setError('Server returned invalid response');
                    return;
                }
                
                const data = await response.json();
                console.log('Token response data:', data);
                
                if (data.token) {
                    setToken(data.token);
                    setMatchFound(true);
                    setIsSearching(false);
                    
                    if (data.warning) {
                        console.warn('Token warning:', data.warning);
                    }
                } else {
                    console.error('No token in response');
                    setError('Failed to get video token');
                }
            } catch (error) {
                console.error('Error fetching token:', error);
                setError('Failed to connect to video service');
            }
        });

        return () => {
            console.log('Cleaning up socket connection');
            newSocket.disconnect();
        };
    }, []);

    const handleFindMatch = async () => {
        if (socket && connectionStatus === 'connected') {
            console.log('Finding match...');
            setIsSearching(true);
            setError(null);
            
            // Try to get user data for intelligent matching
            try {
                const userData = await getUserData();
                console.log('Sending user data for intelligent matching:', userData);
                socket.emit('findMatch', userData);
            } catch (error) {
                console.log('Could not get user data, using random matching:', error);
                socket.emit('findMatch');
            }
        } else {
            setError('Not connected to server. Please refresh the page.');
        }
    };

    const getUserData = async () => {
        // Try to get user data from localStorage or make an API call
        const token = localStorage.getItem('authToken'); // Use the correct token key
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Use Next.js API route instead of direct backend call
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const profileData = await response.json();
        return {
            userId: profileData.user.id,
            username: profileData.user.username,
            fullname: profileData.user.fullname
        };
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
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Find a Partner to Chat With</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Click the button below to get matched with someone.</p>
                    
                    {/* Connection Status */}
                    <div className="mb-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                            connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                connectionStatus === 'connected' ? 'bg-green-400' :
                                connectionStatus === 'connecting' ? 'bg-yellow-400' :
                                'bg-red-400'
                            }`}></div>
                            {connectionStatus === 'connected' ? 'Connected' :
                             connectionStatus === 'connecting' ? 'Connecting...' :
                             'Disconnected'}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleFindMatch}
                        disabled={isSearching || connectionStatus !== 'connected'}
                        className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSearching ? 'Searching for a match...' : 'Find a Match'}
                    </button>

                    {isSearching && (
                        <p className="mt-4 text-sm text-gray-500">
                            Looking for someone to chat with. This may take a moment...
                        </p>
                    )}
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <VideoCall
                        appId={process.env.NEXT_PUBLIC_AGORA_APP_ID || 'default_app_id'}
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
