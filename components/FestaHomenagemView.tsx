import React, { useState, useEffect, useMemo } from 'react';
import type { Filho, FestaHomenagemEvento, FestaPagamento } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Save, PlusCircle, Trash2, Edit, X, Users, DollarSign } from 'lucide-react';

interface FestaHomenagemViewProps {
    filhos: Filho[];
    festasSalvas: FestaHomenagemEvento[];
    onSaveFesta: (festa: FestaHomenagemEvento) => void;
    onDeleteFesta: (id: number) => void;
}

const FestaHomenagemView: React.FC<FestaHomenagemViewProps> = ({ filhos, festasSalvas, onSaveFesta, onDeleteFesta }) => {
    const [currentFesta, setCurrentFesta] = useState<Omit<FestaHomenagemEvento, 'id'> & { id?: number }>({
        nome: '',
        data: new Date().toISOString().split('T')[0],
        pagamentos: {}
    });

    const resetForm = () => {
        setCurrentFesta({
            nome: '',
            data: new Date().toISOString().split('T')[0],
            pagamentos: {}
        });
    };
    
    const loadFesta = (id: number) => {
        const festa = festasSalvas.find(f => f.id === id);
        if (festa) {
            setCurrentFesta(festa);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentFesta(prev => ({...prev, [name]: value}));
    };
    
    const handlePagamentoChange = (filhoId: number, field: 'pago' | 'valor', value: boolean | string) => {
        setCurrentFesta(prev => {
            const newPagamentos = { ...prev.pagamentos };
            const currentPagamento = newPagamentos[filhoId] || { pago: false };
            
            if (field === 'pago') {
                newPagamentos[filhoId] = { ...currentPagamento, pago: value as boolean };
                if (!value) {
                    delete newPagamentos[filhoId].valor; // Clear value if not paid
                }
            } else if (field === 'valor') {
                newPagamentos[filhoId] = { ...currentPagamento, valor: Number(value) };
            }

            return { ...prev, pagamentos: newPagamentos };
        });
    };
    
    const handleSave = () => {
        if (!currentFesta.nome) {
            alert('Por favor, defina um nome para o evento.');
            return;
        }
        onSaveFesta(currentFesta as FestaHomenagemEvento);
        resetForm();
    };

    const resumo = useMemo(() => {
        const pagamentos = Object.values(currentFesta.pagamentos);
        const totalPagantes = pagamentos.filter(p => p.pago).length;
        const valorArrecadado = pagamentos.reduce((acc, p) => acc + (p.valor || 0), 0);
        return { totalPagantes, valorArrecadado };
    }, [currentFesta.pagamentos]);
    
    const sortedFilhos = useMemo(() => [...filhos].sort((a,b) => a.nome.localeCompare(b.nome)), [filhos]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100">Festa / Homenagem</h2>
             <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Main Form */}
                <div className="xl:w-3/4 w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{currentFesta.id ? `Editando: ${currentFesta.nome}` : 'Novo Evento'}</h3>
                                <div className="flex gap-2">
                                    <button onClick={resetForm} className="flex items-center gap-2 text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-md transition-colors"><PlusCircle size={16}/> Novo</button>
                                    <button onClick={handleSave} disabled={!currentFesta.nome} className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-md transition-colors disabled:bg-gray-500"><Save size={16}/> {currentFesta.id ? 'Atualizar' : 'Salvar'}</button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1">Nome do Evento</label>
                                <input id="nome" name="nome" type="text" value={currentFesta.nome} onChange={handleInputChange} placeholder="Ex: Festa de Iemanjá" className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="data" className="block text-sm font-medium text-gray-300 mb-1">Data do Evento</label>
                                <input id="data" name="data" type="date" value={currentFesta.data} onChange={handleInputChange} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3 w-full">
                           <Card>
                                <CardHeader><h3 className="text-lg font-semibold">Controle de Pagamentos</h3></CardHeader>
                                <CardContent className="max-h-[40rem] overflow-y-auto pr-2">
                                    <ul className="divide-y divide-gray-700">
                                        {sortedFilhos.map(filho => {
                                            const pagamento = currentFesta.pagamentos[filho.id] || {pago: false};
                                            return (
                                                <li key={filho.id} className="py-3 flex items-center justify-between gap-4">
                                                    <span className="font-medium flex-1">{filho.nome}</span>
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="number" 
                                                            value={pagamento.valor || ''}
                                                            onChange={e => handlePagamentoChange(filho.id, 'valor', e.target.value)}
                                                            placeholder="Valor"
                                                            disabled={!pagamento.pago}
                                                            className="w-24 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
                                                        />
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" checked={pagamento.pago} onChange={e => handlePagamentoChange(filho.id, 'pago', e.target.checked)} className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                            <span className="ml-3 text-sm font-medium text-gray-300">Pago</span>
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:w-1/3 w-full">
                             <Card>
                                <CardHeader><h3 className="text-lg font-semibold">Resumo Financeiro</h3></CardHeader>
                                <CardContent className="space-y-3 text-lg">
                                    <div className="flex items-center gap-3">
                                        <Users size={24} className="text-indigo-400"/>
                                        <div>
                                            <p className="font-bold">{resumo.totalPagantes}</p>
                                            <p className="text-sm text-gray-400">Total de Pagantes</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <DollarSign size={24} className="text-green-400"/>
                                        <div>
                                            <p className="font-bold">{resumo.valorArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            <p className="text-sm text-gray-400">Valor Arrecadado</p>
                                        </div>
                                    </div>
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
                            {festasSalvas.length > 0 ? festasSalvas.map(festa => {
                                const pagamentos = Object.values(festa.pagamentos);
                                const totalPagantes = pagamentos.filter(p => p.pago).length;
                                const valorArrecadado = pagamentos.reduce((acc, p) => acc + (p.valor || 0), 0);
                                return (
                                <div key={festa.id} className="p-3 bg-gray-800/50 rounded-md space-y-2 border border-gray-700">
                                    <div>
                                        <p className="font-semibold truncate">{festa.nome}</p>
                                        <p className="text-xs text-gray-400">{new Date(festa.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                    </div>
                                    <div className="text-xs text-gray-300 flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                                        <span className="flex items-center gap-1"><Users size={12}/>{totalPagantes} Pagantes</span>
                                        <span className="font-semibold text-green-400">{valorArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => loadFesta(festa.id)} className="flex-1 text-xs py-1 px-2 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-1"><Edit size={12}/> Carregar</button>
                                        <button onClick={() => onDeleteFesta(festa.id)} className="py-1 px-2 bg-red-600 hover:bg-red-500 rounded"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                            )}) : <p className="text-center text-gray-500 py-4">Nenhum evento salvo.</p>}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default FestaHomenagemView;