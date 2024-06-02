import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmNewPassword) {
            setMessage('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.post('http://localhost:3001/users/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': token
                }
            });

            setMessage(response.data.message);
        } catch (error) {
            console.error('Erreur lors de la modification du mot de passe :', error);
            setMessage(error.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h2>Modification du mot de passe</h2>
                            {message && <div className="alert alert-info">{message}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Mot de passe actuel</label>
                                    <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmNewPassword" className="form-label">Confirmez le nouveau mot de passe</label>
                                    <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Modifier le mot de passe</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
