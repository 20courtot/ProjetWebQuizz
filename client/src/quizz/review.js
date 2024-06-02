import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ReviewQuizz = () => {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userResponses, setUserResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState({ positive: 0, total: 0, outOf20: 0 });

    useEffect(() => {
        axios.get(`http://localhost:3001/api/quizz/${id}/users`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            setUsers(response.data.users);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            setIsLoading(false);
        });
    }, [id]);

    const handleUserClick = (userId) => {
        axios.get(`http://localhost:3001/api/quizz/${id}/users/${userId}/responses`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            const fetchedResponses = response.data.answers;

            // Calculate initial score
            const positiveAnswers = fetchedResponses.filter(answer => answer.isAccepted === true).length;
            const totalAnswers = fetchedResponses.length;
            const scoreOutOf20 = (positiveAnswers / totalAnswers) * 20;

            setUserResponses(fetchedResponses);
            setSelectedUser(userId);
            setScore({
                positive: positiveAnswers,
                total: totalAnswers,
                outOf20: scoreOutOf20.toFixed(2)
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des réponses de l\'utilisateur :', error);
        });
    };

    const updateScore = (updatedResponses) => {
        const positiveAnswers = updatedResponses.filter(response => response.isAccepted === true).length;
        const totalAnswers = updatedResponses.length;
        const scoreOutOf20 = (positiveAnswers / totalAnswers) * 20;

        setScore({
            positive: positiveAnswers,
            total: totalAnswers,
            outOf20: scoreOutOf20.toFixed(2)
        });
    };

    const handleAcceptResponse = (responseId) => {
        axios.put(`http://localhost:3001/api/quizz/responses/${responseId}/accept`, {}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            const updatedResponses = userResponses.map(response => {
                if (response.id === responseId) {
                    return { ...response, isAccepted: true };
                }
                return response;
            });
            setUserResponses(updatedResponses);
            updateScore(updatedResponses);
        })
        .catch(error => {
            console.error('Erreur lors de l\'acceptation de la réponse :', error);
        });
    };

    const handleRejectResponse = (responseId) => {
        axios.put(`http://localhost:3001/api/quizz/responses/${responseId}/reject`, {}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            const updatedResponses = userResponses.map(response => {
                if (response.id === responseId) {
                    return { ...response, isAccepted: false };
                }
                return response;
            });
            setUserResponses(updatedResponses);
            updateScore(updatedResponses);
        })
        .catch(error => {
            console.error('Erreur lors du rejet de la réponse :', error);
        });
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">Correction</h2>
                <div className="row">
                    <div className="col-md-4">
                        <h4>Liste des élèves</h4>
                        <ul className="list-group">
                            {users.map(user => (
                                <li key={user.id} className="list-group-item">
                                    <button className="btn btn-primary" onClick={() => handleUserClick(user.id)}>{user.firstName} {user.lastName}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-8">
                        {selectedUser && (
                            <div>
                                <h4>Réponses de l'élève sélectionné</h4>
                                <ul className="list-group">
                                    {userResponses.map(response => (
                                        <li key={response.id} className="list-group-item">
                                            <p>Question : {response.Question.libelle}</p>
                                            <p>Réponse: {response.libelle}</p>
                                            {response.isAccepted === null && (
                                                <div>
                                                    <button className="btn btn-success" onClick={() => handleAcceptResponse(response.id)}>Accepter</button>
                                                    <button className="btn btn-danger" onClick={() => handleRejectResponse(response.id)}>Refuser</button>
                                                </div>
                                            )}
                                            {response.isAccepted === true && <span className="badge bg-success">Accepté</span>}
                                            {response.isAccepted === false && <span className="badge bg-danger">Refusé</span>}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3">
                                    <h4>Note</h4>
                                    <p>{score.positive} / {score.total}</p>
                                    <p>Note sur 20 : {score.outOf20}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewQuizz;
