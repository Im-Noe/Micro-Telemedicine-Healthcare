/**
 * MTH — Micro Telemedicine Healthcare
 * dashboard.js — Full SPA logic
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     PROTEKSI SESI — redirect jika belum login
  ══════════════════════════════════════ */
  var SESSION_USER = null;
  try {
    var raw = sessionStorage.getItem('mth_user');
    if (raw) SESSION_USER = JSON.parse(raw);
  } catch(_) {}

  if (!SESSION_USER) {
    window.location.href = 'index.html';
    return; // hentikan eksekusi
  }

  /* ══════════════════════════════════════
     MOCK DATA — identitas pakai inisial
  ══════════════════════════════════════ */
  var ALL_USERS = {
    'pasien1@gmail.com': { display: 'Pasien 1',  initial: 'P1', role: 'pasien', faskes: 'Puskesmas Tanjung' },
    'pasien2@gmail.com': { display: 'Pasien 2',  initial: 'P2', role: 'pasien', faskes: 'Puskesmas Gangga' },
    'pasien3@gmail.com': { display: 'Pasien 3',  initial: 'P3', role: 'pasien', faskes: 'Puskesmas Bayan' },
    'dokter1@gmail.com': { display: 'Dokter A',  initial: 'DA', role: 'dokter', faskes: 'RSUD Tanjung',      spec: 'Dokter Umum' },
    'dokter2@gmail.com': { display: 'Dokter B',  initial: 'DB', role: 'dokter', faskes: 'RSUD Tanjung',      spec: 'Penyakit Dalam' },
    'dokter3@gmail.com': { display: 'Dokter C',  initial: 'DC', role: 'dokter', faskes: 'Puskesmas Tanjung', spec: 'Dokter Umum' },
    'admin@mth.id':      { display: 'Admin MTH', initial: 'AD', role: 'admin',  faskes: 'RSUD Tanjung' },
  };

  // Pastikan info sesi lengkap
  var userFromDB = ALL_USERS[SESSION_USER.email] || SESSION_USER;
  var CURRENT_USER = Object.assign({}, SESSION_USER, userFromDB);
  var currentRole  = CURRENT_USER.role; // 'pasien' | 'dokter' | 'admin'

  var DOCTORS = [
    { id: 1, display: 'Dokter A', initial: 'DA', spec: 'Dokter Umum',    faskes: 'RSUD Tanjung',      online: true  },
    { id: 2, display: 'Dokter B', initial: 'DB', spec: 'Penyakit Dalam', faskes: 'RSUD Tanjung',      online: true  },
    { id: 3, display: 'Dokter C', initial: 'DC', spec: 'Dokter Umum',    faskes: 'Pusk. Tanjung',     online: false },
    { id: 4, display: 'Dokter D', initial: 'DD', spec: 'Endokrinologi',  faskes: 'RSUD Tanjung',      online: true  },
  ];

  var APPOINTMENTS = [
    { id: 1, patient: 'Pasien 1', doctor: 'Dokter A', date: '2025-06-10', time: '09:00', type: 'Teleconsultation', status: 'confirmed', puskesmas: 'Pusk. Tanjung' },
    { id: 2, patient: 'Pasien 2', doctor: 'Dokter B', date: '2025-06-10', time: '10:30', type: 'Kontrol Rutin',    status: 'confirmed', puskesmas: 'Pusk. Gangga' },
    { id: 3, patient: 'Pasien 1', doctor: 'Dokter A', date: '2025-06-11', time: '08:00', type: 'Teleconsultation', status: 'pending',   puskesmas: 'Pusk. Tanjung' },
    { id: 4, patient: 'Pasien 3', doctor: 'Dokter C', date: '2025-06-09', time: '13:00', type: 'Kontrol Rutin',    status: 'done',      puskesmas: 'Pusk. Nipah' },
    { id: 5, patient: 'Pasien 2', doctor: 'Dokter D', date: '2025-06-12', time: '11:00', type: 'Konsultasi',       status: 'pending',   puskesmas: 'Pusk. Kayangan' },
  ];

  var EMR_HISTORY = [
    { date: '10 Mei 2025', icon: '💊', title: 'Kontrol Hipertensi', body: 'TD: 145/92 mmHg. Terapi amlodipin 5mg dilanjutkan. Kontrol kembali 1 bulan.', doctor: 'Dokter A' },
    { date: '3 Apr 2025',  icon: '🩺', title: 'Teleconsultasi',     body: 'Keluhan pusing dan mual. Diberikan betahistine 12mg. Anjuran cukup istirahat.', doctor: 'Dokter B' },
    { date: '15 Mar 2025', icon: '🔬', title: 'Pemeriksaan Lab',    body: 'GDS 118 mg/dL, HbA1c 6.4%. Prediabetes. Saran perubahan gaya hidup.',         doctor: 'Dokter A' },
    { date: '1 Feb 2025',  icon: '💊', title: 'Kontrol Rutin',      body: 'TD: 138/88 mmHg. Kondisi stabil. Terapi dilanjutkan.',                         doctor: 'Dokter D' },
  ];

  var NOTIFICATIONS = [
    { id: 1, icon: '📅', bg: '#edfcfb', title: 'Jadwal Konsultasi',  msg: 'Konsultasi dengan Dokter A besok pukul 09:00',  time: '2 jam lalu',  unread: true  },
    { id: 2, icon: '❗', bg: '#fff1f2', title: 'Pengingat Kontrol',  msg: 'Jadwal kontrol hipertensi Anda sudah mendekat', time: '5 jam lalu',  unread: true  },
    { id: 3, icon: '📋', bg: '#fffbeb', title: 'Hasil Pemeriksaan',  msg: 'Hasil lab Anda sudah tersedia di rekam medis',  time: '1 hari lalu', unread: true  },
    { id: 4, icon: '✅', bg: '#f0fdf4', title: 'Konsultasi Selesai', msg: 'Konsultasi dengan Dokter B telah selesai',      time: '2 hari lalu', unread: false },
    { id: 5, icon: '💊', bg: '#eff6ff', title: 'Pengingat Obat',     msg: 'Waktunya minum obat amlodipin',                time: '3 hari lalu', unread: false },
  ];

  var MONITORING_DATA = {
    bp:      [{ date:'1 Jun', sys:148 },{ date:'3 Jun', sys:142 },{ date:'5 Jun', sys:138 },{ date:'7 Jun', sys:140 },{ date:'9 Jun', sys:136 },{ date:'11 Jun', sys:133 },{ date:'13 Jun', sys:130 }],
    glucose: [{ date:'1 Jun', val:124 },{ date:'3 Jun', val:118 },{ date:'5 Jun', val:115 },{ date:'7 Jun', val:121 },{ date:'9 Jun', val:112 },{ date:'11 Jun', val:108 },{ date:'13 Jun', val:106 }],
  };

  var PATIENTS_LIST = [
    { id: 'P001', display: 'Pasien 1', initial: 'P1', nik: '5208010101900001', penyakit: ['Hipertensi'],             puskesmas: 'Pusk. Tanjung',  lastVisit: '10 Mei 2025', status: 'Aktif' },
    { id: 'P002', display: 'Pasien 2', initial: 'P2', nik: '5208010201850002', penyakit: ['Diabetes Mellitus'],      puskesmas: 'Pusk. Gangga',   lastVisit: '8 Mei 2025',  status: 'Aktif' },
    { id: 'P003', display: 'Pasien 3', initial: 'P3', nik: '5208010301750003', penyakit: ['Hipertensi','Diabetes'],  puskesmas: 'Pusk. Tanjung',  lastVisit: '5 Mei 2025',  status: 'Aktif' },
    { id: 'P004', display: 'Pasien 4', initial: 'P4', nik: '5208010401950004', penyakit: ['Hipertensi'],             puskesmas: 'Pusk. Nipah',    lastVisit: '1 Mei 2025',  status: 'Aktif' },
    { id: 'P005', display: 'Pasien 5', initial: 'P5', nik: '5208010501800005', penyakit: ['Diabetes Mellitus'],      puskesmas: 'Pusk. Kayangan', lastVisit: '28 Apr 2025', status: 'Aktif' },
    { id: 'P006', display: 'Pasien 6', initial: 'P6', nik: '5208010601920006', penyakit: ['Hipertensi'],             puskesmas: 'Pusk. Bayan',    lastVisit: '20 Apr 2025', status: 'Tidak Aktif' },
  ];

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  var currentPage    = 'dashboard';
  var selectedDoctor = null;
  var selectedDate   = null;
  var selectedTime   = null;
  var calYear        = 2025;
  var calMonth       = 5; // Juni (0-indexed)
  var notifications  = NOTIFICATIONS.map(function(n){ return Object.assign({}, n); });
  var chatMessages   = [
    { from: 'doctor', text: 'Selamat datang! Ada yang bisa saya bantu hari ini?', time: '09:01' }
  ];

  /* ══════════════════════════════════════
     NAV PER ROLE
  ══════════════════════════════════════ */
  var NAV = {
    pasien: [
      { section: 'Menu Utama' },
      { id: 'dashboard',        label: 'Dashboard',           icon: dashIcon() },
      { id: 'teleconsultation', label: 'Teleconsultation',    icon: chatIcon(),  badge: null },
      { id: 'appointment',      label: 'Booking Jadwal',      icon: calIcon() },
      { id: 'monitoring',       label: 'Monitoring Kesehatan',icon: chartIcon() },
      { id: 'emr',              label: 'Rekam Medis (EMR)',   icon: docIcon() },
      { section: 'Lainnya' },
      { id: 'notification',     label: 'Notifikasi',          icon: bellIcon(),  badge: 3 },
      { id: 'profil',           label: 'Profil Saya',         icon: userIcon() },
    ],
    dokter: [
      { section: 'Menu Utama' },
      { id: 'dashboard',        label: 'Dashboard',           icon: dashIcon() },
      { id: 'teleconsultation', label: 'Teleconsultation',    icon: chatIcon(),  badge: 2 },
      { id: 'pasien-list',      label: 'Daftar Pasien',       icon: usersIcon() },
      { id: 'monitoring',       label: 'Monitoring Pasien',   icon: chartIcon() },
      { id: 'emr',              label: 'Rekam Medis (EMR)',   icon: docIcon() },
      { section: 'Lainnya' },
      { id: 'notification',     label: 'Notifikasi',          icon: bellIcon(),  badge: 2 },
      { id: 'profil',           label: 'Profil Saya',         icon: userIcon() },
    ],
    admin: [
      { section: 'Menu Utama' },
      { id: 'dashboard',        label: 'Dashboard',           icon: dashIcon() },
      { id: 'user-management',  label: 'Manajemen Pengguna',  icon: usersIcon() },
      { id: 'appointment',      label: 'Kelola Jadwal',       icon: calIcon() },
      { id: 'emr',              label: 'Database EMR',        icon: docIcon() },
      { section: 'Sistem' },
      { id: 'monitoring',       label: 'Monitoring Sistem',   icon: chartIcon() },
      { id: 'notification',     label: 'Notifikasi',          icon: bellIcon(),  badge: 1 },
      { id: 'profil',           label: 'Pengaturan',          icon: settingsIcon() },
    ],
  };

  /* SVG Icons */
  function svg(p){ return '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">'+p+'</svg>'; }
  function dashIcon()     { return svg('<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>'); }
  function chatIcon()     { return svg('<path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'); }
  function calIcon()      { return svg('<rect x="3" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 2v4M13 2v4M3 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'); }
  function chartIcon()    { return svg('<path d="M3 17l4-6 4 3 4-8 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'); }
  function docIcon()      { return svg('<path d="M7 3H4a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V9l-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 3v6h6M8 13h5M8 10h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'); }
  function bellIcon()     { return svg('<path d="M10 2a6 6 0 00-6 6v2.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14a2 2 0 004 0" stroke="currentColor" stroke-width="1.5"/>'); }
  function userIcon()     { return svg('<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 19c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'); }
  function usersIcon()    { return svg('<circle cx="7" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 18c0-3 2.69-5 6-5m6 0c3.31 0 6 2 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'); }
  function settingsIcon() { return svg('<circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2m0 12v2M2 10h2m12 0h2m-3.05-4.95-1.41 1.41M5.46 14.54l-1.41 1.41m0-11.9 1.41 1.41m9.09 9.09 1.41 1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'); }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    updateUserUI();
    buildNav();
    renderPage(currentPage);
    bindSidebar();
    bindNotifications();
    bindModal();
    bindLogout();
    injectToggleStyle();
  }

  function updateUserUI() {
    document.getElementById('nav-avatar').textContent    = CURRENT_USER.initial;
    document.getElementById('nav-name').textContent      = CURRENT_USER.display;
    document.getElementById('nav-role').textContent      = CURRENT_USER.role === 'pasien' ? 'Pasien' : CURRENT_USER.role === 'dokter' ? (CURRENT_USER.spec || 'Dokter') : 'Administrator';
    document.getElementById('topbar-avatar').textContent = CURRENT_USER.initial;
    document.body.dataset.role                           = currentRole;

    // Sembunyikan role switcher (hanya untuk demo internal, tidak perlu di produksi)
    var rs = document.querySelector('.role-switcher');
    if (rs) rs.style.display = 'none';
  }

  /* ══════════════════════════════════════
     NAV
  ══════════════════════════════════════ */
  function buildNav() {
    var nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    var items = NAV[currentRole] || NAV['pasien'];
    items.forEach(function(item) {
      if (item.section) {
        nav.insertAdjacentHTML('beforeend', '<div class="nav-section-label">'+item.section+'</div>');
        return;
      }
      var el = document.createElement('div');
      el.className = 'nav-item' + (item.id === currentPage ? ' active' : '');
      el.dataset.page = item.id;
      el.innerHTML = item.icon + '<span>' + item.label + '</span>' + (item.badge ? '<span class="nav-badge">'+item.badge+'</span>' : '');
      el.addEventListener('click', function(){ navigateTo(item.id); });
      nav.appendChild(el);
    });
  }

  var PAGE_TITLES = {
    dashboard: 'Dashboard', teleconsultation: 'Teleconsultation',
    appointment: 'Booking Jadwal', monitoring: 'Monitoring Kesehatan',
    emr: 'Rekam Medis Elektronik', notification: 'Notifikasi',
    profil: 'Profil', 'pasien-list': 'Daftar Pasien',
    'user-management': 'Manajemen Pengguna',
  };

  function navigateTo(page) {
    currentPage = page;
    buildNav();
    renderPage(page);
    document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || 'Dashboard';
    if (window.innerWidth <= 720) {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.remove('show');
    }
    window.scrollTo(0,0);
  }

  /* ══════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════ */
  function bindSidebar() {
    var sidebar  = document.getElementById('sidebar');
    var overlay  = document.getElementById('sidebar-overlay');
    var hamburger = document.getElementById('hamburger');
    var closeBtn = document.getElementById('sidebar-close');

    hamburger && hamburger.addEventListener('click', function(){
      sidebar.classList.add('open');
      overlay.classList.add('show');
    });
    [overlay, closeBtn].forEach(function(el){
      el && el.addEventListener('click', function(){
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    });
  }

  /* ══════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════ */
  function bindLogout() {
    document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', function(){
      sessionStorage.removeItem('mth_user');
      showToast('Keluar dari sistem...', 'Bye');
      setTimeout(function(){ window.location.href = 'index.html'; }, 1000);
    });
  }

  /* ══════════════════════════════════════
     NOTIFICATIONS
  ══════════════════════════════════════ */
  function bindNotifications() {
    var btn     = document.getElementById('notif-btn');
    var panel   = document.getElementById('notif-panel');
    var overlay = document.getElementById('notif-overlay');
    var clear   = document.getElementById('notif-clear');

    renderNotifList();

    btn && btn.addEventListener('click', function(){
      panel.classList.add('open');
      overlay.classList.add('show');
    });
    overlay && overlay.addEventListener('click', function(){
      panel.classList.remove('open');
      overlay.classList.remove('show');
    });
    clear && clear.addEventListener('click', function(){
      notifications.forEach(function(n){ n.unread = false; });
      renderNotifList();
      updateNotifBadge();
      showToast('Semua notifikasi ditandai dibaca', 'OK');
    });
  }

  function renderNotifList() {
    var list = document.getElementById('notif-list');
    if (!list) return;
    list.innerHTML = notifications.map(function(n){
      return '<div class="notif-item'+(n.unread?' unread':'')+'" data-id="'+n.id+'">'
        +'<div class="notif-item-icon" style="background:'+n.bg+'">'+n.icon+'</div>'
        +'<div class="notif-item-body">'
          +'<div class="notif-item-title">'+n.title+'</div>'
          +'<div class="notif-item-msg">'+n.msg+'</div>'
          +'<div class="notif-item-time">'+n.time+'</div>'
        +'</div></div>';
    }).join('');
    list.querySelectorAll('.notif-item').forEach(function(el){
      el.addEventListener('click', function(){
        var id = parseInt(el.dataset.id);
        var n  = notifications.find(function(x){ return x.id === id; });
        if (n) n.unread = false;
        renderNotifList();
        updateNotifBadge();
      });
    });
  }

  function updateNotifBadge() {
    var cnt   = notifications.filter(function(n){ return n.unread; }).length;
    var badge = document.getElementById('notif-badge');
    if (!badge) return;
    badge.textContent    = cnt;
    badge.style.display  = cnt > 0 ? '' : 'none';
  }

  /* ══════════════════════════════════════
     MODAL
  ══════════════════════════════════════ */
  function bindModal() {
    document.getElementById('modal-close') && document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay') && document.getElementById('modal-overlay').addEventListener('click', function(e){
      if (e.target === e.currentTarget) closeModal();
    });
  }

  function openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML    = bodyHTML;
    document.getElementById('modal-overlay').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
  }

  /* ══════════════════════════════════════
     TOAST
  ══════════════════════════════════════ */
  var toastTimer;
  function showToast(msg, icon) {
    icon = icon || 'OK';
    clearTimeout(toastTimer);
    document.getElementById('toast-msg').textContent = msg;
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast').classList.add('show');
    toastTimer = setTimeout(function(){ document.getElementById('toast').classList.remove('show'); }, 3000);
  }

  /* ══════════════════════════════════════
     PAGE RENDERER
  ══════════════════════════════════════ */
  function renderPage(page) {
    var content = document.getElementById('content');
    content.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'page';
    div.innerHTML  = getPageHTML(page);
    content.appendChild(div);
    bindPageInteractions(page);
  }

  function getPageHTML(page) {
    switch(page) {
      case 'dashboard':        return currentRole === 'pasien' ? dashboardPasien() : currentRole === 'dokter' ? dashboardDokter() : dashboardAdmin();
      case 'teleconsultation': return pageTeleconsultation();
      case 'appointment':      return pageAppointment();
      case 'monitoring':       return pageMonitoring();
      case 'emr':              return pageEMR();
      case 'notification':     return pageNotification();
      case 'pasien-list':      return pagePatientList();
      case 'user-management':  return pageUserManagement();
      case 'profil':           return pageProfil();
      default:                 return '<div class="page-header"><h2 class="page-title">Halaman tidak ditemukan</h2></div>';
    }
  }

  /* ══════════════════════════════════════
     DASHBOARD PASIEN
  ══════════════════════════════════════ */
  function dashboardPasien() {
    var myAppts = APPOINTMENTS.filter(function(a){ return a.patient === CURRENT_USER.display; });
    var next    = myAppts.find(function(a){ return a.status !== 'done'; });

    return ''
      +'<div class="greeting-banner">'
        +'<div class="greeting-text"><h2>Selamat Datang, '+CURRENT_USER.display+'! 👋</h2><p>Senin, 13 Juni 2025 &nbsp;·&nbsp; '+CURRENT_USER.faskes+'</p></div>'
        +'<div class="greeting-actions">'
          +'<button class="btn" onclick="window.navigateTo(\'teleconsultation\')">🩺 Konsultasi Sekarang</button>'
          +'<button class="btn" onclick="window.navigateTo(\'appointment\')">📅 Buat Janji</button>'
          +'<button class="btn" onclick="window.navigateTo(\'monitoring\')">📊 Input Data Kesehatan</button>'
        +'</div>'
      +'</div>'

      +(next ? ''
        +'<div class="appt-next">'
          +'<div class="appt-date-box"><div class="month">Jun</div><div class="day">'+next.date.split('-')[2]+'</div></div>'
          +'<div class="appt-info"><div class="appt-doctor">'+next.doctor+'</div><div class="appt-detail">📍 '+CURRENT_USER.faskes+' &nbsp;·&nbsp; ⏰ '+next.time+' WIB &nbsp;·&nbsp; 💻 '+next.type+'</div></div>'
          +'<span class="badge '+(next.status==='confirmed'?'badge-success':'badge-warn')+'">'+(next.status==='confirmed'?'Terkonfirmasi':'Menunggu')+'</span>'
        +'</div>'
      : '')

      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +statCard('🩺','Konsultasi Bulan Ini','4 Sesi','↑ 1 dari bulan lalu','up','teal')
        +statCard('❤️','Tekanan Darah','130/83','Terkontrol','up','rose')
        +statCard('🍬','Gula Darah','106 mg/dL','Membaik ↓','up','amber')
        +statCard('📋','Rekam Medis','12 Entri','Terakhir 10 Mei','','blue')
      +'</div>'

      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📊</span>Tekanan Darah (7 Hari)</div>'
          +miniBarChart(MONITORING_DATA.bp.map(function(d){ return d.sys; }), MONITORING_DATA.bp.map(function(d){ return d.date; }), 110, 165, '#e05252')
        +'</div>'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📅</span>Jadwal Konsultasi Saya</div>'
          +(myAppts.length ? myAppts.map(apptRow).join('') : '<p style="color:var(--slate-400);font-size:.84rem;padding:.5rem 0">Belum ada jadwal.</p>')
          +'<button class="btn btn-outline btn-sm" style="margin-top:.75rem;width:100%" onclick="window.navigateTo(\'appointment\')">+ Buat Janji Baru</button>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     DASHBOARD DOKTER
  ══════════════════════════════════════ */
  function dashboardDokter() {
    return ''
      +'<div class="greeting-banner">'
        +'<div class="greeting-text"><h2>Selamat Pagi, '+CURRENT_USER.display+'! 👋</h2><p>Senin, 13 Juni 2025 &nbsp;·&nbsp; '+CURRENT_USER.faskes+'</p></div>'
        +'<div class="greeting-actions">'
          +'<button class="btn" onclick="window.navigateTo(\'teleconsultation\')">💬 Mulai Teleconsultasi</button>'
          +'<button class="btn" onclick="window.navigateTo(\'pasien-list\')">👥 Lihat Pasien</button>'
        +'</div>'
      +'</div>'
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +statCard('👥','Total Pasien Hari Ini','8 Pasien','2 menunggu','','teal')
        +statCard('💬','Teleconsultasi','3 Sesi','1 berlangsung','','blue')
        +statCard('⚠️','Perlu Perhatian','2 Pasien','Hasil abnormal','down','rose')
        +statCard('✅','Konsultasi Selesai','5 Sesi','Hari ini','up','green')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📅</span>Jadwal Hari Ini</div>'
          +APPOINTMENTS.slice(0,4).map(function(a){
            return '<div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--slate-100)">'
              +'<div class="avatar">'+a.patient.replace('Pasien ','P').trim().slice(0,2)+'</div>'
              +'<div style="flex:1"><div style="font-size:.84rem;font-weight:600">'+a.patient+'</div><div style="font-size:.73rem;color:var(--slate-500)">'+a.time+' · '+a.type+'</div></div>'
              +'<span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Konfirmasi':a.status==='pending'?'Menunggu':'Selesai')+'</span>'
            +'</div>';
          }).join('')
        +'</div>'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📊</span>Monitoring Pasien Kronis</div>'
          +'<div style="font-size:.82rem;color:var(--slate-500);margin-bottom:.75rem">Pasien dengan nilai di luar normal:</div>'
          +[{display:'Pasien 3',issue:'TD: 158/98 mmHg',type:'Hipertensi',warn:'error'},{display:'Pasien 2',issue:'GDS: 248 mg/dL',type:'Diabetes',warn:'warn'}].map(function(p){
            return '<div style="display:flex;align-items:center;gap:.75rem;padding:.6rem .85rem;background:var(--slate-50);border-radius:10px;margin-bottom:.5rem;border-left:3px solid var(--'+(p.warn==='error'?'error':'warn')+')">'
              +'<div class="avatar" style="background:linear-gradient(135deg,var(--'+(p.warn==='error'?'error':'warn')+'),#888)">'+p.display.replace('Pasien ','P')+'</div>'
              +'<div style="flex:1"><div style="font-size:.84rem;font-weight:600">'+p.display+'</div><div style="font-size:.72rem;color:var(--slate-500)">'+p.issue+' · '+p.type+'</div></div>'
              +'<button class="btn btn-sm btn-outline" onclick="window.navigateTo(\'emr\')">Lihat EMR</button>'
            +'</div>';
          }).join('')
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     DASHBOARD ADMIN
  ══════════════════════════════════════ */
  function dashboardAdmin() {
    return ''
      +'<div class="greeting-banner">'
        +'<div class="greeting-text"><h2>Dashboard Administrator 🛠️</h2><p>Senin, 13 Juni 2025 &nbsp;·&nbsp; RSUD Tanjung — Sistem berjalan normal</p></div>'
        +'<div class="greeting-actions">'
          +'<button class="btn" onclick="window.navigateTo(\'user-management\')">👥 Kelola Pengguna</button>'
          +'<button class="btn" onclick="window.showToast(\'Backup dimulai...\',\'💾\')">💾 Backup Data</button>'
        +'</div>'
      +'</div>'
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +statCard('👥','Total Pengguna','247','↑ 12 bulan ini','up','teal')
        +statCard('👨‍⚕️','Dokter Aktif','18','9 puskesmas','','blue')
        +statCard('📋','Total Konsultasi','1.284','Bulan ini','up','green')
        +statCard('🖥️','Status Sistem','Online','Uptime 99.8%','up','teal')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📊</span>Kunjungan per Kecamatan (2025)</div>'
          +adminBarChart()
        +'</div>'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">⚙️</span>Status Layanan</div>'
          +[{label:'Server Cloud',ok:true},{label:'Database EMR',ok:true},{label:'Pusk. Tanjung',ok:true},{label:'Pusk. Bayan',ok:false},{label:'Notifikasi Push',ok:true}].map(function(s){
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--slate-100)">'
              +'<span style="font-size:.84rem">'+s.label+'</span>'
              +'<span class="badge '+(s.ok?'badge-success':'badge-error')+'">'+(s.ok?'Online':'Gangguan')+'</span>'
            +'</div>';
          }).join('')
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: TELECONSULTATION
  ══════════════════════════════════════ */
  function pageTeleconsultation() {
    var docCards = DOCTORS.map(function(d){
      return '<div class="doctor-card'+(selectedDoctor===d.id?' selected':'')+'" data-doc="'+d.id+'">'
        +'<div class="doctor-avatar">'+d.initial+'</div>'
        +'<div class="doctor-name">'+d.display+'</div>'
        +'<div class="doctor-spec">'+d.spec+'</div>'
        +'<div class="doctor-faskes">'+d.faskes+'</div>'
        +'<div class="doctor-status'+(d.online?' online':'')+'">'+( d.online?'Online':'Offline')+'</div>'
      +'</div>';
    }).join('');

    var selDoc = selectedDoctor ? DOCTORS.find(function(d){ return d.id===selectedDoctor; }) : null;
    var chatHTML = chatMessages.map(function(m){
      return '<div class="msg '+(m.from==='doctor'?'received':'sent')+'">'
        +'<div class="msg-bubble">'+m.text+'</div>'
        +'<div class="msg-time">'+m.time+'</div>'
      +'</div>';
    }).join('');

    return ''
      +'<div class="page-header"><h2 class="page-title">Teleconsultation</h2><p class="page-subtitle">Konsultasi kesehatan jarak jauh dengan dokter pilihan Anda</p></div>'
      +'<div class="grid-2">'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title"><span class="card-title-icon">👨‍⚕️</span>Pilih Dokter</div>'
            +'<div class="doctor-grid" id="doctor-grid">'+docCards+'</div>'
          +'</div>'
        +'</div>'
        +'<div>'
          +'<div class="chat-wrap">'
            +'<div class="chat-header">'
              +'<div class="doctor-avatar" style="width:38px;height:38px;font-size:.85rem;margin:0">'+(selDoc?selDoc.initial:'?')+'</div>'
              +'<div><div class="doctor-name" id="chat-doctor-name">'+(selDoc?selDoc.display:'Pilih dokter terlebih dahulu')+'</div>'
                +'<div class="doctor-spec" id="chat-doctor-spec">'+(selDoc?selDoc.spec:'')+'</div></div>'
              +(selDoc?'<span class="badge badge-success" style="margin-left:auto">Online</span>':'')
            +'</div>'
            +'<div class="chat-messages" id="chat-messages">'+chatHTML+'</div>'
            +'<div class="chat-input-area">'
              +'<input class="chat-input" id="chat-input" placeholder="Ketik pesan..." '+(selDoc?'':'disabled')+' />'
              +'<button class="chat-send" id="chat-send" '+(selDoc?'':'disabled')+'>'
                +'<svg viewBox="0 0 20 20" fill="none"><path d="M18 10L3 3l3 7-3 7 15-7z" fill="currentColor"/></svg>'
              +'</button>'
            +'</div>'
          +'</div>'
          +'<div class="card" style="margin-top:1rem">'
            +'<div class="card-title"><span class="card-title-icon">📋</span>Keluhan &amp; Gejala</div>'
            +'<div class="form-group"><label class="form-label">Keluhan Utama</label>'
              +'<textarea class="form-textarea" placeholder="Tuliskan keluhan atau gejala yang Anda rasakan..." id="keluhan-input"></textarea>'
            +'</div>'
            +'<button class="btn btn-primary" style="width:100%" id="send-keluhan-btn">Kirim ke Dokter</button>'
          +'</div>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: APPOINTMENT
  ══════════════════════════════════════ */
  function pageAppointment() {
    var MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    var apptTable = APPOINTMENTS.map(function(a){
      return '<tr>'
        +'<td><div style="font-weight:500">'+a.patient+'</div><div style="font-size:.72rem;color:var(--slate-400)">'+a.puskesmas+'</div></td>'
        +'<td>'+a.doctor+'</td>'
        +'<td>'+a.date+'<br><span style="font-size:.75rem;color:var(--slate-400)">'+a.time+'</span></td>'
        +'<td>'+a.type+'</td>'
        +'<td><span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Konfirmasi':a.status==='pending'?'Menunggu':'Selesai')+'</span></td>'
        +'<td><div style="display:flex;gap:.4rem">'
          +'<button class="btn btn-sm btn-outline" onclick="window.showApptDetail('+a.id+')">Detail</button>'
          +(a.status!=='done'?'<button class="btn btn-sm btn-danger" onclick="window.showToast(\'Janji dibatalkan\',\'!\')">Batal</button>':'')
        +'</div></td>'
      +'</tr>';
    }).join('');

    return ''
      +'<div class="page-header"><h2 class="page-title">'+(currentRole==='admin'?'Kelola Jadwal':'Booking Jadwal Konsultasi')+'</h2><p class="page-subtitle">Atur jadwal konsultasi dengan mudah</p></div>'
      +'<div class="grid-2" style="margin-bottom:1.5rem;align-items:start">'
        +'<div class="card">'
          +'<div class="card-title"><span class="card-title-icon">➕</span>Buat Janji Baru</div>'
          +'<div class="form-group"><label class="form-label">Pilih Dokter</label>'
            +'<select class="form-select" id="book-doctor"><option value="">-- Pilih dokter --</option>'
              +DOCTORS.map(function(d){ return '<option value="'+d.id+'">'+d.display+' — '+d.spec+'</option>'; }).join('')
            +'</select>'
          +'</div>'
          +'<div class="form-group"><label class="form-label">Jenis Layanan</label>'
            +'<select class="form-select"><option>Teleconsultation</option><option>Kontrol Rutin</option><option>Konsultasi Pertama</option></select>'
          +'</div>'
          +'<div class="form-group"><label class="form-label">Pilih Tanggal</label>'
            +'<div class="cal-header">'
              +'<button class="cal-nav" id="cal-prev"><svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>'
              +'<span class="cal-month" id="cal-month-label">'+MONTH_NAMES[calMonth]+' '+calYear+'</span>'
              +'<button class="cal-nav" id="cal-next"><svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>'
            +'</div>'
            +'<div class="cal-grid" id="cal-grid">'+buildCalendar(calYear, calMonth)+'</div>'
          +'</div>'
          +'<div class="form-group"><label class="form-label">Pilih Waktu</label>'
            +'<div class="time-slots" id="time-slots">'
              +['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30'].map(function(t,i){
                return '<div class="time-slot'+(i===2||i===5?' full':'')+'" data-time="'+t+'">'+t+'</div>';
              }).join('')
            +'</div>'
          +'</div>'
          +'<button class="btn btn-primary" style="width:100%" id="book-confirm-btn">Konfirmasi Janji</button>'
        +'</div>'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📋</span>Daftar Jadwal</div>'
          +'<div class="table-wrap"><table>'
            +'<thead><tr><th>Pasien</th><th>Dokter</th><th>Tgl/Waktu</th><th>Tipe</th><th>Status</th><th>Aksi</th></tr></thead>'
            +'<tbody id="appt-table">'+apptTable+'</tbody>'
          +'</table></div>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: MONITORING
  ══════════════════════════════════════ */
  function pageMonitoring() {
    return ''
      +'<div class="page-header"><h2 class="page-title">Monitoring Kesehatan</h2><p class="page-subtitle">Pantau perkembangan kondisi kesehatan secara berkala</p></div>'
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +statCard('❤️','Tekanan Darah Terbaru','130/83 mmHg','Senin, 13 Jun','up','rose')
        +statCard('🍬','Gula Darah Terbaru','106 mg/dL','Senin, 13 Jun','up','amber')
        +statCard('⚖️','Berat Badan','68 kg','Stabil','','teal')
        +statCard('💓','Denyut Nadi','76 bpm','Normal','up','blue')
      +'</div>'
      +'<div class="monitoring-input-card" style="margin-bottom:1.25rem">'
        +'<div class="card-title" style="color:var(--teal-700)"><span class="card-title-icon">➕</span>Input Data Kesehatan Hari Ini</div>'
        +'<div class="form-row-2">'
          +'<div class="form-group"><label class="form-label">Tekanan Darah Sistolik (mmHg)</label><input type="number" class="form-input" placeholder="contoh: 130" id="input-sys" /></div>'
          +'<div class="form-group"><label class="form-label">Tekanan Darah Diastolik (mmHg)</label><input type="number" class="form-input" placeholder="contoh: 83" id="input-dia" /></div>'
          +'<div class="form-group"><label class="form-label">Gula Darah (mg/dL)</label><input type="number" class="form-input" placeholder="contoh: 106" id="input-glucose" /></div>'
          +'<div class="form-group"><label class="form-label">Denyut Nadi (bpm)</label><input type="number" class="form-input" placeholder="contoh: 76" id="input-pulse" /></div>'
        +'</div>'
        +'<div class="form-group"><label class="form-label">Catatan Tambahan</label><textarea class="form-textarea" placeholder="Gejala, aktivitas, atau catatan lain..." id="input-note"></textarea></div>'
        +'<button class="btn btn-primary" id="save-monitoring-btn">💾 Simpan Data Kesehatan</button>'
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">❤️</span>Riwayat Tekanan Darah (7 Hari)</div>'
          +miniBarChart(MONITORING_DATA.bp.map(function(d){ return d.sys; }), MONITORING_DATA.bp.map(function(d){ return d.date; }), 110, 165, '#e05252')
          +'<div style="font-size:.76rem;color:var(--slate-400);margin-top:.5rem">Normal: &lt;120/80 mmHg · Pre-hipertensi: 120–139</div>'
        +'</div>'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">🍬</span>Riwayat Gula Darah (7 Hari)</div>'
          +miniBarChart(MONITORING_DATA.glucose.map(function(d){ return d.val; }), MONITORING_DATA.glucose.map(function(d){ return d.date; }), 80, 140, '#e08a2e')
          +'<div style="font-size:.76rem;color:var(--slate-400);margin-top:.5rem">Normal puasa: 70–100 mg/dL · Prediabetes: 100–125</div>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: EMR
  ══════════════════════════════════════ */
  function pageEMR() {
    var u = CURRENT_USER;
    return ''
      +'<div class="page-header"><h2 class="page-title">Rekam Medis Elektronik</h2><p class="page-subtitle">Riwayat kesehatan dan catatan medis lengkap</p></div>'
      +'<div class="emr-profile">'
        +'<div class="emr-avatar">'+u.initial+'</div>'
        +'<div class="emr-meta">'
          +'<h3>'+u.display+'</h3>'
          +'<p>'+u.faskes+' &nbsp;·&nbsp; No. RM: RM-2025-0042</p>'
          +'<div class="emr-tags"><span class="emr-tag">Hipertensi</span><span class="emr-tag">Prediabetes</span><span class="emr-tag">Amlodipin 5mg</span></div>'
        +'</div>'
        +'<div style="display:flex;flex-direction:column;gap:.5rem;align-items:flex-end;flex-shrink:0">'
          +'<button class="btn btn-outline btn-sm" onclick="window.showToast(\'Mengunduh rekam medis...\',\'📥\')">⬇ Unduh PDF</button>'
          +'<button class="btn btn-ghost btn-sm" onclick="window.showToast(\'Cetak rekam medis...\',\'🖨\')">🖨 Cetak</button>'
        +'</div>'
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title"><span class="card-title-icon">📋</span>Riwayat Konsultasi</div>'
          +'<div class="emr-timeline">'
            +EMR_HISTORY.map(function(h){
              return '<div class="timeline-item">'
                +'<div class="timeline-dot">'+h.icon+'</div>'
                +'<div class="timeline-content">'
                  +'<div class="timeline-date">'+h.date+' · '+h.doctor+'</div>'
                  +'<div class="timeline-title">'+h.title+'</div>'
                  +'<div class="timeline-body">'+h.body+'</div>'
                +'</div></div>';
            }).join('')
          +'</div>'
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title"><span class="card-title-icon">💊</span>Obat Aktif</div>'
            +[{name:'Amlodipin 5mg',dose:'1x1 sehari',note:'Setelah makan'},{name:'Betahistin 12mg',dose:'2x1 sehari',note:'Pagi & sore'}].map(function(o){
              return '<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 0;border-bottom:1px solid var(--slate-100)">'
                +'<div style="width:36px;height:36px;background:var(--teal-50);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem">💊</div>'
                +'<div><div style="font-size:.85rem;font-weight:600">'+o.name+'</div><div style="font-size:.74rem;color:var(--slate-500)">'+o.dose+' · '+o.note+'</div></div>'
              +'</div>';
            }).join('')
          +'</div>'
          +'<div class="card"><div class="card-title"><span class="card-title-icon">🔬</span>Hasil Lab Terbaru</div>'
            +[['Gula Darah Puasa','118 mg/dL','Prediabetes','warn'],['HbA1c','6.4%','Prediabetes','warn'],['Kolesterol','198 mg/dL','Normal','success'],['Kreatinin','0.9 mg/dL','Normal','success']].map(function(r){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.55rem 0;border-bottom:1px solid var(--slate-100)">'
                +'<span style="font-size:.82rem">'+r[0]+'</span>'
                +'<div style="text-align:right"><div style="font-size:.85rem;font-weight:600">'+r[1]+'</div><span class="badge badge-'+r[3]+'">'+r[2]+'</span></div>'
              +'</div>';
            }).join('')
          +'</div>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: NOTIFICATION
  ══════════════════════════════════════ */
  function pageNotification() {
    return ''
      +'<div class="page-header"><h2 class="page-title">Notifikasi</h2><p class="page-subtitle">Pengingat jadwal, hasil pemeriksaan, dan informasi kesehatan</p></div>'
      +'<div class="card">'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'
          +'<span style="font-size:.84rem;color:var(--slate-500)">'+notifications.filter(function(n){ return n.unread; }).length+' belum dibaca</span>'
          +'<button class="btn btn-ghost btn-sm" onclick="window.markAllRead()">Tandai semua dibaca</button>'
        +'</div>'
        +'<div id="full-notif-list">'
          +notifications.map(function(n){
            return '<div class="notif-item'+(n.unread?' unread':'')+'" data-id="'+n.id+'" style="margin:0 -1.25rem;padding-left:1.25rem;padding-right:1.25rem">'
              +'<div class="notif-item-icon" style="background:'+n.bg+'">'+n.icon+'</div>'
              +'<div class="notif-item-body"><div class="notif-item-title">'+n.title+'</div><div class="notif-item-msg">'+n.msg+'</div><div class="notif-item-time">'+n.time+'</div></div>'
              +(n.unread?'<div style="width:8px;height:8px;border-radius:50%;background:var(--teal-400);flex-shrink:0"></div>':'')
            +'</div>';
          }).join('')
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: PATIENT LIST (Dokter)
  ══════════════════════════════════════ */
  function pagePatientList() {
    return ''
      +'<div class="page-header"><h2 class="page-title">Daftar Pasien</h2><p class="page-subtitle">Kelola dan pantau kondisi pasien Anda</p></div>'
      +'<div class="card">'
        +'<div class="search-bar">'
          +'<div class="search-input-wrap">'
            +'<svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            +'<input class="search-input" placeholder="Cari ID pasien, penyakit..." id="patient-search" />'
          +'</div>'
          +'<select class="form-select" style="width:auto;min-width:150px"><option>Semua Penyakit</option><option>Hipertensi</option><option>Diabetes Mellitus</option></select>'
        +'</div>'
        +'<div class="table-wrap"><table>'
          +'<thead><tr><th>No. RM</th><th>Pasien</th><th>Penyakit</th><th>Puskesmas</th><th>Kunjungan Terakhir</th><th>Status</th><th>Aksi</th></tr></thead>'
          +'<tbody>'
            +PATIENTS_LIST.map(function(p){
              return '<tr>'
                +'<td style="font-family:monospace;font-size:.8rem">'+p.id+'</td>'
                +'<td><div style="display:flex;align-items:center;gap:.6rem"><div class="avatar" style="width:30px;height:30px;font-size:.7rem">'+p.initial+'</div><span style="font-weight:500">'+p.display+'</span></div></td>'
                +'<td>'+p.penyakit.map(function(d){ return '<span class="badge badge-info" style="margin-right:.2rem">'+d+'</span>'; }).join('')+'</td>'
                +'<td style="font-size:.82rem">'+p.puskesmas+'</td>'
                +'<td style="font-size:.82rem">'+p.lastVisit+'</td>'
                +'<td><span class="badge '+(p.status==='Aktif'?'badge-success':'badge-neutral')+'">'+p.status+'</span></td>'
                +'<td><div style="display:flex;gap:.4rem">'
                  +'<button class="btn btn-sm btn-outline" onclick="window.navigateTo(\'emr\')">EMR</button>'
                  +'<button class="btn btn-sm btn-primary" onclick="window.navigateTo(\'teleconsultation\')">Konsul</button>'
                +'</div></td>'
              +'</tr>';
            }).join('')
          +'</tbody>'
        +'</table></div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: USER MANAGEMENT (Admin)
  ══════════════════════════════════════ */
  function pageUserManagement() {
    var users = [
      {initial:'P1',display:'Pasien 1',email:'pasien1@gmail.com',role:'Pasien',faskes:'Pusk. Tanjung',date:'1 Jan 2025',status:'Aktif'},
      {initial:'DA',display:'Dokter A',email:'dokter1@gmail.com',role:'Dokter',faskes:'RSUD Tanjung',date:'15 Des 2024',status:'Aktif'},
      {initial:'P2',display:'Pasien 2',email:'pasien2@gmail.com',role:'Pasien',faskes:'Pusk. Gangga',date:'10 Feb 2025',status:'Aktif'},
      {initial:'DB',display:'Dokter B',email:'dokter2@gmail.com',role:'Dokter',faskes:'RSUD Tanjung',date:'1 Nov 2024',status:'Aktif'},
      {initial:'P3',display:'Pasien 3',email:'pasien3@gmail.com',role:'Pasien',faskes:'Pusk. Bayan',date:'5 Mar 2025',status:'Aktif'},
      {initial:'DC',display:'Dokter C',email:'dokter3@gmail.com',role:'Dokter',faskes:'Pusk. Tanjung',date:'20 Jan 2025',status:'Aktif'},
    ];
    return ''
      +'<div class="page-header"><h2 class="page-title">Manajemen Pengguna</h2><p class="page-subtitle">Kelola akun pasien, dokter, dan administrator sistem</p></div>'
      +'<div class="grid-3" style="margin-bottom:1.25rem">'
        +statCard('👤','Total Pasien','229 Akun','↑ 10 bulan ini','up','teal')
        +statCard('👨‍⚕️','Total Dokter','18 Akun','9 puskesmas','','blue')
        +statCard('⚙️','Administrator','3 Akun','Terverifikasi','','green')
      +'</div>'
      +'<div class="card">'
        +'<div class="search-bar">'
          +'<div class="search-input-wrap">'
            +'<svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            +'<input class="search-input" placeholder="Cari ID, email..." />'
          +'</div>'
          +'<select class="form-select" style="width:auto;min-width:130px"><option>Semua Role</option><option>Pasien</option><option>Dokter</option><option>Admin</option></select>'
          +'<button class="btn btn-primary btn-sm" onclick="window.openAddUserModal()">+ Tambah Pengguna</button>'
        +'</div>'
        +'<div class="table-wrap"><table>'
          +'<thead><tr><th>Pengguna</th><th>Email</th><th>Role</th><th>Fasilitas</th><th>Terdaftar</th><th>Status</th><th>Aksi</th></tr></thead>'
          +'<tbody>'
            +users.map(function(u){
              return '<tr>'
                +'<td><div style="display:flex;align-items:center;gap:.6rem"><div class="avatar" style="width:30px;height:30px;font-size:.7rem">'+u.initial+'</div>'+u.display+'</div></td>'
                +'<td style="font-size:.8rem;color:var(--slate-500)">'+u.email+'</td>'
                +'<td><span class="badge '+(u.role==='Dokter'?'badge-info':u.role==='Admin'?'badge-warn':'badge-neutral')+'">'+u.role+'</span></td>'
                +'<td style="font-size:.8rem">'+u.faskes+'</td>'
                +'<td style="font-size:.8rem;color:var(--slate-400)">'+u.date+'</td>'
                +'<td><span class="badge '+(u.status==='Aktif'?'badge-success':'badge-error')+'">'+u.status+'</span></td>'
                +'<td><div style="display:flex;gap:.4rem">'
                  +'<button class="btn btn-sm btn-outline" onclick="window.showToast(\'Edit pengguna...\',\'!\')">Edit</button>'
                  +'<button class="btn btn-sm btn-danger" onclick="window.showToast(\'Pengguna dinonaktifkan\',\'!\')">Nonaktif</button>'
                +'</div></td>'
              +'</tr>';
            }).join('')
          +'</tbody>'
        +'</table></div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     PAGE: PROFIL
  ══════════════════════════════════════ */
  function pageProfil() {
    var u = CURRENT_USER;
    var roleLabel = u.role === 'pasien' ? 'Pasien' : u.role === 'dokter' ? (u.spec || 'Dokter') : 'Administrator';
    return ''
      +'<div class="page-header"><h2 class="page-title">Profil '+(u.role==='admin'?'& Pengaturan':'Saya')+'</h2></div>'
      +'<div class="grid-2">'
        +'<div class="card">'
          +'<div style="text-align:center;padding:1rem 0 1.5rem">'
            +'<div class="emr-avatar" style="width:72px;height:72px;font-size:1.6rem;margin:0 auto 1rem">'+u.initial+'</div>'
            +'<div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700">'+u.display+'</div>'
            +'<div style="font-size:.82rem;color:var(--teal-600);font-weight:500;margin:.25rem 0">'+roleLabel+'</div>'
            +'<div style="font-size:.78rem;color:var(--slate-500)">'+u.faskes+'</div>'
          +'</div>'
          +'<div style="border-top:1px solid var(--slate-100);padding-top:1rem">'
            +[['Email',u.email||'-'],['Fasilitas',u.faskes||'-'],['Role',roleLabel]].map(function(r){
              return '<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--slate-100)">'
                +'<span style="font-size:.8rem;color:var(--slate-500)">'+r[0]+'</span>'
                +'<span style="font-size:.82rem;font-weight:500">'+r[1]+'</span>'
              +'</div>';
            }).join('')
          +'</div>'
          +'<button class="btn btn-outline" style="width:100%;margin-top:1rem" onclick="window.showToast(\'Edit profil dibuka\',\'!\')">✏️ Edit Profil</button>'
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔒 Keamanan Akun</div>'
            +'<button class="btn btn-outline" style="width:100%;margin-bottom:.65rem" onclick="window.showToast(\'Ganti kata sandi...\',\'!\')">🔑 Ubah Kata Sandi</button>'
            +'<button class="btn btn-outline" style="width:100%" onclick="window.showToast(\'Autentikasi 2 faktor aktif\',\'OK\')">📱 Autentikasi 2 Faktor</button>'
          +'</div>'
          +'<div class="card"><div class="card-title">🔔 Preferensi Notifikasi</div>'
            +[['Pengingat Jadwal Konsultasi',true],['Hasil Pemeriksaan',true],['Pengingat Obat',true],['Info Kesehatan',false]].map(function(r){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--slate-100)">'
                +'<span style="font-size:.84rem">'+r[0]+'</span>'
                +'<div class="toggle-switch'+(r[1]?' on':'')+'" onclick="this.classList.toggle(\'on\')"></div>'
              +'</div>';
            }).join('')
          +'</div>'
        +'</div>'
      +'</div>';
  }

  /* ══════════════════════════════════════
     HELPERS UI
  ══════════════════════════════════════ */
  function statCard(icon, label, value, sub, trend, color) {
    return '<div class="stat-card">'
      +'<div class="stat-icon-wrap '+color+'">'+icon+'</div>'
      +'<div class="stat-body">'
        +'<div class="stat-value">'+value+'</div>'
        +'<div class="stat-label">'+label+'</div>'
        +'<div class="stat-change '+(trend||'')+'">'+sub+'</div>'
      +'</div>'
    +'</div>';
  }

  function apptRow(a) {
    return '<div style="display:flex;align-items:center;gap:.65rem;padding:.5rem 0;border-bottom:1px solid var(--slate-100)">'
      +'<div style="font-size:.8rem;font-weight:600;color:var(--teal-700);min-width:38px">'+a.time+'</div>'
      +'<div style="flex:1"><div style="font-size:.82rem;font-weight:500">'+a.doctor+'</div><div style="font-size:.72rem;color:var(--slate-400)">'+a.date+' · '+a.type+'</div></div>'
      +'<span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Konfirmasi':a.status==='pending'?'Menunggu':'Selesai')+'</span>'
    +'</div>';
  }

  function miniBarChart(values, labels, min, max, color) {
    color = color || 'var(--teal-600)';
    var maxH = 90;
    var bars = values.map(function(v, i) {
      var h = Math.max(12, Math.round(((v - min) / (max - min)) * maxH));
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px">'
        +'<div style="width:20px;height:'+h+'px;border-radius:4px 4px 0 0;background:'+color+';opacity:.85" title="'+v+'"></div>'
        +'<div style="font-size:.58rem;color:var(--slate-400)">'+labels[i].replace(/[A-Za-z ]/g,'').trim()+'</div>'
      +'</div>';
    }).join('');
    return '<div style="display:flex;align-items:flex-end;gap:4px;padding:.75rem 0 .25rem">'+bars+'</div>';
  }

  function adminBarChart() {
    var data = [['Tanjung',5650],['Pemenang',4357],['Gangga',4004],['Kayangan',3200],['Bayan',1817]];
    var maxV = 5650;
    return data.map(function(row) {
      return '<div style="margin-bottom:.6rem">'
        +'<div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.25rem"><span>Kec. '+row[0]+'</span><span style="font-weight:600;color:var(--teal-700)">'+row[1].toLocaleString()+'</span></div>'
        +'<div style="height:10px;background:var(--slate-100);border-radius:var(--radius-full)">'
          +'<div style="height:100%;width:'+Math.round(row[1]/maxV*100)+'%;background:linear-gradient(90deg,var(--teal-600),var(--teal-300));border-radius:var(--radius-full)"></div>'
        +'</div>'
      +'</div>';
    }).join('');
  }

  /* ══════════════════════════════════════
     CALENDAR
  ══════════════════════════════════════ */
  var MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  var DAY_NAMES   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

  function buildCalendar(year, month) {
    var firstDay    = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var html = DAY_NAMES.map(function(d){ return '<div class="cal-day-header">'+d+'</div>'; }).join('');
    for (var i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr  = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      var isPast   = new Date(year, month, d) < new Date(2025, 5, 8);
      var isSel    = selectedDate === dateStr;
      var hasSlot  = [10,11,12,13,14,15,16,17].indexOf(d) >= 0;
      html += '<div class="cal-day'+(isPast?' disabled':'')+(isSel?' selected':'')+(hasSlot&&!isPast?' has-slot':'')+'" data-date="'+dateStr+'">'+d+'</div>';
    }
    return html;
  }

  function bindCalDays() {
    document.querySelectorAll('.cal-day:not(.disabled):not(.empty)').forEach(function(day){
      day.addEventListener('click', function(){
        document.querySelectorAll('.cal-day').forEach(function(d){ d.classList.remove('selected'); });
        day.classList.add('selected');
        selectedDate = day.dataset.date;
      });
    });
  }

  /* ══════════════════════════════════════
     PAGE INTERACTIONS
  ══════════════════════════════════════ */
  function bindPageInteractions(page) {
    if (page === 'teleconsultation') bindTeleconsultation();
    if (page === 'appointment')      bindAppointment();
    if (page === 'monitoring')       bindMonitoring();
    if (page === 'notification')     bindNotificationPage();
  }

  function bindTeleconsultation() {
    document.querySelectorAll('.doctor-card').forEach(function(card){
      card.addEventListener('click', function(){
        selectedDoctor = parseInt(card.dataset.doc);
        document.querySelectorAll('.doctor-card').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        var doc = DOCTORS.find(function(d){ return d.id === selectedDoctor; });
        document.getElementById('chat-doctor-name').textContent = doc.display;
        document.getElementById('chat-doctor-spec').textContent = doc.spec;
        var inp  = document.getElementById('chat-input');
        var send = document.getElementById('chat-send');
        if (inp)  inp.disabled  = false;
        if (send) send.disabled = false;
      });
    });

    function sendChat() {
      var input = document.getElementById('chat-input');
      var msg   = input ? input.value.trim() : '';
      if (!msg || !selectedDoctor) return;
      var now  = new Date();
      var time = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
      chatMessages.push({ from: 'patient', text: msg, time: time });
      input.value = '';
      renderChatMessages();
      var replies = [
        'Baik, bisa ceritakan sudah berapa lama gejala ini?',
        'Apakah Anda sudah minum obat hipertensi hari ini?',
        'Saya rekomendasikan istirahat cukup dan kurangi asupan garam.',
        'Baik, akan saya catat dalam rekam medis Anda. Ada keluhan lain?',
      ];
      setTimeout(function(){
        chatMessages.push({ from: 'doctor', text: replies[Math.floor(Math.random()*replies.length)], time: time });
        renderChatMessages();
      }, 1200);
    }

    var sendBtn = document.getElementById('chat-send');
    var chatInp = document.getElementById('chat-input');
    sendBtn && sendBtn.addEventListener('click', sendChat);
    chatInp && chatInp.addEventListener('keydown', function(e){ if (e.key === 'Enter') sendChat(); });

    var keluhanBtn = document.getElementById('send-keluhan-btn');
    keluhanBtn && keluhanBtn.addEventListener('click', function(){
      var val = document.getElementById('keluhan-input') ? document.getElementById('keluhan-input').value.trim() : '';
      if (!val)          { showToast('Isi keluhan terlebih dahulu', '!'); return; }
      if (!selectedDoctor) { showToast('Pilih dokter terlebih dahulu','!'); return; }
      var now  = new Date();
      var time = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
      chatMessages.push({ from: 'patient', text: '📋 Keluhan: '+val, time: time });
      renderChatMessages();
      document.getElementById('keluhan-input').value = '';
      showToast('Keluhan dikirim ke dokter','OK');
    });
  }

  function renderChatMessages() {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = chatMessages.map(function(m){
      return '<div class="msg '+(m.from==='doctor'?'received':'sent')+'">'
        +'<div class="msg-bubble">'+m.text+'</div>'
        +'<div class="msg-time">'+m.time+'</div>'
      +'</div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
  }

  function bindAppointment() {
    var monthLabel = document.getElementById('cal-month-label');

    document.getElementById('cal-prev') && document.getElementById('cal-prev').addEventListener('click', function(){
      calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
      document.getElementById('cal-grid').innerHTML = buildCalendar(calYear, calMonth);
      if (monthLabel) monthLabel.textContent = MONTH_NAMES[calMonth]+' '+calYear;
      bindCalDays();
    });
    document.getElementById('cal-next') && document.getElementById('cal-next').addEventListener('click', function(){
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
      document.getElementById('cal-grid').innerHTML = buildCalendar(calYear, calMonth);
      if (monthLabel) monthLabel.textContent = MONTH_NAMES[calMonth]+' '+calYear;
      bindCalDays();
    });
    bindCalDays();

    document.querySelectorAll('.time-slot:not(.full)').forEach(function(slot){
      slot.addEventListener('click', function(){
        document.querySelectorAll('.time-slot').forEach(function(s){ s.classList.remove('selected'); });
        slot.classList.add('selected');
        selectedTime = slot.dataset.time;
      });
    });

    document.getElementById('book-confirm-btn') && document.getElementById('book-confirm-btn').addEventListener('click', function(){
      var docId = document.getElementById('book-doctor') ? document.getElementById('book-doctor').value : '';
      if (!docId)       { showToast('Pilih dokter terlebih dahulu','!'); return; }
      if (!selectedDate){ showToast('Pilih tanggal konsultasi','!'); return; }
      if (!selectedTime){ showToast('Pilih waktu konsultasi','!'); return; }
      var doc = DOCTORS.find(function(d){ return d.id == docId; });
      openModal('Konfirmasi Janji', ''
        +'<div style="background:var(--teal-50);border:1.5px solid var(--teal-200);border-radius:12px;padding:1rem;margin-bottom:1rem">'
          +[['Dokter',doc?doc.display:'-'],['Spesialisasi',doc?doc.spec:'-'],['Tanggal',selectedDate],['Waktu',selectedTime],['Jenis','Teleconsultation']].map(function(r){
            return '<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid var(--teal-100)">'
              +'<span style="font-size:.82rem;color:var(--slate-500)">'+r[0]+'</span>'
              +'<span style="font-size:.84rem;font-weight:600">'+r[1]+'</span>'
            +'</div>';
          }).join('')
        +'</div>'
        +'<div class="modal-actions">'
          +'<button class="btn btn-outline" onclick="window.closeModal()">Batal</button>'
          +'<button class="btn btn-primary" onclick="window.confirmBooking()">Konfirmasi</button>'
        +'</div>');
    });
  }

  function bindMonitoring() {
    document.getElementById('save-monitoring-btn') && document.getElementById('save-monitoring-btn').addEventListener('click', function(){
      var sys = document.getElementById('input-sys') ? document.getElementById('input-sys').value : '';
      var gl  = document.getElementById('input-glucose') ? document.getElementById('input-glucose').value : '';
      if (!sys && !gl) { showToast('Isi minimal satu data kesehatan','!'); return; }
      showToast('Data kesehatan berhasil disimpan','OK');
      ['input-sys','input-dia','input-glucose','input-pulse','input-note'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
    });
  }

  function bindNotificationPage() {
    document.querySelectorAll('#full-notif-list .notif-item').forEach(function(el){
      el.addEventListener('click', function(){
        var id = parseInt(el.dataset.id);
        var n  = notifications.find(function(x){ return x.id === id; });
        if (n) n.unread = false;
        renderPage('notification');
        updateNotifBadge();
      });
    });
  }

  /* ══════════════════════════════════════
     GLOBAL HELPERS
  ══════════════════════════════════════ */
  window.navigateTo = navigateTo;
  window.showToast  = showToast;
  window.closeModal = closeModal;

  window.confirmBooking = function() {
    closeModal();
    showToast('Janji berhasil dibuat! Notifikasi akan dikirim.','OK');
    selectedDate = null;
    selectedTime = null;
  };

  window.showApptDetail = function(id) {
    var a = APPOINTMENTS.find(function(x){ return x.id === id; });
    if (!a) return;
    openModal('Detail Janji Konsultasi', ''
      +[['Pasien',a.patient],['Dokter',a.doctor],['Tanggal',a.date],['Waktu',a.time],['Jenis',a.type],['Puskesmas',a.puskesmas],['Status',a.status]].map(function(r){
        return '<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--slate-100)">'
          +'<span style="font-size:.82rem;color:var(--slate-500)">'+r[0]+'</span>'
          +'<span style="font-size:.84rem;font-weight:600">'+r[1]+'</span>'
        +'</div>';
      }).join('')
      +'<div class="modal-actions">'
        +'<button class="btn btn-outline" onclick="window.closeModal()">Tutup</button>'
        +(a.status!=='done'?'<button class="btn btn-primary" onclick="window.closeModal();window.navigateTo(\'teleconsultation\')">Mulai Konsultasi</button>':'')
      +'</div>');
  };

  window.openAddUserModal = function() {
    openModal('Tambah Pengguna Baru', ''
      +'<div class="form-row-2">'
        +'<div class="form-group"><label class="form-label">Nama / ID</label><input type="text" class="form-input" placeholder="Dokter D / Pasien 7"/></div>'
        +'<div class="form-group"><label class="form-label">Role</label><select class="form-select"><option>Pasien</option><option>Dokter</option><option>Admin</option></select></div>'
      +'</div>'
      +'<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="user@email.com"/></div>'
      +'<div class="form-group"><label class="form-label">Kata Sandi</label><input type="password" class="form-input" placeholder="Min. 8 karakter"/></div>'
      +'<div class="form-group"><label class="form-label">Fasilitas Kesehatan</label>'
        +'<select class="form-select"><option>RSUD Tanjung</option><option>Pusk. Tanjung</option><option>Pusk. Gangga</option><option>Pusk. Kayangan</option><option>Pusk. Bayan</option></select>'
      +'</div>'
      +'<div class="modal-actions">'
        +'<button class="btn btn-outline" onclick="window.closeModal()">Batal</button>'
        +'<button class="btn btn-primary" onclick="window.closeModal();window.showToast(\'Pengguna berhasil ditambahkan\',\'OK\')">Simpan</button>'
      +'</div>');
  };

  window.markAllRead = function() {
    notifications.forEach(function(n){ n.unread = false; });
    renderPage('notification');
    updateNotifBadge();
    showToast('Semua notifikasi ditandai dibaca','OK');
  };

  function injectToggleStyle() {
    var s = document.createElement('style');
    s.textContent = '.toggle-switch{width:40px;height:22px;border-radius:11px;background:var(--slate-200);cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}'
      +'.toggle-switch::after{content:"";position:absolute;width:16px;height:16px;border-radius:50%;background:white;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.15)}'
      +'.toggle-switch.on{background:var(--teal-500)}'
      +'.toggle-switch.on::after{transform:translateX(18px)}';
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════
     START
  ══════════════════════════════════════ */
  init();

})();
