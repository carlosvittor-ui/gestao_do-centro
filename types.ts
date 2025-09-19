export enum Situacao {
  Ativo = 'ativo',
  Afastado = 'afastado',
  Desligado = 'desligado',
}

export enum Funcao {
  PaiMaePequena = 'Pai ou Mãe Pequena',
  Oga = 'Ogãns',
  Curimba = 'curimba',
  CambonoChefe = 'Cambono Chefe',
  Ekedi = 'Ekedis',
  FilhaAxe = 'Filhas do Axé',
  Nenhum = 'Nenhum'
}

export enum Departamento {
  Recepcao = 'Recepção',
  Cantina = 'Cantina',
  Cozinha = 'Cozinha',
  Limpeza = 'limpeza',
  Nenhum = 'Nenhum'
}

export interface Filho {
  id: number;
  nome: string;
  situacao: Situacao;
  departamento: Departamento;
  dataEntrada: string;
  dataNascimento: string;
  orixas: {
    primeiro: string;
    segundo: string;
  };
  entidades: {
    exu: string;
    pomboGira: string;
    caboclo: string;
    baiano: string;
    marinheiro: string;
    cigano: string;
    pretoVelho: string;
    ere: string;
    boiadeiro: string;
    exuMirim: string;
  };
  pontoRiscadoUrl?: string;
  juremado: {
    e: boolean;
    data?: string;
  };
  ordemSuporte: {
    tem: boolean;
    data?: string;
  };
  ordemPasse: {
    tem: boolean;
    data?: string;
  };
  podeDarPasse: boolean;
  funcao: Funcao;
}

export type FilhoFormData = Omit<Filho, 'id'>;


export enum View {
  Cadastro = 'cadastro',
  Presenca = 'presenca',
  Organizacao = 'organizacao',
  Historico = 'historico',
}

export interface Presenca {
  [filhoId: number]: boolean;
}

export interface MediumCambonePairings {
  [mediumId: number]: number | null;
}

export interface DepartamentoAssignments {
  recepcao?: number | null;
  cantina?: number | null;
}

export interface Tab {
    id: View;
    label: string;
}

export interface GiraOrganizacaoSnapshot {
  mediumCambonePairings: MediumCambonePairings;
  departamentoAssignments: DepartamentoAssignments;
}

export interface GiraHistorico {
  id: string; // Unique ID, e.g., an ISO string from new Date()
  data: string;
  giraDoDia: string;
  presentes: number[]; // Array of Filho IDs
  ausentes: number[]; // Array of Filho IDs
  organizacao: GiraOrganizacaoSnapshot;
}