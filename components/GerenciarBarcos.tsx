import React, { useState, useMemo, useEffect } from 'react';
import type { Barco, PadrinhoSelection, Filho } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { PlusCircle, Trash2, Plus, Edit, X } from 'lucide-react';

interface GerenciarBarcosProps {
  barcos: Barco[];
  onAdd: (barcoData: Omit<Barco, 'id'>) => void;
  onUpdate: (barco: Barco) => void;
  onDelete: (id: number) => void;
  filhos: Filho[];
}

const GerenciarBarcos: React.FC<GerenciarBarcosProps> = ({ barcos, onAdd, onUpdate, onDelete, filhos }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBarco, setEditingBarco] = useState<Barco | null>(null);
  
  const [barcoName, setBarcoName] = useState('');
  const [barcoPadrinhos, setBarcoPadrinhos] = useState<PadrinhoSelection[]>([]);

  useEffect(() => {
    if (editingBarco) {
        setBarcoName(editingBarco.nome);
        setBarcoPadrinhos(editingBarco.padrinhos || []);
        setIsFormOpen(true);
    } else {
        setBarcoName('');
        setBarcoPadrinhos([]);
    }
  }, [editingBarco]);

  const possiveisPadrinhos = useMemo(() => {
    return filhos.flatMap(f =>
      (f.entidadesPadrinhos || []).map(entidadeKey => ({
        filhoId: f.id,
        entidadeKey: entidadeKey,
        // @ts-ignore
        displayText: `${f.entidades[entidadeKey] || entidadeKey} (${f.nome})`
      }))
    ).sort((a,b) => a.displayText.localeCompare(b.displayText));
  }, [filhos]);

  const handleOpenFormForCreate = () => {
    setEditingBarco(null);
    setIsFormOpen(true);
  };
  
  const handleOpenFormForEdit = (barco: Barco) => {
    setEditingBarco(barco);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBarco(null);
  };

  const handleAddPadrinho = () => {
    setBarcoPadrinhos(prev => [...prev, { filhoId: 0, entidadeKey: '' }]);
  };

  const handlePadrinhoChange = (index: number, value: string) => {
    if (!value) return;
    const [filhoId, entidadeKey] = value.split(':');
    const newPadrinhos = [...barcoPadrinhos];
    newPadrinhos[index] = { filhoId: parseInt(filhoId, 10), entidadeKey };
    setBarcoPadrinhos(newPadrinhos);
  };

  const handleRemovePadrinho = (index: number) => {
    setBarcoPadrinhos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcoName.trim()) {
      const barcoData = { 
        nome: barcoName.trim(), 
        padrinhos: barcoPadrinhos.filter(p=>p.filhoId) 
      };

      if (editingBarco) {
        onUpdate({ ...editingBarco, ...barcoData });
      } else {
        onAdd(barcoData);
      }
      handleCloseForm();
    }
  };

  const handleDelete = () => {
    if (editingBarco && window.confirm(`Tem certeza que deseja excluir o barco "${editingBarco.nome}"?`)) {
        onDelete(editingBarco.id);
        handleCloseForm();
    }
  };

  const getPadrinhoDisplayName = (padrinho: PadrinhoSelection) => {
    const medium = filhos.find(f => f.id === padrinho.filhoId);
    if (!medium) return 'Padrinho desconhecido';
    // @ts-ignore
    const entidadeNome = medium.entidades[padrinho.entidadeKey] || padrinho.entidadeKey;
    return `${entidadeNome} (${medium.nome})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100">Gerenciar Barco de Juremação</h2>
        {!isFormOpen && (
          <button onClick={handleOpenFormForCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"><PlusCircle size={20}/> Adicionar Barco</button>
        )}
      </div>

      {isFormOpen && (
        <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-200">{editingBarco ? 'Editar Barco' : 'Adicionar Novo Barco'}</h3>
                <button onClick={handleCloseForm} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="barco-name" className="text-sm font-medium text-gray-300">Nome do Barco</label>
                    <input
                      id="barco-name" type="text" value={barcoName}
                      onChange={(e) => setBarcoName(e.target.value)} placeholder="Nome do barco"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Padrinhos Espirituais</label>
                    <div className="space-y-2">
                        {barcoPadrinhos.map((padrinho, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <select value={`${padrinho.filhoId}:${padrinho.entidadeKey}`} onChange={(e) => handlePadrinhoChange(index, e.target.value)} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                                    <option value="0:">Selecione...</option>
                                    {possiveisPadrinhos.map(p => <option key={`${p.filhoId}-${p.entidadeKey}`} value={`${p.filhoId}:${p.entidadeKey}`}>{p.displayText}</option>)}
                                </select>
                                <button type="button" onClick={() => handleRemovePadrinho(index)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPadrinho} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"><Plus size={16}/> Adicionar Padrinho</button>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    {editingBarco && (
                        <button type="button" onClick={handleDelete} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2"><Trash2 size={16}/> Excluir Barco</button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCloseForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancelar</button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500" disabled={!barcoName.trim()}>
                        Salvar
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
        </Card>
      )}
      
      {!isFormOpen && (
        <Card>
            <CardHeader><h3 className="text-lg font-medium text-gray-200">Barcos Cadastrados</h3></CardHeader>
            <CardContent>
                {barcos.length > 0 ? (
                    <ul className="space-y-3">
                        {barcos.map(barco => (
                            <li key={barco.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-100 text-lg">{barco.nome}</p>
                                        {(barco.padrinhos && barco.padrinhos.length > 0) && (
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-400 mb-1">Padrinhos:</p>
                                                <ul className="list-disc list-inside text-sm text-gray-300">
                                                    {barco.padrinhos.map((p, index) => ( <li key={index}>{getPadrinhoDisplayName(p)}</li> ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleOpenFormForEdit(barco)} className="text-indigo-400 hover:text-indigo-300 p-1" title={`Editar barco ${barco.nome}`}><Edit size={18}/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : ( <p className="text-center text-gray-500 py-4">Nenhum barco cadastrado.</p> )}
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GerenciarBarcos;