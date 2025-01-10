## Core Components

### Authentication Layer (`/src/auth/`)
- `auth0-config.js` - Auth0 configuration and setup
- `auth-service.js` - Service wrapper for Auth0 functionality
- `auth-context.js` - React context for auth state management

### Firebase Integration (`/src/firebase/`)
- `firebase-config.js` - Firebase initialization and config
- `firestore-service.js` - Firestore database operations
- `storage-service.js` - Firebase storage management

### UI Components (`/src/components/`)

#### Authentication Components (`/auth/`)
- `LoginButton.js` - Handles Auth0 login flow
- `LogoutButton.js` - Manages logout process

#### Common UI Elements (`/common/`)
- `Header.js` - Application header component
- `Loading.js` - Loading state indicators
- `ErrorMessage.js` - Error display handling

#### Testing Components (`/test/`)
- `FirestoreTest.js` - Firestore operation testing
- `StorageTest.js` - Storage operation testing

### Utilities (`/src/utils/`)
- `error-handler.js` - Centralized error handling
- `validators.js` - Input validation logic

### Entry Points
- `App.js` - Main application component
- `index.js` - Application bootstrap
- `index.css` - Global styles

## Configuration Files

### Public Assets (`/public/`)
- `index.html` - HTML entry point
- `_headers` - Netlify headers configuration

### System Configuration (`/config/`)
- `cors-config.js` - CORS security settings

### Deployment Configuration
- `netlify.toml` - Netlify deployment settings
- `package.json` - Project dependencies and scripts

Key configuration files:

### 1. `auth0-config.js`:
```javascript
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: window.location.origin
};
```

### 2. `firebase-config.js`:
```javascript
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

### 3. `cors-config.js`:
```javascript
export const corsHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'cross-origin'
};
```

### 4. `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Resource-Policy = "cross-origin"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### 5. `public/_headers`:
```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Resource-Policy: cross-origin
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(),microphone=(),geolocation=()
```

## Security Considerations

1. **CORS Headers**: Implemented strict CORS policies to prevent unauthorized cross-origin requests.
2. **Security Headers**: Added comprehensive security headers to protect against common web vulnerabilities.
3. **Environment Variables**: Sensitive configuration values are stored in environment variables.
4. **Authentication Flow**: Secure integration between Auth0 and Firebase.

## Setup Instructions

1. Create necessary Auth0 and Firebase accounts
2. Configure environment variables
3. Set up security headers in Netlify
4. Deploy application

## Development Notes

- Keep sensitive configuration in environment variables
- Regularly update dependencies for security patches
- Test authentication flow thoroughly
- Monitor CORS and security header configurations
- 
