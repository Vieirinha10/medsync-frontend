import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

// Passamos o 'children' que é o componente que queremos renderizar
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return <Navigate to="/login" />;
    }

    // Se houver token, renderiza o componente filho (a página protegida)
    return children;
};

// Precisamos de um componente separado para extrair o ID da URL
const SimulacaoWrapper = () => {
    const { casoId } = useParams();
    return <SimulacaoCaso casoId={casoId} />;
}

export default ProtectedRoute;
