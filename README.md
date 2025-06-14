﻿﻿# Club Management System

A comprehensive web application for managing university clubs, events, and student activities. This system provides a platform for students, club managers, and administrators to interact and manage club-related activities efficiently.

## 🌟 Features

### User Roles
- **Students**: Can view clubs, apply for membership, and participate in events
- **Club Managers**: Can manage their clubs, events, and member applications
- **Administrators**: Have full system control and oversight

### Key Functionalities
- User authentication and authorization
- Club creation and management
- Event scheduling and management
- Member application processing
- Profile management
- Image upload and storage
- Email verification system

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account (for image storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/habeebFayez/club_managment_system_WebApp.git
cd to file 
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🛠️ Built With

- **Frontend Framework**: React.js
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: React Bootstrap
- **Icons**: Font Awesome
- **Storage**: Firebase Storage
- **Authentication**: JWT (JSON Web Tokens)
- **Form Handling**: React Select

## 📁 Project Structure

```
src/
├── api/              # API configuration and Firebase setup
├── Component/        # Reusable UI components
├── contexts/         # React context providers
├── Dashboard/        # Dashboard components
├── EditProfile/      # Profile editing functionality
├── HomePage/         # Landing page components
├── Login/           # Authentication components
├── PrivateRoute/    # Protected route components
├── Users/           # User-specific components
│   ├── AdminUser/   # Admin-specific features
│   ├── ClubManagerUser/ # Club manager features
│   └── StudentUser/ # Student-specific features
├── util/            # Utility functions
└── WeekEvents/      # Event management components
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Secure password requirements
- Email verification system
- Protected routes
- Environment variable configuration

## 🚀 Deployment

The application is deployed using GitHub Pages and can be accessed at [https://habeebFayez.github.io/club_managment_system_WebApp](https://habeebFayez.github.io/club_managment_system_WebApp)

To deploy your own version:

```bash
npm run deploy
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, please open an issue in the [GitHub repository](https://github.com/habeebFayez/club_managment_system_WebApp/issues)

## 🙏 Acknowledgments

- React.js community
- Firebase team
- All contributors and users of the system

## 📫 Contact

Habeeb Fayez - [@habeebFayez](https://github.com/habeebFayez)

Project Link: [https://github.com/habeebFayez/club_managment_system_WebApp](https://github.com/habeebFayez/club_managment_system_WebApp)
