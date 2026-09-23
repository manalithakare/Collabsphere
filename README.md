# 🌐 CollabSphere

**CollabSphere** is a MERN-based platform that connects **influencers and brands** in one place, making collaboration management easier and more organized.

The platform is designed to manage collaboration requests, paid and barter campaigns, communication, payment status, and AI-powered content ideas through a centralized system.

---

## 🚀 Features

### 👩‍💻 Influencer Module

* Create and manage influencer profiles
* View available brand collaboration opportunities
* Receive and manage collaboration requests
* Track active and completed collaborations
* Manage paid and barter collaborations
* Track payment status

### 🏢 Brand Module

* Create and manage brand profiles
* Discover suitable influencers
* Send collaboration requests
* Manage ongoing campaigns
* Track collaboration and payment status

### 🤖 AI-Powered Features

* AI chatbot for collaboration assistance
* Generate product-video/content ideas
* Suggest creative concepts for brand campaigns
* Assist influencers with collaboration-related queries

### 📊 Collaboration Management

* Paid collaboration tracking
* Barter collaboration tracking
* Pending/accepted/rejected request management
* Campaign status management
* Centralized collaboration dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI

* Gemini API

### Tools

* Git
* GitHub
* VS Code
* REST APIs

---

## 🔄 How CollabSphere Works

```text
             ┌─────────────────┐
             │   User Signup   │
             └────────┬────────┘
                      ↓
          ┌───────────────────────┐
          │ Select User Type      │
          │ Influencer / Brand    │
          └───────────┬───────────┘
                      ↓
        ┌──────────────────────────┐
        │ Create / Manage Profile  │
        └────────────┬─────────────┘
                     ↓
       ┌───────────────────────────┐
       │ Find Collaboration        │
       │ Opportunities              │
       └────────────┬──────────────┘
                    ↓
        ┌─────────────────────────┐
        │ Send / Receive Request   │
        └────────────┬────────────┘
                     ↓
       ┌───────────────────────────┐
       │ Collaboration Accepted    │
       └────────────┬──────────────┘
                    ↓
       ┌───────────────────────────┐
       │ Campaign & Payment        │
       │ Management                │
       └────────────┬──────────────┘
                    ↓
          ┌────────────────────┐
          │ Collaboration Done│
          └────────────────────┘
```

---

## 💡 Problem Statement

Influencer-brand collaborations are often managed through scattered channels such as social media messages, emails, and spreadsheets. This can make it difficult to track collaboration requests, campaign progress, payments, and communication.

**CollabSphere** aims to provide a centralized platform where influencers and brands can manage their collaborations more efficiently.

---

## 🎯 Project Objectives

* Connect brands and influencers through a single platform
* Simplify the collaboration request process
* Manage paid and barter collaborations
* Track campaign and payment status
* Provide AI-assisted content ideas
* Reduce dependency on scattered communication channels
* Provide a centralized collaboration dashboard

---

## 📂 Project Structure

```text
CollabSphere/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

*Project structure may vary depending on the current implementation.*

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/CollabSphere.git
cd CollabSphere
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Never upload your `.env` file or API keys to GitHub.**

### 4. Start the backend

```bash
npm start
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

---

## 🔐 Authentication

CollabSphere can use authentication to securely manage user accounts and protect application routes.

Authentication-related functionality may include:

* User registration
* User login
* Protected routes
* Role-based access
* JWT-based authentication

---

## 🤖 AI Integration

CollabSphere integrates the **Gemini API** to provide AI-assisted functionality.

Example use cases:

```text
Brand/Product
     ↓
AI Assistant
     ↓
Content / Video Ideas
     ↓
Influencer Campaign
```

The AI assistant can help generate creative ideas for product videos and campaign content.

---

## 📌 Key Modules

| Module         | Description                                 |
| -------------- | ------------------------------------------- |
| Authentication | User registration and login                 |
| Profiles       | Influencer and brand profiles               |
| Collaboration  | Send and manage collaboration requests      |
| Campaigns      | Manage ongoing collaborations               |
| Payments       | Track payment status                        |
| Barter         | Manage product/service-based collaborations |
| AI Assistant   | Generate campaign and content ideas         |
| Dashboard      | Centralized platform management             |

---

## 🔮 Future Enhancements

* Advanced influencer search and filtering
* Social media profile integration
* Real-time chat
* Automated payment processing
* Campaign analytics
* AI-based influencer-brand matching
* Email and notification system
* Mobile
