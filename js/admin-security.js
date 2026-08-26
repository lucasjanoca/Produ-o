(() => {
  const cfg = window.APP_CONFIG || {};
  const supabaseLib = window.supabase;
  const adminContent = document.getElementById('adminContent');
  const loginPanel = document.getElementById('loginPanel');
  const loginMessage = document.getElementById('loginMessage');
  const accountsPanel = document.getElementById('panel-contas');
  const accountsTab = document.querySelector('.admin-tab[data-tab="contas"]');
  const accountForm = document.getElementById('accountForm');

  if (!supabaseLib || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !adminContent || !loginPanel) {
    if (adminContent) adminContent.style.visibility = 'hidden';
    return;
  }

  const client = supabaseLib.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  let currentRole = null;
  let verifying = false;

  const setMessage = (text, type = 'error-message') => {
    if (!loginMessage) return;
    loginMessage.className = `form-message ${type}`;
    loginMessage.textContent = text;
  };

  const setAccountsVisibility = (role) => {
    const owner = role === 'owner';
    if (accountsTab) accountsTab.style.display = owner ? '' : 'none';
    if (accountsPanel && !owner) accountsPanel.classList.add('hidden');
  };

  const lockPanel = () => {
    currentRole = null;
    adminContent.style.visibility = 'hidden';
    adminContent.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    const logout = document.getElementById('logoutBtn');
    if (logout) logout.classList.add('hidden');
    setAccountsVisibility(null);
  };

  const unlockPanel = (role) => {
    currentRole = role;
    adminContent.style.visibility = 'visible';
    setAccountsVisibility(role);
  };

  async function verifyAccess(session, { signOutIfDenied = true } = {}) {
    if (verifying) return currentRole;
    verifying = true;
    try {
      if (!session?.user) {
        lockPanel();
        return null;
      }

      const { data, error } = await client
        .from('production_admins')
        .select('role,active')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error || !data?.active || !['owner', 'manager'].includes(data.role)) {
        lockPanel();
        if (signOutIfDenied) await client.auth.signOut();
        setMessage('Esta conta não possui acesso ao painel administrativo.');
        return null;
      }

      unlockPanel(data.role);
      return data.role;
    } catch (error) {
      console.error('Falha ao validar acesso do painel:', error);
      lockPanel();
      setMessage('Não foi possível validar sua permissão. Atualize a página e tente novamente.');
      return null;
    } finally {
      verifying = false;
    }
  }

  async function bootstrap() {
    const { data, error } = await client.auth.getSession();
    if (error) {
      lockPanel();
      setMessage('Não foi possível validar sua sessão.');
      return;
    }
    await verifyAccess(data?.session, { signOutIfDenied: true });
  }

  client.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => verifyAccess(session, { signOutIfDenied: true }), 0);
  });

  if (accountForm) {
    const password = document.getElementById('accountPassword');
    const passwordConfirm = document.getElementById('accountPasswordConfirm');
    if (password) {
      password.minLength = 8;
      password.placeholder = 'Mínimo 8 caracteres';
    }
    if (passwordConfirm) passwordConfirm.minLength = 8;

    accountForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const status = document.getElementById('accountStatus');
      const name = String(document.getElementById('accountName')?.value || '').trim();
      const email = String(document.getElementById('accountEmail')?.value || '').trim().toLowerCase();
      const pass = String(password?.value || '');
      const confirm = String(passwordConfirm?.value || '');

      if (currentRole !== 'owner') {
        if (status) status.textContent = 'Somente o administrador principal pode criar contas';
        return;
      }
      if (name.length < 2 || !email || pass.length < 8) {
        if (status) status.textContent = 'Preencha os dados e use uma senha com 8+ caracteres';
        return;
      }
      if (pass !== confirm) {
        if (status) status.textContent = 'As senhas não conferem';
        return;
      }

      try {
        if (status) status.textContent = 'Criando conta com segurança...';
        const { data, error } = await client.functions.invoke('production-admin-create-user', {
          body: { name, email, password: pass }
        });
        if (error) throw error;
        if (!data?.created) throw new Error(data?.error || 'Não foi possível criar a conta.');
        accountForm.reset();
        if (status) status.textContent = 'Conta criada e autorizada ✓';
        window.setTimeout(() => {
          if (status) status.textContent = 'Pronto';
        }, 3500);
      } catch (error) {
        console.error('Falha ao criar conta do painel:', error);
        let message = 'Não foi possível criar a conta';
        try {
          const context = error?.context;
          if (context && typeof context.json === 'function') {
            const payload = await context.json();
            if (payload?.error) message = payload.error;
          } else if (error?.message) {
            message = error.message;
          }
        } catch {}
        if (status) status.textContent = `Erro: ${message}`;
      }
    }, true);
  }

  bootstrap();
})();
