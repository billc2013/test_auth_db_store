# Minimal Auth0 + Firebase Test with CORS Headers

## Current Implementation
This repository contains a minimal test implementation demonstrating:
- Auth0 authentication integration
- Firebase Firestore database operations
- Firebase Storage operations
- All functioning with strict CORS headers enabled:
  - Cross-Origin-Opener-Policy: same-origin
  - Cross-Origin-Embedder-Policy: require-corp
  - Cross-Origin-Resource-Policy: cross-origin

### Purpose
This proof-of-concept confirms that these services can work together while maintaining the strict CORS requirements needed for WebR integration (our next development phase).

### Features Tested
- Auth0 login/logout flow
- Writing to Firestore database
- Reading from Firestore database
- Uploading files to Firebase Storage
- All operations with proper error handling and user feedback

## Roadmap: WebR Integration

### Phase 1: Basic WebR Environment
- Integrate WebR with existing Auth0/Firebase setup
- Implement basic R code execution environment
- Ensure SharedArrayBuffer communication works with CORS headers
- Implement PostMessage fallback for unsupported browsers

### Phase 2: Student Features
- Personal workspace for each authenticated student
- Basic code editor with syntax highlighting
- Output display for R results
- Error handling and feedback

### Phase 3: Persistence
- Auto-save functionality
- Save/load R workspace state
- Store code snippets in Firestore
- Store outputs in Firebase Storage

### Phase 4: Educational Features
- Pre-loaded datasets for assignments
- Template assignments
- Basic plotting capabilities
- Exercise validation

### Phase 5: Instructor Features
- Assignment management
- Student progress tracking
- Basic analytics on usage

## Development Notes

### CORS Requirements
CORS headers must be properly set for:
- Main application pages
- JavaScript resources
- Firebase endpoints
- WebR resources

### Security Considerations
- Token management
- Data access controls
- Rate limiting
- Input validation

### Performance Optimization
- WebR asset caching
- Lazy loading of features
- Efficient storage usage
- Browser compatibility checks

## Usage Goals
This system is designed for educational use, specifically:
- Quick access to R functionality
- No installation required
- Minimal interface for basic R operations
- Focus on specific lab assignments
- Not intended to replace full R Studio functionality

## Technical Stack
- Auth0 for authentication
- Firebase for backend services
- WebR for R functionality
- Modern browser features (ES6+)

## Getting Started
[Installation and setup instructions will go here]

## Contributing
[Contribution guidelines will go here]

## License
[License information will go here]
