import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './Home';
import Quizz from './quizz/index';
import CreateQuizz from './quizz/create';
import EditQuizz from './quizz/edit';
import Groupes from './groupes/index';
import CreateGroupe from './groupes/create';
import EditGroupe from './groupes/edit';
import Users from './users/index';
import EditUser from './users/edit';
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
                    <Route path="/quizz" element={<Quizz />} />
                    <Route path="/quizz/create" element={<CreateQuizz />} />
                    <Route path="/quizz/edit/:id" element={<EditQuizz />} />
                    <Route path="/groupes" element={<Groupes />} />
                    <Route path="/groupes/create" element={<CreateGroupe />} />
                    <Route path="/groupes/edit/:id" element={<EditGroupe />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/edit/:id" element={<EditUser />} />
                    {/* Ajoutez d'autres routes ici */}
                </Routes>
            </div>
        </Router>
    );
};

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
