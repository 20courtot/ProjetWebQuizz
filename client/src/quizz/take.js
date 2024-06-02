import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TakeQuizz = () => {
    const { id } = useParams();
    const [quizz, setQuizz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/quizz/${id}`);
                setQuizz(response.data);
                setQuestions(response.data.Questions);
                setIsLoading(false);

                const token = localStorage.getItem('token');
                if (token) {
                    axios.defaults.headers.common['Authorization'] = token;
                    const answersResponse = await axios.get(`http://localhost:3001/api/quizz/${id}/answers`);
                    setAnsweredQuestions(answersResponse.data.map(answer => answer.QuestionId));
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du quizz :', error);
                setIsLoading(false);
            }
        };

        fetchQuizzDetails();
    }, [id, navigate]);

    const handleAnswer = async (answer) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        const data = {
            questionId: questions[currentQuestionIndex].id,
            answer
        };

        try {
            await axios.post(`http://localhost:3001/api/quizz/${id}/answer`, data, {
                headers: {
                    'Authorization': token
                }
            });

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Quiz terminé, afficher un message de fin
                alert('Quiz terminé !');
                navigate('/quizz', { state: { message: 'Quiz terminé avec succès!' } });
            }
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse :', error);
            // Afficher un message d'erreur à l'utilisateur
        }
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!quizz) {
        return <div>Erreur lors de la récupération du quizz.</div>;
    }

    const filteredQuestions = questions.filter(q => !answeredQuestions.includes(q.id));

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">{quizz.titre}</h2>
                {currentQuestionIndex < filteredQuestions.length && (
                    <Question
                        question={filteredQuestions[currentQuestionIndex]}
                        onAnswer={handleAnswer}
                    />
                )}
            </div>
        </div>
    );
};

const Question = ({ question, onAnswer }) => {
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim() !== '') {
            onAnswer(answer);
            setAnswer(''); // Réinitialiser la réponse pour la prochaine question
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{question.libelle}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="answer" className="form-label">Votre réponse</label>
                        <input
                            type="text"
                            className="form-control"
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Suivant</button>
                </form>
            </div>
        </div>
    );
};

export default TakeQuizz;
