// src/App.tsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

type EventRow = {
  id: number;
  title: string;
  event_date: string; // ISO date (YYYY-MM-DD)
  type: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
};

export default function App() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [newType, setNewType] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: sess } = await supabase.auth.getSession();
      setSessionEmail(sess.session?.user?.email ?? null);
      await loadEvents();
    };

    // mantém sessão atualizada
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email ?? null);
    });

    init();
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error(error);
      alert('Erro ao carregar eventos: ' + error.message);
    } else {
      setEvents(data as EventRow[]);
    }
    setLoading(false);
  };

  const signInWithMagicLink = async () => {
    if (!email) {
      alert('Informe um e-mail');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert('Erro no login: ' + error.message);
    else alert('Verifique seu e-mail. Enviamos um link de acesso.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addEvent = async () => {
    if (!newTitle || !newDate) {
      alert('Título e data são obrigatórios.');
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess.session?.user?.id ?? null;

    const { error } = await supabase.from('events').insert({
      title: newTitle,
      event_date: newDate,
      type: newType || null,
      notes: newNotes || null,
      created_by: userId,
    });

    if (error) {
      alert('Erro ao inserir evento: ' + error.message);
      return;
    }
    setNewTitle('');
    setNewType('');
    setNewNotes('');
    await loadEvents();
  };

  return (
    <div style={{ maxWidth: 780, margin: '24px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Gestão de Terreiro — Eventos</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        Supabase conectado via <code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code>.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0' }}>
        {sessionEmail ? (
          <>
            <span>Logado: <strong>{sessionEmail}</strong></span>
            <button onClick={signOut}>Sair</button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: 8, flex: 1 }}
            />
            <button onClick={signInWithMagicLink}>Entrar por link mágico</button>
          </>
        )}
      </div>

      <section style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Novo evento</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 1fr', gap: 12 }}>
          <input
            placeholder="Título (ex.: Gira de Xangô)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            placeholder="Tipo (opcional)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={{ padding: 8 }}
          />
          <textarea
            placeholder="Observações (opcional)"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            style={{ gridColumn: '1 / -1', padding: 8, minHeight: 60 }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={addEvent} disabled={!sessionEmail}>
            Salvar evento (requer login)
          </button>
          {!sessionEmail && (
            <small style={{ marginLeft: 8, opacity: 0.75 }}>
              entre com e-mail para inserir.
            </small>
          )}
        </div>
      </section>

      <h2 style={{ marginTop: 0 }}>Próximos eventos</h2>
      {loading ? (
        <p>Carregando…</p>
      ) : events.length === 0 ? (
        <p>Nenhum evento cadastrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {events.map((e) => (
            <li key={e.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{e.title}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {new Date(e.event_date + 'T00:00:00').toLocaleDateString()}
                {e.type ? ` • ${e.type}` : ''}
              </div>
              {e.notes && <div style={{ marginTop: 6 }}>{e.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
