import React, { useMemo } from 'react';
import type { GiraHistorico, Filho } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Funcao } from '../types';

interface HistoricoDetalhesModalProps {
  gira: GiraHistorico;
  filhos: Filho[];
  onClose: () => void;
}

const HistoricoDetalhesModal: React.FC<HistoricoDetalhesModalProps> = ({ gira, filhos, onClose }) => {
  
    const presentesFilhos = useMemo(() => {
        return (gira.presentes || []).map(id => filhos.find(f => f.id === id)).filter((f): f is Filho => f !== undefined);
    }, [gira.presentes, filhos]);

    const ausentesFilhos = useMemo(() => {
        return (gira.ausentes || []).map(id => filhos.find(f => f.id === id)).filter((f): f is Filho => f !== undefined);
    }, [gira.ausentes, filhos]);

    const findNameById = (id: number | null | undefined): string => {
        if (!id) return 'N/A';
        const filho = filhos.find(f => f.id === id);
        return filho ? filho.nome : 'Desconhecido';
    };

    const filhosEmFuncaoFixa = useMemo(() => {
        return presentesFilhos.filter(f => f.funcao !== Funcao.Nenhum);
    }, [presentesFilhos]);

    const filterByFuncao = (funcoes: Funcao[]) => filhosEmFuncaoFixa.filter(f => funcoes.includes(f.funcao));
    
    const mediumsNaGira = Object.keys(gira.organizacao.mediumCambonePairings).map(id => parseInt(id, 10));
    
    const fixedFunctionIdsToExclude = useMemo(() => {
        return new Set(filhosEmFuncaoFixa.filter(f => f.funcao !== Funcao.Curimba).map(f => f.id));
    }, [filhosEmFuncaoFixa]);

    const alocadosIds = useMemo(() => {
        const ids = new Set<number>();
        mediumsNaGira.forEach(id => ids.add(id));
        Object.values(gira.organizacao.mediumCambonePairings).forEach(id => { if (id) ids.add(id) });
        Object.values(gira.organizacao.departamentoAssignments).forEach(id => { if (id) ids.add(id) });
        fixedFunctionIdsToExclude.forEach(id => ids.add(id));
        return ids;
    }, [gira, fixedFunctionIdsToExclude, mediumsNaGira]);

    const filhosNaoAlocados = presentesFilhos.filter(f => !alocadosIds.has(f.id));

    return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop" onClick={onClose}>
        <div className="w-full max-w-6xl modal-content" onClick={e => e.stopPropagation()}>
            <Card className="max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-indigo-400">{gira.giraDoDia}</h3>
                            <p className="text-sm text-gray-400">Detalhes da Gira de {new Date(gira.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* PRESENCA */}
                        <div className="space-y-4">
                             <Card>
                                <CardHeader><h4 className="font-semibold text-gray-200">Presentes ({presentesFilhos.length})</h4></CardHeader>
                                <CardContent className="max-h-48 overflow-y-auto text-sm space-y-1">
                                    {presentesFilhos.map(f => <p key={f.id}>{f.nome}</p>)}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><h4 className="font-semibold text-gray-200">Ausentes ({ausentesFilhos.length})</h4></CardHeader>
                                <CardContent className="max-h-48 overflow-y-auto text-sm space-y-1">
                                     {ausentesFilhos.length > 0 ? ausentesFilhos.map(f => <p key={f.id}>{f.nome}</p>) : <p className="text-gray-500">Ninguém ausente.</p>}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ORGANIZACAO */}
                        <div className="space-y-4">
                             <Card>
                                <CardHeader><h4 className="font-semibold text-gray-200">Organização da Gira</h4></CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <h5 className="font-semibold text-indigo-400 mb-2">Médiuns e Cambonos</h5>
                                        <div className="space-y-1">
                                            {mediumsNaGira.length > 0 ? mediumsNaGira.map(mediumId => (
                                                <p key={mediumId}><strong className="font-medium text-gray-300">{findNameById(mediumId)}:</strong> <span className="text-gray-400">{findNameById(gira.organizacao.mediumCambonePairings[mediumId])}</span></p>
                                            )) : <p className="text-gray-500">Nenhum médium atuou.</p>}
                                        </div>
                                    </div>
                                    <hr className="border-gray-700"/>
                                    <div>
                                        <h5 className="font-semibold text-indigo-400 mb-2">Funções Fixas</h5>
                                        <div className="space-y-1">
                                            <p><strong>Pais/Mães Peq.:</strong> <span className="text-gray-400">{filterByFuncao([Funcao.PaiMaePequena]).map(f => f.nome).join(', ') || 'N/A'}</span></p>
                                            <p><strong>Ogãns/Curimba:</strong> <span className="text-gray-400">{filterByFuncao([Funcao.Oga, Funcao.Curimba]).map(f => f.nome).join(', ') || 'N/A'}</span></p>
                                            <p><strong>Cambono Chefe:</strong> <span className="text-gray-400">{filterByFuncao([Funcao.CambonoChefe]).map(f => f.nome).join(', ') || 'N/A'}</span></p>
                                            <p><strong>Ekedis:</strong> <span className="text-gray-400">{filterByFuncao([Funcao.Ekedi]).map(f => f.nome).join(', ') || 'N/A'}</span></p>
                                            <p><strong>Filhas do Axé:</strong> <span className="text-gray-400">{filterByFuncao([Funcao.FilhaAxe]).map(f => f.nome).join(', ') || 'N/A'}</span></p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-700"/>
                                     <div>
                                        <h5 className="font-semibold text-indigo-400 mb-2">Apoio</h5>
                                        <div className="space-y-1">
                                            <p><strong>Recepção:</strong> <span className="text-gray-400">{findNameById(gira.organizacao.departamentoAssignments.recepcao)}</span></p>
                                            <p><strong>Cantina:</strong> <span className="text-gray-400">{findNameById(gira.organizacao.departamentoAssignments.cantina)}</span></p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-700"/>
                                    <div>
                                        <h5 className="font-semibold text-indigo-400 mb-2">Disponíveis na Assistência</h5>
                                        <p className="text-gray-400">{filhosNaoAlocados.map(f => f.nome).join(', ') || 'Nenhum membro ficou apenas na assistência.'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default HistoricoDetalhesModal;