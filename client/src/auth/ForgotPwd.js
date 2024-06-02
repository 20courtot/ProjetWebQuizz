import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/users/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error);
            setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto border p-4">
                        <h2>Réinitialisation du mot de passe</h2>
                        {message && <div className="alert alert-info">{message}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input type="email" className="form-control" id="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">Réinitialiser le mot de passe</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
