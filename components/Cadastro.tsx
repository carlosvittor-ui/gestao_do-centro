import React, { useState, useMemo } from 'react';
import type { Filho, FilhoFormData, Barco } from '../types';
import { Situacao, Departamento } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import FilhoFormModal from './FilhoFormModal';

interface CadastroProps {
  filhos: Filho[];
  onAdd: (filho: FilhoFormData) => void;
  onUpdate: (filho: Filho) => void;
  onDelete: (id: number) => void;
  barcos: Barco[];
}

const statusColorMap: Record<Situacao, string> = {
    [Situacao.Ativo]: 'bg-green-500',
    [Situacao.Afastado]: 'bg-yellow-500',
    [Situacao.Desligado]: 'bg-red-500',
};

const Cadastro: React.FC<CadastroProps> = ({ filhos, onAdd, onUpdate, onDelete, barcos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFilho, setEditingFilho] = useState<Filho | null>(null);
    const [filters, setFilters] = useState({
        situacao: 'all',
        departamento: 'all',
        barcoId: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredFilhos = useMemo(() => {
        return filhos.filter(filho => {
            const situacaoMatch = filters.situacao === 'all' || filho.situacao === filters.situacao;
            const departamentoMatch = filters.departamento === 'all' || filho.departamento === filters.departamento;
            const barcoMatch = filters.barcoId === 'all' || (filho.juremado.barcoId ? filho.juremado.barcoId.toString() === filters.barcoId : false);
            return situacaoMatch && departamentoMatch && barcoMatch;
        });
    }, [filhos, filters]);

    const handleOpenModalForCreate = () => {
        setEditingFilho(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (filho: Filho) => {
        setEditingFilho(filho);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFilho(null);
    };

    const handleSave = (filhoData: FilhoFormData | Filho) => {
        if ('id' in filhoData) {
            onUpdate(filhoData);
        } else {
            onAdd(filhoData);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.')) {
            onDelete(id);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-100">Gerenciamento de Membros</h2>
                <button
                    onClick={handleOpenModalForCreate}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    <PlusCircle size={20} />
                    Cadastrar Novo Membro
                </button>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-medium text-gray-200">Filtros</h3>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="situacao-filter" className="block text-sm font-medium text-gray-300 mb-1">Situação</label>
                            <select id="situacao-filter" name="situacao" onChange={handleFilterChange} value={filters.situacao} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todas</option>
                                {Object.values(Situacao).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="departamento-filter" className="block text-sm font-medium text-gray-300 mb-1">Departamento</label>
                            <select id="departamento-filter" name="departamento" onChange={handleFilterChange} value={filters.departamento} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todos</option>
                                {Object.values(Departamento).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="barco-filter" className="block text-sm font-medium text-gray-300 mb-1">Barco de Jurema</label>
                            <select id="barco-filter" name="barcoId" onChange={handleFilterChange} value={filters.barcoId} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todos</option>
                                {barcos.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Situação</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Barco Juremado</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Padrinhos</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departamento</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data de Entrada</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                                {filteredFilhos.length > 0 ? filteredFilhos.map((filho) => {
                                    const barco = filho.juremado.barcoId ? barcos.find(b => b.id === filho.juremado.barcoId) : null;
                                    
                                    const padrinhos = barco?.padrinhos || [];
                                    let padrinhoDisplay = '-';
                                    if (padrinhos.length > 0) {
                                        const primeiroPadrinho = padrinhos[0];
                                        const medium = filhos.find(f => f.id === primeiroPadrinho.filhoId);
                                        if (medium) {
                                            // @ts-ignore
                                            const entidadeNome = medium.entidades[primeiroPadrinho.entidadeKey] || primeiroPadrinho.entidadeKey;
                                            padrinhoDisplay = `${entidadeNome} (${medium.nome})`;
                                        }
                                        if (padrinhos.length > 1) {
                                            padrinhoDisplay += `, +${padrinhos.length - 1}`;
                                        }
                                    }

                                    return (
                                    <tr key={filho.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{filho.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <span className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${statusColorMap[filho.situacao]}`}></span>
                                                {filho.situacao.charAt(0).toUpperCase() + filho.situacao.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{barco?.nome || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate" title={padrinhoDisplay}>{padrinhoDisplay}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.departamento}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(filho.dataEntrada).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-4">
                                                <button onClick={() => handleOpenModalForEdit(filho)} className="text-indigo-400 hover:text-indigo-300" title="Editar">
                                                    <Edit size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(filho.id)} className="text-red-400 hover:text-red-300" title="Excluir">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            Nenhum membro encontrado com os filtros selecionados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {isModalOpen && (
                <FilhoFormModal
                    filho={editingFilho}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    barcos={barcos}
                    allFilhos={filhos}
                />
            )}
        </div>
    );
};

export default Cadastro;