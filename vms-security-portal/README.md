# 🛡️ VMS Security Portal (Gate Management System)

The VMS Security Portal is a dedicated web application for Gate Officers and Estate Administrators to manage, validate, and monitor visitor access within the estate. This portal is built using **React** and **TypeScript**.

## 🚀 Key Features

### Gate Officer (Security Role)
* **Access Code Validation:** Rapid validation of 5-character access codes.
* **QR Code Scanning:** Real-time validation via camera/QR code scanner integration.
* **Instant Feedback:** High-contrast visual feedback (Grant/Deny) on validation results.

### Estate Administrator (Admin Role)
* **User Management:** CRUD operations for Homes and Residents (linking Residents to Homes).
* **Security Management:** Generating and resetting the Security Master Login credential.
* **Visitor Logs:** Monitoring and filtering of all visitor entry/exit records (Flow 4).

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React (with Hooks)** | Core UI library for building the application. |
| **Language** | **TypeScript** | Ensures robust, type-safe code, especially for API contracts. |
| **Styling** | **CSS Modules / Tailwind CSS** (Choose one) | Component-scoped styling and rapid development utility-first framework. |
| **Networking** | **Axios** | HTTP client for making secure API requests. |
| **State** | **Zustand / Redux Toolkit** (Choose one) | Global state management for authentication and application data. |
| **Routing** | **React Router** | Handling protected routes and navigation between views. |

## ⚙️ Project Setup

### Prerequisites

You will need the following installed on your system:
* Node.js (LTS version)
* npm or yarn

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/CodeClub-WTeam/VMS-Security-Web-Portal.git](https://github.com/CodeClub-WTeam/VMS-Security-Web-Portal.git)
    cd VMS-Security-Web-Portal
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root directory and add your backend API endpoint.

    ```bash
    # .env
    REACT_APP_API_BASE_URL=[https://vmsbackend.vercel.app/api/v1](https://vmsbackend.vercel.app/api/v1)
    ```

### Running the Application

1.  **Start the Development Server:**
    ```bash
    npm start
    # OR
    yarn start
    ```

2.  The application should automatically open in your browser at `http://localhost:3000`.

## 📂 Project Structure

The codebase follows a standard React/TypeScript structure, organized by feature (slice) to maximize scalability and separation of concerns.

src/

├── api/             # API services (axios setup, auth interceptors)

├── components/      # Reusable UI components (buttons, inputs, layouts)

├── features/        # Business logic organized by domain

│   ├── auth/        # Login logic, protected routes

│   ├── validation/  # Code scanning, validation portal

│   ├── admin/       # Home, Resident management (CRUD)

│   └── logs/        # Visitor log monitoring

├── hooks/           # Custom React hooks (useAuth, useValidation)

├── pages/           # Route components (LoginPage, AdminDashboard)

└── types/           # Global TypeScript interfaces
