// src/lib/auth.js
// Cache del rol del usuario actual, con invalidación automática en login/logout.
import { supabase } from './supabase.js';

let _role = null;       // 'admin' | 'user' | null
let _resolved = false;
let _inflight = null;

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange(() => {
    _role = null;
    _resolved = false;
  });
}

/**
 * Devuelve el rol del usuario actual: 'admin' | 'user' | null.
 * Cachea el resultado hasta que cambie la sesión.
 */
export async function getUserRole() {
  if (_resolved) return _role;
  if (_inflight) return _inflight;
  _inflight = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      _role = null;
      _resolved = true;
      return null;
    }
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', session.user.id)
      .single();
    _role = perfil?.rol || 'user';
    _resolved = true;
    return _role;
  })();
  try {
    return await _inflight;
  } finally {
    _inflight = null;
  }
}

/** Devuelve true si el usuario actual es admin. */
export async function isAdmin() {
  return (await getUserRole()) === 'admin';
}
