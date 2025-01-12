export const getUserInfo = async (accessToken) => {
    console.log('Getting user info...');
    try {
        const response = await fetch(`https://${auth0Config.domain}/userinfo`, {
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response status:', response.status);
        const userInfo = await response.json();
        console.log('User info received:', userInfo);
        return userInfo;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

export const initiateLogin = () => {
    console.log('Login button clicked');
    const auth0LoginUrl = `https://${auth0Config.domain}/authorize?` +
        `response_type=token&` +
        `client_id=${auth0Config.clientId}&` +
        `redirect_uri=${encodeURIComponent(auth0Config.redirectUri)}&` +
        `scope=${auth0Config.scope}`;
    
    console.log('Auth0 URL:', auth0LoginUrl);
    window.location.href = auth0LoginUrl;
};
