window.APP_CONFIG = {
  SUPABASE_URL: "https://yncspxfsvlqdnodlsosb.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_jALAHHuvrV5oxj2mugWTCQ_stD_vFyN",
  REFRESH_SECONDS: 5
};

(() => {
  const adminContent = document.getElementById('adminContent');
  if (!adminContent) return;

  // Mantém o conteúdo administrativo invisível até a permissão ser validada.
  adminContent.style.visibility = 'hidden';

  const script = document.createElement('script');
  script.src = 'js/admin-security.js?v=20260825-1';
  script.async = false;
  script.onerror = () => {
    adminContent.style.visibility = 'hidden';
    const message = document.getElementById('loginMessage');
    if (message) {
      message.className = 'form-message error-message';
      message.textContent = 'Não foi possível carregar a validação de segurança. Atualize a página.';
    }
  };
  document.head.appendChild(script);
})();
