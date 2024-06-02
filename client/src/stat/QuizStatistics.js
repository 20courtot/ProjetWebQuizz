import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import Header from '../components/header';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const QuizStatistics = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/average-last', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setQuizData(response.data.averages);
                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques des quiz :', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    const labels = quizData.map(data => data.title);
    const scores = quizData.map(data => parseFloat(data.average));

    const barData = {
        labels,
        datasets: [
            {
                label: 'Moyenne des quiz',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: scores
            }
        ]
    };

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">Statistiques des Quiz</h2>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <h4>Moyennes des Quizz</h4>
                        <Bar data={barData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizStatistics;
