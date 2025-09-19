import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800/50 mt-12">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Sistema de Gestão do Axé. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};