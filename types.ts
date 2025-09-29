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

export interface PadrinhoSelection {
  filhoId: number;
  entidadeKey: string;
}

export interface JuremaInfo {
  e: boolean;
  data?: string;
  barcoId?: number;
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
  juremado: JuremaInfo;
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
  entidadesPadrinhos?: string[]; // array of keys from `entidades`
}

export type FilhoFormData = Omit<Filho, 'id'>;


export enum View {
  Cadastro = 'cadastro',
  Presenca = 'presenca',
  Organizacao = 'organizacao',
  Historico = 'historico',
}

export type PresencaStatus = 'presente' | 'ausente';

export interface Presenca {
  [filhoId: number]: PresencaStatus;
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
  id: number;
  gira_id: number;
  data: string;
  giraDoDia: string;
  presentes: number[];
  ausentes: number[];
  organizacao: GiraOrganizacaoSnapshot;
}

export interface Barco {
  id: number;
  nome: string;
  padrinhos?: PadrinhoSelection[];
}

// Tipos para Gira Externa
export type GiraExternaTransporte = 'motorista' | 'carona' | 'independente';

export interface GiraExternaParticipante {
    participa: boolean;
    transporte?: GiraExternaTransporte;
}

export interface GiraExternaParticipacao {
    [filhoId: number]: GiraExternaParticipante;
}

export interface GiraExternaCarros {
    [motoristaId: number]: (number | null)[]; // Array of 4 passenger IDs
}

export interface GiraExternaSalva {
    id: number;
    nome: string;
    data: string;
    participacao: GiraExternaParticipacao;
    carros: GiraExternaCarros;
}

// Tipos para Festa/Homenagem
export interface FestaPagamento {
    pago: boolean;
    valor?: number;
}

export interface FestaHomenagemEvento {
    id: number;
    nome: string;
    data: string;
    pagamentos: {
        [filhoId: number]: FestaPagamento;
    };
}