import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditUser = ({ match }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/user/${id}`);
                setUser(response.data.user);
                setFirstName(response.data.user.firstName);
                setLastName(response.data.user.lastName);
                setEmail(response.data.user.email);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/users/user/${user.id}`, {
                firstName,
                lastName,
                email
            });
            // Rediriger vers la page de détails de l'utilisateur ou afficher un message de succès
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            // Afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">Modifier les informations de l'utilisateur</h2>
                {user && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Prénom</label>
                            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Nom</label>
                            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Adresse email</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditUser;