<div align="center">

# 🌾 Agro Lynk
### *Connecting Farmers, Markets & Communities*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Latest-lightgrey.svg)](https://expressjs.com/)

*A comprehensive platform bridging the gap between farmers and consumers through digital marketplace innovation*

---

</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [💻 Usage](#-usage)
- [📱 User Roles](#-user-roles)
- [🗺️ API Documentation](#️-api-documentation)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👥 Team](#-team)
- [📞 Support](#-support)

---

## 🌟 Overview

**Agro Lynk** is a revolutionary farmers market finder and agricultural marketplace platform designed to create seamless connections between farmers, customers, and delivery partners. Our platform empowers local agriculture by providing farmers with direct access to consumers while offering customers fresh, locally-sourced produce with convenient delivery options.

### 🎯 Mission
To revolutionize the agricultural supply chain by eliminating intermediaries, ensuring fair prices for farmers, and providing consumers with access to fresh, quality produce directly from the source.

### 🌱 Vision
Building sustainable agricultural communities through technology-driven marketplace solutions that benefit farmers, consumers, and the environment.

---

## ✨ Key Features

### 👨‍🌾 **For Farmers**
- 📝 **Easy Registration** - Simple onboarding process with profile verification
- 🛍️ **Product Management** - List and manage agricultural products with ease
- 📊 **Analytics Dashboard** - Track sales, revenue, and customer engagement
- 🗺️ **Location Mapping** - GPS-based farm location for easy discovery
- 💰 **Direct Payments** - Secure payment processing through Razorpay integration

### 🛒 **For Customers**
- 🔍 **Smart Search** - Find local farmers and markets by location
- 🗺️ **Interactive Maps** - Visual exploration of nearby farms and markets
- 🛒 **Shopping Cart** - Seamless shopping experience with wishlist functionality
- 📱 **Responsive Design** - Optimized for mobile and desktop experiences
- 🔐 **Secure Authentication** - Google OAuth integration for safe login

### 🚚 **For Couriers**
- 📋 **Delivery Management** - Efficient order tracking and delivery system
- 📍 **Route Optimization** - Google Maps integration for optimal delivery routes
- ⭐ **Rating System** - Customer feedback and performance tracking
- 📄 **Document Verification** - Secure verification process for courier partners

### 🔒 **For Administrators**
- 📊 **Comprehensive Dashboard** - Monitor platform activity and performance
- ✅ **User Verification** - Manage farmer, customer, and courier verifications
- 📈 **Analytics & Reporting** - Detailed insights into platform usage and growth
- 🛡️ **Security Management** - Monitor and maintain platform security

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### **Cloud & Services**
![AWS](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

### **Development Tools**
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 📁 Project Structure

```
Agro-Lynk/
├── 📂 frontend/                 # React + Vite Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   ├── 📂 pages/           # Application pages
│   │   ├── 📂 assets/          # Static assets and utilities
│   │   ├── 📂 lib/             # Utility libraries
│   │   └── 📂 snippets/        # Code snippets
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
├── 📂 backend/                  # Node.js + Express Backend
│   ├── 📂 controller/          # Route controllers
│   ├── 📂 models/              # MongoDB schemas
│   ├── 📂 routers/             # API routes
│   ├── 📂 middlewares/         # Custom middleware
│   ├── 📂 utils/               # Utility functions
│   ├── 📂 db/                  # Database configuration
│   ├── 📄 app.js               # Express app configuration
│   ├── 📄 index.js             # Server entry point
│   └── 📄 package.json
└── 📄 README.md                # Project documentation
```

---

## 🚀 Quick Start

Get Agro Lynk running locally in just a few steps:

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally or cloud instance
- **Git** for version control

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder.git
cd Masterpushers-Farmers-Market-Finder
```

### 2️⃣ Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3️⃣ Start Development Servers
```bash
# Terminal 1 - Backend Server
cd backend
npm run dev

# Terminal 2 - Frontend Server
cd frontend
npm run dev
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## ⚙️ Installation

### **Backend Setup**

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Configuration](#-configuration))

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔧 Configuration

### **Backend Environment Variables**

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/agro-lynk

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
JWT_ACCESS_TOKEN_EXPIRY=1d
JWT_REFRESH_TOKEN_EXPIRY=10d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=your-aws-region

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Email Service
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### **Frontend Configuration**

Update `frontend/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
export const GOOGLE_MAPS_API_KEY = 'your-google-maps-api-key';
```

---

## 💻 Usage

### **Getting Started**

1. **Register as a User**
   - Visit the application homepage
   - Choose your role: Farmer, Customer, or Courier
   - Complete the registration process

2. **For Farmers**
   - Set up your farm profile
   - Add products with descriptions and images
   - Manage inventory and pricing
   - Track orders and earnings

3. **For Customers**
   - Browse local farmers and markets
   - Search products by category or location
   - Add items to cart and checkout
   - Track order delivery status

4. **For Couriers**
   - Complete verification process
   - Accept delivery requests
   - Use integrated maps for navigation
   - Manage delivery schedules

### **Key Application Features**

| Feature | Description | User Role |
|---------|-------------|-----------|
| 🗺️ **Market Discovery** | Find local farmers markets using GPS location | Customer |
| 🛒 **Product Catalog** | Browse and search agricultural products | Customer |
| 📝 **Farm Management** | Add/edit farm details and product listings | Farmer |
| 🚚 **Delivery Tracking** | Real-time order tracking and status updates | All Users |
| 💳 **Secure Payments** | Integrated payment processing with Razorpay | Customer/Farmer |
| ⭐ **Rating System** | Rate farmers, products, and delivery service | Customer |
| 📊 **Analytics Dashboard** | View sales statistics and performance metrics | Farmer/Admin |

---

## 📱 User Roles

### 👨‍🌾 **Farmer Dashboard**
- Product management (add, edit, delete products)
- Order management and fulfillment tracking
- Revenue analytics and sales reports
- Customer reviews and ratings
- Farm profile and location settings

### 🛒 **Customer Interface**
- Location-based market discovery
- Product browsing with filters and search
- Shopping cart and wishlist functionality
- Order history and tracking
- Farmer and product reviews

### 🚚 **Courier Panel**
- Delivery request notifications
- Route optimization with Google Maps
- Delivery status updates
- Earnings and performance tracking
- Customer rating system

### 🔐 **Admin Console**
- User verification and management
- Platform analytics and insights
- Content moderation
- Payment and transaction monitoring
- System configuration

---

## 🗺️ API Documentation

### **Base URL**
```
http://localhost:3000/api/v1
```

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | User logout |
| `GET` | `/auth/profile` | Get user profile |

### **Product Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/product` | Get all products |
| `POST` | `/product` | Create new product |
| `GET` | `/product/:id` | Get product by ID |
| `PUT` | `/product/:id` | Update product |
| `DELETE` | `/product/:id` | Delete product |

### **Farmer Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/farmer` | Get all farmers |
| `POST` | `/farmer` | Register as farmer |
| `GET` | `/farmer/:id` | Get farmer profile |
| `PUT` | `/farmer/:id` | Update farmer profile |

### **Order Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/order` | Create new order |
| `GET` | `/order` | Get user orders |
| `GET` | `/order/:id` | Get order details |
| `PUT` | `/order/:id/status` | Update order status |

### **Payment Processing**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/payment/create` | Create payment order |
| `POST` | `/payment/verify` | Verify payment |
| `GET` | `/payment/history` | Payment history |

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve Agro Lynk:

### **Getting Started**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow existing code style and conventions
   - Add appropriate comments and documentation
   - Write or update tests as needed

4. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature: description"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Add screenshots for UI changes

### **Development Guidelines**

- 📋 Follow existing code style and ESLint rules
- ✅ Write meaningful commit messages
- 🧪 Add tests for new features
- 📚 Update documentation as needed
- 🔍 Ensure all tests pass before submitting

### **Areas for Contribution**
- 🐛 Bug fixes and improvements
- ✨ New feature development
- 📖 Documentation enhancements
- 🎨 UI/UX improvements
- 🔧 Performance optimizations
- 🌐 Internationalization support

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Masterpushers Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👥 Team

### **Masterpushers Development Team**

<div align="center">

| Role | Contributor | GitHub |
|------|-------------|--------|
| 🎯 **Project Lead** | Pavan | [@Pavan0228](https://github.com/Pavan0228) |
| 💻 **Frontend Developer** | Nikhil | [@Nikhil](https://github.com/Nikhil) |
| 🔧 **Backend Developer** | [Contributor] | [@contributor](https://github.com/contributor) |
| 🎨 **UI/UX Designer** | [Contributor] | [@contributor](https://github.com/contributor) |

</div>

---

## 📞 Support

### **Need Help?**

- 📧 **Email**: support@agrolynk.com
- 📱 **Discord**: [Join our community](https://discord.gg/agrolynk)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder/issues)
- 📖 **Documentation**: [Project Wiki](https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder/wiki)

### **Quick Links**
- [🚀 Getting Started Guide](#-quick-start)
- [⚙️ Configuration Help](#-configuration)
- [🔧 Troubleshooting](https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder/wiki/Troubleshooting)
- [📋 FAQ](https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder/wiki/FAQ)

---

<div align="center">

### 🌟 Star This Repository

If you find Agro Lynk helpful, please consider giving it a star! ⭐

**Made with ❤️ by the Masterpushers Team**

*Connecting agriculture with technology for a sustainable future*

[![Follow @Pavan0228](https://img.shields.io/github/followers/Pavan0228?style=social)](https://github.com/Pavan0228)
[![Star this repo](https://img.shields.io/github/stars/Pavan0228/Masterpushers-Farmers-Market-Finder?style=social)](https://github.com/Pavan0228/Masterpushers-Farmers-Market-Finder)

</div>
