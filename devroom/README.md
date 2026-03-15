# DevRoom

DevRoom is a real-time collaborative classroom code editor. It enables teachers to manage student coding sessions, run code, and track typing metrics, complete with AI detection and focus tracking.

## Prerequisites
- Node.js (v18 or higher recommended)
- GitHub Personal Access Token (for auto-commit functionality)

## Project Structure
This is a monorepo-style project consisting of:
- `next-app/`: The Next.js frontend application containing the IDE and Dashboard.
- `socket-server/`: The Node.js standalone backend handling Socket.io and Yjs WebSocket synchronization.

---

## 🚀 How to Start the Application

You will need **two separate terminal windows** open to run both the frontend and the backend simultaneously.

### 1. Start the Backend Server
The backend coordinates all real-time editing, the Teacher Dashboard events, and the GitHub auto-commit engine.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd ./socket-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `socket-server` directory and add your GitHub token:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The backend will start and bind to `localhost:4000`.*

### 2. Start the Frontend Application
The frontend contains the teacher dashboard, the code editor, and the code execution engine.

1. Open a **second** terminal and navigate to the frontend folder:
   ```bash
   cd ./next-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   *The frontend will start on `localhost:3000`.*

---

## 🎮 How to Use the App

Once both servers are running, you can access the application in your browser:

- **Teacher View**: Navigate to [http://localhost:3000/teacher/math-101](http://localhost:3000/teacher/math-101). This view provides the Spectator Grid, Summon/Lockdown controls, and AI Analysis features.
- **Student View**: Open an Incognito window or a different browser and navigate to [http://localhost:3000/student/math-101](http://localhost:3000/student/math-101). The student's typing, focus, and file actions will instantly sync to the teacher's dashboard.

### Core Features:
- **File Explorer**: Click the `+` icon on the left sidebar to create new files (e.g., `script.js`, `main.py`, `app.cpp`).
- **Code Execution**: Write code and click **Run Code** in the top right of the editor to securely execute it in the browser and see terminal output.
- **Classroom Mechanics**: As a teacher, use **Summon All** to force student browsers to jump to your active file, or **Lockdown** to freeze all student code editors.
- **Threat Tracking**: The teacher dashboard actively monitors if students lose focus on the IDE and flags them if their typing speed exceeds 60+ WPM.
