import React from 'react';
import type { Filho, Presenca } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';

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

  const handleTogglePresenca = (filhoId: number) => {
    setPresenca({
      ...presenca,
      [filhoId]: !presenca[filhoId],
    });
  };

  const marcarTodos = () => {
    const novaPresenca: Presenca = {};
    filhosAtivos.forEach(filho => {
        novaPresenca[filho.id] = true;
    });
    setPresenca(novaPresenca);
  };

  const desmarcarTodos = () => {
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
                <button onClick={marcarTodos} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">Marcar Todos</button>
                <button onClick={desmarcarTodos} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">Desmarcar Todos</button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Presente</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {filhosAtivos.map((filho) => (
                  <tr key={filho.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{filho.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <label className="flex justify-center items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!presenca[filho.id]}
                          onChange={() => handleTogglePresenca(filho.id)}
                          className="h-6 w-6 rounded-md bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600"
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresencaView;