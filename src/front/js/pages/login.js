import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);  
    const location = useLocation();

    useEffect(() => {
        if (store.authToken || localStorage.getItem('authToken')) {
            alert("usuario logeado")
        }
    }, [store.authToken, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const validate = () => {
        const errors = {};
        if (!email) errors.email = "El email no es correcto";
        if (!password) errors.password = "La contraseña no es correcta";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }
     
        try {
            const success = await actions.login(email, password, setError);
            if (success) {
                const from = location.state?.from?.pathname || '/home';
                navigate(from);
            }
        } catch (error) {
            setError({ general: "Error al iniciar sesión. Inténtalo de nuevo más tarde." });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Inicio de Sesión</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                    {error.email && <div className="text-danger">{error.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                    {error.password && <div className="text-danger">{error.password}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block w-100">
                                    Iniciar sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
