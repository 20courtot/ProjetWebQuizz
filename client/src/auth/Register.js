import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('professeur'); // État pour le rôle avec une valeur par défaut
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envoi des données d'inscription à votre backend
            const response = await axios.post('http://localhost:3001/users/register', {
                firstName,
                lastName,
                email,
                password,
                role // Inclure le rôle dans les données envoyées
            });

            // Rediriger l'utilisateur vers la page de connexion après une inscription réussie
            navigate('/login');
        } catch (error) {
            // Gérer les erreurs (par exemple, afficher un message d'erreur à l'utilisateur)
            const errorMsg = error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto border p-4">
                        <h2>Inscription</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName">Prénom</label>
                                <input type="text" className="form-control" id="firstName" placeholder="Entrez votre prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="lastName">Nom</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Entrez votre nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input type="email" className="form-control" id="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="password">Mot de passe</label>
                                <input type="password" className="form-control" id="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="role">Rôle</label>
                                <select className="form-control" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                                    <option value="professeur">professeur</option>
                                    <option value="eleve">eleve</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <Link className="btn btn-secondary" to="/login">Se connecter</Link>
                                <button type="submit" className="btn btn-primary ms-2">
                                    S'inscrire
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;