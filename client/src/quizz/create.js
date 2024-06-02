import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { BiSolidTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const CreateQuizz = () => {
    const [titre, setTitre] = useState('');
    const [questions, setQuestions] = useState(['']);
    const [groupes, setGroupes] = useState([]);
    const [selectedGroupe, setSelectedGroupe] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/groupes');
                setGroupes(response.data.groupes);
            } catch (error) {
                console.error('Erreur lors de la récupération des groupes :', error);
            }
        };
        fetchGroupes();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const data = {
            titre,
            GroupeId: selectedGroupe, // Ajoutez l'ID du groupe sélectionné
            questions: questions.map(question => ({ libelle: question }))
        };

        axios.post('http://localhost:3001/api/quizz', data, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            navigate('/quizz', { state: { message: 'Quizz ajouté avec succès!' } });
        })
        .catch(error => {
            console.error('Erreur lors de la création du quizz :', error);
        });
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h2 className="mb-4">Création de formulaire</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="titre" className="form-label">Titre</label>
                                    <input type="text" className="form-control" id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="groupe" className="form-label">Groupe</label>
                                    <select className="form-select" id="groupe" value={selectedGroupe} onChange={(e) => setSelectedGroupe(e.target.value)} required>
                                        <option value="">Sélectionnez un groupe</option>
                                        {groupes.map(groupe => (
                                            <option key={groupe.id} value={groupe.id}>{groupe.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Questions</label>
                                    {questions.map((question, index) => (
                                        <div key={index} className="input-group mb-3">
                                            <input type="text" className="form-control" value={question} onChange={(e) => handleQuestionChange(index, e.target.value)} required />
                                            <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveQuestion(index)}><BiSolidTrash /></button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-primary mb-3" onClick={handleAddQuestion}>Ajouter une question</button>
                                </div>
                                <button type="submit" className="btn btn-primary">Créer</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizz;
