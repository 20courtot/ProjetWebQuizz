import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
  // Récupérer le token du local storage
  const token = localStorage.getItem('token');
        // Vérifier si le token existe
        if (token) {
            window.location.href = '/';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3001/users/login', {
                email,
                password
            });
    
            // Vérifier la réponse et rediriger l'utilisateur si la connexion réussit
            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                const redirectTo = response.data.redirectTo;
                if (redirectTo) {
                    window.location.href = redirectTo; // Redirection vers la page spécifiée dans la réponse
                } else {
                    console.log('Redirection non spécifiée.');
                }
            } else {
                console.log('Erreur lors de la connexion :', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto border p-4">
                        <h2>Connexion</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input type="email" className="form-control" id="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="password">Mot de passe</label>
                                <input type="password" className="form-control" id="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div>
                                <button className="btn btn-secondary mt-3"><Link className="dropdown-item" to="/register">S'inscrire</Link></button>
                                <button type="submit" className="btn btn-primary mt-3 ms-2">
                                    Se connecter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
