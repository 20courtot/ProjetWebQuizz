import React, { useState, useEffect } from 'react';
import Header from './components/header';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { BsFillFileEarmarkTextFill, BsFillPeopleFill, BsFillStarFill } from 'react-icons/bs';

const Home = () => {
    const [user, setUser] = useState(null);
    const [lastQuizResults, setLastQuizResults] = useState([]);
    const [averageLastQuizzes, setAverageLastQuizzes] = useState([]);

    useEffect(() => {
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
        if (user) {
            const fetchLastQuizResults = async () => {
                if (user.role === 'eleve') {
                    try {
                        const response = await axios.get('http://localhost:3001/api/last-results', {
                            headers: {
                                'Authorization': localStorage.getItem('token')
                            }
                        });
                        setLastQuizResults(response.data.results);
                    } catch (error) {
                        console.error('Erreur lors de la récupération des derniers résultats de quiz :', error);
                    }
                }
            };

            const fetchAverageLastQuizzes = async () => {
                if (user.role === 'professeur') {
                    try {
                        const response = await axios.get('http://localhost:3001/api/average-last', {
                            headers: {
                                'Authorization': localStorage.getItem('token')
                            }
                        });
                        setAverageLastQuizzes(response.data.averages);
                    } catch (error) {
                        console.error('Erreur lors de la récupération de la moyenne des derniers quiz :', error);
                    }
                }
            };

            fetchLastQuizResults();
            fetchAverageLastQuizzes();
        }
    }, [user]);

    return (
        <div>
            <Header />
            <div className="container mt-4">
                {user && user.role === 'eleve' && (
                    <div>
                        <h2>Bienvenue, {user.firstName} {user.lastName}</h2>
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <Card className="text-center">
                                    <Card.Body>
                                        <BsFillFileEarmarkTextFill size={50} />
                                        <Card.Title>Passer un quiz</Card.Title>
                                        <Link to="/quizz" className="btn btn-primary">Voir les quizz</Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <h3>Derniers quiz passés</h3>
                        <ul className="list-group">
                            {lastQuizResults.map((result, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>{result.title}</strong> - Note: {result.correctAnswers} / {result.totalQuestions} ({result.score.toFixed(2)} / 20)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {user && user.role === 'professeur' && (
                    <div>
                        <h2>Bienvenue, {user.firstName} {user.lastName}</h2>
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <Card className="text-center">
                                    <Card.Body>
                                        <BsFillFileEarmarkTextFill size={50} />
                                        <Card.Title>Gérer les quiz</Card.Title>
                                        <Link to="/quizz" className="btn btn-primary">Voir les quizz</Link>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-4 mb-4">
                                <Card className="text-center">
                                    <Card.Body>
                                        <BsFillPeopleFill size={50} />
                                        <Card.Title>Gérer les groupes</Card.Title>
                                        <Link to="/groupes" className="btn btn-primary">Voir les groupes</Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <h3>Moyennes des 5 derniers quiz</h3>
                        {averageLastQuizzes.length > 0 ? (
                            <ul className="list-group">
                                {averageLastQuizzes.map((quiz, index) => (
                                    <li key={index} className="list-group-item">
                                        <BsFillStarFill /> <strong>{quiz.title}</strong> - Moyenne: {quiz.average} / 20
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="alert alert-warning">
                                Pas de quiz récents à afficher.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
