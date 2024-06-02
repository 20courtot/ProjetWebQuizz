import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { BiSolidTrash } from 'react-icons/bi';
import { useParams, useNavigate } from 'react-router-dom'; // Importer useParams depuis react-router-dom
import axios from 'axios';

const EditGroupe = () => {
    const { id } = useParams(); // Utiliser useParams pour obtenir les paramètres de l'URL
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupe = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get(`http://localhost:3001/api/groupes/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                });
                const groupe = response.data.groupe;
                const users = response.data.users;
                console.log(users);
                setName(groupe.name);
                // Remplir les adresses e-mail existantes du groupe dans la liste des e-mails
                setEmails(users.map(user => user.email));
            } catch (error) {
                console.error('Erreur lors de la récupération des informations du groupe :', error);
                setError('Erreur lors de la récupération des informations du groupe.');
            }
        };

        fetchGroupe();
    }, [id]);

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
            const response = await axios.put(`http://localhost:3001/api/groupes/${id}`, data, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(response.data);
            // Si la mise à jour réussit, effacez les erreurs précédentes
            setError('');
            // Traitez la réponse du backend si nécessaire
            navigate('/groupes', { state: { message: 'Groupe modifié avec succès!' } });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du groupe :', error);
            // Affichez le message d'erreur dans l'interface utilisateur
            setError(error.response.data.message);
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
                            <h2 className="mb-4">Édition de groupe</h2>
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
                                <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGroupe;
