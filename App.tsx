
import React, { useState, useMemo, useEffect } from 'react';
import { Tab, View } from './types';
import type { Filho, Presenca, MediumCambonePairings, DepartamentoAssignments, FilhoFormData, GiraHistorico, GiraExternaState } from './types';
import Cadastro from './components/Cadastro';
import PresencaView from './components/PresencaView';
import OrganizacaoGira from './components/OrganizacaoGira';
import HistoricoView from './components/HistoricoView';
import GiraExternaView from './components/GiraExternaView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { mockFilhos } from './data/mock';
import { Menu, X } from 'lucide-react';

const initialGiraExternaState: GiraExternaState = {
    nome: '',
    data: new Date().toISOString().split('T')[0],
    participantes: {},
    carros: {},
};

const App: React.FC = () => {
  const [filhos, setFilhos] = useState<Filho[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.Presenca);
  const [giraDoDia, setGiraDoDia] = useState<string>('');
  const [presenca, setPresenca] = useState<Presenca>({});
  
  const [mediumCambonePairings, setMediumCambonePairings] = useState<MediumCambonePairings>({});
  const [departamentoAssignments, setDepartamentoAssignments] = useState<DepartamentoAssignments>({});
  
  const [historicoGiras, setHistoricoGiras] = useState<GiraHistorico[]>([]);
  const [giraExternaState, setGiraExternaState] = useState<GiraExternaState>(initialGiraExternaState);
  
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load data from Local Storage on initial render
  useEffect(() => {
    try {
      const storedFilhos = localStorage.getItem('gestaoTerreiro_filhos');
      if (storedFilhos) {
        setFilhos(JSON.parse(storedFilhos));
      } else {
        setFilhos(mockFilhos);
      }

      const storedHistorico = localStorage.getItem('gestaoTerreiro_historico');
      if (storedHistorico) {
        setHistoricoGiras(JSON.parse(storedHistorico));
      }
    } catch (error) {
      console.error('Failed to load data from local storage, falling back to mocks.', error);
      setFilhos(mockFilhos);
      setHistoricoGiras([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Save filhos to Local Storage whenever they change
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('gestaoTerreiro_filhos', JSON.stringify(filhos));
    }
  }, [filhos, isInitialLoad]);

  // Save historico to Local Storage whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('gestaoTerreiro_historico', JSON.stringify(historicoGiras));
    }
  }, [historicoGiras, isInitialLoad]);


  const dataDeHoje = new Date().toLocaleDateString('pt-BR');

  const filhosAtivos = useMemo(() => filhos.filter(f => f.situacao === 'ativo'), [filhos]);
  
  const filhosPresentes = useMemo(() => {
    return filhosAtivos.filter(f => presenca[f.id]);
  }, [filhosAtivos, presenca]);

  const resetAssignments = () => {
    setMediumCambonePairings({});
    setDepartamentoAssignments({});
  };
  
  const resetDailyState = () => {
    setGiraDoDia('');
    setPresenca({});
    resetAssignments();
  }

  const handleSetPresenca = (newPresenca: Presenca) => {
    setPresenca(newPresenca);
    resetAssignments();
  }

  const handleFinalizarGira = () => {
    if (!giraDoDia || filhosPresentes.length === 0) {
      alert("É necessário definir o nome da gira e ter ao menos um membro presente para salvar.");
      return;
    }
  
    try {
      // Prepare organization snapshot
      // FIX: Corrected typo from 'podeDarPссе' to 'podeDarPasse'.
      const mediumsPresentesNaGira = filhosPresentes.filter(f => f.podeDarPasse);
      const completePairings: MediumCambonePairings = {};
      mediumsPresentesNaGira.forEach(medium => {
        completePairings[medium.id] = mediumCambonePairings[medium.id] || null;
      });
      const organizacaoSnapshot = {
        mediumCambonePairings: completePairings,
        departamentoAssignments: { ...departamentoAssignments }
      };

      // Create historical record
      const presentesIds = filhosPresentes.map(f => f.id);
      const ausentesIds = filhosAtivos.filter(f => !presenca[f.id]).map(f => f.id);

      const newHistoricoEntry: GiraHistorico = {
        id: new Date().toISOString(), // Unique ID
        data: new Date().toISOString(),
        giraDoDia: giraDoDia,
        presentes: presentesIds,
        ausentes: ausentesIds,
        organizacao: organizacaoSnapshot
      };
      
      setHistoricoGiras(prev => [newHistoricoEntry, ...prev]);

      resetDailyState();
      setCurrentView(View.Presenca);
      alert('Gira finalizada e salva no histórico com sucesso!');
  
    } catch (error: any) {
      console.error("Error finalizing gira:", error);
      alert(`Ocorreu um erro ao finalizar a gira: ${error.message}`);
    }
  };

  const handleAddFilho = (newFilhoData: FilhoFormData) => {
    setFilhos(prev => {
        const newId = prev.length > 0 ? Math.max(...prev.map(f => f.id)) + 1 : 1;
        const newFilho: Filho = { id: newId, ...newFilhoData };
        return [...prev, newFilho].sort((a, b) => a.id - b.id);
    });
    alert('Filho cadastrado com sucesso!');
  };

  const handleAddMultipleFilhos = (newFilhosData: FilhoFormData[]) => {
      setFilhos(prev => {
          let lastId = prev.length > 0 ? Math.max(...prev.map(f => f.id)) : 0;
          const newFilhos: Filho[] = newFilhosData.map(data => {
              lastId++;
              return { id: lastId, ...data };
          });
          return [...prev, ...newFilhos].sort((a, b) => a.id - b.id);
      });
      if (newFilhosData.length > 0) {
        alert(`${newFilhosData.length} filho(s) cadastrado(s) com sucesso!`);
      }
  };

  const handleUpdateFilho = (updatedFilho: Filho) => {
    setFilhos(prev => prev.map(f => (f.id === updatedFilho.id ? updatedFilho : f)));
    alert('Filho atualizado com sucesso!');
  };

  const handleDeleteFilho = (filhoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.')) {
        setFilhos(prev => prev.filter(f => f.id !== filhoId));
        alert('Filho excluído com sucesso!');
    }
  };

  const renderView = () => {
    if (loading) {
      return <div className="text-center py-12 text-lg text-gray-400">Carregando dados...</div>
    }
    switch (currentView) {
      case View.Cadastro:
        return <Cadastro 
            filhos={filhos}
            onAdd={handleAddFilho}
            onAddMultiple={handleAddMultipleFilhos}
            onUpdate={handleUpdateFilho}
            onDelete={handleDeleteFilho}
        />;
      case View.Presenca:
        return (
          <PresencaView
            filhosAtivos={filhosAtivos}
            presenca={presenca}
            setPresenca={handleSetPresenca}
            giraDoDia={giraDoDia}
            setGiraDoDia={setGiraDoDia}
            dataDeHoje={dataDeHoje}
          />
        );
      case View.Organizacao:
        return (
          <OrganizacaoGira
            filhos={filhos}
            filhosPresentes={filhosPresentes}
            giraDoDia={giraDoDia}
            dataDeHoje={dataDeHoje}
            mediumCambonePairings={mediumCambonePairings}
            setMediumCambonePairings={setMediumCambonePairings}
            departamentoAssignments={departamentoAssignments}
            setDepartamentoAssignments={setDepartamentoAssignments}
            onFinalizarGira={handleFinalizarGira}
          />
        );
      case View.Historico:
        return <HistoricoView historico={historicoGiras} filhos={filhos} />;
      case View.GiraExterna:
        return <GiraExternaView 
            filhosAtivos={filhosAtivos}
            giraExternaState={giraExternaState}
            setGiraExternaState={setGiraExternaState}
        />;
      default:
        return null;
    }
  };
  
  const tabs: Tab[] = [
      { id: View.Presenca, label: 'Controle de Presença' },
      { id: View.Organizacao, label: 'Organização da Gira' },
      { id: View.GiraExterna, label: 'Gira Externa' },
      { id: View.Cadastro, label: 'Cadastro de Membros' },
      { id: View.Historico, label: 'Histórico de Giras' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <nav className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="md:hidden">
                    <span className="text-white font-medium">
                        {tabs.find(t => t.id === currentView)?.label || 'Menu'}
                    </span>
                </div>

                <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
                    <div className="flex items-baseline space-x-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentView(tab.id)}
                                className={`${
                                    currentView === tab.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Abrir menu principal</span>
                        {isMobileMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setCurrentView(tab.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${
                                currentView === tab.id
                                    ? 'bg-indigo-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                            aria-current={currentView === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </nav>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div key={currentView} className="fade-in">
            {renderView()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
