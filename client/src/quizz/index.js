import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Quizz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [user, setUser] = useState(null);

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
        axios.get('http://localhost:3001/api/quizz')
            .then(response => {
                setQuizzes(response.data.quizzes);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des quiz :', error);
            });
    }, [user]);

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
                <div className="row">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{quiz.titre}</h5>
                                    <p className="card-text">Description du quiz</p>
                                    <Link to={`/quizz/edit/${quiz.id}`} className="btn btn-primary mr-2">Modifier</Link>
                                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteQuizz(quiz.id)}>Supprimer</button>
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
