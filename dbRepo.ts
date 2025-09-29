// src/dbRepo.ts
import { supabase } from '../supabaseClient';

// Tabelas usadas pelo app (snapshot por tabela)
type TableName = 'filhos' | 'barcos' | 'historico_giras' | 'giras_externas' | 'festas';

// Cada linha guarda { id, data: { ...objetoCompletoDoApp } }
type Row<T> = { id: number; data: T };

// Utilitário: converte array de objetos (cada um com id) para payload de insert
function toRows<T extends { id: number }>(items: T[]): Row<T>[] {
  return items.map((it) => ({ id: it.id, data: it as any }));
}

async function loadTable<T>(table: TableName): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ id: r.id, ...(r.data || {}) })) as T[];
}

/**
 * Substitui TODO o conteúdo da tabela pelo snapshot informado.
 * Estratégia simples/segura para manter o front 100% em sincronia.
 */
async function replaceTable<T extends { id: number }>(table: TableName, items: T[]) {
  // apaga tudo
  const del = await supabase.from(table).delete().neq('id', -1);
  if (del.error) throw del.error;

  if (items.length === 0) return;

  // insere tudo de novo
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
