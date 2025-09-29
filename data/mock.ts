import type { Filho, GiraHistorico, Barco, GiraExternaSalva, FestaHomenagemEvento } from '../types';
import { Situacao, Funcao, Departamento } from '../types';

export const mockBarcos: Barco[] = [
  {
    id: 1,
    nome: "Barco da Fé",
    padrinhos: [
      { filhoId: 1, entidadeKey: 'pretoVelho' },
      { filhoId: 2, entidadeKey: 'caboclo' }
    ]
  },
  {
    id: 2,
    nome: "Barco da Caridade",
    padrinhos: [
      { filhoId: 3, entidadeKey: 'baiano' }
    ]
  },
  {
    id: 3,
    nome: "Barco da Esperança",
    padrinhos: [
       { filhoId: 4, entidadeKey: 'exu' }
    ]
  }
];

export const mockFilhos: Filho[] = [
  {
    id: 1,
    nome: 'Maria da Silva',
    situacao: Situacao.Ativo,
    departamento: Departamento.Recepcao,
    dataEntrada: '2020-01-15',
    dataNascimento: '1985-05-20',
    orixas: { primeiro: 'Iemanjá', segundo: 'Oxum' },
    entidades: { exu: 'Maria Padilha', pomboGira: 'Rosa Caveira', caboclo: 'Caboclo 7 Flechas', baiano: 'Zé Baiano', marinheiro: 'Martim Pescador', cigano: 'Cigano Pablo', pretoVelho: 'Vó Benedita', ere: 'Rosinha', boiadeiro: 'Chico da Campina', exuMirim: 'Caveirinha' },
    juremado: { e: true, data: '2021-06-10', barcoId: 1 },
    ordemSuporte: { tem: true, data: '2020-08-01' },
    ordemPasse: { tem: true, data: '2022-03-12' },
    podeDarPasse: true,
    funcao: Funcao.PaiMaePequena,
    entidadesPadrinhos: ['pretoVelho', 'caboclo']
  },
  {
    id: 2,
    nome: 'João Santos',
    situacao: Situacao.Ativo,
    departamento: Departamento.Cantina,
    dataEntrada: '2019-11-20',
    dataNascimento: '1990-02-10',
    orixas: { primeiro: 'Ogum', segundo: 'Iansã' },
    entidades: { exu: 'Tranca Rua', pomboGira: 'Dama da Noite', caboclo: 'Caboclo Pena Branca', baiano: 'Severino', marinheiro: 'João da Praia', cigano: 'Cigano Ramirez', pretoVelho: 'Pai Joaquim', ere: 'Pedrinho', boiadeiro: 'Laço de Ouro', exuMirim: 'Brasinha' },
    juremado: { e: true, data: '2021-06-10', barcoId: 1 },
    ordemSuporte: { tem: true, data: '2020-05-15' },
    ordemPasse: { tem: true, data: '2021-11-01' },
    podeDarPasse: true,
    funcao: Funcao.Oga,
    entidadesPadrinhos: ['caboclo']
  },
  {
    id: 3,
    nome: 'Ana Oliveira',
    situacao: Situacao.Ativo,
    departamento: Departamento.Nenhum,
    dataEntrada: '2021-03-05',
    dataNascimento: '1995-09-30',
    orixas: { primeiro: 'Oxóssi', segundo: 'Obá' },
    entidades: { exu: 'Tiriri', pomboGira: 'Maria Quitéria', caboclo: 'Cabocla Jurema', baiano: 'Maria do Cais', marinheiro: 'Zé do Mar', cigano: 'Cigana Esmeralda', pretoVelho: 'Vó Maria Conga', ere: 'Aninha', boiadeiro: 'Zé do Laço', exuMirim: 'Faísca' },
    juremado: { e: false },
    ordemSuporte: { tem: false },
    ordemPasse: { tem: true, data: '2023-01-20' },
    podeDarPasse: false,
    funcao: Funcao.Curimba,
    entidadesPadrinhos: ['baiano']
  },
  {
    id: 4,
    nome: 'Carlos Pereira',
    situacao: Situacao.Afastado,
    departamento: Departamento.Nenhum,
    dataEntrada: '2018-07-22',
    dataNascimento: '1980-12-01',
    orixas: { primeiro: 'Xangô', segundo: 'Egunitá' },
    entidades: { exu: 'Exu Veludo', pomboGira: 'Pombo Gira das 7 Saias', caboclo: 'Caboclo Rompe Mato', baiano: 'Zé do Coco', marinheiro: 'Capitão dos Mares', cigano: 'Cigano Wladimir', pretoVelho: 'Pai João', ere: 'Zezinho', boiadeiro: 'João Boiadeiro', exuMirim: 'Chama Dinheiro' },
    juremado: { e: true, data: '2020-02-02', barcoId: 2 },
    ordemSuporte: { tem: true, data: '2019-01-10' },
    ordemPasse: { tem: true, data: '2020-09-05' },
    podeDarPasse: true,
    funcao: Funcao.Nenhum,
    entidadesPadrinhos: ['exu']
  },
  {
    id: 5,
    nome: 'Beatriz Costa',
    situacao: Situacao.Ativo,
    departamento: Departamento.Limpeza,
    dataEntrada: '2022-01-10',
    dataNascimento: '2000-01-15',
    orixas: { primeiro: 'Nanã', segundo: 'Omulu' },
    entidades: { exu: 'Capeta', pomboGira: 'Rainha', caboclo: 'Ubirajara', baiano: 'Chiquinho', marinheiro: 'Marinheiro das 7 Ondas', cigano: 'Carmencita', pretoVelho: 'Vó Cambinda', ere: 'Mariazinha', boiadeiro: 'Navalha', exuMirim: 'Pimentinha' },
    juremado: { e: false },
    ordemSuporte: { tem: false },
    ordemPasse: { tem: false },
    podeDarPasse: false,
    funcao: Funcao.FilhaAxe
  },
  {
    id: 6, nome: 'Lucas Almeida', situacao: Situacao.Ativo, departamento: Departamento.Cozinha, dataEntrada: '2021-08-19', dataNascimento: '1992-04-12',
    orixas: { primeiro: 'Oxalá', segundo: 'Iemanjá' }, entidades: { exu: 'Marabô', pomboGira: 'Pombo Gira Menina', caboclo: 'Caboclo do Sol', baiano: 'Lampião', marinheiro: 'Zé Pescador', cigano: 'Igor', pretoVelho: 'Pai Francisco', ere: 'Doum', boiadeiro: 'Carreiro', exuMirim: 'Labareda' },
    juremado: { e: true, barcoId: 3, data: '2023-05-05' }, ordemSuporte: { tem: true, data: '2022-01-01' }, ordemPasse: { tem: true, data: '2023-03-03' }, podeDarPasse: true, funcao: Funcao.CambonoChefe
  },
  {
    id: 7, nome: 'Fernanda Lima', situacao: Situacao.Desligado, departamento: Departamento.Nenhum, dataEntrada: '2020-05-30', dataNascimento: '1988-11-08',
    orixas: { primeiro: 'Iansã', segundo: 'Xangô' }, entidades: { exu: 'Giramundo', pomboGira: 'Cigana', caboclo: 'Cobra Coral', baiano: 'Manoel', marinheiro: 'Navegante', cigano: 'Natasha', pretoVelho: 'Vó Catarina', ere: 'Crispim', boiadeiro: 'Laçador', exuMirim: 'Foguinho' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 8, nome: 'Ricardo Souza', situacao: Situacao.Ativo, departamento: Departamento.Recepcao, dataEntrada: '2023-02-14', dataNascimento: '1998-07-21',
    orixas: { primeiro: 'Omulu', segundo: 'Nanã' }, entidades: { exu: 'Sete Covas', pomboGira: 'Sete Véus', caboclo: 'Arranca Toco', baiano: 'Baianinho', marinheiro: 'Marujo', cigano: 'Bóris', pretoVelho: 'Pai Maneco', ere: 'Cosminho', boiadeiro: 'Zé do Brejo', exuMirim: 'Treme Terra' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 9, nome: 'Juliana Ribeiro', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2017-06-01', dataNascimento: '1983-03-15',
    orixas: { primeiro: 'Oxum', segundo: 'Oxóssi' }, entidades: { exu: 'Pinga Fogo', pomboGira: 'Maria Mulambo', caboclo: 'Águia Dourada', baiano: 'Chico Dendê', marinheiro: 'Timoneiro', cigano: 'Sara', pretoVelho: 'Vó Benta', ere: 'Estrelinha', boiadeiro: 'Vaqueiro do Sertão', exuMirim: 'Ventania' },
    juremado: { e: true, barcoId: 2, data: '2019-04-10' }, ordemSuporte: { tem: true, data: '2018-01-15' }, ordemPasse: { tem: true, data: '2020-01-20' }, podeDarPasse: true, funcao: Funcao.Ekedi
  },
  {
    id: 10, nome: 'Marcos Gomes', situacao: Situacao.Ativo, departamento: Departamento.Cantina, dataEntrada: '2022-09-02', dataNascimento: '1991-08-25',
    orixas: { primeiro: 'Ogum', segundo: 'Oxalá' }, entidades: { exu: 'Sete Encruzilhadas', pomboGira: 'Rosa Vermelha', caboclo: 'Tupa', baiano: 'Jesuíno', marinheiro: 'Leme', cigano: 'Artêmio', pretoVelho: 'Pai Guiné', ere: 'Flechinha', boiadeiro: 'Boiadeiro da Chapada', exuMirim: 'Toco Preto' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 11, nome: 'Gabriela Ferreira', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2023-01-20', dataNascimento: '2001-05-18',
    orixas: { primeiro: 'Iemanjá', segundo: 'Oxalá' }, entidades: { exu: 'Exu do Lodo', pomboGira: 'Pombo Gira da Calunga', caboclo: 'Caboclo da Lua', baiano: 'Coquinho', marinheiro: 'Pescador das Almas', cigano: 'Yasmin', pretoVelho: 'Vó Joaquina', ere: 'Gotinha de Luz', boiadeiro: 'Rei do Gado', exuMirim: 'Lama Negra' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 12, nome: 'Thiago Martins', situacao: Situacao.Afastado, departamento: Departamento.Nenhum, dataEntrada: '2019-02-11', dataNascimento: '1987-01-07',
    orixas: { primeiro: 'Xangô', segundo: 'Iansã' }, entidades: { exu: 'Sete Gargalhadas', pomboGira: 'Pombo Gira da Estrada', caboclo: 'Ubiratan', baiano: 'Chico da Bahia', marinheiro: 'Marinheiro da Tempestade', cigano: 'Juan', pretoVelho: 'Pai Serafim', ere: 'Trovãozinho', boiadeiro: 'Boiadeiro do Rio', exuMirim: 'Faísca' },
    juremado: { e: true, barcoId: 3, data: '2021-02-15' }, ordemSuporte: { tem: true, data: '2019-10-10' }, ordemPasse: { tem: true, data: '2022-05-20' }, podeDarPasse: true, funcao: Funcao.Nenhum
  },
  {
    id: 13, nome: 'Amanda Nunes', situacao: Situacao.Ativo, departamento: Departamento.Limpeza, dataEntrada: '2022-11-15', dataNascimento: '1999-06-22',
    orixas: { primeiro: 'Oxum', segundo: 'Ogum' }, entidades: { exu: 'Exu Caveira', pomboGira: 'Rosa Negra', caboclo: 'Caboclo Gira-Mundo', baiano: 'Zé da Navalha', marinheiro: 'Marinheiro do Cais', cigano: 'Jade', pretoVelho: 'Vó Maria Redonda', ere: 'Florzinha', boiadeiro: 'Boiadeiro da Serra', exuMirim: 'Brasinha' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 14, nome: 'Rodrigo Barbosa', situacao: Situacao.Ativo, departamento: Departamento.Cozinha, dataEntrada: '2018-04-16', dataNascimento: '1984-09-14',
    orixas: { primeiro: 'Oxóssi', segundo: 'Oxum' }, entidades: { exu: 'Exu Morcego', pomboGira: 'Pombo Gira do Cruzeiro', caboclo: 'Caboclo Flecheiro', baiano: 'Zé Pelintra', marinheiro: 'Marinheiro da Lua', cigano: 'Esmeralda', pretoVelho: 'Pai Cambinda', ere: 'Jasmim', boiadeiro: 'Boiadeiro do Laço', exuMirim: 'Fagulha' },
    juremado: { e: true, barcoId: 1, data: '2020-07-07' }, ordemSuporte: { tem: true, data: '2019-01-01' }, ordemPasse: { tem: true, data: '2021-08-08' }, podeDarPasse: true, funcao: Funcao.Nenhum
  },
  {
    id: 15, nome: 'Larissa Dias', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2023-04-01', dataNascimento: '2002-10-03',
    orixas: { primeiro: 'Iansã', segundo: 'Ogum' }, entidades: { exu: 'Exu do Cemitério', pomboGira: 'Pombo Gira das Almas', caboclo: 'Caboclo Ventania', baiano: 'Baiana Sete Saias', marinheiro: 'Marinheiro dos Sete Mares', cigano: 'Carmela', pretoVelho: 'Vó Chica', ere: 'Raio de Sol', boiadeiro: 'Boiadeiro do Sol', exuMirim: 'Tufão' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 16, nome: 'Vinicius Rocha', situacao: Situacao.Ativo, departamento: Departamento.Recepcao, dataEntrada: '2020-10-10', dataNascimento: '1993-12-30',
    orixas: { primeiro: 'Omulu', segundo: 'Iemanjá' }, entidades: { exu: 'Exu Gato Preto', pomboGira: 'Pombo Gira da Figueira', caboclo: 'Caboclo Treme-Terra', baiano: 'Baiano do Bonfim', marinheiro: 'Marinheiro da Âncora', cigano: 'Ramon', pretoVelho: 'Pai Tobias', ere: 'Cristal', boiadeiro: 'Boiadeiro da Lua', exuMirim: 'Terremoto' },
    juremado: { e: false }, ordemSuporte: { tem: true, data: '2021-05-15' }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 17, nome: 'Camila Azevedo', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2019-08-08', dataNascimento: '1989-02-28',
    orixas: { primeiro: 'Nanã', segundo: 'Xangô' }, entidades: { exu: 'Exu Tata Caveira', pomboGira: 'Pombo Gira do Forno', caboclo: 'Caboclo da Mata Virgem', baiano: 'Baiana da Praia', marinheiro: 'Marinheiro das Águas Claras', cigano: 'Zafira', pretoVelho: 'Vó Rosa', ere: 'Conchinha', boiadeiro: 'Boiadeiro da Campina', exuMirim: 'Brasa' },
    juremado: { e: true, barcoId: 2, data: '2022-02-22' }, ordemSuporte: { tem: true, data: '2020-03-03' }, ordemPasse: { tem: true, data: '2023-01-01' }, podeDarPasse: true, funcao: Funcao.Nenhum
  },
  {
    id: 18, nome: 'Felipe Mendes', situacao: Situacao.Ativo, departamento: Departamento.Cantina, dataEntrada: '2021-06-25', dataNascimento: '1996-04-05',
    orixas: { primeiro: 'Oxalá', segundo: 'Oxum' }, entidades: { exu: 'Exu do Ouro', pomboGira: 'Pombo Gira da Sorte', caboclo: 'Caboclo do Ouro', baiano: 'Baiano da Sorte', marinheiro: 'Marinheiro do Tesouro', cigano: 'Vladimir', pretoVelho: 'Pai Benedito', ere: 'Douradinho', boiadeiro: 'Boiadeiro Rico', exuMirim: 'Dinheirinho' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum
  },
  {
    id: 19, nome: 'Isabela Castro', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2022-04-18', dataNascimento: '1994-07-11',
    orixas: { primeiro: 'Iemanjá', segundo: 'Ogum' }, entidades: { exu: 'Exu do Mar', pomboGira: 'Pombo Gira da Praia', caboclo: 'Caboclo do Mar', baiano: 'Baiana do Mar', marinheiro: 'Marinheiro do Mar', cigano: 'Cigana do Mar', pretoVelho: 'Vó do Mar', ere: 'Ondina', boiadeiro: 'Boiadeiro do Mar', exuMirim: 'Marolinha' },
    juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.FilhaAxe
  },
  {
    id: 20, nome: 'Leonardo Pinto', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2018-12-12', dataNascimento: '1986-10-10',
    orixas: { primeiro: 'Ogum', segundo: 'Iansã' }, entidades: { exu: 'Exu da Guerra', pomboGira: 'Pombo Gira da Batalha', caboclo: 'Caboclo Guerreiro', baiano: 'Baiano Valente', marinheiro: 'Marinheiro Lutador', cigano: 'Cigano Bravo', pretoVelho: 'Pai Lutador', ere: 'Faísca', boiadeiro: 'Boiadeiro Lutador', exuMirim: 'Centelha' },
    juremado: { e: true, barcoId: 3, data: '2020-10-10' }, ordemSuporte: { tem: true, data: '2019-05-05' }, ordemPasse: { tem: true, data: '2021-12-12' }, podeDarPasse: true, funcao: Funcao.Oga
  },
  { id: 21, nome: 'Renata Albuquerque', situacao: Situacao.Ativo, departamento: Departamento.Cozinha, dataEntrada: '2023-03-10', dataNascimento: '1997-03-17', orixas: { primeiro: 'Oxum', segundo: 'Xangô' }, entidades: { exu: 'Exu dos Rios', pomboGira: 'Pombo Gira da Cachoeira', caboclo: 'Caboclo do Rio', baiano: 'Baiana do Rio', marinheiro: 'Marinheiro do Rio', cigano: 'Cigana do Rio', pretoVelho: 'Vó do Rio', ere: 'Gotinha', boiadeiro: 'Boiadeiro do Rio', exuMirim: 'Laguinho' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 22, nome: 'Diego Fernandes', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2021-11-05', dataNascimento: '1990-01-25', orixas: { primeiro: 'Xangô', segundo: 'Iansã' }, entidades: { exu: 'Exu do Fogo', pomboGira: 'Pombo Gira do Fogo', caboclo: 'Caboclo do Fogo', baiano: 'Baiano do Fogo', marinheiro: 'Marinheiro do Fogo', cigano: 'Cigano do Fogo', pretoVelho: 'Pai do Fogo', ere: 'Chaminha', boiadeiro: 'Boiadeiro do Fogo', exuMirim: 'Fagulha' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: true, data: '2023-05-10' }, podeDarPasse: false, funcao: Funcao.Curimba },
  { id: 23, nome: 'Sofia Cardoso', situacao: Situacao.Ativo, departamento: Departamento.Limpeza, dataEntrada: '2022-07-21', dataNascimento: '2000-08-08', orixas: { primeiro: 'Oxóssi', segundo: 'Obá' }, entidades: { exu: 'Exu da Mata', pomboGira: 'Pombo Gira da Mata', caboclo: 'Caboclo da Mata', baiano: 'Baiano da Mata', marinheiro: 'Marinheiro da Mata', cigano: 'Cigana da Mata', pretoVelho: 'Pai da Mata', ere: 'Folhinha', boiadeiro: 'Boiadeiro da Mata', exuMirim: 'Mataguinho' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 24, nome: 'Gustavo Moreira', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2019-09-19', dataNascimento: '1982-06-06', orixas: { primeiro: 'Ogum', segundo: 'Oxóssi' }, entidades: { exu: 'Exu da Lança', pomboGira: 'Pombo Gira da Flecha', caboclo: 'Caboclo da Lança', baiano: 'Baiano da Flecha', marinheiro: 'Marinheiro da Lança', cigano: 'Cigano da Flecha', pretoVelho: 'Pai da Lança', ere: 'Lancinha', boiadeiro: 'Boiadeiro da Lança', exuMirim: 'Flechin' }, juremado: { e: true, barcoId: 1, data: '2021-09-19' }, ordemSuporte: { tem: true, data: '2020-04-14' }, ordemPasse: { tem: true, data: '2022-10-20' }, podeDarPasse: true, funcao: Funcao.Nenhum },
  { id: 25, nome: 'Alice Teixeira', situacao: Situacao.Desligado, departamento: Departamento.Nenhum, dataEntrada: '2021-01-01', dataNascimento: '1995-02-02', orixas: { primeiro: 'Iemanjá', segundo: 'Nanã' }, entidades: { exu: 'Exu do Lodo', pomboGira: 'Pombo Gira do Lodo', caboclo: 'Caboclo do Lodo', baiano: 'Baiano do Lodo', marinheiro: 'Marinheiro do Lodo', cigano: 'Cigana do Lodo', pretoVelho: 'Vó do Lodo', ere: 'Lodinho', boiadeiro: 'Boiadeiro do Lodo', exuMirim: 'Laminha' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 26, nome: 'Bruno Carvalho', situacao: Situacao.Ativo, departamento: Departamento.Recepcao, dataEntrada: '2023-05-01', dataNascimento: '1998-09-09', orixas: { primeiro: 'Omulu', segundo: 'Oxum' }, entidades: { exu: 'Exu das Almas', pomboGira: 'Pombo Gira das Almas', caboclo: 'Caboclo das Almas', baiano: 'Baiano das Almas', marinheiro: 'Marinheiro das Almas', cigano: 'Cigano das Almas', pretoVelho: 'Pai das Almas', ere: 'Alminha', boiadeiro: 'Boiadeiro das Almas', exuMirim: 'Alminha' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 27, nome: 'Clara Melo', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2020-02-28', dataNascimento: '1988-08-18', orixas: { primeiro: 'Iansã', segundo: 'Xangô' }, entidades: { exu: 'Exu da Tempestade', pomboGira: 'Pombo Gira da Tempestade', caboclo: 'Caboclo da Tempestade', baiano: 'Baiano da Tempestade', marinheiro: 'Marinheiro da Tempestade', cigano: 'Cigana da Tempestade', pretoVelho: 'Pai da Tempestade', ere: 'Ventinho', boiadeiro: 'Boiadeiro da Tempestade', exuMirim: 'Tufãozinho' }, juremado: { e: true, barcoId: 2, data: '2022-03-15' }, ordemSuporte: { tem: true, data: '2021-01-20' }, ordemPasse: { tem: true, data: '2023-04-10' }, podeDarPasse: true, funcao: Funcao.Ekedi },
  { id: 28, nome: 'Daniel Arantes', situacao: Situacao.Afastado, departamento: Departamento.Nenhum, dataEntrada: '2019-06-30', dataNascimento: '1981-11-11', orixas: { primeiro: 'Oxalá', segundo: 'Iemanjá' }, entidades: { exu: 'Exu da Paz', pomboGira: 'Pombo Gira da Paz', caboclo: 'Caboclo da Paz', baiano: 'Baiano da Paz', marinheiro: 'Marinheiro da Paz', cigano: 'Cigano da Paz', pretoVelho: 'Pai da Paz', ere: 'Pombinho', boiadeiro: 'Boiadeiro da Paz', exuMirim: 'Pazinha' }, juremado: { e: false }, ordemSuporte: { tem: true, data: '2020-01-01' }, ordemPasse: { tem: true, data: '2021-06-06' }, podeDarPasse: true, funcao: Funcao.Nenhum },
  { id: 29, nome: 'Eduarda Gomes', situacao: Situacao.Ativo, departamento: Departamento.Cantina, dataEntrada: '2022-10-10', dataNascimento: '1999-12-12', orixas: { primeiro: 'Oxum', segundo: 'Oxalá' }, entidades: { exu: 'Exu do Amor', pomboGira: 'Pombo Gira do Amor', caboclo: 'Caboclo do Amor', baiano: 'Baiano do Amor', marinheiro: 'Marinheiro do Amor', cigano: 'Cigana do Amor', pretoVelho: 'Vó do Amor', ere: 'Amorzinho', boiadeiro: 'Boiadeiro do Amor', exuMirim: 'Coração' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 30, nome: 'Fábio Neves', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2017-01-15', dataNascimento: '1979-05-25', orixas: { primeiro: 'Ogum', segundo: 'Iansã' }, entidades: { exu: 'Exu de Ferro', pomboGira: 'Pombo Gira de Aço', caboclo: 'Caboclo de Ferro', baiano: 'Baiano de Aço', marinheiro: 'Marinheiro de Ferro', cigano: 'Cigano de Aço', pretoVelho: 'Pai de Ferro', ere: 'Ferrinho', boiadeiro: 'Boiadeiro de Aço', exuMirim: 'Fagulha' }, juremado: { e: true, barcoId: 3, data: '2019-02-20' }, ordemSuporte: { tem: true, data: '2018-03-10' }, ordemPasse: { tem: true, data: '2020-08-15' }, podeDarPasse: true, funcao: Funcao.PaiMaePequena },
  { id: 31, nome: 'Heloísa Brandão', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2023-06-01', dataNascimento: '2003-01-01', orixas: { primeiro: 'Iemanjá', segundo: 'Oxum' }, entidades: { exu: 'Exu da Concha', pomboGira: 'Pombo Gira da Pérola', caboclo: 'Caboclo da Maré', baiano: 'Baiana da Areia', marinheiro: 'Marinheiro da Espuma', cigano: 'Cigana do Mar', pretoVelho: 'Vó da Praia', ere: 'Conchinha', boiadeiro: 'Boiadeiro do Litoral', exuMirim: 'Ondinha' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 32, nome: 'Ícaro Dias', situacao: Situacao.Ativo, departamento: Departamento.Cozinha, dataEntrada: '2021-04-04', dataNascimento: '1992-04-14', orixas: { primeiro: 'Xangô', segundo: 'Obá' }, entidades: { exu: 'Exu da Pedreira', pomboGira: 'Pombo Gira da Pedreira', caboclo: 'Caboclo da Pedreira', baiano: 'Baiano da Pedreira', marinheiro: 'Marinheiro da Pedreira', cigano: 'Cigano da Pedreira', pretoVelho: 'Pai da Pedreira', ere: 'Pedrinha', boiadeiro: 'Boiadeiro da Pedreira', exuMirim: 'Rochinha' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 33, nome: 'Joana Prado', situacao: Situacao.Ativo, departamento: Departamento.Limpeza, dataEntrada: '2022-08-16', dataNascimento: '1996-06-16', orixas: { primeiro: 'Nanã', segundo: 'Omulu' }, entidades: { exu: 'Exu do Pântano', pomboGira: 'Pombo Gira do Pântano', caboclo: 'Caboclo do Pântano', baiano: 'Baiano do Pântano', marinheiro: 'Marinheiro do Pântano', cigano: 'Cigana do Pântano', pretoVelho: 'Vó do Pântano', ere: 'Laminha', boiadeiro: 'Boiadeiro do Pântano', exuMirim: 'Lama' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 34, nome: 'Kleber Vasconcelos', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2018-10-30', dataNascimento: '1980-02-20', orixas: { primeiro: 'Oxóssi', segundo: 'Iemanjá' }, entidades: { exu: 'Exu Sete Flechas', pomboGira: 'Pombo Gira Sete Flechas', caboclo: 'Caboclo Sete Flechas', baiano: 'Baiano Sete Flechas', marinheiro: 'Marinheiro Sete Flechas', cigano: 'Cigano Sete Flechas', pretoVelho: 'Pai Sete Flechas', ere: 'Flecha Dourada', boiadeiro: 'Boiadeiro Sete Flechas', exuMirim: 'Flechinha' }, juremado: { e: true, barcoId: 1, data: '2020-11-11' }, ordemSuporte: { tem: true, data: '2019-07-07' }, ordemPasse: { tem: true, data: '2021-11-21' }, podeDarPasse: true, funcao: Funcao.Nenhum },
  { id: 35, nome: 'Laura Moreira', situacao: Situacao.Ativo, departamento: Departamento.Recepcao, dataEntrada: '2023-02-22', dataNascimento: '2001-03-23', orixas: { primeiro: 'Oxum', segundo: 'Oxóssi' }, entidades: { exu: 'Exu do Ouro', pomboGira: 'Pombo Gira do Ouro', caboclo: 'Caboclo do Ouro', baiano: 'Baiano do Ouro', marinheiro: 'Marinheiro do Ouro', cigano: 'Cigana do Ouro', pretoVelho: 'Vó do Ouro', ere: 'Ourinho', boiadeiro: 'Boiadeiro do Ouro', exuMirim: 'Pepita' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 36, nome: 'Miguel Ângelo', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2020-09-05', dataNascimento: '1993-09-15', orixas: { primeiro: 'Oxalá', segundo: 'Ogum' }, entidades: { exu: 'Exu da Capa Preta', pomboGira: 'Pombo Gira da Capa Preta', caboclo: 'Caboclo da Capa Preta', baiano: 'Baiano da Capa Preta', marinheiro: 'Marinheiro da Capa Preta', cigano: 'Cigano da Capa Preta', pretoVelho: 'Pai da Capa Preta', ere: 'Capinha', boiadeiro: 'Boiadeiro da Capa Preta', exuMirim: 'Sombrio' }, juremado: { e: false }, ordemSuporte: { tem: true, data: '2021-08-01' }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Curimba },
  { id: 37, nome: 'Natália Queiroz', situacao: Situacao.Ativo, departamento: Departamento.Cantina, dataEntrada: '2022-06-12', dataNascimento: '1998-05-12', orixas: { primeiro: 'Iansã', segundo: 'Ogum' }, entidades: { exu: 'Exu do Vento', pomboGira: 'Pombo Gira do Vento', caboclo: 'Caboclo do Vento', baiano: 'Baiano do Vento', marinheiro: 'Marinheiro do Vento', cigano: 'Cigana do Vento', pretoVelho: 'Vó do Vento', ere: 'Brisinha', boiadeiro: 'Boiadeiro do Vento', exuMirim: 'Ventania' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.Nenhum },
  { id: 38, nome: 'Otávio Ramalho', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2019-03-25', dataNascimento: '1985-04-24', orixas: { primeiro: 'Omulu', segundo: 'Nanã' }, entidades: { exu: 'Exu da Terra', pomboGira: 'Pombo Gira da Terra', caboclo: 'Caboclo da Terra', baiano: 'Baiano da Terra', marinheiro: 'Marinheiro da Terra', cigano: 'Cigano da Terra', pretoVelho: 'Pai da Terra', ere: 'Terrinha', boiadeiro: 'Boiadeiro da Terra', exuMirim: 'Grão de Areia' }, juremado: { e: true, barcoId: 2, data: '2021-04-25' }, ordemSuporte: { tem: true, data: '2020-02-15' }, ordemPasse: { tem: true, data: '2022-09-30' }, podeDarPasse: true, funcao: Funcao.Nenhum },
  { id: 39, nome: 'Patrícia Xavier', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2022-01-30', dataNascimento: '1991-01-30', orixas: { primeiro: 'Iemanjá', segundo: 'Oxalá' }, entidades: { exu: 'Exu do Mar Profundo', pomboGira: 'Pombo Gira do Mar Profundo', caboclo: 'Caboclo do Mar Profundo', baiano: 'Baiano do Mar Profundo', marinheiro: 'Marinheiro do Mar Profundo', cigano: 'Cigana do Mar Profundo', pretoVelho: 'Vó do Mar Profundo', ere: 'Gotinha Salgada', boiadeiro: 'Boiadeiro do Mar Profundo', exuMirim: 'Abismo' }, juremado: { e: false }, ordemSuporte: { tem: false }, ordemPasse: { tem: false }, podeDarPasse: false, funcao: Funcao.FilhaAxe },
  { id: 40, nome: 'Quintino Aires', situacao: Situacao.Ativo, departamento: Departamento.Nenhum, dataEntrada: '2021-07-17', dataNascimento: '1995-07-17', orixas: { primeiro: 'Ogum', segundo: 'Oxalá' }, entidades: { exu: 'Exu da Meia-Noite', pomboGira: 'Pombo Gira da Meia-Noite', caboclo: 'Caboclo da Meia-Noite', baiano: 'Baiano da Meia-Noite', marinheiro: 'Marinheiro da Meia-Noite', cigano: 'Cigano da Meia-Noite', pretoVelho: 'Pai da Meia-Noite', ere: 'Estrelinha da Noite', boiadeiro: 'Boiadeiro da Meia-Noite', exuMirim: 'Sombrinha' }, juremado: { e: false }, ordemSuporte: { tem: true, data: '2022-06-01' }, ordemPasse: { tem: true, data: '2023-05-20' }, podeDarPasse: true, funcao: Funcao.Oga }
];

export const mockHistorico: GiraHistorico[] = [];

export const mockGirasExternasSalvas: GiraExternaSalva[] = [];

export const mockFestas: FestaHomenagemEvento[] = [];
