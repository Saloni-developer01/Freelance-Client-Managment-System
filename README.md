# 🚀 FreelanceFlow: Smart Client & Invoice Management System

**FreelanceFlow** is a powerful SaaS-based management tool designed specifically for freelancers to streamline their client onboarding, project tracking, and invoicing process. It features a tiered subscription model to help freelancers scale from starters to pros.


## ✨ Key Features

- **📊 Comprehensive Dashboard:** Get a bird's eye view of your business metrics.
- **👥 Client Management:** Easily add, edit, and track client details.
- **📄 Professional Invoicing:** Generate professional invoices in seconds.
- **💳 Razorpay Integration:** Secure subscription-based payment system (Monthly Pro Plan).
- **🔒 Secure Authentication:** JWT-based login and signup system.
- **📈 Growth Tiers:** - **Free Tier:** Manage up to 3 clients.
  - **Pro Tier:** Unlimited clients and advanced features.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React (Icons), Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Payment Gateway:** Razorpay API
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Live Demo

Check out the live application: [FreelanceFlow Live](https://freelance-client-managment-system.vercel.app)

## 📦 Installation & Setup

If you want to run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saloni-developer01/Freelance-Client-Managment-System.git
   cd freelance-flow

2. **Setup Backend:**
- **Go to the server folder.**
- **Install dependencies: npm install**
- **Create a .env file and add:**
    ```bash
    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_secret_key
    RAZORPAY_KEY_ID=your_key_id
    RAZORPAY_KEY_SECRET=your_key_secret

- **Start server: node index.js**


3. **Setup Frontend:**

- **Go to the client folder.**

- **Install dependencies: npm install**

- **Create a .env file and add:**
    ```bash
    VITE_API_BASE_URL=http://localhost:5000
    VITE_RAZORPAY_KEY_ID=your_key_id
    
- **Start frontend: npm run dev**

## 🛡️ Privacy & Terms
This project includes integrated policies for Refund, Cancellation, and Privacy, making it compliant with standard payment gateway requirements.

### Developed with ❤️ to empower freelancers.
