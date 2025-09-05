import AgoraAccessToken from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = AgoraAccessToken;

export const generateToken = (req, res) => {
    console.log('Token generation request received:', req.body);
    
    const { channelName } = req.body;
    if (!channelName) {
        console.error('Missing channelName in request');
        return res.status(400).json({ error: 'channelName is required' });
    }

    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    console.log('Agora Config Check:', { 
        hasAppId: !!appID, 
        hasAppCert: !!appCertificate,
        channelName 
    });

    if (!appID || !appCertificate) {
        console.error('Missing Agora credentials');
        
        // For development/testing purposes, return a mock token
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            console.log('Development mode: returning mock token');
            return res.json({ 
                token: 'mock_token_for_development',
                warning: 'Using mock token - configure AGORA_APP_ID and AGORA_APP_CERTIFICATE for production'
            });
        }
        
        return res.status(500).json({ error: 'Agora credentials not found. Please configure AGORA_APP_ID and AGORA_APP_CERTIFICATE environment variables.' });
    }

    try {
        const uid = 0; 
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600; // 1 hour
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

        console.log('Token generated successfully for channel:', channelName);
        res.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
};
