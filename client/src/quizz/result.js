import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResultQuizz = () => {
    const { id } = useParams();
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState({ positive: 0, total: 0, outOf20: 0 });

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(`http://localhost:3001/api/quizz/${id}/answers`, {
                    headers: {
                        'Authorization': token
                    }
                });

                const fetchedAnswers = response.data;

                // Calculate score
                const positiveAnswers = fetchedAnswers.filter(answer => answer.isAccepted === true).length;
                const totalAnswers = fetchedAnswers.length;
                const scoreOutOf20 = (positiveAnswers / totalAnswers) * 20;

                setAnswers(fetchedAnswers);
                setScore({
                    positive: positiveAnswers,
                    total: totalAnswers,
                    outOf20: scoreOutOf20.toFixed(2)
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des réponses :', error);
                setIsLoading(false);
            }
        };

        fetchAnswers();
    }, [id]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">Correction du Quiz</h2>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="list-group">
                            {answers.map(answer => (
                                <li key={answer.id} className="list-group-item">
                                    <h5>Question : {answer.Question.libelle}</h5>
                                    <p>Votre réponse: {answer.libelle}</p>
                                    {answer.isAccepted === true && <span className="badge bg-success">Accepté</span>}
                                    {answer.isAccepted === false && <span className="badge bg-danger">Refusé</span>}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <h4>Note</h4>
                            <p>{score.positive} / {score.total}</p>
                            <p>{score.outOf20} / 20</p>
                        </div>
                        <Link to="/quizz" className="btn btn-primary mt-3">Retour à la liste des quiz</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultQuizz;
