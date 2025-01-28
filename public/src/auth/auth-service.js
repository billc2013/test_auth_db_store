// auth/auth-service.js
import { auth0Config } from './auth0-config.js';

// Fetch user info from Auth0
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

// Redirect the user to the Auth0 login page
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

// Get the Firebase custom token from the ID token claims
export const getFirebaseToken = async (auth0Client) => {
    console.log('Getting Firebase custom token...');
    try {
        const claims = await auth0Client.getIdTokenClaims();
        const firebaseToken = claims["https://webr-1de0a.firebaseapp.com/firebase_token"];
        
        if (!firebaseToken) {
            throw new Error('Firebase token not found in ID token claims.');
        }

        console.log('Firebase custom token retrieved:', firebaseToken);
        return firebaseToken;
    } catch (error) {
        console.error('Error getting Firebase custom token:', error);
        throw error;
    }
};
