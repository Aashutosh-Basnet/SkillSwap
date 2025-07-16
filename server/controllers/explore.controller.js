import AgoraAccessToken from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = AgoraAccessToken;

export const generateToken = (req, res) => {
    const { channelName } = req.body;
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
        return res.status(500).json({ error: 'Agora credentials not found' });
    }

    const uid = 0; 
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    res.json({ token });
};
