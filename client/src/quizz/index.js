import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Quizz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [user, setUser] = useState(null);
    const [responsesStatus, setResponsesStatus] = useState({});
    const location = useLocation();
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        // Récupérer les informations de l'utilisateur du localStorage
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = token;
                try {
                    const response = await axios.get('http://localhost:3001/users/user');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        // Effectuer une requête pour obtenir la liste des quiz
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/quizz');
                setQuizzes(response.data.quizzes);

                if (user && user.role === 'eleve') {
                    const responsesStatus = {};
                    for (const quiz of response.data.quizzes) {
                        const res = await axios.get(`http://localhost:3001/api/quizz/${quiz.id}/responses/status`);
                        responsesStatus[quiz.id] = res.data.completed;
                    }
                    setResponsesStatus(responsesStatus);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des quiz :', error);
            }
        };

        if (user) {
            fetchQuizzes();
        }
    }, [user]);

    useEffect(() => {
        if (location.state && location.state.message) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                window.history.replaceState({}, document.title);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleDeleteQuizz = async (quizzId) => {
        try {
            // Effectuer une requête pour supprimer le quizz
            await axios.delete(`http://localhost:3001/api/quizz/${quizzId}`);
            
            // Mettre à jour la liste des quiz après la suppression
            setQuizzes(quizzes.filter(quiz => quiz.id !== quizzId));
        } catch (error) {
            console.error('Erreur lors de la suppression du quiz :', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="m-4">
                <h2 className="mb-4">Liste des quiz</h2>
                {showMessage && (
                    <div className="alert alert-success" role="alert">
                        {location.state.message}
                    </div>
                )}
                <div className="row">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{quiz.titre}</h5>
                                    {user && user.role === 'eleve' ? (
                                        <>
                                            {!responsesStatus[quiz.id] && (
                                                <Link to={`/quizz/take/${quiz.id}`} className="btn btn-primary mr-2">Passer</Link>
                                            )}
                                            <Link to={`/quizz/result/${quiz.id}`} className="btn btn-success ms-2">Resultat</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={`/quizz/edit/${quiz.id}`} className="btn btn-primary mr-2">Modifier</Link>
                                            <Link to={`/quizz/review/${quiz.id}`} className="btn btn-success ms-2">Corriger</Link>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDeleteQuizz(quiz.id)}>Supprimer</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quizz;
