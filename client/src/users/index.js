import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/users/users');
                setUsers(response.data.users);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUsers = async (userId) => {
        try {
            // Effectuer une requête pour supprimer le quizz
            await axios.delete(`http://localhost:3001/api/users/${userId}`);
            
            // Mettre à jour la liste des quiz après la suppression
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <h2 className="my-4">Liste des utilisateurs</h2>
                <div className="row">
                    {users.map(user => (
                        <div key={user.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                                    <p className="card-text">Email: {user.email}</p>
                                    <Link to={`/users/edit/${user.id}`} className="btn btn-primary mr-2">Modifier</Link>
                                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteUsers(user.id)}>Supprimer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersList;
