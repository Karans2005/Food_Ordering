# 🍔 Food Ordering Backend

Welcome to my **Food Ordering Backend API** 🚀

This repository contains the backend of my **Food Ordering Web Application**, built using **Node.js, Express.js, MongoDB, and Mongoose**.

The backend provides REST APIs for managing food products, users, and orders and handles communication between the frontend and database.

---

## 🚀 Features

- 🍔 Food/Product Management
- 👤 User Management
- 🛒 Cart & Order Management
- 📦 Order Processing
- 🔄 CRUD Operations
- 🌐 RESTful APIs
- 🗄️ MongoDB Database
- 🔐 API-based Backend Architecture
- 📋 JSON API Responses
- ⚡ Express.js Server

---

## 🛠️ Technologies Used

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB
- 📦 Mongoose
- 🌐 REST API
- 📋 JSON
- 🔧 Git & GitHub
- ☁️ Render

---

## 📌 API Operations

The backend supports standard CRUD operations:

### Create
Used to add new food/products or create orders.

### Read
Used to retrieve food/products, users, and order data.

### Update
Used to update existing food/product or order information.

### Delete
Used to remove existing food/product data.

---

## 🔗 API Structure

```text
/api/products
/api/users
/api/orders
```

### HTTP Methods

```text
GET       → Fetch Data
POST      → Create Data
PUT/PATCH → Update Data
DELETE    → Delete Data
```

---

## 📂 Project Structure

```text
Food-Ordering-Backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## 🗄️ Database

This project uses **MongoDB** as the database and **Mongoose** for database interaction.

MongoDB stores application data such as:

- Users
- Food Products
- Orders
- Other application-related data

---

## 🌐 REST API

The backend follows a **REST API architecture** where the frontend communicates with the server using HTTP requests.

Example:

```text
Frontend
   ↓
REST API
   ↓
Express.js
   ↓
Mongoose
   ↓
MongoDB
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> Never upload your actual `.env` file or database credentials to GitHub.

---

## ▶️ Run Locally

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create a `.env` file and add your MongoDB connection string.

### 4. Start the Server

```bash
npm start
```

Or:

```bash
node index.js
```

---

## 🔄 Backend Workflow

```text
Food Ordering Frontend
        ↓
     API Request
        ↓
   Express.js Server
        ↓
      Routes
        ↓
    Controllers
        ↓
      Mongoose
        ↓
      MongoDB
        ↓
    JSON Response
        ↓
Food Ordering Frontend
```

---

## 🎯 Project Goal

The goal of this project is to build a backend for a real-world **Food Ordering Application** and understand how a frontend application communicates with a database through REST APIs.

---

## 👨‍💻 Author

**Harsh Kumar Sahu**

Full-Stack Developer | MERN Stack 🚀

---

⭐ If you find this project useful, consider giving it a **Star**!
