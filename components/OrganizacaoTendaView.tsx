import React, { useState } from 'react';
import type { Filho, FilhoFormData, Barco, GiraExternaParticipacao, GiraExternaCarros, GiraExternaSalva, FestaHomenagemEvento } from '../types';
import Cadastro from './Cadastro';
import GerenciarBarcos from './GerenciarBarcos';
import GerenciarPadrinhos from './GerenciarPadrinhos';
import GiraExternaView from './GiraExternaView';
import FestaHomenagemView from './FestaHomenagemView';

interface OrganizacaoTendaViewProps {
  filhos: Filho[];
  filhosAtivos: Filho[];
  onAddFilho: (filho: FilhoFormData) => void;
  onUpdateFilho: (filho: Filho) => void;
  onDeleteFilho: (id: number) => void;
  barcos: Barco[];
  onAddBarco: (barcoData: Omit<Barco, 'id'>) => void;
  onUpdateBarco: (barco: Barco) => void;
  onDeleteBarco: (id: number) => void;
  
  // Gira Externa Props
  giraExternaNome: string;
  setGiraExternaNome: React.Dispatch<React.SetStateAction<string>>;
  giraExternaData: string;
  setGiraExternaData: React.Dispatch<React.SetStateAction<string>>;
  participacaoGiraExterna: GiraExternaParticipacao;
  setParticipacaoGiraExterna: React.Dispatch<React.SetStateAction<GiraExternaParticipacao>>;
  carrosGiraExterna: GiraExternaCarros;
  setCarrosGiraExterna: React.Dispatch<React.SetStateAction<GiraExternaCarros>>;
  girasExternasSalvas: GiraExternaSalva[];
  editingGiraExternaId: number | null;
  onSaveGiraExterna: () => void;
  onLoadGiraExterna: (id: number) => void;
  onDeleteGiraExterna: (id: number) => void;
  onNewGiraExterna: () => void;

  // Festa/Homenagem Props
  festas: FestaHomenagemEvento[];
  onSaveFesta: (festa: FestaHomenagemEvento) => void;
  onDeleteFesta: (id: number) => void;
}

type SubView = 'membros' | 'barcos' | 'padrinhos' | 'giraExterna' | 'festaHomenagem';

const OrganizacaoTendaView: React.FC<OrganizacaoTendaViewProps> = (props) => {
  const [subView, setSubView] = useState<SubView>('membros');
  
  const tabs: {id: SubView, label: string}[] = [
      { id: 'membros', label: 'Membros' },
      { id: 'barcos', label: 'Barco de Juremação' },
      { id: 'padrinhos', label: 'Padrinhos Espirituais' },
      { id: 'giraExterna', label: 'Gira Externa' },
      { id: 'festaHomenagem', label: 'Festa/Homenagem' },
  ]

  const renderSubView = () => {
    switch (subView) {
      case 'membros':
        return <Cadastro 
            filhos={props.filhos}
            onAdd={props.onAddFilho}
            onUpdate={props.onUpdateFilho}
            onDelete={props.onDeleteFilho}
            barcos={props.barcos}
        />;
      case 'barcos':
        return <GerenciarBarcos 
            barcos={props.barcos}
            onAdd={props.onAddBarco}
            onUpdate={props.onUpdateBarco}
            onDelete={props.onDeleteBarco}
            filhos={props.filhos}
        />;
       case 'padrinhos':
        return <GerenciarPadrinhos
            filhos={props.filhos}
            onUpdateFilho={props.onUpdateFilho}
        />;
      case 'giraExterna':
        return <GiraExternaView
            filhos={props.filhosAtivos}
            giraExternaNome={props.giraExternaNome}
            setGiraExternaNome={props.setGiraExternaNome}
            giraExternaData={props.giraExternaData}
            setGiraExternaData={props.setGiraExternaData}
            participacao={props.participacaoGiraExterna}
            setParticipacao={props.setParticipacaoGiraExterna}
            carros={props.carrosGiraExterna}
            setCarros={props.setCarrosGiraExterna}
            eventosSalvos={props.girasExternasSalvas}
            editingId={props.editingGiraExternaId}
            onSave={props.onSaveGiraExterna}
            onLoad={props.onLoadGiraExterna}
            onDelete={props.onDeleteGiraExterna}
            onNew={props.onNewGiraExterna}
        />;
      case 'festaHomenagem':
        return <FestaHomenagemView 
            filhos={props.filhosAtivos}
            festasSalvas={props.festas}
            onSaveFesta={props.onSaveFesta}
            onDeleteFesta={props.onDeleteFesta}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
        <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                 {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSubView(tab.id)}
                        className={`${
                            subView === tab.id
                            ? 'border-indigo-500 text-indigo-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                 ))}
            </nav>
        </div>
        <div>
            {renderSubView()}
        </div>
    </div>
  );
};

export default OrganizacaoTendaView;