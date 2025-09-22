import React from 'react';
import { Leaf } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-indigo-500/10">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Sistema de Gestão do Axé
                </h1>
                <p className="mt-1 text-md text-gray-400">Gerenciamento de membros e organização das giras</p>
            </div>
        </header>
    );
};