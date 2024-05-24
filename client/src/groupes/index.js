import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Groupes = () => {
    const [groupes, setGroupes] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Récupérer les informations de l'utilisateur du localStorage
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = token;
                try {
                    const response = await axios.get('http://localhost:3001/users/user');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        };

        fetchUser();
    }, []);
    
    useEffect(() => {
        // Effectuer une requête pour obtenir la liste des groupes
        axios.get('http://localhost:3001/api/groupes')
            .then(response => {
                setGroupes(response.data.groupes);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des groupes :', error);
            });
    }, [user]);

    const handleDeleteGroupe = async (groupeId) => {
        try {
            // Effectuer une requête pour supprimer le groupe
            await axios.delete(`http://localhost:3001/api/groupes/${groupeId}`);
            
            // Mettre à jour la liste des groupes après la suppression
            setGroupes(groupes.filter(groupe => groupe.id !== groupeId));
        } catch (error) {
            console.error('Erreur lors de la suppression du groupe :', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="m-4">
                <h2 className="mb-4">Liste des groupes</h2>
                <div className="row">
                    {groupes.map(groupe => (
                        <div key={groupe.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{groupe.name}</h5>
                                    <p className="card-text">Description du groupe</p>
                                    <Link to={`/groupes/edit/${groupe.id}`} className="btn btn-primary mr-2">Modifier</Link>
                                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteGroupe(groupe.id)}>Supprimer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Groupes;
