import React, { useState, useMemo } from 'react';
import type { Filho, FilhoFormData } from '../types';
import { Situacao, Funcao, Departamento } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { PlusCircle, Edit, Trash2, Upload, Download, Image as ImageIcon } from 'lucide-react';
import FilhoFormModal from './FilhoFormModal';

interface CadastroProps {
  filhos: Filho[];
  onAdd: (filho: FilhoFormData) => void;
  onAddMultiple: (filhos: FilhoFormData[]) => void;
  onUpdate: (filho: Filho) => void;
  onDelete: (id: number) => void;
}

const statusColorMap: Record<Situacao, string> = {
    [Situacao.Ativo]: 'bg-green-500',
    [Situacao.Afastado]: 'bg-yellow-500',
    [Situacao.Desligado]: 'bg-red-500',
};

declare global {
    interface Window {
        html2canvas: any;
    }
}

const Cadastro: React.FC<CadastroProps> = ({ filhos, onAdd, onAddMultiple, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFilho, setEditingFilho] = useState<Filho | null>(null);
    const [filters, setFilters] = useState({
        situacao: 'all',
        funcao: 'all',
        departamento: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredFilhos = useMemo(() => {
        return filhos.filter(filho => {
            const situacaoMatch = filters.situacao === 'all' || filho.situacao === filters.situacao;
            const funcaoMatch = filters.funcao === 'all' || filho.funcao === filters.funcao;
            const departamentoMatch = filters.departamento === 'all' || filho.departamento === filters.departamento;
            return situacaoMatch && funcaoMatch && departamentoMatch;
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
        onDelete(id);
    };
    
    const handleExportTemplate = () => {
        const headers = [
            'nome', 'situacao', 'departamento', 'dataEntrada', 'dataNascimento', 
            'orixas_primeiro', 'orixas_segundo', 'entidades_exu', 'entidades_pomboGira', 
            'entidades_caboclo', 'entidades_baiano', 'entidades_marinheiro', 
            'entidades_cigano', 'entidades_pretoVelho', 'entidades_ere', 
            'entidades_boiadeiro', 'entidades_exuMirim', 'pontoRiscadoUrl', 
            'juremado_e', 'juremado_data', 'ordemSuporte_tem', 'ordemSuporte_data', 
            'ordemPasse_tem', 'ordemPasse_data', 'podeDarPasse', 'funcao'
        ];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n';
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_cadastro_filhos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                alert('Arquivo vazio ou contém apenas o cabeçalho.');
                return;
            }
            const headers = lines[0].split(',').map(h => h.trim());
            const newFilhos: FilhoFormData[] = [];
            const errors: string[] = [];

            for (let i = 1; i < lines.length; i++) {
                const data = lines[i].split(',');
                const row = headers.reduce((obj, nextKey, index) => {
                    obj[nextKey] = data[index]?.trim();
                    return obj;
                }, {} as any);

                try {
                    if (!row.nome) {
                        throw new Error(`Nome é obrigatório.`);
                    }

                    const newFilho: FilhoFormData = {
                        nome: row.nome,
                        situacao: Object.values(Situacao).includes(row.situacao) ? row.situacao : Situacao.Ativo,
                        departamento: Object.values(Departamento).includes(row.departamento) ? row.departamento : Departamento.Nenhum,
                        dataEntrada: row.dataEntrada || new Date().toISOString().split('T')[0],
                        dataNascimento: row.dataNascimento || '',
                        orixas: {
                            primeiro: row.orixas_primeiro || '',
                            segundo: row.orixas_segundo || ''
                        },
                        entidades: {
                            exu: row.entidades_exu || '', pomboGira: row.entidades_pomboGira || '',
                            caboclo: row.entidades_caboclo || '', baiano: row.entidades_baiano || '',
                            marinheiro: row.entidades_marinheiro || '', cigano: row.entidades_cigano || '',
                            pretoVelho: row.entidades_pretoVelho || '', ere: row.entidades_ere || '',
                            boiadeiro: row.entidades_boiadeiro || '', exuMirim: row.entidades_exuMirim || ''
                        },
                        pontoRiscadoUrl: row.pontoRiscadoUrl || '',
                        juremado: { e: row.juremado_e === 'true', data: row.juremado_data || '' },
                        ordemSuporte: { tem: row.ordemSuporte_tem === 'true', data: row.ordemSuporte_data || '' },
                        ordemPasse: { tem: row.ordemPasse_tem === 'true', data: row.ordemPasse_data || '' },
                        podeDarPasse: row.podeDarPasse === 'true',
                        funcao: Object.values(Funcao).includes(row.funcao) ? row.funcao : Funcao.Nenhum,
                    };
                    newFilhos.push(newFilho);
                } catch(err) {
                    errors.push(`Erro na linha ${i + 1}: ${(err as Error).message}. Linha ignorada.`);
                }
            }
            
            if (newFilhos.length > 0) {
                onAddMultiple(newFilhos);
            }
            if (errors.length > 0) {
                alert(`Importação concluída com erros:\n${errors.join('\n')}`);
            } else if (newFilhos.length === 0) {
                alert('Nenhum membro válido encontrado no arquivo.');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const handleGenerateEntidadesImage = (filho: Filho) => {
        const container = document.createElement('div');
        container.id = 'image-generator-container';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '500px';
        container.style.padding = '2rem';
        container.style.backgroundColor = '#1f2937'; // bg-gray-800
        container.style.color = '#e5e7eb'; // text-gray-200
        container.style.fontFamily = "'Inter', sans-serif";
        container.style.borderRadius = '0.5rem';

        const entidadesValidas = Object.entries(filho.entidades).filter(([, nome]) => nome && nome.trim() !== '');
        
        const entitiesHtml = entidadesValidas.length > 0 
            ? entidadesValidas.map(([tipo, nome]) => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #374151;">
                    <span style="text-transform: capitalize; font-weight: 500;">${tipo.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>${nome}</span>
                </div>
            `).join('')
            : '<p style="text-align: center; color: #6b7280; padding: 1rem 0;">Nenhuma entidade cadastrada.</p>';

        container.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 1rem; margin-bottom: 1rem;">
                <h2 style="font-size: 1.875rem; font-weight: 700; color: #a5b4fc;">${filho.nome}</h2>
                <p style="font-size: 1.125rem; color: #9ca3af;">Quadro de Entidades</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                ${entitiesHtml}
            </div>
        `;
        
        document.body.appendChild(container);
        
        if (window.html2canvas) {
            window.html2canvas(container, {
                backgroundColor: '#1f2937',
                scale: 2,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                const fileName = `entidades_${filho.nome.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
                document.body.removeChild(container);
            }).catch((err: any) => {
                console.error("html2canvas error:", err);
                alert('Ocorreu um erro ao gerar a imagem.');
                document.body.removeChild(container);
            });
        } else {
             alert('Não foi possível gerar a imagem. A biblioteca de captura pode não ter sido carregada.');
             document.body.removeChild(container);
        }
    };
    
    const handleGenerateAllEntidadesImage = () => {
        const container = document.createElement('div');
        container.id = 'all-entidades-generator';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '1800px';
        container.style.padding = '2rem';
        container.style.backgroundColor = '#111827';
        container.style.color = '#d1d5db';
        container.style.fontFamily = "'Inter', sans-serif";

        const entidadeMap: { [key: string]: string } = {
            exu: 'Exu', pomboGira: 'Pombo Gira', caboclo: 'Caboclo',
            pretoVelho: 'Preto Velho', ere: 'Erê', boiadeiro: 'Boiadeiro',
            baiano: 'Baiano', marinheiro: 'Marinheiro', cigano: 'Cigano',
            exuMirim: 'Exu Mirim',
        };
        const entidadeKeys = Object.keys(entidadeMap);

        const tableHeaders = `
            <tr>
                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #374151; background-color: #1f2937; font-weight: 600; color: #9ca3af; white-space: nowrap; text-transform: uppercase; font-size: 12px;">Nome do Membro</th>
                ${entidadeKeys.map(key => `<th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #374151; background-color: #1f2937; font-weight: 600; color: #9ca3af; text-transform: uppercase; font-size: 12px;">${entidadeMap[key]}</th>`).join('')}
            </tr>
        `;

        const podeDarPasseFilhos = [...filhos].filter(f => f.podeDarPasse).sort((a, b) => a.nome.localeCompare(b.nome));
        const demaisFilhos = [...filhos].filter(f => !f.podeDarPasse).sort((a, b) => a.nome.localeCompare(b.nome));

        const generateRows = (filhosList: Filho[], highlight: boolean = false) => {
            return filhosList.map((filho, index) => {
                const bgColor = index % 2 === 0 ? 'rgba(31, 41, 55, 0.5)' : 'rgba(17, 24, 39, 0.5)';
                const nomeStyle = highlight ? 'font-weight: 700; color: #a78bfa;' : 'font-weight: 500; color: #e5e7eb;';
                return `
                    <tr style="border-bottom: 1px solid #374151; background-color: ${bgColor};">
                        <td style="padding: 10px 15px; ${nomeStyle} white-space: nowrap;">${filho.nome}</td>
                        ${entidadeKeys.map(key => `<td style="padding: 10px 15px; color: #9ca3af; white-space: nowrap;">${(filho.entidades as any)[key] || ''}</td>`).join('')}
                    </tr>
                `;
            }).join('');
        };
        
        const tableRowsPasse = generateRows(podeDarPasseFilhos, true);
        const tableRowsDemais = generateRows(demaisFilhos, false);

        const passeTable = podeDarPasseFilhos.length > 0 ? `
            <h2 style="font-size: 1.75rem; font-weight: 600; color: #a5b4fc; text-align: center; margin-bottom: 1rem; margin-top: 2rem;">Médiuns de Passe</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #374151; border-radius: 8px; overflow: hidden;">
                <thead>${tableHeaders}</thead>
                <tbody>${tableRowsPasse}</tbody>
            </table>
        ` : '';
        
        const demaisTable = demaisFilhos.length > 0 ? `
            <h2 style="font-size: 1.75rem; font-weight: 600; color: #a5b4fc; text-align: center; margin-bottom: 1rem; margin-top: 2rem;">Cadastro dos Médiuns da Corrente</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #374151; border-radius: 8px; overflow: hidden;">
                <thead>${tableHeaders}</thead>
                <tbody>${tableRowsDemais}</tbody>
            </table>
        ` : '';

        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <h1 style="font-size: 2.25rem; font-weight: 700; color: #c4b5fd;">Quadro Geral de Entidades</h1>
                <p style="font-size: 1.125rem; color: #6b7280;">${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            ${passeTable}
            ${demaisTable}
        `;
    
        document.body.appendChild(container);
    
        if (window.html2canvas) {
            window.html2canvas(container, {
                backgroundColor: '#111827',
                scale: 2,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = 'quadro_geral_entidades.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).finally(() => {
                if (container.parentElement) {
                    document.body.removeChild(container);
                }
            });
        } else {
            alert('Não foi possível gerar a imagem. A biblioteca de captura pode não ter sido carregada.');
            if (container.parentElement) {
                document.body.removeChild(container);
            }
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-semibold text-gray-100">Cadastro de Membros</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handleExportTemplate}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105"
                    >
                        <Download size={18} />
                        Exportar Template
                    </button>
                    
                    <input type="file" id="import-file" accept=".csv,.txt" onChange={handleImportFile} className="hidden" />
                    <label htmlFor="import-file" className="cursor-pointer flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105">
                        <Upload size={18} />
                        Importar Arquivo
                    </label>
                    
                    <button
                        onClick={handleGenerateAllEntidadesImage}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105"
                    >
                        <ImageIcon size={18} />
                        Exportar Entidades
                    </button>

                    <button
                        onClick={handleOpenModalForCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105"
                    >
                        <PlusCircle size={20} />
                        Cadastrar Novo
                    </button>
                </div>
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
                            <label htmlFor="funcao-filter" className="block text-sm font-medium text-gray-300 mb-1">Função</label>
                            <select id="funcao-filter" name="funcao" onChange={handleFilterChange} value={filters.funcao} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todas</option>
                                {Object.values(Funcao).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="departamento-filter" className="block text-sm font-medium text-gray-300 mb-1">Departamento</label>
                            <select id="departamento-filter" name="departamento" onChange={handleFilterChange} value={filters.departamento} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todos</option>
                                {Object.values(Departamento).map(d => <option key={d} value={d}>{d}</option>)}
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">1º Orixá</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">2º Orixá</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Função</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departamento</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data de Entrada</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                                {filteredFilhos.length > 0 ? filteredFilhos.map((filho) => (
                                    <tr key={filho.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{filho.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <span className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${statusColorMap[filho.situacao]}`}></span>
                                                {filho.situacao.charAt(0).toUpperCase() + filho.situacao.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.orixas.primeiro}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.orixas.segundo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.funcao}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{filho.departamento}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(filho.dataEntrada).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-4">
                                                <button onClick={() => handleGenerateEntidadesImage(filho)} className="text-sky-400 hover:text-sky-300" title="Gerar Imagem de Entidades">
                                                    <ImageIcon size={18}/>
                                                </button>
                                                <button onClick={() => handleOpenModalForEdit(filho)} className="text-indigo-400 hover:text-indigo-300" title="Editar">
                                                    <Edit size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(filho.id)} className="text-red-400 hover:text-red-300" title="Excluir">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
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
                />
            )}
        </div>
    );
};

export default Cadastro;
