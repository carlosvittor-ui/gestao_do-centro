import React, { useMemo } from 'react';
import type { Filho, MediumCambonePairings, DepartamentoAssignments } from '../types';
import { Funcao, Departamento } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Save, Image as ImageIcon, Users, Hand, Building, Anchor } from 'lucide-react';

declare global {
    interface Window {
        html2canvas: any;
    }
}

interface OrganizacaoGiraProps {
    filhos: Filho[];
    filhosPresentes: Filho[];
    giraDoDia: string;
    dataDeHoje: string;
    mediumCambonePairings: MediumCambonePairings;
    setMediumCambonePairings: React.Dispatch<React.SetStateAction<MediumCambonePairings>>;
    departamentoAssignments: DepartamentoAssignments;
    setDepartamentoAssignments: React.Dispatch<React.SetStateAction<DepartamentoAssignments>>;
    onFinalizarGira: () => void;
}

const OrganizacaoGira: React.FC<OrganizacaoGiraProps> = ({
    filhos,
    filhosPresentes,
    giraDoDia,
    dataDeHoje,
    mediumCambonePairings,
    setMediumCambonePairings,
    departamentoAssignments,
    setDepartamentoAssignments,
    onFinalizarGira
}) => {

    const mediumsPresentes = useMemo(() => {
        return filhosPresentes.filter(f => f.podeDarPasse).sort((a,b) => a.nome.localeCompare(b.nome));
    }, [filhosPresentes]);
    
    const mediumIdsPresentes = useMemo(() => new Set(mediumsPresentes.map(m => m.id)), [mediumsPresentes]);

    const pairedCambonoIds = useMemo(() => new Set(Object.values(mediumCambonePairings).filter((id): id is number => id !== null)), [mediumCambonePairings]);
    const apoioIds = useMemo(() => new Set(Object.values(departamentoAssignments).filter((id): id is number => id !== null)), [departamentoAssignments]);
    
    const fixedFunctionIdsToExclude = useMemo(() => {
        const ids = filhosPresentes
            .filter(f => f.funcao !== Funcao.Nenhum && f.funcao !== Funcao.Curimba)
            .map(f => f.id);
        return new Set(ids);
    }, [filhosPresentes]);

    const cambonesDisponiveis = useMemo(() => {
        return filhosPresentes.filter(f =>
            !mediumIdsPresentes.has(f.id) &&
            !apoioIds.has(f.id) &&
            !pairedCambonoIds.has(f.id) &&
            !fixedFunctionIdsToExclude.has(f.id)
        );
    }, [filhosPresentes, mediumIdsPresentes, apoioIds, pairedCambonoIds, fixedFunctionIdsToExclude]);

    const handlePairingChange = (mediumId: number, cambonoId: string) => {
        const newPairings = { ...mediumCambonePairings };
        const id = cambonoId ? parseInt(cambonoId, 10) : null;

        for (const key in newPairings) {
            if (newPairings[key] === id) {
                newPairings[key] = null;
            }
        }
        
        newPairings[mediumId] = id;
        setMediumCambonePairings(newPairings);
    };

    const handleDepartmentChange = (dept: 'recepcao' | 'cantina', filhoId: string) => {
        const id = filhoId ? parseInt(filhoId, 10) : null;
        const otherDept: 'recepcao' | 'cantina' = dept === 'recepcao' ? 'cantina' : 'recepcao';
        
        const newAssignments = { ...departamentoAssignments };

        if (id && newAssignments[otherDept] === id) {
            newAssignments[otherDept] = null;
        }

        newAssignments[dept] = id;
        setDepartamentoAssignments(newAssignments);
    };

    const filhosEmFuncaoFixa = useMemo(() => {
        return filhosPresentes.filter(f => f.funcao !== Funcao.Nenhum);
    }, [filhosPresentes]);

    const filhosApoioDisponiveis = (dept: Departamento) => {
        const currentSelectionForDept = departamentoAssignments[dept === Departamento.Recepcao ? 'recepcao' : 'cantina'];
        return filhosPresentes.filter(f =>
            (
                !apoioIds.has(f.id) || f.id === currentSelectionForDept
            ) &&
            (f.departamento === dept || f.departamento === Departamento.Nenhum) &&
            (f.funcao === Funcao.Nenhum || f.funcao === Funcao.Curimba) &&
            !mediumIdsPresentes.has(f.id) &&
            !pairedCambonoIds.has(f.id) &&
            !fixedFunctionIdsToExclude.has(f.id)
        );
    }
    const filhosRecepcao = useMemo(() => filhosApoioDisponiveis(Departamento.Recepcao), [filhosPresentes, mediumIdsPresentes, pairedCambonoIds, fixedFunctionIdsToExclude, departamentoAssignments]);
    const filhosCantina = useMemo(() => filhosApoioDisponiveis(Departamento.Cantina), [filhosPresentes, mediumIdsPresentes, pairedCambonoIds, fixedFunctionIdsToExclude, departamentoAssignments]);


    const filhosNaoAlocados = useMemo(() => {
        const alocadosIds = new Set<number>([
            ...mediumIdsPresentes,
            ...pairedCambonoIds,
            ...apoioIds,
            ...fixedFunctionIdsToExclude,
        ]);

        return filhosPresentes.filter(f => !alocadosIds.has(f.id));
    }, [filhosPresentes, mediumIdsPresentes, pairedCambonoIds, apoioIds, fixedFunctionIdsToExclude]);
    
    const filterByFuncao = (funcoes: Funcao[]) => filhosEmFuncaoFixa.filter(f => funcoes.includes(f.funcao));
    
    const findNameById = (id: number | null) => {
        if (id === null) return 'N/A';
        return filhos.find(f => f.id === id)?.nome || 'N/A';
    }

    const handleGenerateImage = () => {
        const element = document.getElementById('gira-organization-layout-image');
        if (element && window.html2canvas) {
            window.html2canvas(element, {
                backgroundColor: '#111827',
                scale: 2,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                const fileName = `organizacao_${giraDoDia.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'gira'}_${dataDeHoje.replace(/\//g,'-')}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            alert('Não foi possível gerar a imagem. A biblioteca de captura pode não ter sido carregada.');
        }
    };

    if (filhosPresentes.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-300">Nenhum membro presente.</h2>
                    <p className="text-gray-500 mt-2">Por favor, registre a presença na aba 'Controle de Presença' primeiro.</p>
                </CardContent>
            </Card>
        );
    }
    
    const ImageLayout = () => (
        <div id="gira-organization-layout-image" className="p-8 bg-gray-900 text-gray-200 space-y-6" style={{ width: '800px'}}>
             <div className="text-center border-b-2 border-indigo-500 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-indigo-400">{giraDoDia || 'Gira sem nome'}</h1>
                <p className="text-lg text-gray-400">{dataDeHoje}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div> {/* Left Column */}
                     {mediumsPresentes.length > 0 && (
                        <Card className="h-full border-2 border-indigo-500/70 shadow-lg shadow-indigo-500/20">
                            <CardHeader><h3 className="text-xl font-semibold flex items-center gap-2"><Hand size={20}/> Médiuns e Cambonos</h3></CardHeader>
                            <CardContent className="p-0">
                                 <table className="w-full text-left">
                                    <thead className="bg-gray-800/50">
                                        <tr className="border-b border-gray-600">
                                            <th className="p-3 text-sm font-semibold uppercase text-gray-400 tracking-wider">Médium</th>
                                            <th className="p-3 text-sm font-semibold uppercase text-gray-400 tracking-wider">Cambono</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mediumsPresentes.map(medium => (
                                            <tr key={medium.id} className="border-b border-gray-700/50 last:border-b-0">
                                                <td className="p-3 font-medium text-gray-100">{medium.nome}</td>
                                                <td className="p-3 text-gray-300">{findNameById(mediumCambonePairings[medium.id] || null)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div> {/* Right Column */}
                     {filhosNaoAlocados.length > 0 && (
                        <Card className="h-full">
                            <CardHeader><h3 className="text-xl font-semibold flex items-center gap-2"><Users size={20}/> Médiuns da Corrente</h3></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                    {filhosNaoAlocados.map(f => <p key={f.id} className="text-gray-300 border-b border-gray-700/50 pb-1">{f.nome}</p>)}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader><h3 className="text-xl font-semibold flex items-center gap-2"><Anchor size={20}/> Funções e Departamentos</h3></CardHeader>
                <CardContent className="grid grid-cols-2 gap-8 text-sm">
                    <div className="space-y-2">
                        <p><strong>Pai da casa:</strong> {filterByFuncao([Funcao.PaiDaCasa]).map(f => f.nome).join(', ') || 'N/A'}</p>
                        <p><strong>Pais/Mães Peq.:</strong> {filterByFuncao([Funcao.PaiMaePequena]).map(f => f.nome).join(', ') || 'N/A'}</p>
                        <p><strong>Ogãns/Curimba:</strong> {filterByFuncao([Funcao.Oga, Funcao.Curimba]).map(f => f.nome).join(', ') || 'N/A'}</p>
                        <p><strong>Cambono Chefe:</strong> {filterByFuncao([Funcao.CambonoChefe]).map(f => f.nome).join(', ') || 'N/A'}</p>
                        <p><strong>Ekedis:</strong> {filterByFuncao([Funcao.Ekedi]).map(f => f.nome).join(', ') || 'N/A'}</p>
                         <p><strong>Filhas do Axé:</strong> {filterByFuncao([Funcao.FilhaAxe]).map(f => f.nome).join(', ') || 'N/A'}</p>
                    </div>
                     <div className="space-y-2">
                        <p><strong>Recepção:</strong> {findNameById(departamentoAssignments.recepcao )}</p>
                        <p><strong>Cantina:</strong> {findNameById(departamentoAssignments.cantina )}</p>
                        <p><strong>Limpeza:</strong> <span className="text-gray-400">Escala no grupo</span></p>
                        <p><strong>Cozinha:</strong> <span className="text-gray-400">Escala no grupo</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="space-y-6">
             {/* Componente para a imagem, fica escondido */}
            <div className="absolute -left-[9999px] top-0">
                <ImageLayout />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-100">Organização da Gira: <span className="text-indigo-400">{giraDoDia || 'Não definida'}</span></h2>
                            <p className="text-sm text-gray-400">{dataDeHoje} - {filhosPresentes.length} presentes</p>
                        </div>
                         <div className="flex items-center gap-4">
                            <button
                                onClick={handleGenerateImage}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                            >
                                <ImageIcon size={18} />
                                Gerar Imagem
                            </button>
                            <button
                              onClick={onFinalizarGira}
                              disabled={!giraDoDia || filhosPresentes.length === 0}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              <Save size={18} />
                              Finalizar e Salvar Gira
                            </button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-[35%] w-full flex flex-col gap-6">
                    <Card className="flex-1">
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-200">Médiuns e Cambonos</h3>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-[40rem] overflow-y-auto">
                           {mediumsPresentes.length > 0 ? mediumsPresentes.map(medium => {
                                const currentCambonoId = mediumCambonePairings[medium.id];
                                const cambonoOptions = [...cambonesDisponiveis];

                                if (currentCambonoId) {
                                    const isCurrentCambonoInList = cambonesDisponiveis.some(c => c.id === currentCambonoId);
                                    if (!isCurrentCambonoInList) {
                                        const currentCambono = filhosPresentes.find(f => f.id === currentCambonoId);
                                        if (currentCambono) {
                                            cambonoOptions.push(currentCambono);
                                            cambonoOptions.sort((a, b) => a.nome.localeCompare(b.nome));
                                        }
                                    }
                                }

                               return (
                                <div key={medium.id} className="grid grid-cols-2 gap-2 items-center">
                                    <span className="text-sm font-medium truncate py-2 px-3 bg-gray-700/50 rounded-md">{medium.nome}</span>
                                    <select 
                                        value={mediumCambonePairings[medium.id] || ''}
                                        onChange={(e) => handlePairingChange(medium.id, e.target.value)}
                                        className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Selecionar...</option>
                                        {cambonoOptions.map(cambono => (
                                            <option key={cambono.id} value={cambono.id}>{cambono.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            )}) : (
                                <p className="text-gray-500 text-center py-4">Nenhum médium habilitado para dar passe presente.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:w-[65%] w-full flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-200">Funções e Departamentos</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-indigo-400 mb-2">Funções Fixas</h4>
                                    <div className="text-sm space-y-2">
                                         <p><strong>Pai Da Casa:</strong> {filterByFuncao([Funcao.PaiDaCasa]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                        <p><strong>Pais/Mães Peq.:</strong> {filterByFuncao([Funcao.PaiMaePequena]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                        <p><strong>Ogãns/Curimba:</strong> {filterByFuncao([Funcao.Oga, Funcao.Curimba]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                        <p><strong>Cambono Chefe:</strong> {filterByFuncao([Funcao.CambonoChefe]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                        <p><strong>Ekedis:</strong> {filterByFuncao([Funcao.Ekedi]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                        <p><strong>Filhas do Axé:</strong> {filterByFuncao([Funcao.FilhaAxe]).map(f => f.nome).join(', ') || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-indigo-400 mb-2">Apoio</h4>
                                    <div className="text-sm space-y-2">
                                        <div className="flex items-center gap-2">
                                            <strong className="w-20">Recepção:</strong>
                                            <select 
                                                value={departamentoAssignments.recepcao || ''}
                                                onChange={e => handleDepartmentChange('recepcao', e.target.value)}
                                                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                                            >
                                                <option value="">Selecionar...</option>
                                                {filhosRecepcao.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <strong className="w-20">Cantina:</strong>
                                            <select 
                                                value={departamentoAssignments.cantina || ''}
                                                onChange={e => handleDepartmentChange('cantina', e.target.value)}
                                                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                                            >
                                                <option value="">Selecionar...</option>
                                                {filhosCantina.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                            </select>
                                        </div>
                                        <p><strong>Limpeza:</strong> <span className="text-gray-400">Escala no grupo</span></p>
                                        <p><strong>Cozinha:</strong> <span className="text-gray-400">Escala no grupo</span></p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-200">Médiuns da Corrente</h3>
                        </CardHeader>
                        <CardContent>
                            {filhosNaoAlocados.length > 0 ? (
                                <p className="text-gray-400 leading-relaxed">
                                    {filhosNaoAlocados.map(filho => filho.nome).join(', ')}
                                </p>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Todos os membros presentes foram alocados em alguma função.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrganizacaoGira;
