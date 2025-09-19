import React, { useState } from 'react';
import type { GiraHistorico, Filho } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import HistoricoDetalhesModal from './HistoricoDetalhesModal';
import { Calendar, Users, Eye } from 'lucide-react';

interface HistoricoViewProps {
  historico: GiraHistorico[];
  filhos: Filho[];
}

const HistoricoView: React.FC<HistoricoViewProps> = ({ historico, filhos }) => {
  const [selectedGira, setSelectedGira] = useState<GiraHistorico | null>(null);

  if (historico.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-300">Nenhum histórico encontrado.</h2>
          <p className="text-gray-500 mt-2">Finalize uma gira na aba 'Organização da Gira' para salvá-la aqui.</p>
        </CardContent>
      </Card>
    );
  }

  const getPresentesCount = (gira: GiraHistorico) => gira.presentes?.length || 0;
  const getAusentesCount = (gira: GiraHistorico) => gira.ausentes?.length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">Histórico de Giras</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {historico.map((gira) => (
          <Card key={gira.id} className="hover:border-indigo-500 transition-colors duration-200 flex flex-col">
            <CardHeader>
              <h3 className="text-lg font-bold text-indigo-400 truncate">{gira.giraDoDia}</h3>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <span>{new Date(gira.data).toLocaleDateString('pt-BR')}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Users size={16} className="text-gray-400" />
                <span>{getPresentesCount(gira)} Presentes / {getAusentesCount(gira)} Ausentes</span>
              </p>
            </CardContent>
            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedGira(gira)}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                <Eye size={16} />
                Ver Detalhes
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedGira && (
        <HistoricoDetalhesModal
          gira={selectedGira}
          filhos={filhos}
          onClose={() => setSelectedGira(null)}
        />
      )}
    </div>
  );
};

export default HistoricoView;
