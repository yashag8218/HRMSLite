# HRMS Lite - Human Resource Management System

A lightweight Human Resource Management System (HRMS) built with Django, React, and MongoDB.

## Live Demo

- **Frontend**: https://hrms-lite-xi.vercel.app/
- **Backend API**: https://hrmslite.onrender.com/

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Tailwind CSS + Axios |
| **Backend** | Django 5 + Django REST Framework |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (frontend) + Render (backend) |


## Project Structure

```
HRMSLite/
├── backend/
│   ├── hrms/                    # Django project settings
│   ├── employees/               # Employee app
│   ├── attendance/              # Attendance app
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API calls
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```
 

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (optional):
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_NAME=hrms_lite
DEBUG=True
```

5. Run the server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file for production:
```env
VITE_API_URL=your_backend_url
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn hrms.wsgi:application`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `MONGODB_NAME`: `hrms_lite`
   - `DEBUG`: `False`

### Frontend (Vercel)

1. Import your GitHub repository
2. Set the root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
4. Deploy

### MongoDB Atlas

1. Create a free cluster at MongoDB Atlas
2. Create a database user
3. Whitelist IP addresses (use 0.0.0.0/0 for Render)
4. Get connection string and add to backend environment variables