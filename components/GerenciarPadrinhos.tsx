import React, { useState, useEffect } from 'react';
import type { Filho } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';

interface GerenciarPadrinhosProps {
  filhos: Filho[];
  onUpdateFilho: (filho: Filho) => void;
}

const GerenciarPadrinhos: React.FC<GerenciarPadrinhosProps> = ({ filhos, onUpdateFilho }) => {
  const [selectedFilhoId, setSelectedFilhoId] = useState<number | null>(null);
  const [selectedEntidades, setSelectedEntidades] = useState<string[]>([]);
  
  const selectedFilho = selectedFilhoId ? filhos.find(f => f.id === selectedFilhoId) : null;
  
  useEffect(() => {
    if (selectedFilho) {
      setSelectedEntidades(selectedFilho.entidadesPadrinhos || []);
    } else {
      setSelectedEntidades([]);
    }
  }, [selectedFilho]);

  const handleFilhoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    setSelectedFilhoId(id || null);
  };
  
  const handleEntidadeToggle = (entidadeKey: string) => {
    setSelectedEntidades(prev => 
      prev.includes(entidadeKey)
        ? prev.filter(key => key !== entidadeKey)
        : [...prev, entidadeKey]
    );
  };
  
  const handleSave = () => {
    if (selectedFilho) {
      const updatedFilho = {
        ...selectedFilho,
        entidadesPadrinhos: selectedEntidades,
      };
      onUpdateFilho(updatedFilho);
      alert('Padrinhos espirituais salvos com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">Definir Padrinhos/Madrinhas Espirituais</h2>
      <Card>
        <CardContent>
          <div className="max-w-md mx-auto">
            <label htmlFor="filho-select" className="block text-sm font-medium text-gray-300 mb-1">
              Selecione um Médium
            </label>
            <select
              id="filho-select"
              value={selectedFilhoId || ''}
              onChange={handleFilhoChange}
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione...</option>
              {filhos.map(filho => (
                <option key={filho.id} value={filho.id}>{filho.nome}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      {selectedFilho && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-200">
              Selecione as entidades de <span className="text-indigo-400">{selectedFilho.nome}</span> que podem ser Padrinhos/Madrinhas
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
             {Object.entries(selectedFilho.entidades).map(([key, nome]) => (
                nome && (
                    <label key={key} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-700">
                        <input
                            type="checkbox"
                            checked={selectedEntidades.includes(key)}
                            onChange={() => handleEntidadeToggle(key)}
                            className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-600"
                        />
                        <span className="text-gray-200 capitalize">{nome} ({key.replace(/([A-Z])/g, ' $1')})</span>
                    </label>
                )
             ))}
             <div className="flex justify-end pt-4">
                 <button 
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                 >
                    Salvar Alterações
                 </button>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GerenciarPadrinhos;
