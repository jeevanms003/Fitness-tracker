# Fitness Tracker App

A modern, full-stack fitness tracking application built with React, Vite, Node.js, and MongoDB. Track your daily steps, water intake, meals, and workouts in a beautiful dark-mode interface.

## Features

- **Dashboard**: At-a-glance summary of your daily progress (Steps, Calories, Water, Active Time) and weekly activity charts.
- **Daily Log**: Detailed timeline view of all your activities and meals for any selected date.
- **Workout Logic**: Log different workout types with automatic calorie estimation based on duration.
- **Diet Tracker**: Log meals with calorie and protein tracking. Visual progress bars for daily goals.
- **Hydration Tracker**: Interactive water logger with visual "cup" indicators and daily goal tracking.
- **Step Tracker**: Manually log steps or sync (simulated) with activity.
- **Data Persistence**: All data is stored in a local MongoDB database.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Server) running locally on default port 27017.

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-tracker
```

### 2. Install Dependencies
This project has a single `package.json` that handles scripts for both frontend and backend for convenience, but you may need to install them specifically if structured differently. Assuming standard structure:

```bash
# Install root/frontend dependencies
npm install

# Install backend dependencies (if in a separate folder, otherwise root handles it)
cd backend
npm install
cd ..
```
*Note: If `backend` is just a subfolder without its own package.json, ensure root `package.json` includes `express`, `mongoose`, `cors`, `body-parser`.*

### 3. Start the Database
Ensure your local MongoDB instance is running:
```bash
# Command depends on your OS/install method, typically:
mongod
# OR if installed as a service (Windows):
net start MongoDB
```

### 4. Run the Application
You need to run both the Backend Server and the Frontend Client.

**Option A: Concurrent (Recommended if script available)**
```bash
npm run dev
# This usually runs both if set up with concurrently, otherwise run separate terminals.
```

**Option B: Separate Terminals**

*Terminal 1 (Backend):*
```bash
node backend/server.js
# Should see: Server running on http://localhost:3001
# And: ✅ Connected to MongoDB
```

*Terminal 2 (Frontend):*
```bash
npm run dev
# Should see: VITE vX.X.X ready in X ms
# Local: http://localhost:5173/
```

## Usage Guide

1.  **Onboarding**: On first load, you may see default empty data. Start by logging some activities.
2.  **Log a Workout**: Go to the **Workout** page. Select a date, type (e.g., "Running"), and duration. Click "Add Workout".
3.  **Log a Meal**: Go to the **Diet** page. Add a meal name, calories, and protein. Or use the "Quick Add" buttons for common items like Water or Bananas.
4.  **Track Water**: Go to the **Water** page. Click the `+` buttons to add water. Click the number itself to manually edit if you made a typo. Use "Reset" to clear the day's log.
5.  **View History**: Go to **Daily Log** and use the date picker to see what you did yesterday or any past day.
6.  **Dashboard**: Check the main dashboard to see your weekly calorie burn trend and today's overall progress against your goals.

## Tech Stack

-   **Frontend**: React, Tailwind CSS, Lucide React (Icons), Recharts (Charts), Radix UI (Primitives).
-   **Backend**: Node.js, Express.
-   **Database**: MongoDB, Mongoose.
-   **Styling**: Custom CSS variables for dark mode and gradients.

## Customization

-   **Goals**: You can adjust default user goals in `backend/server.js` or through the App Context initial state if you strictly want frontend defaults.
-   **Theme**: Colors are defined in `src/index.css` using HSL values. You can tweak the `--primary` or `--accent` variables to change the app's look.

---
*Built with ❤️ for fitness enthusiasts.*
