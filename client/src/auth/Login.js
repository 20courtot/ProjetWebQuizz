import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
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
    
            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                const redirectTo = response.data.redirectTo;
                if (redirectTo) {
                    window.location.href = redirectTo;
                } else {
                    console.log('Redirection non spécifiée.');
                }
            } else {
                console.log('Erreur lors de la connexion :', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setError('Connexion invalide, veuillez vérifier vos informations.');
        }
    };    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto border p-4">
                        <h2>Connexion</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input type="email" className="form-control" id="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="password">Mot de passe</label>
                                <input type="password" className="form-control" id="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="mt-3">
                                <Link className="btn btn-secondary" to="/register">S'inscrire</Link>
                                <button type="submit" className="btn btn-primary ms-3">Se connecter</button>
                                <Link to="/forgot-password" className="btn btn-link">Mot de passe oublié ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
