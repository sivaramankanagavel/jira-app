import '@testing-library/jest-dom';

process.env.REACT_APP_API_BASE_URL="http://44.223.17.229:5000/api"
process.env.REACT_APP_LOGIN_ENDPOINT="/auth/login"
process.env.REACT_APP_USER_ENDPOINT="/users"
process.env.REACT_APP_PROJECTS_ENDPOINT="/projects"
process.env.REACT_APP_API_TASKS="/tasks"
process.env.REACT_APP_API_TASKS_AND_PROJECTS="/tasks/project"

process.env.REACT_APP_FIREBASE_API_KEY='AIzaSyCFM_UJm7J0pvsLP7onF3yFC1ljZwdtzdc'
process.env.REACT_APP_FIREBASE_AUTH_DOMAIN='jira-application-33508.firebaseapp.com'
process.env.REACT_APP_FIREBASE_PROJECT_ID='jira-application-33508'
process.env.REACT_APP_FIREBASE_STORAGE_BUCKET='jira-application-33508.firebasestorage.app'
process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID='450693672460'
process.env.REACT_APP_FIREBASE_APP_ID='1:450693672460:web:c8e326efdf5dcd16448829'