import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPwd';
import ChangePassword from './auth/ChangePwd';
import Home from './Home';
import Quizz from './quizz/index';
import CreateQuizz from './quizz/create';
import EditQuizz from './quizz/edit';
import TakeQuizz from './quizz/take';
import ReviewQuizz from './quizz/review';
import ResultQuizz from './quizz/result';
import Groupes from './groupes/index';
import CreateGroupe from './groupes/create';
import EditGroupe from './groupes/edit';
import Users from './users/index';
import EditUser from './users/edit';
import QuizStatistics from './stat/QuizStatistics';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/quizz" element={<Quizz />} />
                    <Route path="/quizz/create" element={<CreateQuizz />} />
                    <Route path="/quizz/edit/:id" element={<EditQuizz />} />
                    <Route path="/quizz/take/:id" element={<TakeQuizz />} />
                    <Route path="/quizz/review/:id" element={<ReviewQuizz />} />
                    <Route path="/quizz/result/:id" element={<ResultQuizz />} />
                    <Route path="/groupes" element={<Groupes />} />
                    <Route path="/groupes/create" element={<CreateGroupe />} />
                    <Route path="/groupes/edit/:id" element={<EditGroupe />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/edit/:id" element={<EditUser />} />
                    <Route path="/stat" element={<QuizStatistics />} />
                </Routes>
            </div>
        </Router>
    );
};

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
