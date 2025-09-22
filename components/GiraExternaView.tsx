import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import type { Filho, GiraExternaState } from '../types';
import { TransporteModo } from '../types';
// FIX: Removed unused and non-existent 'Walking' icon from lucide-react import.
import { Car, UserCheck, Users, ChevronDown, Rocket } from 'lucide-react';

interface GiraExternaViewProps {
  filhosAtivos: Filho[];
  giraExternaState: GiraExternaState;
  setGiraExternaState: React.Dispatch<React.SetStateAction<GiraExternaState>>;
}

const VAGAS_POR_CARRO = 4;

const GiraExternaView: React.FC<GiraExternaViewProps> = ({
  filhosAtivos,
  giraExternaState,
  setGiraExternaState,
}) => {
  const { nome, data, participantes, carros } = giraExternaState;
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGiraExternaState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleParticipacaoToggle = (filhoId: number) => {
    setGiraExternaState(prev => {
      const newParticipantes = { ...prev.participantes };
      const current = newParticipantes[filhoId];
      const isParticipando = !current?.participando;

      newParticipantes[filhoId] = {
        participando: isParticipando,
        transporte: isParticipando ? (current?.transporte || null) : null,
      };
      
      const newCarros = { ...prev.carros };
      if (current?.transporte === TransporteModo.Motorista && !isParticipando) {
          delete newCarros[filhoId];
      }

      return { ...prev, participantes: newParticipantes, carros: newCarros };
    });
  };

  const handleTransporteChange = (filhoId: number, transporte: TransporteModo) => {
    setGiraExternaState(prev => {
      const oldTransporte = prev.participantes[filhoId]?.transporte;
      const newParticipantes = {
        ...prev.participantes,
        [filhoId]: { ...prev.participantes[filhoId], transporte },
      };
      
      const newCarros = { ...prev.carros };
      if (oldTransporte === TransporteModo.Motorista && transporte !== TransporteModo.Motorista) {
        delete newCarros[filhoId];
      }
      if (transporte === TransporteModo.Motorista && oldTransporte !== TransporteModo.Motorista) {
        newCarros[filhoId] = Array(VAGAS_POR_CARRO).fill(null);
      }

      return { ...prev, participantes: newParticipantes, carros: newCarros };
    });
  };

  const motoristas = useMemo(() =>
    filhosAtivos.filter(f => participantes[f.id]?.transporte === TransporteModo.Motorista)
  , [filhosAtivos, participantes]);

  const passageirosQuePrecisamCarona = useMemo(() =>
    filhosAtivos.filter(f => participantes[f.id]?.transporte === TransporteModo.Carona)
  , [filhosAtivos, participantes]);

  const passageirosAlocadosIds = useMemo(() =>
    new Set(Object.values(carros).flat().filter(id => id !== null))
  , [carros]);

  const passageirosDisponiveis = useMemo(() =>
    passageirosQuePrecisamCarona.filter(f => !passageirosAlocadosIds.has(f.id))
  , [passageirosQuePrecisamCarona, passageirosAlocadosIds]);

  const handleAlocarPassageiro = (motoristaId: number, slotIndex: number, passageiroId: string | null) => {
    setGiraExternaState(prev => {
        const newCarros = JSON.parse(JSON.stringify(prev.carros));
        const pId = passageiroId ? parseInt(passageiroId, 10) : null;
        
        if (pId) {
            for (const mId in newCarros) {
                newCarros[mId] = newCarros[mId].map((id: number | null) => (id === pId ? null : id));
            }
        }
        
        newCarros[motoristaId][slotIndex] = pId;

        return { ...prev, carros: newCarros };
    });
  };
  
  const transporteIconMap: Record<TransporteModo, React.ReactElement> = {
      [TransporteModo.Motorista]: <Car size={18} />,
      [TransporteModo.Carona]: <Users size={18} />,
      [TransporteModo.Independente]: <Rocket size={18} />,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-100">Organização de Gira Externa</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome-gira-externa" className="block text-sm font-medium text-gray-300 mb-1">
              Nome do Evento
            </label>
            <input
              type="text"
              id="nome-gira-externa"
              name="nome"
              value={nome}
              onChange={handleInfoChange}
              placeholder="Ex: Gira na Praia de Santos"
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="data-gira-externa" className="block text-sm font-medium text-gray-300 mb-1">
              Data do Evento
            </label>
            <input
              type="date"
              id="data-gira-externa"
              name="data"
              value={data}
              onChange={handleInfoChange}
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Etapa 1: Lista de Presença */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-200">Etapa 1: Controle de Participação</h3>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto space-y-3">
              {filhosAtivos.map(filho => {
                  const p = participantes[filho.id];
                  const isParticipando = p?.participando || false;
                  return (
                      <div key={filho.id} className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-200">{filho.nome}</span>
                              <label className="switch">
                                  <input type="checkbox" checked={isParticipando} onChange={() => handleParticipacaoToggle(filho.id)} />
                                  <span className="slider"></span>
                              </label>
                          </div>
                          {isParticipando && (
                              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-center gap-2">
                                  {[TransporteModo.Motorista, TransporteModo.Carona, TransporteModo.Independente].map(modo => {
                                      const isSelected = p?.transporte === modo;
                                      return (
                                        <button key={modo} onClick={() => handleTransporteChange(filho.id, modo)}
                                            className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-md transition-all duration-200 ${
                                                isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                            }`}
                                        >
                                            {transporteIconMap[modo]}
                                            {modo.charAt(0).toUpperCase() + modo.slice(1)}
                                        </button>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
                  )
              })}
          </CardContent>
        </Card>

        {/* Etapa 2: Organização dos Carros */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-medium text-gray-200">Etapa 2: Organização dos Carros</h3>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {motoristas.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Nenhum motorista definido.</p>
                    ) : (
                        motoristas.map(motorista => {
                            const isOpen = openAccordion === motorista.id;
                            return (
                                <div key={motorista.id} className="bg-gray-800/70 rounded-lg overflow-hidden">
                                    <button onClick={() => setOpenAccordion(isOpen ? null : motorista.id)} className="w-full flex justify-between items-center p-4 text-left">
                                        <h4 className="font-semibold text-indigo-400 flex items-center gap-2"><Car size={18}/> {motorista.nome}</h4>
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="p-4 pt-0">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                {carros[motorista.id]?.map((passageiroId, index) => {
                                                    const currentPassageiro = passageiroId ? filhosAtivos.find(f => f.id === passageiroId) : null;
                                                    return (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-400 w-14">Vaga {index + 1}:</span>
                                                            <select value={passageiroId || ''}
                                                                onChange={(e) => handleAlocarPassageiro(motorista.id, index, e.target.value)}
                                                                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                                                            >
                                                                <option value="">Vazio</option>
                                                                {currentPassageiro && <option value={currentPassageiro.id}>{currentPassageiro.nome}</option>}
                                                                {passageirosDisponiveis.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                                            </select>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <h3 className="text-lg font-medium text-gray-200">Resumo</h3>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p className="flex items-center gap-2"><UserCheck size={16} className="text-green-400"/> <strong>{Object.values(participantes).filter(p=>p.participando).length}</strong> Participantes</p>
                    <p className="flex items-center gap-2"><Car size={16} className="text-blue-400"/> <strong>{motoristas.length}</strong> Motoristas</p>
                    <p className="flex items-center gap-2"><Users size={16} className="text-yellow-400"/> <strong>{passageirosQuePrecisamCarona.length}</strong> Precisam de Carona ({passageirosDisponiveis.length} sem carro)</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default GiraExternaView;