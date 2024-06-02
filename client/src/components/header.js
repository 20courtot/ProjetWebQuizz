import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const [user, setUser] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:3001/users/logout');
            if (response.status === 200) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = token;
                try {
                    const response = await axios.get('http://localhost:3001/users/user');
                    if (!response.data.user) {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } else {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        };

        fetchUser();
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Accueil</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownQuizz" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Quizz
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownQuizz">
                                {user && user.role === 'professeur' && (
                                    <li><Link className="dropdown-item" to="/quizz/create">Ajouter un quizz</Link></li>
                                )}
                                <li><Link className="dropdown-item" to="/quizz">Voir mes quizz</Link></li>
                            </ul>
                        </li>
                        {user && user.role === 'professeur' && (
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownGroupes" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Groupes
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownGroupes">
                                    <li><Link className="dropdown-item" to="/groupes/create">Ajouter un groupe</Link></li>
                                    <li><Link className="dropdown-item" to="/groupes">Voir mes groupes</Link></li>
                                </ul>
                            </li>
                        )}
                        {user && user.role === 'professeur' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/stat">Statistiques</Link>
                            </li>
                        )}
                        {user && user.role === 'admin' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Utilisateurs</Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <p className="m-0 me-3">{user.firstName} {user.lastName}</p>
                                <Link to="/change-password" className="btn btn-secondary">Modifier le mot de passe</Link>
                                <button className="btn btn-outline-primary ms-4" onClick={handleLogout}>Se déconnecter</button>
                            </>
                        ) : (
                            <Link className="btn btn-outline-success" to="/login">Se connecter</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
