import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Situacao, Funcao, Departamento, Filho, FilhoFormData } from '../types';

interface FilhoFormModalProps {
    filho: Filho | null;
    onSave: (filhoData: FilhoFormData | Filho) => void;
    onClose: () => void;
}

const defaultFormData: FilhoFormData = {
    nome: '',
    situacao: Situacao.Ativo,
    departamento: Departamento.Nenhum,
    dataEntrada: new Date().toISOString().split('T')[0],
    dataNascimento: '',
    orixas: { primeiro: '', segundo: '' },
    entidades: { exu: '', pomboGira: '', caboclo: '', baiano: '', marinheiro: '', cigano: '', pretoVelho: '', ere: '', boiadeiro: '', exuMirim: '' },
    pontoRiscadoUrl: '',
    juremado: { e: false, data: '' },
    ordemSuporte: { tem: false, data: '' },
    ordemPasse: { tem: false, data: '' },
    podeDarPasse: false,
    funcao: Funcao.Nenhum,
};

const FilhoFormModal: React.FC<FilhoFormModalProps> = ({ filho, onSave, onClose }) => {
    const [formData, setFormData] = useState<FilhoFormData | Filho>(defaultFormData);

    useEffect(() => {
        setFormData(filho ? { ...filho } : { ...defaultFormData });
    }, [filho]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isChecked = e.target.checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? isChecked : value }));
    };
    
    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'juremado' | 'ordemSuporte' | 'ordemPasse') => {
        const { name, value, type, checked } = e.target;
        const key = name.split('.')[1];

        setFormData(prev => ({
            ...prev,
            [category]: {
                // @ts-ignore
                ...prev[category],
                [key]: type === 'checkbox' ? checked : value
            }
        }));
    };
    
    const handleOrixaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            orixas: {
                ...prev.orixas,
                [name]: value
            }
        }));
    };


    const handleEntidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            entidades: {
                ...prev.entidades,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderInput = (label: string, name: string, type: string = 'text', required: boolean = false) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input 
                type={type} 
                name={name} 
                id={name} 
                value={(formData as any)[name] || ''} 
                onChange={handleChange} 
                required={required}
                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
    );
    
    const renderSelect = (label: string, name: string, options: object) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <select
                name={name}
                id={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                ))}
            </select>
        </div>
    );

    const renderConditionalDate = (label: string, category: 'juremado' | 'ordemSuporte' | 'ordemPasse') => {
        const booleanKey = category === 'juremado' ? 'e' : 'tem';
        const isChecked = (formData as any)[category]?.[booleanKey] || false;

        return (
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name={`${category}.${booleanKey}`}
                        checked={isChecked}
                        onChange={(e) => handleNestedChange(e, category)}
                        className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                </label>
                {isChecked && (
                    <input
                        type="date"
                        name={`${category}.data`}
                        value={(formData as any)[category].data || ''}
                        onChange={(e) => handleNestedChange(e, category)}
                        className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop" onClick={onClose}>
            <div className="w-full max-w-4xl modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <Card className="max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-indigo-400">{filho ? `Editar ${filho.nome}` : 'Cadastrar Novo Filho'}</h3>
                                <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Bloco 1: Informações Pessoais e do Terreiro */}
                            <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {renderInput('Nome Completo', 'nome', 'text', true)}
                                {renderInput('Data de Nascimento', 'dataNascimento', 'date', true)}
                                {renderInput('Data de Entrada', 'dataEntrada', 'date', true)}
                                {renderSelect('Situação', 'situacao', Situacao)}
                                {renderSelect('Função', 'funcao', Funcao)}
                                {renderSelect('Departamento', 'departamento', Departamento)}
                            </fieldset>
                            
                            {/* Bloco 2: Orixás */}
                            <fieldset className="p-4 border border-gray-700 rounded-md">
                                <legend className="text-md font-semibold text-gray-300 px-2">Orixás</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label htmlFor="primeiroOrixa" className="block text-sm font-medium text-gray-300 mb-1">1º Orixá</label>
                                        <input 
                                            type="text"
                                            name="primeiro"
                                            id="primeiroOrixa"
                                            value={formData.orixas.primeiro || ''}
                                            onChange={handleOrixaChange}
                                            className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="segundoOrixa" className="block text-sm font-medium text-gray-300 mb-1">2º Orixá</label>
                                        <input 
                                            type="text"
                                            name="segundo"
                                            id="segundoOrixa"
                                            value={formData.orixas.segundo || ''}
                                            onChange={handleOrixaChange}
                                            className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Bloco 3: Ordens e Consagrações */}
                            <fieldset className="p-4 border border-gray-700 rounded-md">
                                <legend className="text-md font-semibold text-gray-300 px-2">Ordens e Consagrações</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                                    {renderConditionalDate('É Juremado?', 'juremado')}
                                    {renderConditionalDate('Tem Ordem de Suporte?', 'ordemSuporte')}
                                    {renderConditionalDate('Tem Ordem de Passe?', 'ordemPasse')}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="podeDarPasse"
                                            checked={formData.podeDarPasse || false}
                                            onChange={handleChange}
                                            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600"
                                        />
                                        <span className="text-sm font-medium text-gray-300">Pode dar passe?</span>
                                    </label>
                                </div>
                            </fieldset>
                            
                             {/* Bloco 4: Entidades */}
                            <fieldset className="p-4 border border-gray-700 rounded-md">
                                <legend className="text-md font-semibold text-gray-300 px-2">Entidades</legend>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                    {Object.keys(formData.entidades).map(key => (
                                        <div key={key}>
                                            <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                            <input 
                                                type="text"
                                                name={key}
                                                id={key}
                                                value={(formData.entidades as any)[key] || ''}
                                                onChange={handleEntidadeChange}
                                                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </fieldset>

                             {/* Bloco 5: Ponto Riscado */}
                             <fieldset>
                                {renderInput('URL da Imagem do Ponto Riscado', 'pontoRiscadoUrl')}
                             </fieldset>

                        </CardContent>
                        <div className="p-4 border-t border-gray-700 flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancelar</button>
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Salvar</button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default FilhoFormModal;