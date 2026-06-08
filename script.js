/**
 * MTH — Micro Telemedicine Healthcare
 * script.js — Login & Register logic
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     AKUN TERDAFTAR (demo hardcoded)
  ══════════════════════════════════════ */
  const ACCOUNTS = [
    { email: 'pasien1@gmail.com', password: 'Pw123',    role: 'pasien', display: 'Pasien 1',  initial: 'P1', faskes: 'Puskesmas Tanjung' },
    { email: 'pasien2@gmail.com', password: 'Pw123',    role: 'pasien', display: 'Pasien 2',  initial: 'P2', faskes: 'Puskesmas Gangga' },
    { email: 'pasien3@gmail.com', password: 'Pw123',    role: 'pasien', display: 'Pasien 3',  initial: 'P3', faskes: 'Puskesmas Bayan' },
    { email: 'dokter1@gmail.com', password: 'Dok123',   role: 'dokter', display: 'Dokter A',  initial: 'DA', faskes: 'RSUD Tanjung',      spec: 'Dokter Umum' },
    { email: 'dokter2@gmail.com', password: 'Dok123',   role: 'dokter', display: 'Dokter B',  initial: 'DB', faskes: 'RSUD Tanjung',      spec: 'Penyakit Dalam' },
    { email: 'dokter3@gmail.com', password: 'Dok123',   role: 'dokter', display: 'Dokter C',  initial: 'DC', faskes: 'Puskesmas Tanjung', spec: 'Dokter Umum' },
    { email: 'admin@mth.id',      password: 'Admin123', role: 'admin',  display: 'Admin MTH', initial: 'AD', faskes: 'RSUD Tanjung' },
  ];

  /* ══════════════════════════════════════
     DOM REFS
  ══════════════════════════════════════ */
  const tabBtns      = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.querySelector('.tab-indicator');
  const sections     = {
    login:    document.getElementById('tab-login'),
    register: document.getElementById('tab-register'),
  };
  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toast        = document.getElementById('toast');
  const toastMsg     = document.getElementById('toast-msg');

  /* ══════════════════════════════════════
     TAB SWITCHER
  ══════════════════════════════════════ */
  function switchTab(tab) {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    tabIndicator.classList.toggle('right', tab === 'register');
    Object.entries(sections).forEach(([key, el]) => {
      el.classList.toggle('active', key === tab);
    });
  }

  tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  document.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); switchTab(link.dataset.switch); });
  });

  /* ══════════════════════════════════════
     DEMO HINT — accordion & auto-fill
  ══════════════════════════════════════ */
  const demoHint   = document.getElementById('demo-hint');
  const demoToggle = document.getElementById('demo-hint-toggle');

  demoToggle && demoToggle.addEventListener('click', () => {
    demoHint.classList.toggle('open');
  });

  document.querySelectorAll('.demo-acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emailEl = document.getElementById('login-email');
      const passEl  = document.getElementById('login-password');
      if (emailEl) emailEl.value = btn.dataset.email;
      if (passEl)  passEl.value  = btn.dataset.pass;
      demoHint.classList.remove('open');
      clearError(emailEl, document.getElementById('login-email-err'));
      clearError(passEl,  document.getElementById('login-pass-err'));
    });
  });

  /* ══════════════════════════════════════
     PASSWORD TOGGLE
  ══════════════════════════════════════ */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type   = isPass ? 'text' : 'password';
      btn.querySelector('.eye-show').style.display = isPass ? 'none' : '';
      btn.querySelector('.eye-hide').style.display = isPass ? ''     : 'none';
    });
  });

  /* ══════════════════════════════════════
     PASSWORD STRENGTH
  ══════════════════════════════════════ */
  const regPassEl     = document.getElementById('reg-password');
  const strengthEl    = document.getElementById('pass-strength');
  const strengthLabel = document.getElementById('strength-label');
  const LABELS        = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];

  function calcStrength(pwd) {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8)          s++;
    if (/[A-Z]/.test(pwd))        s++;
    if (/[0-9]/.test(pwd))        s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  }

  regPassEl && regPassEl.addEventListener('input', () => {
    const lvl = calcStrength(regPassEl.value);
    if (!regPassEl.value) {
      strengthEl.removeAttribute('data-level');
      strengthLabel.textContent = 'Kekuatan kata sandi';
    } else {
      strengthEl.setAttribute('data-level', String(lvl));
      strengthLabel.textContent = LABELS[lvl] || '';
    }
  });

  /* ══════════════════════════════════════
     HELPERS
  ══════════════════════════════════════ */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function showError(inputEl, msgEl, msg) {
    if (inputEl) inputEl.classList.add('error');
    if (msgEl)   msgEl.textContent = msg || '';
  }

  function clearError(inputEl, msgEl) {
    if (inputEl) inputEl.classList.remove('error');
    if (msgEl)   msgEl.textContent = '';
  }

  function setLoading(btn, loading) {
    btn.classList.toggle('loading', loading);
    btn.disabled = loading;
  }

  let toastTimer;
  function showToast(msg, icon) {
    icon = icon || 'OK';
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.querySelector('.toast-icon').textContent = icon;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ══════════════════════════════════════
     LOGIN — validasi & redirect
  ══════════════════════════════════════ */
  loginForm && loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var emailEl = document.getElementById('login-email');
    var passEl  = document.getElementById('login-password');
    var emailEr = document.getElementById('login-email-err');
    var passEr  = document.getElementById('login-pass-err');
    var valid   = true;

    clearError(emailEl, emailEr);
    clearError(passEl,  passEr);

    if (!emailEl.value.trim()) {
      showError(emailEl, emailEr, 'Email wajib diisi'); valid = false;
    } else if (!isValidEmail(emailEl.value)) {
      showError(emailEl, emailEr, 'Format email tidak valid'); valid = false;
    }
    if (!passEl.value) {
      showError(passEl, passEr, 'Kata sandi wajib diisi'); valid = false;
    }
    if (!valid) return;

    var btn = loginForm.querySelector('.btn-primary');
    setLoading(btn, true);

    // Simulasi network delay
    setTimeout(function() {
      var emailLower = emailEl.value.trim().toLowerCase();
      var account    = null;
      for (var i = 0; i < ACCOUNTS.length; i++) {
        if (ACCOUNTS[i].email.toLowerCase() === emailLower && ACCOUNTS[i].password === passEl.value) {
          account = ACCOUNTS[i];
          break;
        }
      }

      setLoading(btn, false);

      if (!account) {
        showError(passEl, passEr, 'Email atau kata sandi salah');
        showToast('Login gagal — periksa email & kata sandi', '✗');
        return;
      }

      // Simpan sesi
      try {
        sessionStorage.setItem('mth_user', JSON.stringify(account));
      } catch(err) {
        // fallback jika sessionStorage tidak tersedia
        window._mthUser = account;
      }

      showToast('Selamat datang, ' + account.display + '! Mengalihkan...', '✓');

      setTimeout(function() {
        window.location.href = 'dashboard.html';
      }, 900);

    }, 900);
  });

  /* ══════════════════════════════════════
     REGISTER (Pasien only)
  ══════════════════════════════════════ */
  var regConfirmEl  = document.getElementById('reg-confirm');
  var regConfirmErr = document.getElementById('reg-confirm-err');
  var regEmailEl    = document.getElementById('reg-email');
  var regEmailErr   = document.getElementById('reg-email-err');

  regConfirmEl && regConfirmEl.addEventListener('input', function() {
    if (regConfirmEl.value && regPassEl && regConfirmEl.value !== regPassEl.value) {
      showError(regConfirmEl, regConfirmErr, 'Kata sandi tidak cocok');
    } else {
      clearError(regConfirmEl, regConfirmErr);
    }
  });

  registerForm && registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;

    clearError(regEmailEl, regEmailErr);
    clearError(regConfirmEl, regConfirmErr);

    if (!regEmailEl || !regEmailEl.value.trim()) {
      showError(regEmailEl, regEmailErr, 'Email wajib diisi'); valid = false;
    } else if (!isValidEmail(regEmailEl.value)) {
      showError(regEmailEl, regEmailErr, 'Format email tidak valid'); valid = false;
    }

    if (!regPassEl || !regPassEl.value || regPassEl.value.length < 8) {
      showToast('Kata sandi minimal 8 karakter', '!!'); valid = false;
    }

    if (regConfirmEl && regPassEl && regConfirmEl.value !== regPassEl.value) {
      showError(regConfirmEl, regConfirmErr, 'Kata sandi tidak cocok'); valid = false;
    }

    if (!document.getElementById('agree-terms').checked) {
      showToast('Setujui syarat & ketentuan terlebih dahulu', '!!'); valid = false;
    }

    if (!valid) return;

    var btn = registerForm.querySelector('.btn-primary');
    setLoading(btn, true);

    setTimeout(function() {
      setLoading(btn, false);
      showToast('Akun pasien berhasil dibuat! Silakan masuk.', 'OK');
      registerForm.reset();
      if (strengthEl)    strengthEl.removeAttribute('data-level');
      if (strengthLabel) strengthLabel.textContent = 'Kekuatan kata sandi';
      setTimeout(function() { switchTab('login'); }, 1200);
    }, 1400);
  });

  /* ══════════════════════════════════════
     CLEAR ERROR ON INPUT
  ══════════════════════════════════════ */
  document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        var errEl = document.getElementById(input.id + '-err');
        if (errEl) errEl.textContent = '';
      }
    });
  });

  /* ══════════════════════════════════════
     JIKA SUDAH LOGIN → langsung dashboard
  ══════════════════════════════════════ */
  try {
    var existing = sessionStorage.getItem('mth_user');
    if (existing) {
      JSON.parse(existing);
      window.location.href = 'dashboard.html';
    }
  } catch(_) {
    sessionStorage.removeItem('mth_user');
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  switchTab('login');

})();
