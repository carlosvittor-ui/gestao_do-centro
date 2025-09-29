import React, { useState, useMemo } from 'react';
import { Tab, View } from './types';
import type { Filho, Presenca, MediumCambonePairings, DepartamentoAssignments, FilhoFormData, GiraHistorico, Barco, GiraExternaParticipacao, GiraExternaCarros, GiraExternaSalva, FestaHomenagemEvento } from './types';
import OrganizacaoTendaView from './components/OrganizacaoTendaView';
import PresencaView from './components/PresencaView';
import OrganizacaoGira from './components/OrganizacaoGira';
import HistoricoView from './components/HistoricoView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [filhos, setFilhos] = useState<Filho[]>([]);
  const [barcos, setBarcos] = useState<Barco[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.Presenca);
  const [giraDoDia, setGiraDoDia] = useState<string>('');
  const [presenca, setPresenca] = useState<Presenca>({});
  
  const [mediumCambonePairings, setMediumCambonePairings] = useState<MediumCambonePairings>({});
  const [departamentoAssignments, setDepartamentoAssignments] = useState<DepartamentoAssignments>({});
  
  const [historicoGiras, setHistoricoGiras] = useState<GiraHistorico[]>([]);

  // State for Gira Externa
  const [giraExternaNome, setGiraExternaNome] = useState<string>('');
  const [giraExternaData, setGiraExternaData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [participacaoGiraExterna, setParticipacaoGiraExterna] = useState<GiraExternaParticipacao>({});
  const [carrosGiraExterna, setCarrosGiraExterna] = useState<GiraExternaCarros>({});
  const [girasExternasSalvas, setGirasExternasSalvas] = useState<GiraExternaSalva[]>([]);
  const [editingGiraExternaId, setEditingGiraExternaId] = useState<number | null>(null);

  // State for Festa/Homenagem
  const [festas, setFestas] = useState<FestaHomenagemEvento[]>([]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const dataDeHoje = new Date().toLocaleDateString('pt-BR');

  const filhosAtivos = useMemo(() => filhos.filter(f => f.situacao === 'ativo'), [filhos]);
  
  const filhosPresentes = useMemo(() => {
    return filhosAtivos.filter(f => presenca[f.id] === 'presente');
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
  
    const presentesIds = filhosAtivos
      .filter(f => presenca[f.id] === 'presente')
      .map(f => f.id);
    const ausentesIds = filhosAtivos
      .filter(f => presenca[f.id] === 'ausente')
      .map(f => f.id);

    const mediumsPresentesNaGira = filhosPresentes.filter(f => f.podeDarPasse);
    const completePairings: MediumCambonePairings = {};
    mediumsPresentesNaGira.forEach(medium => {
      completePairings[medium.id] = mediumCambonePairings[medium.id] || null;
    });

    const newHistoricoEntry: GiraHistorico = {
      id: Date.now(),
      gira_id: Date.now() + 1,
      data: new Date().toISOString(),
      giraDoDia: giraDoDia,
      presentes: presentesIds,
      ausentes: ausentesIds,
      organizacao: {
        mediumCambonePairings: completePairings,
        departamentoAssignments: { ...departamentoAssignments }
      }
    };

    setHistoricoGiras(prev => [newHistoricoEntry, ...prev]);
    
    resetDailyState();
    setCurrentView(View.Presenca);
    alert('Gira finalizada e salva no histórico com sucesso!');
  };

  const handleAddFilho = (newFilhoData: FilhoFormData) => {
    const newId = Math.max(...filhos.map(f => f.id), 0) + 1;
    const newFilho: Filho = { id: newId, ...newFilhoData };
    setFilhos(prev => [...prev, newFilho].sort((a, b) => a.id - b.id));
    alert('Filho cadastrado com sucesso!');
  };

  const handleUpdateFilho = (updatedFilho: Filho) => {
    setFilhos(prev => prev.map(f => f.id === updatedFilho.id ? updatedFilho : f));
    alert('Filho atualizado com sucesso!');
  };

  const handleDeleteFilho = (filhoId: number) => {
    if (window.confirm('Tem certeza?')) {
      setFilhos(prev => prev.filter(f => f.id !== filhoId));
      alert('Filho excluído com sucesso!');
    }
  };
  
  const handleAddBarco = (newBarcoData: Omit<Barco, 'id'>) => {
    const newBarco: Barco = {
      id: Math.max(...barcos.map(b => b.id), 0) + 1,
      ...newBarcoData,
    };
    setBarcos(prev => [...prev, newBarco]);
    alert('Barco cadastrado com sucesso!');
  };

  const handleUpdateBarco = (updatedBarco: Barco) => {
    setBarcos(prev => prev.map(b => b.id === updatedBarco.id ? updatedBarco : b));
    alert('Barco atualizado com sucesso!');
  };

  const handleDeleteBarco = (id: number) => {
      setFilhos(prev => 
        prev.map(f => {
          if (f.juremado?.barcoId === id) {
            const { barcoId, ...restJuremado } = f.juremado;
            return { ...f, juremado: restJuremado };
          }
          return f;
        })
      );
      setBarcos(prev => prev.filter(b => b.id !== id));
      alert('Barco excluído com sucesso!');
  };

  // Gira Externa handlers
  const resetGiraExternaForm = () => {
    setGiraExternaNome('');
    setGiraExternaData(new Date().toISOString().split('T')[0]);
    setParticipacaoGiraExterna({});
    setCarrosGiraExterna({});
    setEditingGiraExternaId(null);
  };

  const handleSaveGiraExterna = () => {
    const evento: Omit<GiraExternaSalva, 'id'> = {
        nome: giraExternaNome,
        data: giraExternaData,
        participacao: participacaoGiraExterna,
        carros: carrosGiraExterna
    };

    if (editingGiraExternaId) {
        setGirasExternasSalvas(prev => prev.map(g => g.id === editingGiraExternaId ? { ...g, ...evento } : g));
        alert('Gira externa atualizada com sucesso!');
    } else {
        const newId = Math.max(...girasExternasSalvas.map(g => g.id), 0) + 1;
        setGirasExternasSalvas(prev => [{ id: newId, ...evento }, ...prev]);
        alert('Gira externa salva com sucesso!');
    }
    resetGiraExternaForm();
  };

  const handleLoadGiraExterna = (id: number) => {
    const evento = girasExternasSalvas.find(g => g.id === id);
    if (evento) {
        setEditingGiraExternaId(evento.id);
        setGiraExternaNome(evento.nome);
        setGiraExternaData(evento.data);
        setParticipacaoGiraExterna(evento.participacao);
        setCarrosGiraExterna(evento.carros);
    }
  };

  const handleDeleteGiraExterna = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta organização de gira externa?')) {
        setGirasExternasSalvas(prev => prev.filter(g => g.id !== id));
        if (editingGiraExternaId === id) {
            resetGiraExternaForm();
        }
        alert('Organização de gira externa excluída!');
    }
  };
  
  // Festa/Homenagem Handlers
  const handleSaveFesta = (festa: FestaHomenagemEvento) => {
    if (festa.id) {
        setFestas(prev => prev.map(f => f.id === festa.id ? festa : f));
        alert('Festa/Homenagem atualizada!');
    } else {
        const newId = Math.max(...festas.map(f => f.id), 0) + 1;
        setFestas(prev => [{ ...festa, id: newId }, ...prev]);
        alert('Festa/Homenagem salva!');
    }
  };
  
  const handleDeleteFesta = (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir este evento?')) {
          setFestas(prev => prev.filter(f => f.id !== id));
          alert('Evento excluído!');
      }
  };


  const renderView = () => {
    switch (currentView) {
      case View.Cadastro:
        return <OrganizacaoTendaView
            filhos={filhos}
            filhosAtivos={filhosAtivos}
            onAddFilho={handleAddFilho}
            onUpdateFilho={handleUpdateFilho}
            onDeleteFilho={handleDeleteFilho}
            barcos={barcos}
            onAddBarco={handleAddBarco}
            onUpdateBarco={handleUpdateBarco}
            onDeleteBarco={handleDeleteBarco}
            
            // Gira Externa Props
            giraExternaNome={giraExternaNome}
            setGiraExternaNome={setGiraExternaNome}
            giraExternaData={giraExternaData}
            setGiraExternaData={setGiraExternaData}
            participacaoGiraExterna={participacaoGiraExterna}
            setParticipacaoGiraExterna={setParticipacaoGiraExterna}
            carrosGiraExterna={carrosGiraExterna}
            setCarrosGiraExterna={setCarrosGiraExterna}
            girasExternasSalvas={girasExternasSalvas}
            editingGiraExternaId={editingGiraExternaId}
            onSaveGiraExterna={handleSaveGiraExterna}
            onLoadGiraExterna={handleLoadGiraExterna}
            onDeleteGiraExterna={handleDeleteGiraExterna}
            onNewGiraExterna={resetGiraExternaForm}

            // Festa/Homenagem Props
            festas={festas}
            onSaveFesta={handleSaveFesta}
            onDeleteFesta={handleDeleteFesta}
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
      default:
        return null;
    }
  };
  
  const tabs: Tab[] = [
      { id: View.Presenca, label: 'Controle de Presença' },
      { id: View.Organizacao, label: 'Organização da Gira' },
      { id: View.Cadastro, label: 'Organização Tenda' },
      { id: View.Historico, label: 'Histórico de Giras' },
  ];

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <nav className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center h-16">
            
            {/* Mobile menu button*/}
            <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="flex-1 flex items-center justify-center">
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleNavClick(tab.id)}
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
            </div>

          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`${
                    currentView === tab.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
