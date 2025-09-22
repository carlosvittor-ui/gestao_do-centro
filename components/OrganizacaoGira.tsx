import React, { useMemo } from 'react';
import type { Filho, MediumCambonePairings, DepartamentoAssignments } from '../types';
import { Funcao, Departamento } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Save, Image as ImageIcon } from 'lucide-react';

// Define html2canvas no escopo global para o TypeScript
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
        return filhosPresentes.filter(f => f.podeDarPasse).sort((a,b) => {
            if (a.nome === 'Pai Marcos') return -1;
            if (b.nome === 'Pai Marcos') return 1;
            return a.nome.localeCompare(b.nome);
        });
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

    const handlePairingChange = (mediumId: number, cambonoIdStr: string) => {
        const cambonoId = cambonoIdStr ? parseInt(cambonoIdStr, 10) : null;
        
        setMediumCambonePairings(prevPairings => {
            const newPairings = { ...prevPairings };
            
            // If a cambono was selected, ensure they are unassigned from any other medium.
            if (cambonoId !== null) {
                for (const mId in newPairings) {
                    if (newPairings[mId] === cambonoId) {
                        newPairings[mId] = null;
                    }
                }
            }

            // Assign the new cambono (or null) to the current medium
            newPairings[mediumId] = cambonoId;
            
            return newPairings;
        });
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

    const handleGenerateImage = () => {
        // Find original elements to clone
        const mediumsCard = document.getElementById('card-mediums');
        const correnteCard = document.getElementById('card-corrente');
        const funcoesCard = document.getElementById('card-funcoes');

        if (!mediumsCard || !correnteCard || !funcoesCard || !window.html2canvas) {
            alert('Erro: Não foi possível encontrar os elementos necessários para gerar a imagem.');
            return;
        }

        // Create an off-screen container for rendering the image
        const container = document.createElement('div');
        container.id = 'image-generator-container';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '1200px';
        container.style.padding = '1.5rem';
        container.style.backgroundColor = '#111827';
        container.style.fontFamily = "'Inter', sans-serif";
        container.style.color = '#e5e7eb';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1.5rem';

        // Create a dynamic header FOR THE IMAGE ONLY
        const imageHeader = document.createElement('div');
        imageHeader.className = 'p-4 bg-gray-800/50 rounded-lg'; // Mimic Card style
        imageHeader.innerHTML = `
            <div>
                <h2 class="text-xl font-semibold text-gray-100">Organização da Gira: <span class="text-indigo-400">${giraDoDia || 'Não definida'}</span></h2>
                <p class="text-sm text-gray-400">${dataDeHoje} - ${filhosPresentes.length} presentes</p>
            </div>
        `;

        const replaceSelectsInClone = (originalElement: HTMLElement, clone: HTMLElement) => {
            const originalSelects = originalElement.querySelectorAll('select');
            const clonedSelects = clone.querySelectorAll('select');

            if (originalSelects.length !== clonedSelects.length) {
                console.error("Mismatch between original and cloned select elements.");
                return;
            }

            clonedSelects.forEach((clonedSelect, index) => {
                const originalSelect = originalSelects[index];
                const selectedOption = originalSelect.options[originalSelect.selectedIndex];
                const text = selectedOption && selectedOption.value ? selectedOption.text : 'Não selecionado';
                
                // Use a DIV for better block-level styling and flexbox alignment
                const replacement = document.createElement('div');
                replacement.textContent = text;
                
                // Copy original classes for styling (padding, bg, etc.), remove focus rings, and add flex for alignment.
                // This ensures the replacement visually matches the select element's box.
                replacement.className = clonedSelect.className.replace('focus:outline-none focus:ring-indigo-500 focus:border-indigo-500', '') + ' flex items-center';

                if (clonedSelect.parentElement) {
                    clonedSelect.parentElement.replaceChild(replacement, clonedSelect);
                }
            });
        };
        
        // Clone elements
        const mediumsClone = mediumsCard.cloneNode(true) as HTMLElement;
        const correnteClone = correnteCard.cloneNode(true) as HTMLElement;
        const funcoesClone = funcoesCard.cloneNode(true) as HTMLElement;
        
        // Replace selects by reading from original elements
        replaceSelectsInClone(mediumsCard, mediumsClone);
        replaceSelectsInClone(correnteCard, correnteClone);
        replaceSelectsInClone(funcoesCard, funcoesClone);
        
        // Create the layout structure
        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.gap = '1.5rem';
        topRow.style.alignItems = 'flex-start';

        const leftCol = document.createElement('div');
        leftCol.style.flex = '0 0 35%';
        leftCol.appendChild(mediumsClone);

        const rightCol = document.createElement('div');
        rightCol.style.flex = '1';
        rightCol.appendChild(correnteClone);

        topRow.appendChild(leftCol);
        topRow.appendChild(rightCol);

        // Append everything to the main container
        container.appendChild(imageHeader);
        container.appendChild(topRow);
        container.appendChild(funcoesClone);

        document.body.appendChild(container);

        window.html2canvas(container, {
            backgroundColor: '#111827',
            scale: 2,
        }).then((canvas: HTMLCanvasElement) => {
            const link = document.createElement('a');
            const fileName = `organizacao_${giraDoDia.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'gira'}_${new Date().toISOString().split('T')[0]}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch((err: any) => {
            console.error("Erro ao gerar imagem:", err);
            alert("Ocorreu um erro ao gerar a imagem.");
        }).finally(() => {
            if (container.parentElement) {
                document.body.removeChild(container);
            }
        });
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
    
    return (
        <div className="space-y-6">
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

            <div className="flex flex-col lg:flex-row gap-6" id="gira-organization-layout">
                <div className="lg:w-[35%] w-full flex flex-col gap-6">
                    <Card className="flex-1" id="card-mediums">
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
                    <Card id="card-corrente">
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-200">Membros da Corrente</h3>
                        </CardHeader>
                        <CardContent>
                            {filhosNaoAlocados.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {filhosNaoAlocados.map(filho => (
                                        <div key={filho.id} className="bg-gray-700/50 p-3 rounded-md text-center text-sm">
                                            {filho.nome}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Todos os membros presentes foram alocados.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card id="card-funcoes">
                        <CardHeader>
                            <h3 className="text-lg font-medium text-gray-200">Funções e Departamentos</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-indigo-400 mb-2">Funções</h4>
                                    <div className="text-sm space-y-2">
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
                </div>
            </div>
        </div>
    );
};

export default OrganizacaoGira;