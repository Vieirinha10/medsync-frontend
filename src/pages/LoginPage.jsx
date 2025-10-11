import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const LoginPage = () => {
    // ... (useState para email, password, etc.)

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            // ... (resto da lógica de login)
        } catch (err) {
            // ... (lógica de erro)
        }
    };

    // ... (o resto do código do componente permanece o mesmo)
};

export default LoginPage;