import React from 'react';
import type { Filho, Presenca, PresencaStatus } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Check, X } from 'lucide-react';

interface PresencaViewProps {
  filhosAtivos: Filho[];
  presenca: Presenca;
  setPresenca: (presenca: Presenca) => void;
  giraDoDia: string;
  setGiraDoDia: (gira: string) => void;
  dataDeHoje: string;
}

const PresencaView: React.FC<PresencaViewProps> = ({
  filhosAtivos,
  presenca,
  setPresenca,
  giraDoDia,
  setGiraDoDia,
  dataDeHoje,
}) => {
  const sortedFilhos = [...filhosAtivos].sort((a, b) => a.nome.localeCompare(b.nome));

  const handleSetPresencaStatus = (filhoId: number, status: PresencaStatus) => {
    const currentStatus = presenca[filhoId];
    const newStatus = currentStatus === status ? undefined : status;
    
    const newPresenca = { ...presenca };
    if (newStatus) {
      newPresenca[filhoId] = newStatus;
    } else {
      delete newPresenca[filhoId];
    }
    setPresenca(newPresenca);
  };

  const marcarTodosPresentes = () => {
    const novaPresenca: Presenca = {};
    filhosAtivos.forEach(filho => {
        novaPresenca[filho.id] = 'presente';
    });
    setPresenca(novaPresenca);
  };

  const limparSelecao = () => {
      setPresenca({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">Controle de Presença - {dataDeHoje}</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="gira" className="block text-sm font-medium text-gray-300 mb-1">
              Gira do Dia
            </label>
            <input
              type="text"
              id="gira"
              value={giraDoDia}
              onChange={(e) => setGiraDoDia(e.target.value)}
              placeholder="Ex: Gira de Pretos Velhos"
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-200">Lista de Ativos</h3>
            <div className="space-x-2">
                <button onClick={marcarTodosPresentes} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">Marcar Todos Presentes</button>
                <button onClick={limparSelecao} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">Limpar Seleção</button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-700">
            {sortedFilhos.map((filho) => (
              <li key={filho.id} className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors">
                <span className="text-sm font-medium text-gray-200">{filho.nome}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSetPresencaStatus(filho.id, 'presente')}
                    className={`p-2 rounded-full transition-colors ${presenca[filho.id] === 'presente' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-green-700'}`}
                    aria-label={`Marcar ${filho.nome} como presente`}
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleSetPresencaStatus(filho.id, 'ausente')}
                    className={`p-2 rounded-full transition-colors ${presenca[filho.id] === 'ausente' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-red-700'}`}
                    aria-label={`Marcar ${filho.nome} como ausente`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresencaView;
