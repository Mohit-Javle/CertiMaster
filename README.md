# CertiMaster 🎓

CertiMaster is a premium, full-stack certificate management and generation platform. It features a modern "Light Luxury" aesthetic, combining glassmorphism with skeuomorphic design elements for a tactile, high-end feel.

## ✨ Features

- **Dynamic Certificate Generation**: Create professional certificates in real-time.
- **Bulk Generator**: Upload data (Excel/CSV) and generate hundreds of certificates at once.
- **Premium Templates**: Choose from a gallery of high-quality, customizable templates.
- **Dashboard Analytics**: Track issued certificates and coin balance.
- **Modern UI/UX**: Built with a focus on aesthetics, featuring smooth animations and tactile skeuomorphic elements.
- **Secure Authentication**: JWT-based login and registration system.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (Modern Utility-First)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **PDF/Image Generation**: `jspdf`, `html2canvas`
- **Bulk Processing**: `xlsx`, `jszip`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: Bcrypt.js, JSON Web Tokens (JWT)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/CertiMaster.git
   cd CertiMaster
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   npm install
   # Create a .env file with your Mongoose URI and JWT Secret
   npm run dev
   ```

## 🎨 Design Philosophy

CertiMaster utilizes a **Light Luxury** design system.
- **Glassmorphism**: Backdrop blurs and translucent borders for depth.
- **Skeuomorphism**: Tactile buttons, inputs, and cards with realistic shadows and highlights (Neumorphic evolution).
- **Typography**: Clean, modern fonts (Inter/Outfit) for maximum readability.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
