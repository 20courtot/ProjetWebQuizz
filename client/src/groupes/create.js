import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { BiSolidTrash } from 'react-icons/bi';

const CreateGroupe = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const data = {
            name,
            emails
        };

        try {
            const response = await axios.post('http://localhost:3001/api/groupes', data, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(response.data);
            // Si la création réussit, effacez les erreurs précédentes
            setError('');
            // Rediriger vers la liste des groupes avec un message de succès
            navigate('/groupes', { state: { message: 'Groupe ajouté avec succès!' } });
        } catch (error) {
            console.error('Erreur lors de la création du groupe :', error);
            // Affichez le message d'erreur dans l'interface utilisateur
            setError(error.response?.data?.message || 'Erreur lors de la création du groupe');
        }
    };

    const addEmail = () => {
        if (email && !emails.includes(email)) {
            setEmails([...emails, email]);
            setEmail('');
        }
    };

    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter(e => e !== emailToRemove));
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h2 className="mb-4">Création de groupe</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nom</label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Ajouter des utilisateurs par email</label>
                                    <div className="input-group">
                                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <button type="button" className="btn btn-outline-secondary" onClick={addEmail}>Ajouter</button>
                                    </div>
                                </div>
                                <ul className="list-group mb-3">
                                    {emails.map((email, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            {email}
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeEmail(email)}>
                                                <BiSolidTrash />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button type="submit" className="btn btn-primary">Créer</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupe;
