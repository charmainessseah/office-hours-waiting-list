import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import JoinPage from './components/JoinPage';
import WaitingList from './components/WaitingList';
import CreateListPage from './components/CreateListPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Dashboard from './components/Dashboard';
import PositionPage from './components/PositionPage'
import PrivateRoutes from './utils/PrivateRoutes';
import './App.css';
import './styles.css';

/**
 * Home Page element that takes the HomePage.js component and wraps it in a div styled with App
 *
 */
const HP = () => (
    <div className="App">
        <HomePage />
    </div>
);

/**
 * Join Page element that takes the JoinPage.js component and wraps it in a div styled with App
 *
 */
const JP = () => (
    <div className="App">
        <JoinPage />
    </div>
);

/**
 * Router that links all the pages of the app
 *
 */
const App = () => (
    <div>
        <Routes>
            <Route path="/" element={<HP />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/resetPassword" element={<ForgotPasswordPage />} />
            <Route element={<PrivateRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/join-page" element={<JP />} />
                <Route path="/create-list-page" element={<CreateListPage />} />
                <Route path="/waiting-list" element={<WaitingList />} />
                <Route path="/student-view" element={<PositionPage />} />
            </Route>
        </Routes>
    </div>
);

export default App;


