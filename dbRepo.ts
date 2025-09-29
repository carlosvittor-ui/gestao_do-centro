// dbRepo.ts (raiz do projeto)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY nas variáveis do Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type TableName = 'filhos' | 'barcos' | 'historico_giras' | 'giras_externas' | 'festas';
type Row<T> = { id: number; data: T };

function toRows<T extends { id: number }>(items: T[]): Row<T>[] {
  return items.map((it) => ({ id: it.id, data: it as any }));
}

async function loadTable<T>(table: TableName): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ id: r.id, ...(r.data || {}) })) as T[];
}

/** Substitui todo o conteúdo da tabela pelo snapshot atual */
async function replaceTable<T extends { id: number }>(table: TableName, items: T[]) {
  const del = await supabase.from(table).delete().neq('id', -1);
  if (del.error) throw del.error;
  if (items.length === 0) return;
  const { error } = await supabase.from(table).insert(toRows(items));
  if (error) throw error;
}

export const db = {
  loadAll: async () => {
    const [filhos, barcos, historico, giras, festas] = await Promise.all([
      loadTable<any>('filhos'),
      loadTable<any>('barcos'),
      loadTable<any>('historico_giras'),
      loadTable<any>('giras_externas'),
      loadTable<any>('festas'),
    ]);
    return { filhos, barcos, historico, giras, festas };
  },
  sync: {
    filhos: (items: any[]) => replaceTable('filhos', items),
    barcos: (items: any[]) => replaceTable('barcos', items),
    historico: (items: any[]) => replaceTable('historico_giras', items),
    girasExternas: (items: any[]) => replaceTable('giras_externas', items),
    festas: (items: any[]) => replaceTable('festas', items),
  },
};
