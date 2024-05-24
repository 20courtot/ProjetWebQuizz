import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BiSolidTrash } from 'react-icons/bi';

const EditQuizz = () => {
    const { id } = useParams();
    const [titre, setTitre] = useState('');
    const [questions, setQuestions] = useState(['']);
    const [groupes, setGroupes] = useState([]);
    const [selectedGroupe, setSelectedGroupe] = useState('');

    useEffect(() => {
        const fetchQuizzDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/quizz/${id}`);
                const { titre, Questions, GroupeId } = response.data;
                setTitre(titre);
                if (Questions) {
                    setQuestions(Questions.map(question => question.libelle));
                }
                setSelectedGroupe(GroupeId); // Définissez le groupe sélectionné
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du quizz :', error);
            }
        };
    
        fetchQuizzDetails();
    }, [id]);

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

    const handleSubmit = async (e) => {
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
    
        try {
            const response = await axios.put(`http://localhost:3001/api/quizz/${id}`, data, {
                headers: {
                    'Authorization': token
                }
            });
            
            console.log(response.data); // Affichez la réponse du serveur si nécessaire
            // Redirigez l'utilisateur vers une autre page ou affichez un message de succès
        } catch (error) {
            console.error('Erreur lors de la mise à jour du quizz :', error);
            // Affichez un message d'erreur à l'utilisateur
        }
    };
    

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h2 className="mb-4">Modification de formulaire</h2>
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
                                <button type="submit" className="btn btn-primary">Modifier</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditQuizz;
