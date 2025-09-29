import React, { useMemo } from 'react';
import type { Filho, GiraExternaParticipacao, GiraExternaCarros, GiraExternaTransporte, GiraExternaSalva } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Car, UserPlus, Rocket, Users, AlertCircle, Save, PlusCircle, Trash2, Edit } from 'lucide-react';

interface GiraExternaViewProps {
    filhos: Filho[];
    giraExternaNome: string;
    setGiraExternaNome: (nome: string) => void;
    giraExternaData: string;
    setGiraExternaData: (data: string) => void;
    participacao: GiraExternaParticipacao;
    setParticipacao: React.Dispatch<React.SetStateAction<GiraExternaParticipacao>>;
    carros: GiraExternaCarros;
    setCarros: React.Dispatch<React.SetStateAction<GiraExternaCarros>>;
    eventosSalvos: GiraExternaSalva[];
    editingId: number | null;
    onSave: () => void;
    onLoad: (id: number) => void;
    onDelete: (id: number) => void;
    onNew: () => void;
}

const GiraExternaView: React.FC<GiraExternaViewProps> = (props) => {
    
    const { filhos, giraExternaNome, setGiraExternaNome, giraExternaData, setGiraExternaData, participacao, setParticipacao, carros, setCarros, eventosSalvos, editingId, onSave, onLoad, onDelete, onNew } = props;

    const sortedFilhos = useMemo(() => [...filhos].sort((a, b) => a.nome.localeCompare(b.nome)), [filhos]);

    const handleParticipacaoChange = (filhoId: number) => {
        setParticipacao(prev => {
            const current = prev[filhoId] || { participa: false };
            const updated = { ...prev, [filhoId]: { ...current, participa: !current.participa }};
            if (!updated[filhoId].participa) {
                delete updated[filhoId].transporte;
                // Check if this member was a driver and remove their car if they were
                if (carros[filhoId]) {
                    setCarros(prevCarros => {
                        const newCarros = {...prevCarros};
                        delete newCarros[filhoId];
                        return newCarros;
                    });
                }
            }
            return updated;
        });
    };

    const handleTransporteChange = (filhoId: number, transporte: GiraExternaTransporte) => {
        setParticipacao(prev => ({
            ...prev,
            [filhoId]: { ...prev[filhoId], transporte }
        }));

        if (transporte !== 'motorista' && carros[filhoId]) {
            setCarros(prevCarros => {
                const newCarros = {...prevCarros};
                delete newCarros[filhoId];
                return newCarros;
            });
        }
        if (transporte === 'motorista' && !carros[filhoId]) {
            setCarros(prevCarros => ({
                ...prevCarros,
                [filhoId]: [null, null, null, null]
            }));
        }
    };
    
    const handleCarroChange = (motoristaId: number, vagaIndex: number, passageiroId: string) => {
        const pId = passageiroId ? parseInt(passageiroId, 10) : null;
        setCarros(prev => {
            const newCarros = {...prev};
            const newVagas = [...newCarros[motoristaId]];
            newVagas[vagaIndex] = pId;
            newCarros[motoristaId] = newVagas;
            return newCarros;
        });
    };

    const participantes = useMemo(() => Object.keys(participacao).filter(id => participacao[Number(id)]?.participa), [participacao]);
    const motoristas = useMemo(() => participantes.filter(id => participacao[Number(id)]?.transporte === 'motorista'), [participantes, participacao]);
    const passageiros = useMemo(() => participantes.filter(id => participacao[Number(id)]?.transporte === 'carona'), [participantes, participacao]);
    const independentes = useMemo(() => participantes.filter(id => participacao[Number(id)]?.transporte === 'independente'), [participantes, participacao]);
    
    const passageirosAlocados = useMemo(() => new Set(Object.values(carros).flat().filter(id => id !== null)), [carros]);

    const passageirosDisponiveis = useMemo(() => 
        passageiros.filter(id => !passageirosAlocados.has(Number(id)))
    , [passageiros, passageirosAlocados]);

    const resumo = {
        participantes: participantes.length,
        motoristas: motoristas.length,
        independentes: independentes.length,
        precisamCarona: passageiros.length,
        semCarro: passageirosDisponiveis.length
    };

    const getFilhoName = (id: string | number) => filhos.find(f => f.id === Number(id))?.nome || 'Desconhecido';

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100">Gira Externa</h2>
            <div className="flex flex-col xl:flex-row gap-6">

                {/* Main Form */}
                <div className="xl:w-3/4 w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{editingId ? `Editando: ${giraExternaNome}` : 'Nova Organização'}</h3>
                                <div className="flex gap-2">
                                    <button onClick={onNew} className="flex items-center gap-2 text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-md transition-colors"><PlusCircle size={16}/> Novo</button>
                                    <button onClick={onSave} disabled={!giraExternaNome} className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-md transition-colors disabled:bg-gray-500"><Save size={16}/> {editingId ? 'Atualizar' : 'Salvar'}</button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="evento-nome" className="block text-sm font-medium text-gray-300 mb-1">Nome do Evento</label>
                                <input id="evento-nome" type="text" value={giraExternaNome} onChange={e => setGiraExternaNome(e.target.value)} placeholder="Ex: Gira na Praia de Santos" className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            </div>
                             <div>
                                <label htmlFor="evento-data" className="block text-sm font-medium text-gray-300 mb-1">Data do Evento</label>
                                <input id="evento-data" type="date" value={giraExternaData} onChange={e => setGiraExternaData(e.target.value)} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/2 w-full">
                            <Card>
                                <CardHeader><h3 className="text-lg font-semibold">Etapa 1: Controle de Participação</h3></CardHeader>
                                <CardContent className="max-h-[40rem] overflow-y-auto pr-2">
                                   <ul className="divide-y divide-gray-700">
                                       {sortedFilhos.map(filho => {
                                           const p = participacao[filho.id];
                                           const isParticipando = p?.participa || false;
                                           return (
                                               <li key={filho.id} className="py-3">
                                                   <div className="flex items-center justify-between">
                                                        <span className="font-medium">{filho.nome}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={isParticipando} onChange={() => handleParticipacaoChange(filho.id)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div></label>
                                                   </div>
                                                   {isParticipando && (
                                                       <div className="mt-3 flex justify-around gap-2">
                                                           {['motorista', 'carona', 'independente'].map(t => {
                                                               const transportType = t as GiraExternaTransporte;
                                                               const isActive = p?.transporte === transportType;
                                                               const colors = { motorista: 'blue', carona: 'teal', independente: 'purple' };
                                                               const icons = { motorista: <Car size={16}/>, carona: <UserPlus size={16}/>, independente: <Rocket size={16}/> };
                                                               return <button key={t} onClick={() => handleTransporteChange(filho.id, transportType)} className={`flex-1 flex items-center justify-center gap-2 text-sm py-2 px-3 rounded-md transition-colors border ${isActive ? `bg-${colors[transportType]}-600 border-${colors[transportType]}-500` : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}>{icons[transportType]} {t.charAt(0).toUpperCase() + t.slice(1)}</button>
                                                           })}
                                                       </div>
                                                   )}
                                               </li>
                                           )
                                       })}
                                   </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:w-1/2 w-full space-y-6">
                            <Card>
                                <CardHeader><h3 className="text-lg font-semibold">Etapa 2: Organização dos Carros</h3></CardHeader>
                                <CardContent className="space-y-4 max-h-[25rem] overflow-y-auto">
                                    {motoristas.length > 0 ? motoristas.map(motoristaId => (
                                        <div key={motoristaId} className="p-3 bg-gray-800/50 rounded-lg">
                                            <h4 className="font-semibold text-indigo-400 flex items-center gap-2"><Car size={18}/> {getFilhoName(motoristaId)}</h4>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {[0, 1, 2, 3].map(vagaIndex => {
                                                    const passageiroAtualId = carros[Number(motoristaId)]?.[vagaIndex];
                                                    const options = passageirosDisponiveis.map(pId => <option key={pId} value={pId}>{getFilhoName(pId)}</option>);
                                                    if (passageiroAtualId && !passageirosDisponiveis.includes(String(passageiroAtualId))) {
                                                        options.unshift(<option key={passageiroAtualId} value={passageiroAtualId}>{getFilhoName(passageiroAtualId)}</option>);
                                                    }
                                                    return(
                                                    <select key={vagaIndex} value={passageiroAtualId || ''} onChange={(e) => handleCarroChange(Number(motoristaId), vagaIndex, e.target.value)} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs">
                                                        <option value="">Vaga {vagaIndex + 1}</option>
                                                        {options}
                                                    </select>
                                                )})}
                                            </div>
                                        </div>
                                    )) : <p className="text-center text-gray-500 py-4">Nenhum motorista definido.</p>}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><h3 className="text-lg font-semibold">Resumo</h3></CardHeader>
                                <CardContent className="space-y-2 text-gray-300">
                                    <p className="flex items-center gap-2"><Users size={16} className="text-green-400"/> {resumo.participantes} Participantes</p>
                                    <p className="flex items-center gap-2"><Car size={16} className="text-blue-400"/> {resumo.motoristas} Motoristas</p>
                                    <p className="flex items-center gap-2"><Rocket size={16} className="text-purple-400"/> {resumo.independentes} Independentes</p>
                                    <p className={`flex items-center gap-2 ${resumo.semCarro > 0 ? 'text-yellow-400' : 'text-gray-300'}`}><AlertCircle size={16}/> {resumo.precisamCarona} Precisam de Carona ({resumo.semCarro} sem carro)</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="xl:w-1/4 w-full">
                     <Card>
                        <CardHeader><h3 className="text-lg font-semibold">Eventos Salvos</h3></CardHeader>
                        <CardContent className="max-h-[60rem] overflow-y-auto space-y-2">
                            {eventosSalvos.length > 0 ? eventosSalvos.map(evento => (
                                <div key={evento.id} className="p-2 bg-gray-800/50 rounded-md">
                                    <p className="font-semibold truncate">{evento.nome}</p>
                                    <p className="text-xs text-gray-400">{new Date(evento.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => onLoad(evento.id)} className="flex-1 text-xs py-1 px-2 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-1"><Edit size={12}/> Carregar</button>
                                        <button onClick={() => onDelete(evento.id)} className="py-1 px-2 bg-red-600 hover:bg-red-500 rounded"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500 py-4">Nenhum evento salvo.</p>}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default GiraExternaView;
