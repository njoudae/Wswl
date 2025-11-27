# Truck Driver Permit System

A mobile-style web application designed for truck drivers to securely request travel permits with face verification and real-time route mapping.

## Features

### 🔐 Secure Authentication
- **Driver Registration**: Complete profile creation with photo capture
- **Face Verification**: Biometric login using camera and stored photos
- **Local Storage**: All data stored securely in browser localStorage

### 📱 Mobile-Optimized Design
- **Responsive UI**: Dark theme optimized for mobile devices
- **Touch-Friendly**: Large buttons and intuitive navigation
- **Camera Integration**: Built-in photo capture and face detection

### 🗺️ Route Management
- **Interactive Maps**: Real-time route display using Leaflet.js
- **Multiple Routes**: Pre-configured highway routes across Saudi Arabia
- **Location Services**: GPS integration for current location tracking

### 📋 Permit System
- **Time Slot Selection**: Flexible scheduling options
- **Route Planning**: Visual route display with distance and duration
- **History Tracking**: Complete permit request history

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Face Detection**: face-api.js for biometric verification
- **Maps**: Leaflet.js for interactive route mapping
- **Storage**: Browser localStorage for data persistence
- **Styling**: Modern CSS with gradients and animations

## Getting Started

### Prerequisites
- Modern web browser with camera access
- HTTPS connection (required for camera access)
- JavaScript enabled

### Installation
1. Clone or download the project files
2. Open `index.html` in a web browser
3. Allow camera permissions when prompted

### Usage

#### Registration Process
1. Click "Register" on the welcome screen
2. Fill in driver details:
   - Full Name
   - National ID
   - Truck Number
   - Cargo Type
3. Capture a photo using the camera
4. Submit registration

#### Login Process
1. Click "Login" on the welcome screen
2. Enter your National ID
3. Start camera and capture a photo
4. Complete face verification
5. Access your dashboard

#### Requesting Permits
1. From the dashboard, click "Request New Permit"
2. Select date and time slot
3. Choose your route
4. Add trip purpose (optional)
5. Submit request
6. View route map with details

## Route Information

The application includes pre-configured routes across Saudi Arabia:

| Route | Start | End | Distance | Duration |
|-------|-------|-----|----------|----------|
| North Highway | Riyadh | Dammam | 450 km | 4-5 hours |
| South Highway | Riyadh | Mecca | 850 km | 8-9 hours |
| East Highway | Riyadh | Dammam | 450 km | 4-5 hours |
| West Highway | Riyadh | Jeddah | 950 km | 9-10 hours |

## Security Features

### Face Verification
- Uses face-api.js for facial landmark detection
- Compares stored photos with live camera feed
- Configurable similarity threshold (currently 60%)
- Secure local processing (no external API calls)

### Data Privacy
- All data stored locally in browser
- No external server communication
- Camera access only when needed
- Automatic data cleanup on logout

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## File Structure

```
truck-driver-permit/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Project documentation
```

## API Dependencies

### External Libraries (CDN)
- **face-api.js**: Face detection and recognition
- **Leaflet.js**: Interactive mapping
- **OpenStreetMap**: Map tiles and data

## Development Notes

### Face Detection Implementation
The application uses a simplified face similarity algorithm:
- Detects 68 facial landmarks
- Calculates Euclidean distance between corresponding points
- Converts distance to similarity score (0-1)
- Uses 0.6 threshold for verification

### Local Storage Schema
```javascript
// Driver data
truckDrivers: {
  [nationalId]: {
    name: string,
    nationalId: string,
    truckNumber: string,
    cargoType: string,
    photo: string (base64)
  }
}

// Permit requests
permits: [
  {
    id: string,
    date: string,
    timeSlot: string,
    route: string,
    purpose: string,
    status: 'pending'|'approved'|'rejected',
    driverId: string,
    driverName: string,
    timestamp: string
  }
]
```

## Customization

### Adding New Routes
1. Update route data in `addRouteToMap()` function
2. Add route options to HTML select element
3. Update helper functions (`getRouteName`, `getRouteDistance`, `getRouteDuration`)

### Modifying Face Verification
1. Adjust similarity threshold in `verifyFace()` function
2. Implement more sophisticated comparison algorithms
3. Add additional security measures as needed

### Styling Changes
- Modify CSS variables for color scheme
- Update animations and transitions
- Adjust responsive breakpoints

## Troubleshooting

### Camera Issues
- Ensure HTTPS connection
- Check browser permissions
- Try refreshing the page
- Verify camera is not in use by other applications

### Face Detection Problems
- Ensure good lighting conditions
- Position face clearly in camera view
- Check if face-api.js models loaded successfully
- Try capturing photo again

### Map Display Issues
- Check internet connection for map tiles
- Verify Leaflet.js loaded correctly
- Ensure location services are enabled

## Future Enhancements

- [ ] Backend integration for data persistence
- [ ] Real-time permit status updates
- [ ] Advanced route optimization
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Driver analytics dashboard

## License

This project is open source and available under the MIT License.

## Support

For technical support or feature requests, please create an issue in the project repository.

---

**Note**: This application is designed for demonstration purposes. For production use, implement additional security measures and backend services as required by your organization's security policies. 