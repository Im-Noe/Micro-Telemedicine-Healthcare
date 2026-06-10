/**
 * MTH — Micro Telemedicine Healthcare
 * dashboard.js  v3.0 — role-specific pages
 */
(function () {
  'use strict';

  /* SESSION GUARD */
  var SESSION_USER = null;
  try { var _r = sessionStorage.getItem('mth_user'); if (_r) SESSION_USER = JSON.parse(_r); } catch(_){}
  if (!SESSION_USER) { window.location.href = 'index.html'; return; }

  /* MASTER USER TABLE */
  var ALL_USERS = {
    'pasien1@gmail.com': { display:'Pasien 1', initial:'P1', role:'pasien', faskes:'Puskesmas Tanjung' },
    'pasien2@gmail.com': { display:'Pasien 2', initial:'P2', role:'pasien', faskes:'Puskesmas Gangga'  },
    'pasien3@gmail.com': { display:'Pasien 3', initial:'P3', role:'pasien', faskes:'Puskesmas Bayan'   },
    'dokter1@gmail.com': { display:'Dokter A', initial:'DA', role:'dokter', faskes:'RSUD Tanjung', spec:'Dokter Umum'    },
    'dokter2@gmail.com': { display:'Dokter B', initial:'DB', role:'dokter', faskes:'RSUD Tanjung', spec:'Penyakit Dalam' },
    'dokter3@gmail.com': { display:'Dokter C', initial:'DC', role:'dokter', faskes:'Pusk. Tanjung', spec:'Dokter Umum'  },
    'admin@mth.id':      { display:'Admin MTH',initial:'AD', role:'admin',  faskes:'RSUD Tanjung' },
  };
  var CU = Object.assign({}, SESSION_USER, ALL_USERS[SESSION_USER.email] || {});
  var currentRole = CU.role;

  /* MOCK DATA */
  var DOCTORS = [
    { id:1, display:'Dokter A', initial:'DA', spec:'Dokter Umum',    faskes:'RSUD Tanjung',  online:true  },
    { id:2, display:'Dokter B', initial:'DB', spec:'Penyakit Dalam', faskes:'RSUD Tanjung',  online:true  },
    { id:3, display:'Dokter C', initial:'DC', spec:'Dokter Umum',    faskes:'Pusk. Tanjung', online:false },
    { id:4, display:'Dokter D', initial:'DD', spec:'Endokrinologi',  faskes:'RSUD Tanjung',  online:true  },
  ];

  var APPOINTMENTS = [
    { id:1, patientId:'P001', patient:'Pasien 1', doctor:'Dokter A', doctorId:1, date:'2025-06-10', time:'09:00', type:'Teleconsultation', status:'confirmed', puskesmas:'Pusk. Tanjung', keluhan:'Tekanan darah tinggi, pusing' },
    { id:2, patientId:'P002', patient:'Pasien 2', doctor:'Dokter B', doctorId:2, date:'2025-06-10', time:'10:30', type:'Kontrol Rutin',    status:'confirmed', puskesmas:'Pusk. Gangga',  keluhan:'Gula darah tidak stabil' },
    { id:3, patientId:'P001', patient:'Pasien 1', doctor:'Dokter A', doctorId:1, date:'2025-06-11', time:'08:00', type:'Teleconsultation', status:'pending',   puskesmas:'Pusk. Tanjung', keluhan:'Evaluasi hasil lab terbaru' },
    { id:4, patientId:'P003', patient:'Pasien 3', doctor:'Dokter C', doctorId:3, date:'2025-06-09', time:'13:00', type:'Kontrol Rutin',    status:'done',      puskesmas:'Pusk. Nipah',   keluhan:'Kontrol rutin hipertensi' },
    { id:5, patientId:'P002', patient:'Pasien 2', doctor:'Dokter D', doctorId:4, date:'2025-06-12', time:'11:00', type:'Konsultasi',       status:'pending',   puskesmas:'Pusk. Kayangan',keluhan:'Konsultasi diabetes mellitus' },
    { id:6, patientId:'P004', patient:'Pasien 4', doctor:'Dokter A', doctorId:1, date:'2025-06-13', time:'14:00', type:'Teleconsultation', status:'confirmed', puskesmas:'Pusk. Nipah',   keluhan:'Sakit kepala berulang' },
  ];

  var PATIENTS_LIST = [
    { id:'P001', display:'Pasien 1', initial:'P1', nik:'5208010101900001', dob:'01/01/1990', goldar:'A+', penyakit:['Hipertensi'],           puskesmas:'Pusk. Tanjung',  lastVisit:'10 Mei 2025', status:'Aktif',
      bp:[148,142,138,140,136,133,130], glucose:[98,102,97,95,99,96,94] },
    { id:'P002', display:'Pasien 2', initial:'P2', nik:'5208010201850002', dob:'02/02/1985', goldar:'B+', penyakit:['Diabetes Mellitus'],     puskesmas:'Pusk. Gangga',   lastVisit:'8 Mei 2025',  status:'Aktif',
      bp:[128,125,130,127,122,120,119], glucose:[198,185,210,175,168,155,148] },
    { id:'P003', display:'Pasien 3', initial:'P3', nik:'5208010301750003', dob:'03/03/1975', goldar:'O+', penyakit:['Hipertensi','Diabetes'], puskesmas:'Pusk. Tanjung',  lastVisit:'5 Mei 2025',  status:'Aktif',
      bp:[162,158,155,160,152,149,145], glucose:[245,230,218,225,210,198,185] },
    { id:'P004', display:'Pasien 4', initial:'P4', nik:'5208010401950004', dob:'04/04/1995', goldar:'AB', penyakit:['Hipertensi'],            puskesmas:'Pusk. Nipah',    lastVisit:'1 Mei 2025',  status:'Aktif',
      bp:[138,135,132,130,128,126,124], glucose:[88,90,86,92,89,87,85] },
    { id:'P005', display:'Pasien 5', initial:'P5', nik:'5208010501800005', dob:'05/05/1980', goldar:'A+', penyakit:['Diabetes Mellitus'],     puskesmas:'Pusk. Kayangan', lastVisit:'28 Apr 2025', status:'Aktif',
      bp:[122,120,118,125,119,117,115], glucose:[178,165,172,160,155,148,142] },
    { id:'P006', display:'Pasien 6', initial:'P6', nik:'5208010601920006', dob:'06/06/1992', goldar:'B+', penyakit:['Hipertensi'],            puskesmas:'Pusk. Bayan',    lastVisit:'20 Apr 2025', status:'Tidak Aktif',
      bp:[145,140,138,136,134,132,130], glucose:[92,95,90,88,94,91,89] },
  ];

  var EMR_DATA = {
    'P001': [
      { date:'10 Mei 2025', icon:'💊', title:'Kontrol Hipertensi',   body:'TD: 145/92 mmHg. Terapi amlodipin 5mg dilanjutkan.',     doctor:'Dokter A', diag:'Hipertensi Grade 1',        obat:'Amlodipin 5mg 1x1' },
      { date:'3 Apr 2025',  icon:'🩺', title:'Teleconsultasi',        body:'Keluhan pusing dan mual. Diberikan betahistine 12mg.',   doctor:'Dokter B', diag:'Vertigo posisional',         obat:'Betahistine 12mg 2x1' },
      { date:'15 Mar 2025', icon:'🔬', title:'Pemeriksaan Lab',       body:'GDS 118 mg/dL, HbA1c 6.4%. Prediabetes.',              doctor:'Dokter A', diag:'Prediabetes',                 obat:'-' },
    ],
    'P002': [
      { date:'8 Mei 2025',  icon:'💊', title:'Kontrol Diabetes',      body:'GDS 185 mg/dL. Metformin 500mg 2x1 dilanjutkan.',       doctor:'Dokter B', diag:'DM Tipe 2',                  obat:'Metformin 500mg 2x1' },
      { date:'10 Apr 2025', icon:'🔬', title:'Cek HbA1c',             body:'HbA1c 7.8%. Kontrol glukosa belum optimal.',            doctor:'Dokter D', diag:'DM Tipe 2 tidak terkontrol', obat:'Metformin + Glibenklamid' },
    ],
    'P003': [
      { date:'5 Mei 2025',  icon:'💊', title:'Kontrol Hipertensi+DM', body:'TD: 158/98 mmHg, GDS 225 mg/dL. Terapi kombinasi.',     doctor:'Dokter C', diag:'Hipertensi + DM Tipe 2',    obat:'Amlodipin 5mg + Metformin' },
    ],
    'P004': [
      { date:'1 Mei 2025',  icon:'🩺', title:'Teleconsultasi',        body:'Keluhan sakit kepala berulang. TD: 138/88 mmHg.',        doctor:'Dokter A', diag:'Hipertensi Grade 1',        obat:'Amlodipin 5mg 1x1' },
    ],
    'P005': [
      { date:'28 Apr 2025', icon:'💊', title:'Kontrol Diabetes',      body:'GDS 160 mg/dL. Perbaikan signifikan.',                  doctor:'Dokter D', diag:'DM Tipe 2 parsial terkontrol',obat:'Metformin 500mg 2x1' },
    ],
    'P006': [
      { date:'20 Apr 2025', icon:'💊', title:'Kontrol Rutin',         body:'TD: 140/88 mmHg. Stabil. Terapi dilanjutkan.',          doctor:'Dokter A', diag:'Hipertensi Grade 1',        obat:'Amlodipin 5mg 1x1' },
    ],
  };

  var CONSULT_HISTORY = [
    { id:'K001', date:'10 Mei 2025', patient:'Pasien 1', doctor:'Dokter A', type:'Teleconsultation', diag:'Hipertensi Grade 1',           resep:'Amlodipin 5mg 1x1',      status:'Selesai' },
    { id:'K002', date:'8 Mei 2025',  patient:'Pasien 2', doctor:'Dokter B', type:'Kontrol Rutin',    diag:'DM Tipe 2',                    resep:'Metformin 500mg 2x1',    status:'Selesai' },
    { id:'K003', date:'5 Mei 2025',  patient:'Pasien 3', doctor:'Dokter C', type:'Kontrol Rutin',    diag:'Hipertensi + DM Tipe 2',       resep:'Amlodipin + Metformin',  status:'Selesai' },
    { id:'K004', date:'3 Apr 2025',  patient:'Pasien 1', doctor:'Dokter B', type:'Teleconsultation', diag:'Vertigo posisional',           resep:'Betahistine 12mg 2x1',   status:'Selesai' },
    { id:'K005', date:'28 Apr 2025', patient:'Pasien 5', doctor:'Dokter D', type:'Kontrol Rutin',    diag:'DM Tipe 2 parsial terkontrol', resep:'Metformin 500mg 2x1',    status:'Selesai' },
  ];

  var NOTIF_PASIEN = [
    { id:1, icon:'📅', bg:'#edfcfb', title:'Jadwal Konsultasi',  msg:'Konsultasi dengan Dokter A besok pukul 09:00',   time:'2 jam lalu',  unread:true  },
    { id:2, icon:'❗', bg:'#fff1f2', title:'Pengingat Kontrol',  msg:'Jadwal kontrol hipertensi Anda sudah mendekat',  time:'5 jam lalu',  unread:true  },
    { id:3, icon:'📋', bg:'#fffbeb', title:'Hasil Pemeriksaan',  msg:'Hasil lab Anda sudah tersedia di rekam medis',   time:'1 hari lalu', unread:true  },
    { id:4, icon:'✅', bg:'#f0fdf4', title:'Konsultasi Selesai', msg:'Konsultasi dengan Dokter B telah selesai',       time:'2 hari lalu', unread:false },
    { id:5, icon:'💊', bg:'#eff6ff', title:'Pengingat Obat',     msg:'Waktunya minum obat amlodipin',                  time:'3 hari lalu', unread:false },
  ];
  var NOTIF_DOKTER = [
    { id:1, icon:'🔔', bg:'#edfcfb', title:'Pasien Baru Menunggu', msg:'Pasien 4 meminta teleconsultasi',              time:'10 menit lalu',unread:true  },
    { id:2, icon:'❗', bg:'#fff1f2', title:'Nilai Kritis',          msg:'GDS Pasien 3 mencapai 245 mg/dL',              time:'1 jam lalu',   unread:true  },
    { id:3, icon:'📋', bg:'#fffbeb', title:'Konsultasi Selesai',    msg:'Konsultasi dengan Pasien 1 telah selesai',     time:'3 jam lalu',   unread:false },
  ];
  var NOTIF_ADMIN = [
    { id:1, icon:'⚠️', bg:'#fff1f2', title:'Gangguan Jaringan',    msg:'Koneksi ke Pusk. Bayan terputus sejak 08:00', time:'2 jam lalu',  unread:true  },
    { id:2, icon:'💾', bg:'#fffbeb', title:'Backup Terjadwal',      msg:'Backup otomatis akan dilaksanakan 23:00',      time:'5 jam lalu',  unread:false },
    { id:3, icon:'👤', bg:'#edfcfb', title:'Pengguna Baru',         msg:'3 akun pasien baru terdaftar hari ini',        time:'1 hari lalu', unread:false },
  ];

  var notifications = (currentRole==='dokter'?NOTIF_DOKTER:currentRole==='admin'?NOTIF_ADMIN:NOTIF_PASIEN).map(function(n){ return Object.assign({},n); });

  var MON = {
    bp:      [{d:'7 Jun',v:148},{d:'8 Jun',v:142},{d:'9 Jun',v:138},{d:'10 Jun',v:140},{d:'11 Jun',v:136},{d:'12 Jun',v:133},{d:'13 Jun',v:130}],
    glucose: [{d:'7 Jun',v:124},{d:'8 Jun',v:118},{d:'9 Jun',v:115},{d:'10 Jun',v:121},{d:'11 Jun',v:112},{d:'12 Jun',v:108},{d:'13 Jun',v:106}],
  };

  /* STATE */
  var currentPage     = 'dashboard';
  var selectedDoctor  = null;
  var selectedPatient = null;
  var selectedDate    = null;
  var selectedTime    = null;
  var calYear  = 2025;
  var calMonth = 5;
  var chatMsgsPasien = [{ from:'doctor', text:'Selamat datang! Ada yang bisa saya bantu?', time:'09:01' }];
  var chatMsgsDokter = [{ from:'patient', text:'Dokter, saya ingin konsultasi mengenai tekanan darah saya.', time:'09:00' }];

  /* NAV ICONS */
  var S = function(p){ return '<svg class="nav-icon" viewBox="0 0 20 20" fill="none">'+p+'</svg>'; };
  var IC = {
    dash:  S('<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>'),
    chat:  S('<path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    cal:   S('<rect x="3" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 2v4M13 2v4M3 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    chart: S('<path d="M3 17l4-6 4 3 4-8 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    doc:   S('<path d="M7 3H4a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V9l-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 3v6h6M8 13h5M8 10h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    bell:  S('<path d="M10 2a6 6 0 00-6 6v2.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14a2 2 0 004 0" stroke="currentColor" stroke-width="1.5"/>'),
    user:  S('<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 19c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    users: S('<circle cx="7" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 18c0-3 2.69-5 6-5m6 0c3.31 0 6 2 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    set:   S('<circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2m0 12v2M2 10h2m12 0h2m-3.05-4.95-1.41 1.41M5.46 14.54l-1.41 1.41m0-11.9 1.41 1.41m9.09 9.09 1.41 1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    heart: S('<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    hist:  S('<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    diag:  S('<path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h0a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    backup:S('<path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1M12 8l-4 4m0 0l-4-4m4 4V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    report:S('<path d="M9 17v-2m3 2v-4m3 4v-6M5 17v-5m-2 6h14a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
    db:    S('<ellipse cx="10" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 5v5c0 1.657 3.582 3 8 3s8-1.343 8-3V5" stroke="currentColor" stroke-width="1.5"/><path d="M2 10v5c0 1.657 3.582 3 8 3s8-1.343 8-3v-5" stroke="currentColor" stroke-width="1.5"/>'),
  };

  var NAV = {
    pasien: [
      { section:'Menu Utama' },
      { id:'dashboard',     label:'Dashboard',            icon:IC.dash  },
      { id:'p-teleconsult', label:'Teleconsultation',     icon:IC.chat  },
      { id:'p-booking',     label:'Booking Jadwal',       icon:IC.cal   },
      { id:'p-monitoring',  label:'Monitoring Kesehatan', icon:IC.heart },
      { id:'p-emr',         label:'Rekam Medis Saya',     icon:IC.doc   },
      { section:'Lainnya' },
      { id:'notification',  label:'Notifikasi',           icon:IC.bell, badge:3 },
      { id:'p-profil',      label:'Profil Saya',          icon:IC.user  },
    ],
    dokter: [
      { section:'Layanan Medis' },
      { id:'dashboard',     label:'Dashboard',            icon:IC.dash  },
      { id:'d-teleconsult', label:'Teleconsultation',     icon:IC.chat, badge:2 },
      { id:'d-pasien-list', label:'Daftar Pasien',        icon:IC.users },
      { id:'d-emr',         label:'Akses EMR Pasien',     icon:IC.doc   },
      { id:'d-diagnosis',   label:'Diagnosis & Resep',    icon:IC.diag  },
      { section:'Monitoring & Evaluasi' },
      { id:'d-monitoring',  label:'Monitoring Pasien',    icon:IC.chart },
      { id:'d-riwayat',     label:'Riwayat Konsultasi',   icon:IC.hist  },
      { section:'Lainnya' },
      { id:'notification',  label:'Notifikasi',           icon:IC.bell, badge:2 },
      { id:'d-profil',      label:'Profil Saya',          icon:IC.user  },
    ],
    admin: [
      { section:'Manajemen' },
      { id:'dashboard',     label:'Dashboard',            icon:IC.dash   },
      { id:'a-users',       label:'Manajemen Pengguna',   icon:IC.users  },
      { id:'a-jadwal',      label:'Pengaturan Jadwal',    icon:IC.cal    },
      { id:'a-emr-db',      label:'Pengelolaan EMR',      icon:IC.db     },
      { section:'Sistem' },
      { id:'a-monitoring',  label:'Monitoring Aktivitas', icon:IC.chart  },
      { id:'a-backup',      label:'Backup & Recovery',    icon:IC.backup },
      { id:'a-laporan',     label:'Laporan Statistik',    icon:IC.report },
      { section:'Lainnya' },
      { id:'notification',  label:'Notifikasi',           icon:IC.bell, badge:1 },
      { id:'a-settings',    label:'Pengaturan Sistem',    icon:IC.set    },
    ],
  };

  var PAGE_TITLES = {
    dashboard:'Dashboard',
    'p-teleconsult':'Teleconsultation','p-booking':'Booking Jadwal',
    'p-monitoring':'Monitoring Kesehatan','p-emr':'Rekam Medis Saya','p-profil':'Profil',
    'd-teleconsult':'Teleconsultation dengan Pasien','d-pasien-list':'Daftar Pasien',
    'd-emr':'Akses EMR Pasien','d-diagnosis':'Diagnosis & Rekomendasi Medis',
    'd-monitoring':'Monitoring Pasien Kronis','d-riwayat':'Riwayat Konsultasi','d-profil':'Profil',
    'a-users':'Manajemen Pengguna','a-jadwal':'Pengaturan Jadwal Layanan',
    'a-emr-db':'Pengelolaan Database EMR','a-monitoring':'Monitoring Aktivitas Sistem',
    'a-backup':'Backup & Recovery Data','a-laporan':'Laporan Statistik','a-settings':'Pengaturan Sistem',
    'notification':'Notifikasi',
  };

  /* INIT */
  function init() {
    updateUserUI();
    buildNav();
    renderPage('dashboard');
    bindSidebar();
    bindNotifications();
    bindModal();
    bindLogout();
    injectStyles();
  }

  function updateUserUI() {
    var rl = CU.role==='pasien'?'Pasien':CU.role==='dokter'?(CU.spec||'Dokter'):'Administrator';
    document.getElementById('nav-avatar').textContent    = CU.initial;
    document.getElementById('nav-name').textContent      = CU.display;
    document.getElementById('nav-role').textContent      = rl;
    document.getElementById('topbar-avatar').textContent = CU.initial;
    document.body.dataset.role = currentRole;
    var rs = document.querySelector('.role-switcher');
    if (rs) rs.style.display = 'none';
  }

  function buildNav() {
    var nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    (NAV[currentRole]||NAV.pasien).forEach(function(item) {
      if (item.section) { nav.insertAdjacentHTML('beforeend','<div class="nav-section-label">'+item.section+'</div>'); return; }
      var el = document.createElement('div');
      el.className = 'nav-item'+(item.id===currentPage?' active':'');
      el.dataset.page = item.id;
      el.innerHTML = item.icon+'<span>'+item.label+'</span>'+(item.badge?'<span class="nav-badge">'+item.badge+'</span>':'');
      el.addEventListener('click', function(){ navigateTo(item.id); });
      nav.appendChild(el);
    });
  }

  function navigateTo(page) {
    currentPage = page;
    buildNav();
    renderPage(page);
    document.getElementById('topbar-title').textContent = PAGE_TITLES[page]||'Dashboard';
    if (window.innerWidth<=720) {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.remove('show');
    }
    window.scrollTo(0,0);
  }

  /* SIDEBAR & LOGOUT */
  function bindSidebar() {
    var sb=document.getElementById('sidebar'), ov=document.getElementById('sidebar-overlay'),
        hb=document.getElementById('hamburger'), cl=document.getElementById('sidebar-close');
    hb&&hb.addEventListener('click',function(){ sb.classList.add('open'); ov.classList.add('show'); });
    [ov,cl].forEach(function(el){ el&&el.addEventListener('click',function(){ sb.classList.remove('open'); ov.classList.remove('show'); }); });
  }
  function bindLogout() {
    var btn=document.getElementById('logout-btn');
    btn&&btn.addEventListener('click',function(){ sessionStorage.removeItem('mth_user'); showToast('Keluar...','👋'); setTimeout(function(){ window.location.href='index.html'; },800); });
  }

  /* NOTIFICATIONS */
  function bindNotifications() {
    var btn=document.getElementById('notif-btn'), panel=document.getElementById('notif-panel'),
        ov=document.getElementById('notif-overlay'), cl=document.getElementById('notif-clear');
    renderNotifList();
    btn&&btn.addEventListener('click',function(){ panel.classList.add('open'); ov.classList.add('show'); });
    ov&&ov.addEventListener('click',function(){ panel.classList.remove('open'); ov.classList.remove('show'); });
    cl&&cl.addEventListener('click',function(){ notifications.forEach(function(n){ n.unread=false; }); renderNotifList(); updateBadge(); showToast('Semua dibaca','✓'); });
  }
  function renderNotifList() {
    var list=document.getElementById('notif-list'); if(!list) return;
    list.innerHTML=notifications.map(function(n){
      return '<div class="notif-item'+(n.unread?' unread':'')+'" data-id="'+n.id+'">'
        +'<div class="notif-item-icon" style="background:'+n.bg+'">'+n.icon+'</div>'
        +'<div class="notif-item-body"><div class="notif-item-title">'+n.title+'</div>'
        +'<div class="notif-item-msg">'+n.msg+'</div><div class="notif-item-time">'+n.time+'</div></div></div>';
    }).join('');
    list.querySelectorAll('.notif-item').forEach(function(el){
      el.addEventListener('click',function(){ var n=notifications.find(function(x){ return x.id==el.dataset.id; }); if(n) n.unread=false; renderNotifList(); updateBadge(); });
    });
  }
  function updateBadge() {
    var cnt=notifications.filter(function(n){ return n.unread; }).length;
    var b=document.getElementById('notif-badge'); if(!b) return;
    b.textContent=cnt; b.style.display=cnt>0?'':'none';
  }

  /* MODAL */
  function bindModal() {
    document.getElementById('modal-close')&&document.getElementById('modal-close').addEventListener('click',closeModal);
    document.getElementById('modal-overlay')&&document.getElementById('modal-overlay').addEventListener('click',function(e){ if(e.target===e.currentTarget) closeModal(); });
  }
  function openModal(title,body){ document.getElementById('modal-title').textContent=title; document.getElementById('modal-body').innerHTML=body; document.getElementById('modal-overlay').classList.add('open'); }
  function closeModal(){ document.getElementById('modal-overlay').classList.remove('open'); }

  /* TOAST */
  var _tt;
  function showToast(msg,icon){ clearTimeout(_tt); document.getElementById('toast-msg').textContent=msg; document.getElementById('toast-icon').textContent=icon||'✓'; document.getElementById('toast').classList.add('show'); _tt=setTimeout(function(){ document.getElementById('toast').classList.remove('show'); },3000); }

  /* RENDER */
  function renderPage(page) {
    var c=document.getElementById('content'); c.innerHTML='';
    var d=document.createElement('div'); d.className='page';
    d.innerHTML=getHTML(page); c.appendChild(d);
    bindPage(page);
  }

  function getHTML(p) {
    var map={
      'dashboard': currentRole==='pasien'?dashPasien():currentRole==='dokter'?dashDokter():dashAdmin(),
      'p-teleconsult':pagePatTeleconsult(),'p-booking':pagePatBooking(),
      'p-monitoring':pagePatMonitoring(),'p-emr':pagePatEMR(),'p-profil':pageProfil(),
      'd-teleconsult':pageDocTeleconsult(),'d-pasien-list':pageDocPasienList(),
      'd-emr':pageDocEMR(),'d-diagnosis':pageDocDiagnosis(),
      'd-monitoring':pageDocMonitoring(),'d-riwayat':pageDocRiwayat(),'d-profil':pageProfil(),
      'a-users':pageAdmUsers(),'a-jadwal':pageAdmJadwal(),'a-emr-db':pageAdmEMR(),
      'a-monitoring':pageAdmMonitoring(),'a-backup':pageAdmBackup(),
      'a-laporan':pageAdmLaporan(),'a-settings':pageAdmSettings(),
      'notification':pageNotification(),
    };
    return map[p]||'<div class="page-header"><h2 class="page-title">Halaman tidak ditemukan</h2></div>';
  }

  /* HELPER COMPONENTS */
  function pad(n){ return String(n).padStart(2,'0'); }
  function nowTime(){ var n=new Date(); return pad(n.getHours())+':'+pad(n.getMinutes()); }
  function ph(title,sub){ return '<div class="page-header"><h2 class="page-title">'+title+'</h2>'+(sub?'<p class="page-subtitle">'+sub+'</p>':'')+'</div>'; }
  function sc(icon,label,val,sub,trend,color){ return '<div class="stat-card"><div class="stat-icon-wrap '+color+'">'+icon+'</div><div class="stat-body"><div class="stat-value">'+val+'</div><div class="stat-label">'+label+'</div><div class="stat-change '+(trend||'')+'">'+sub+'</div></div></div>'; }
  function greetBanner(name,sub,btns){
    return '<div class="greeting-banner"><div class="greeting-text"><h2>Selamat Datang, '+name+'! 👋</h2><p>'+sub+'</p></div>'
      +'<div class="greeting-actions">'+btns.map(function(b){ return '<button class="btn" onclick="navi(\''+b.page+'\')">'+b.label+'</button>'; }).join('')+'</div></div>';
  }
  function apptRow(a){
    return '<div style="display:flex;align-items:center;gap:.65rem;padding:.5rem 0;border-bottom:1px solid var(--slate-100)">'
      +'<div style="font-size:.8rem;font-weight:600;color:var(--teal-700);min-width:38px">'+a.time+'</div>'
      +'<div style="flex:1"><div style="font-size:.82rem;font-weight:500">'+a.doctor+'</div><div style="font-size:.72rem;color:var(--slate-400)">'+a.date+' · '+a.type+'</div></div>'
      +'<span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Konfirmasi':a.status==='pending'?'Menunggu':'Selesai')+'</span></div>';
  }
  function apptNextCard(a){
    return '<div class="appt-next"><div class="appt-date-box"><div class="month">Jun</div><div class="day">'+a.date.split('-')[2]+'</div></div>'
      +'<div class="appt-info"><div class="appt-doctor">'+a.doctor+'</div><div class="appt-detail">⏰ '+a.time+' WIB &nbsp;·&nbsp; 💻 '+a.type+'</div></div>'
      +'<span class="badge '+(a.status==='confirmed'?'badge-success':'badge-warn')+'">'+(a.status==='confirmed'?'Terkonfirmasi':'Menunggu')+'</span></div>';
  }
  function docCard(d,sel){
    return '<div class="doctor-card'+(sel?' selected':'')+'" data-doc="'+d.id+'">'
      +'<div class="doctor-avatar">'+d.initial+'</div><div class="doctor-name">'+d.display+'</div>'
      +'<div class="doctor-spec">'+d.spec+'</div><div class="doctor-faskes">'+d.faskes+'</div>'
      +'<div class="doctor-status'+(d.online?' online':'')+'">'+( d.online?'Online':'Offline')+'</div></div>';
  }
  function chatBox(ini,name,spec,enabled,chatHTML){
    return '<div class="chat-wrap"><div class="chat-header">'
      +'<div class="doctor-avatar" style="width:38px;height:38px;font-size:.85rem;margin:0">'+ini+'</div>'
      +'<div><div class="doctor-name" id="chat-name">'+name+'</div><div class="doctor-spec">'+spec+'</div></div>'
      +(enabled?'<span class="badge badge-success" style="margin-left:auto">Aktif</span>':'')
      +'</div><div class="chat-messages" id="chat-msgs">'+chatHTML+'</div>'
      +'<div class="chat-input-area">'
        +'<input class="chat-input" id="chat-inp" placeholder="Ketik pesan..." '+(enabled?'':'disabled')+'>'
        +'<button class="chat-send" id="chat-send" '+(enabled?'':'disabled')+'>'
          +'<svg viewBox="0 0 20 20" fill="none"><path d="M18 10L3 3l3 7-3 7 15-7z" fill="currentColor"/></svg>'
        +'</button>'
      +'</div></div>';
  }
  function msgBubble(m){
    var side = (m.from==='sent'||m.from==='patient_sent') ? 'sent' : 'received';
    return '<div class="msg '+side+'"><div class="msg-bubble">'+m.text+'</div><div class="msg-time">'+m.time+'</div></div>';
  }
  function timelineItem(h){
    return '<div class="timeline-item"><div class="timeline-dot">'+h.icon+'</div>'
      +'<div class="timeline-content"><div class="timeline-date">'+h.date+' · '+h.doctor+'</div>'
      +'<div class="timeline-title">'+h.title+'</div><div class="timeline-body">'+h.body+'</div></div></div>';
  }
  function obatList(list){ return list.map(function(o){ return '<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 0;border-bottom:1px solid var(--slate-100)"><div style="width:34px;height:34px;background:var(--teal-50);border-radius:9px;display:flex;align-items:center;justify-content:center">💊</div><div><div style="font-size:.84rem;font-weight:600">'+o.name+'</div><div style="font-size:.73rem;color:var(--slate-500)">'+o.dose+' · '+o.note+'</div></div></div>'; }).join(''); }
  function labTable(rows){ return rows.map(function(r){ return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.82rem">'+r[0]+'</span><div style="text-align:right"><div style="font-size:.84rem;font-weight:600">'+r[1]+'</div><span class="badge badge-'+r[3]+'">'+r[2]+'</span></div></div>'; }).join(''); }
  function barChart(vals,labels,min,max,color){
    var mH=88;
    return '<div style="display:flex;align-items:flex-end;gap:3px;padding:.5rem 0 .2rem">'
      +vals.map(function(v,i){
        var h=Math.max(10,Math.round(((v-min)/(max-min))*mH));
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">'
          +'<div style="width:100%;max-width:24px;height:'+h+'px;border-radius:4px 4px 0 0;background:'+(color||'var(--teal-500)')+';opacity:.85" title="'+v+'"></div>'
          +'<div style="font-size:.57rem;color:var(--slate-400)">'+String(labels[i]).replace(/[A-Za-z ]/g,'').trim()+'</div></div>';
      }).join('')+'</div>';
  }
  function hBar(label,val,max,color){
    return '<div style="margin-bottom:.65rem"><div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.2rem"><span>'+label+'</span><span style="font-weight:600;color:var(--teal-700)">'+val.toLocaleString()+'</span></div>'
      +'<div style="height:9px;background:var(--slate-100);border-radius:99px"><div style="height:100%;width:'+Math.round(val/max*100)+'%;background:'+(color||'linear-gradient(90deg,var(--teal-600),var(--teal-300))')+';border-radius:99px"></div></div></div>';
  }
  function formBooking(){
    var MN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    return '<div class="form-group"><label class="form-label">Pilih Dokter</label>'
      +'<select class="form-select" id="book-doctor"><option value="">-- Pilih dokter --</option>'
      +DOCTORS.map(function(d){ return '<option value="'+d.id+'">'+d.display+' — '+d.spec+'</option>'; }).join('')+'</select></div>'
      +'<div class="form-group"><label class="form-label">Jenis Layanan</label>'
      +'<select class="form-select"><option>Teleconsultation</option><option>Kontrol Rutin</option><option>Konsultasi Pertama</option></select></div>'
      +'<div class="form-group"><label class="form-label">Pilih Tanggal</label>'
        +'<div class="cal-header"><button class="cal-nav" id="cal-prev"><svg viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>'
        +'<span class="cal-month" id="cal-month-lbl">'+MN[calMonth]+' '+calYear+'</span>'
        +'<button class="cal-nav" id="cal-next"><svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>'
        +'<div class="cal-grid" id="cal-grid">'+buildCal(calYear,calMonth)+'</div></div>'
      +'<div class="form-group"><label class="form-label">Pilih Waktu</label>'
        +'<div class="time-slots" id="time-slots">'
        +['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30'].map(function(t,i){ return '<div class="time-slot'+(i===2||i===5?' full':'')+'" data-time="'+t+'">'+t+'</div>'; }).join('')
        +'</div></div>';
  }

  /* CALENDAR */
  var MN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  var DN=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  function buildCal(y,m){
    var fd=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
    var h=DN.map(function(d){ return '<div class="cal-day-header">'+d+'</div>'; }).join('');
    for(var i=0;i<fd;i++) h+='<div class="cal-day empty"></div>';
    for(var d=1;d<=dim;d++){
      var ds=y+'-'+pad(m+1)+'-'+pad(d);
      var past=new Date(y,m,d)<new Date(2025,5,8);
      var sel=selectedDate===ds;
      var slot=[10,11,12,13,14,15,16,17].indexOf(d)>=0;
      h+='<div class="cal-day'+(past?' disabled':'')+(sel?' selected':'')+(slot&&!past?' has-slot':'')+'" data-date="'+ds+'">'+d+'</div>';
    }
    return h;
  }
  function bindCalDays(){
    document.querySelectorAll('.cal-day:not(.disabled):not(.empty)').forEach(function(d){
      d.addEventListener('click',function(){ document.querySelectorAll('.cal-day').forEach(function(x){ x.classList.remove('selected'); }); d.classList.add('selected'); selectedDate=d.dataset.date; });
    });
  }

  /* CHAT HELPER */
  function bindChat(msgArr,myFrom){
    function send(){
      var inp=document.getElementById('chat-inp');
      var msg=inp?inp.value.trim():''; if(!msg) return;
      msgArr.push({from:'sent',text:msg,time:nowTime()});
      inp.value=''; renderChat(msgArr);
      var replies = myFrom==='dokter'
        ?['Baik, terima kasih informasinya. Sudah berapa lama keluhan ini?','Apakah sudah minum obat hari ini?','Saya akan catat di rekam medis Anda.']
        :['Baik, saya mengerti.','Silakan ceritakan lebih lanjut.','Saya akan periksa rekam medis Anda.','Tolong ukur tekanan darah sekarang jika bisa.'];
      setTimeout(function(){
        msgArr.push({from:'received',text:replies[Math.floor(Math.random()*replies.length)],time:nowTime()});
        renderChat(msgArr);
      },1200);
    }
    var sb=document.getElementById('chat-send'),ci=document.getElementById('chat-inp');
    sb&&sb.addEventListener('click',send);
    ci&&ci.addEventListener('keydown',function(e){ if(e.key==='Enter') send(); });
  }
  function renderChat(arr){
    var c=document.getElementById('chat-msgs'); if(!c) return;
    c.innerHTML=arr.map(function(m){ return '<div class="msg '+(m.from==='sent'?'sent':'received')+'"><div class="msg-bubble">'+m.text+'</div><div class="msg-time">'+m.time+'</div></div>'; }).join('');
    c.scrollTop=c.scrollHeight;
  }

  /* ═══════════ DASHBOARD PASIEN ═══════════ */
  function dashPasien() {
    var myA=APPOINTMENTS.filter(function(a){ return a.patient===CU.display; });
    var next=myA.find(function(a){ return a.status!=='done'; });
    return greetBanner(CU.display,'Senin, 13 Juni 2025 · '+CU.faskes,[
        {label:'🩺 Konsultasi Sekarang',page:'p-teleconsult'},
        {label:'📅 Buat Janji',page:'p-booking'},
        {label:'📊 Input Kesehatan',page:'p-monitoring'},
      ])
      +(next?apptNextCard(next):'')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('🩺','Konsultasi Bulan Ini','4 Sesi','↑ 1 bulan lalu','up','teal')
        +sc('❤️','Tekanan Darah','130/83','Terkontrol','up','rose')
        +sc('🍬','Gula Darah','106 mg/dL','Membaik','up','amber')
        +sc('📋','Rekam Medis','12 Entri','Terakhir 10 Mei','','blue')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📊 Tekanan Darah (7 Hari)</div>'+barChart(MON.bp.map(function(d){return d.v;}),MON.bp.map(function(d){return d.d;}),110,165,'#e05252')+'</div>'
        +'<div class="card"><div class="card-title">📅 Jadwal Konsultasi Saya</div>'
          +(myA.length?myA.map(apptRow).join(''):'<p style="color:var(--slate-400);font-size:.84rem;padding:.5rem 0">Belum ada jadwal.</p>')
          +'<button class="btn btn-outline btn-sm" style="margin-top:.75rem;width:100%" onclick="navi(\'p-booking\')">+ Buat Janji Baru</button>'
        +'</div>'
      +'</div>';
  }

  /* ═══════════ DASHBOARD DOKTER ═══════════ */
  function dashDokter() {
    var myA=APPOINTMENTS.filter(function(a){ return a.doctor===CU.display; });
    var kritis=PATIENTS_LIST.filter(function(p){ return p.bp[p.bp.length-1]>150||p.glucose[p.glucose.length-1]>200; });
    return greetBanner(CU.display,'Senin, 13 Juni 2025 · '+CU.faskes+' · '+(CU.spec||'Dokter'),[
        {label:'💬 Mulai Teleconsultasi',page:'d-teleconsult'},
        {label:'👥 Daftar Pasien',page:'d-pasien-list'},
        {label:'📝 Diagnosis & Resep',page:'d-diagnosis'},
      ])
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('👥','Jadwal Hari Ini',''+myA.length+' Pasien','','','teal')
        +sc('💬','Teleconsultasi Aktif','2 Sesi','1 menunggu','','blue')
        +sc('⚠️','Nilai Kritis',''+kritis.length+' Pasien','Perlu tindakan','down','rose')
        +sc('✅','Konsultasi Selesai','5 Sesi','Hari ini','up','green')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📅 Jadwal Konsultasi Hari Ini</div>'
          +(myA.length?myA.map(function(a){
            return '<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 0;border-bottom:1px solid var(--slate-100)">'
              +'<div style="min-width:42px;font-size:.8rem;font-weight:700;color:var(--teal-600)">'+a.time+'</div>'
              +'<div class="avatar" style="width:32px;height:32px;font-size:.7rem">'+a.patient.replace('Pasien ','P')+'</div>'
              +'<div style="flex:1"><div style="font-size:.84rem;font-weight:600">'+a.patient+'</div>'
                +'<div style="font-size:.73rem;color:var(--slate-500)">'+a.type+' · '+a.puskesmas+'</div></div>'
              +'<span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Siap':a.status==='pending'?'Menunggu':'Selesai')+'</span>'
            +'</div>';
          }).join(''):'<p style="color:var(--slate-400);font-size:.84rem;padding:.5rem 0">Tidak ada jadwal hari ini.</p>')
        +'</div>'
        +'<div class="card"><div class="card-title">⚠️ Pasien Perlu Perhatian</div>'
          +(kritis.length?kritis.map(function(p){
            var lb=p.bp[p.bp.length-1],lg=p.glucose[p.glucose.length-1];
            return '<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem .85rem;background:#fff1f2;border-radius:10px;margin-bottom:.5rem;border-left:3px solid var(--error)">'
              +'<div class="avatar" style="background:linear-gradient(135deg,var(--error),#e57272);font-size:.72rem">'+p.initial+'</div>'
              +'<div style="flex:1"><div style="font-size:.84rem;font-weight:600">'+p.display+'</div>'
                +'<div style="font-size:.72rem;color:var(--slate-600)">'+(lb>150?'TD: '+lb+' mmHg':'')+(lb>150&&lg>200?' · ':'')+(lg>200?'GDS: '+lg+' mg/dL':'')+'</div></div>'
              +'<button class="btn btn-sm btn-outline" onclick="navi(\'d-monitoring\')">Pantau</button>'
            +'</div>';
          }).join(''):'<div style="padding:1rem;text-align:center;color:var(--success);font-size:.85rem">✅ Semua pasien dalam kondisi normal</div>')
        +'</div>'
      +'</div>'
      +'<div class="card" style="margin-top:1rem"><div class="card-title">📋 Riwayat Konsultasi Terbaru Saya</div>'
        +'<div class="table-wrap"><table><thead><tr><th>ID</th><th>Pasien</th><th>Tanggal</th><th>Tipe</th><th>Diagnosis</th><th>Status</th></tr></thead><tbody>'
          +CONSULT_HISTORY.filter(function(k){ return k.doctor===CU.display; }).map(function(k){
            return '<tr><td style="font-family:monospace;font-size:.78rem">'+k.id+'</td><td>'+k.patient+'</td><td style="font-size:.8rem">'+k.date+'</td>'
              +'<td><span class="badge badge-info">'+k.type+'</span></td><td style="font-size:.8rem">'+k.diag+'</td><td><span class="badge badge-success">'+k.status+'</span></td></tr>';
          }).join('')
        +'</tbody></table></div>'
      +'</div>';
  }

  /* ═══════════ DASHBOARD ADMIN ═══════════ */
  function dashAdmin() {
    return greetBanner('Admin MTH','Senin, 13 Juni 2025 · RSUD Tanjung · Sistem Normal',[
        {label:'👥 Kelola Pengguna',page:'a-users'},
        {label:'📊 Laporan',page:'a-laporan'},
        {label:'💾 Backup',page:'a-backup'},
      ])
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('👤','Total Pasien','247','↑ 12 bulan ini','up','teal')
        +sc('👨‍⚕️','Dokter Aktif','18','9 puskesmas','','blue')
        +sc('📋','Total Konsultasi','1.284','Bulan ini','up','green')
        +sc('🖥️','Status Sistem','Online','Uptime 99.8%','up','teal')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📊 Kunjungan per Kecamatan (2025)</div>'
          +[['Tanjung',5650],['Pemenang',4357],['Gangga',4004],['Kayangan',3200],['Bayan',1817]].map(function(r){ return hBar('Kec. '+r[0],r[1],5650); }).join('')
        +'</div>'
        +'<div class="card"><div class="card-title">⚙️ Status Layanan Real-time</div>'
          +[{n:'Server Cloud',ok:true,i:'Response 42ms'},{n:'Database EMR',ok:true,i:'912 record'},{n:'Pusk. Tanjung',ok:true,i:'Terhubung'},{n:'Pusk. Bayan',ok:false,i:'Timeout'},{n:'Notifikasi Push',ok:true,i:'Aktif'}].map(function(s){
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--slate-100)">'
              +'<div><div style="font-size:.84rem">'+s.n+'</div><div style="font-size:.7rem;color:var(--slate-400)">'+s.i+'</div></div>'
              +'<span class="badge '+(s.ok?'badge-success':'badge-error')+'">'+(s.ok?'Online':'Gangguan')+'</span></div>';
          }).join('')
        +'</div>'
      +'</div>'
      +'<div class="grid-3" style="margin-top:1rem">'
        +sc('📥','Backup Terakhir','Kemarin 23:00','Berhasil','up','green')
        +sc('🔒','Login Gagal','3 Kali','24 jam terakhir','','amber')
        +sc('📦','Ukuran Database','2.4 GB','↑ 120 MB/bln','','blue')
      +'</div>';
  }

  /* ═══════════ PASIEN PAGES ═══════════ */
  function pagePatTeleconsult() {
    var selDoc=selectedDoctor?DOCTORS.find(function(d){ return d.id===selectedDoctor; }):null;
    var chat=chatMsgsPasien.map(msgBubble).join('');
    return ph('Teleconsultation','Konsultasi kesehatan jarak jauh dengan dokter pilihan Anda')
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">👨‍⚕️ Pilih Dokter</div>'
          +'<div class="doctor-grid" id="doctor-grid">'+DOCTORS.map(function(d){ return docCard(d,selectedDoctor===d.id); }).join('')+'</div>'
        +'</div>'
        +'<div>'
          +chatBox(selDoc?selDoc.initial:'?',selDoc?selDoc.display:'Pilih dokter terlebih dahulu',selDoc?selDoc.spec:'',!!selDoc,chat)
          +'<div class="card" style="margin-top:1rem"><div class="card-title">📋 Sampaikan Keluhan</div>'
            +'<div class="form-group"><label class="form-label">Keluhan Utama</label><textarea class="form-textarea" id="keluhan-input" placeholder="Tuliskan keluhan Anda..."></textarea></div>'
            +'<button class="btn btn-primary" style="width:100%" id="send-keluhan-btn">📤 Kirim ke Dokter</button>'
          +'</div>'
        +'</div>'
      +'</div>';
  }

  function pagePatBooking() {
    var myA=APPOINTMENTS.filter(function(a){ return a.patient===CU.display; });
    return ph('Booking Jadwal Konsultasi','Pilih dokter, tanggal dan waktu yang tersedia')
      +'<div class="grid-2" style="align-items:start">'
        +'<div class="card"><div class="card-title">➕ Buat Janji Baru</div>'
          +formBooking()
          +'<button class="btn btn-primary" style="width:100%;margin-top:.75rem" id="book-confirm-btn">Konfirmasi Janji</button>'
        +'</div>'
        +'<div class="card"><div class="card-title">📋 Jadwal Saya</div>'
          +(myA.length?myA.map(apptRow).join(''):'<p style="color:var(--slate-400);font-size:.84rem">Belum ada jadwal.</p>')
        +'</div>'
      +'</div>';
  }

  function pagePatMonitoring() {
    return ph('Monitoring Kesehatan','Pantau dan catat data kesehatan Anda setiap hari')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('❤️','Tekanan Darah','130/83 mmHg','13 Jun 2025','','rose')
        +sc('🍬','Gula Darah','106 mg/dL','13 Jun 2025','','amber')
        +sc('⚖️','Berat Badan','68 kg','Stabil','','teal')
        +sc('💓','Denyut Nadi','76 bpm','Normal','','blue')
      +'</div>'
      +'<div class="monitoring-input-card" style="margin-bottom:1.25rem">'
        +'<div class="card-title" style="color:var(--teal-700)">➕ Input Data Kesehatan Hari Ini</div>'
        +'<div class="form-row-2">'
          +'<div class="form-group"><label class="form-label">Tekanan Darah Sistolik (mmHg)</label><input type="number" class="form-input" id="in-sys" placeholder="130"/></div>'
          +'<div class="form-group"><label class="form-label">Tekanan Darah Diastolik (mmHg)</label><input type="number" class="form-input" id="in-dia" placeholder="83"/></div>'
          +'<div class="form-group"><label class="form-label">Gula Darah (mg/dL)</label><input type="number" class="form-input" id="in-glu" placeholder="106"/></div>'
          +'<div class="form-group"><label class="form-label">Denyut Nadi (bpm)</label><input type="number" class="form-input" id="in-pul" placeholder="76"/></div>'
        +'</div>'
        +'<div class="form-group"><label class="form-label">Catatan Tambahan</label><textarea class="form-textarea" id="in-note" placeholder="Gejala, aktivitas, dll..."></textarea></div>'
        +'<button class="btn btn-primary" id="save-mon-btn">💾 Simpan Data</button>'
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">❤️ Riwayat Tekanan Darah (7 Hari)</div>'+barChart(MON.bp.map(function(d){return d.v;}),MON.bp.map(function(d){return d.d;}),110,165,'#e05252')+'<p style="font-size:.74rem;color:var(--slate-400);margin-top:.4rem">Normal: &lt;120/80 mmHg</p></div>'
        +'<div class="card"><div class="card-title">🍬 Riwayat Gula Darah (7 Hari)</div>'+barChart(MON.glucose.map(function(d){return d.v;}),MON.glucose.map(function(d){return d.d;}),80,140,'#e08a2e')+'<p style="font-size:.74rem;color:var(--slate-400);margin-top:.4rem">Normal puasa: 70–100 mg/dL</p></div>'
      +'</div>';
  }

  function pagePatEMR() {
    var hist=EMR_DATA['P001']||[];
    return ph('Rekam Medis Saya','Riwayat kesehatan dan catatan medis lengkap')
      +'<div class="emr-profile"><div class="emr-avatar">'+CU.initial+'</div>'
        +'<div class="emr-meta"><h3>'+CU.display+'</h3><p>'+CU.faskes+' &nbsp;·&nbsp; No. RM: RM-2025-0042</p>'
          +'<div class="emr-tags"><span class="emr-tag">Hipertensi</span><span class="emr-tag">Prediabetes</span><span class="emr-tag">Amlodipin 5mg</span></div></div>'
        +'<div style="display:flex;flex-direction:column;gap:.5rem;flex-shrink:0">'
          +'<button class="btn btn-outline btn-sm" onclick="showToast(\'Mengunduh PDF...\',\'📥\')">⬇ Unduh PDF</button>'
          +'<button class="btn btn-ghost btn-sm" onclick="showToast(\'Mencetak...\',\'🖨\')">🖨 Cetak</button>'
        +'</div></div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📋 Riwayat Konsultasi</div><div class="emr-timeline">'+hist.map(timelineItem).join('')+'</div></div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">💊 Obat Aktif</div>'+obatList([{name:'Amlodipin 5mg',dose:'1x1 sehari',note:'Setelah makan'},{name:'Betahistin 12mg',dose:'2x1 sehari',note:'Pagi & sore'}])+'</div>'
          +'<div class="card"><div class="card-title">🔬 Hasil Lab Terbaru</div>'+labTable([['Gula Darah Puasa','118 mg/dL','Prediabetes','warn'],['HbA1c','6.4%','Prediabetes','warn'],['Kolesterol','198 mg/dL','Normal','success'],['Kreatinin','0.9 mg/dL','Normal','success']])+'</div>'
        +'</div>'
      +'</div>';
  }

  function pageProfil() {
    var rl=CU.role==='pasien'?'Pasien':CU.role==='dokter'?(CU.spec||'Dokter'):'Administrator';
    return ph('Profil Saya','')
      +'<div class="grid-2">'
        +'<div class="card"><div style="text-align:center;padding:1rem 0 1.5rem">'
          +'<div class="emr-avatar" style="width:72px;height:72px;font-size:1.6rem;margin:0 auto 1rem">'+CU.initial+'</div>'
          +'<div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700">'+CU.display+'</div>'
          +'<div style="font-size:.82rem;color:var(--teal-600);font-weight:500;margin:.25rem 0">'+rl+'</div>'
          +'<div style="font-size:.78rem;color:var(--slate-500)">'+CU.faskes+'</div></div>'
          +[['Email',CU.email||'-'],['Fasilitas',CU.faskes||'-'],['Role',rl]].map(function(r){
            return '<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.8rem;color:var(--slate-500)">'+r[0]+'</span><span style="font-size:.82rem;font-weight:500">'+r[1]+'</span></div>';
          }).join('')
          +'<button class="btn btn-outline" style="width:100%;margin-top:1rem" onclick="showToast(\'Edit profil...\',\'✏️\')">✏️ Edit Profil</button>'
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔒 Keamanan Akun</div>'
            +'<button class="btn btn-outline" style="width:100%;margin-bottom:.65rem" onclick="showToast(\'Ubah kata sandi...\',\'🔑\')">🔑 Ubah Kata Sandi</button>'
            +'<button class="btn btn-outline" style="width:100%" onclick="showToast(\'2FA diaktifkan\',\'✓\')">📱 Autentikasi 2 Faktor</button>'
          +'</div>'
          +'<div class="card"><div class="card-title">🔔 Preferensi Notifikasi</div>'
            +[['Pengingat Jadwal',true],['Hasil Pemeriksaan',true],['Pengingat Obat',true],['Info Kesehatan',false]].map(function(r){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.84rem">'+r[0]+'</span><div class="toggle-switch'+(r[1]?' on':'')+'" onclick="this.classList.toggle(\'on\')"></div></div>';
            }).join('')
          +'</div>'
        +'</div>'
      +'</div>';
  }

  /* ═══════════ DOKTER PAGES ═══════════ */
  function pageDocTeleconsult() {
    var queue=APPOINTMENTS.filter(function(a){ return a.doctor===CU.display&&a.status!=='done'; });
    var selP=selectedPatient?PATIENTS_LIST.find(function(p){ return p.id===selectedPatient; }):null;
    var chat=chatMsgsDokter.map(msgBubble).join('');
    return ph('Teleconsultation','Layani konsultasi pasien secara real-time')
      +'<div class="grid-2">'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">👥 Antrean Pasien</div>'
            +(queue.length?queue.map(function(a){
              var p=PATIENTS_LIST.find(function(x){ return x.display===a.patient; });
              var pid=p?p.id:'';
              return '<div class="doctor-card'+(selectedPatient&&pid===selectedPatient?' selected':'')+' doc-queue-item" data-pid="'+pid+'" style="text-align:left;padding:.85rem 1rem;display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">'
                +'<div class="avatar">'+a.patient.replace('Pasien ','P')+'</div>'
                +'<div style="flex:1"><div style="font-weight:600;font-size:.88rem">'+a.patient+'</div>'
                  +'<div style="font-size:.74rem;color:var(--slate-500)">'+a.time+' · '+a.type+'</div>'
                  +'<div style="font-size:.72rem;color:var(--teal-600);margin-top:.1rem">'+a.keluhan+'</div></div>'
                +'<span class="badge '+(a.status==='confirmed'?'badge-success':'badge-warn')+'">'+(a.status==='confirmed'?'Siap':'Menunggu')+'</span>'
              +'</div>';
            }).join(''):'<p style="color:var(--slate-400);font-size:.84rem;padding:.5rem 0">Tidak ada antrean saat ini.</p>')
          +'</div>'
          +'<div class="card"><div class="card-title">📋 Info Pasien Aktif</div>'
            +(selP
              ?'<div style="display:flex;align-items:center;gap:.85rem;margin-bottom:.85rem">'
                  +'<div class="avatar" style="width:46px;height:46px;font-size:.9rem">'+selP.initial+'</div>'
                  +'<div><div style="font-weight:700;font-size:.95rem">'+selP.display+'</div>'
                    +'<div style="font-size:.76rem;color:var(--teal-600)">'+selP.penyakit.join(', ')+'</div>'
                    +'<div style="font-size:.73rem;color:var(--slate-500)">'+selP.puskesmas+'</div></div></div>'
                +[['TD Terakhir',selP.bp[selP.bp.length-1]+' mmHg'],['GDS Terakhir',selP.glucose[selP.glucose.length-1]+' mg/dL'],['Kunjungan Terakhir',selP.lastVisit]].map(function(r){
                  return '<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.8rem;color:var(--slate-500)">'+r[0]+'</span><span style="font-size:.82rem;font-weight:600">'+r[1]+'</span></div>';
                }).join('')
                +'<div style="display:flex;gap:.5rem;margin-top:.75rem">'
                  +'<button class="btn btn-outline btn-sm" style="flex:1" onclick="navi(\'d-emr\')">📂 EMR Pasien</button>'
                  +'<button class="btn btn-primary btn-sm" style="flex:1" onclick="navi(\'d-diagnosis\')">📝 Diagnosis</button>'
                +'</div>'
              :'<p style="color:var(--slate-400);font-size:.84rem">Pilih pasien dari antrean untuk memulai.</p>')
          +'</div>'
        +'</div>'
        +'<div>'
          +chatBox(selP?selP.initial:'?',selP?selP.display:'Pilih pasien dari antrean',selP?selP.penyakit.join(', '):'',!!selP,chat)
          +'<div class="card" style="margin-top:1rem"><div class="card-title">📝 Catatan Konsultasi</div>'
            +'<div class="form-group"><label class="form-label">Catatan / Instruksi untuk Pasien</label><textarea class="form-textarea" id="doc-note" placeholder="Catatan konsultasi, instruksi pasien..."></textarea></div>'
            +'<div style="display:flex;gap:.5rem"><button class="btn btn-outline" style="flex:1" onclick="navi(\'d-diagnosis\')">📝 Buat Diagnosis</button><button class="btn btn-primary" style="flex:1" id="doc-send-note-btn">💾 Simpan Catatan</button></div>'
          +'</div>'
        +'</div>'
      +'</div>';
  }

  function pageDocPasienList() {
    return ph('Daftar Pasien','Kelola dan akses informasi seluruh pasien')
      +'<div class="card">'
        +'<div class="search-bar"><div class="search-input-wrap"><svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input class="search-input" placeholder="Cari ID, penyakit..."/></div>'
          +'<select class="form-select" style="width:auto;min-width:150px"><option>Semua Penyakit</option><option>Hipertensi</option><option>Diabetes Mellitus</option></select>'
        +'</div>'
        +'<div class="table-wrap"><table><thead><tr><th>No.RM</th><th>Pasien</th><th>Penyakit</th><th>TD Terakhir</th><th>GDS Terakhir</th><th>Puskesmas</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
          +PATIENTS_LIST.map(function(p){
            var lb=p.bp[p.bp.length-1],lg=p.glucose[p.glucose.length-1];
            return '<tr><td style="font-family:monospace;font-size:.78rem">'+p.id+'</td>'
              +'<td><div style="display:flex;align-items:center;gap:.6rem"><div class="avatar" style="width:28px;height:28px;font-size:.68rem">'+p.initial+'</div><div><div style="font-weight:500">'+p.display+'</div><div style="font-size:.7rem;color:var(--slate-400)">'+p.puskesmas+'</div></div></div></td>'
              +'<td>'+p.penyakit.map(function(d){ return '<span class="badge badge-info" style="margin-right:.2rem;font-size:.68rem">'+d+'</span>'; }).join('')+'</td>'
              +'<td><span style="font-size:.83rem;font-weight:600;color:'+(lb>150?'var(--error)':'var(--success)')+'">'+lb+' mmHg</span></td>'
              +'<td><span style="font-size:.83rem;font-weight:600;color:'+(lg>200?'var(--error)':lg>140?'var(--warn)':'var(--success)')+'">'+lg+' mg/dL</span></td>'
              +'<td style="font-size:.8rem">'+p.puskesmas+'</td>'
              +'<td><span class="badge '+(p.status==='Aktif'?'badge-success':'badge-neutral')+'">'+p.status+'</span></td>'
              +'<td><div style="display:flex;gap:.35rem"><button class="btn btn-sm btn-outline doc-emr-btn" data-pid="'+p.id+'">EMR</button><button class="btn btn-sm btn-outline doc-mon-btn" data-pid="'+p.id+'">Pantau</button><button class="btn btn-sm btn-primary doc-diag-btn" data-pid="'+p.id+'">Diagnosis</button></div></td>'
            +'</tr>';
          }).join('')
        +'</tbody></table></div>'
      +'</div>';
  }

  function pageDocEMR() {
    var pid=selectedPatient||'P001';
    var p=PATIENTS_LIST.find(function(x){ return x.id===pid; })||PATIENTS_LIST[0];
    var hist=EMR_DATA[p.id]||[];
    return ph('Akses EMR Pasien','Lihat riwayat kesehatan pasien sebagai dasar analisis medis')
      +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔍 Pilih Pasien</div>'
        +'<div style="display:flex;gap:.5rem;flex-wrap:wrap">'
          +PATIENTS_LIST.map(function(x){ return '<button class="btn '+(x.id===pid?'btn-primary':'btn-outline')+' btn-sm emr-select-btn" data-pid="'+x.id+'">'+x.display+' ('+x.id+')</button>'; }).join('')
        +'</div>'
      +'</div>'
      +'<div class="emr-profile"><div class="emr-avatar">'+p.initial+'</div>'
        +'<div class="emr-meta"><h3>'+p.display+'</h3>'
          +'<p>NIK: '+p.nik+' &nbsp;·&nbsp; Gol. Darah: '+p.goldar+' &nbsp;·&nbsp; '+p.puskesmas+'</p>'
          +'<div class="emr-tags">'+p.penyakit.map(function(d){ return '<span class="emr-tag">'+d+'</span>'; }).join('')+'</div></div>'
        +'<div style="display:flex;flex-direction:column;gap:.5rem;flex-shrink:0">'
          +'<button class="btn btn-primary btn-sm" onclick="navi(\'d-diagnosis\')">📝 Buat Diagnosis</button>'
          +'<button class="btn btn-outline btn-sm" onclick="showToast(\'Mencetak EMR...\',\'🖨\')">🖨 Cetak</button>'
        +'</div>'
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📋 Riwayat Konsultasi</div>'
          +(hist.length?'<div class="emr-timeline">'+hist.map(timelineItem).join('')+'</div>':'<p style="color:var(--slate-400);font-size:.84rem">Belum ada riwayat.</p>')
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">📊 Tren Kesehatan</div>'
            +'<div style="font-size:.78rem;font-weight:600;color:var(--slate-600);margin-bottom:.25rem">Tekanan Darah (7 hari)</div>'
            +barChart(p.bp,['','','','','','',''],90,200,'#e05252')
            +'<div style="font-size:.78rem;font-weight:600;color:var(--slate-600);margin:.75rem 0 .25rem">Gula Darah (7 hari)</div>'
            +barChart(p.glucose,['','','','','','',''],80,280,'#e08a2e')
          +'</div>'
          +(hist[0]?'<div class="card"><div class="card-title">💊 Terapi Terakhir</div>'
            +'<div style="background:var(--teal-50);border:1px solid var(--teal-200);border-radius:10px;padding:.85rem">'
              +'<div style="font-size:.82rem;font-weight:600">'+hist[0].diag+'</div>'
              +'<div style="font-size:.78rem;color:var(--teal-700);margin-top:.25rem">'+hist[0].obat+'</div>'
              +'<div style="font-size:.72rem;color:var(--slate-500);margin-top:.15rem">'+hist[0].date+' · '+hist[0].doctor+'</div>'
            +'</div></div>':'')
        +'</div>'
      +'</div>';
  }

  function pageDocDiagnosis() {
    var pid=selectedPatient||'P001';
    var p=PATIENTS_LIST.find(function(x){ return x.id===pid; })||PATIENTS_LIST[0];
    return ph('Diagnosis & Rekomendasi Medis','Buat diagnosis dan resep berdasarkan data pasien')
      +'<div class="grid-2" style="align-items:start">'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔍 Pilih Pasien</div>'
            +'<div style="display:flex;gap:.5rem;flex-wrap:wrap">'
              +PATIENTS_LIST.map(function(x){ return '<button class="btn '+(x.id===pid?'btn-primary':'btn-outline')+' btn-sm diag-select-btn" data-pid="'+x.id+'">'+x.display+'</button>'; }).join('')
            +'</div></div>'
          +'<div class="card"><div class="card-title">👤 Ringkasan: '+p.display+'</div>'
            +[['Penyakit',p.penyakit.join(', ')],['TD Terakhir',p.bp[p.bp.length-1]+' mmHg'],['GDS Terakhir',p.glucose[p.glucose.length-1]+' mg/dL'],['Kunjungan Terakhir',p.lastVisit]].map(function(r){
              return '<div style="display:flex;justify-content:space-between;padding:.45rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.8rem;color:var(--slate-500)">'+r[0]+'</span><span style="font-size:.82rem;font-weight:600">'+r[1]+'</span></div>';
            }).join('')
            +'<button class="btn btn-outline btn-sm" style="width:100%;margin-top:.75rem" onclick="navi(\'d-emr\')">📂 Lihat EMR Lengkap</button>'
          +'</div>'
        +'</div>'
        +'<div class="card"><div class="card-title">📝 Form Diagnosis & Resep</div>'
          +'<div class="form-group"><label class="form-label">Keluhan Pasien</label><textarea class="form-textarea" id="diag-keluhan" style="min-height:60px" placeholder="Keluhan yang disampaikan pasien..."></textarea></div>'
          +'<div class="form-group"><label class="form-label">Diagnosis</label>'
            +'<select class="form-select" id="diag-select"><option>Pilih diagnosis...</option><option>Hipertensi Grade 1</option><option>Hipertensi Grade 2</option><option>Diabetes Mellitus Tipe 2</option><option>DM Tipe 2 tidak terkontrol</option><option>Hipertensi + DM Tipe 2</option><option>Prediabetes</option><option>Vertigo posisional</option><option>Lainnya</option></select>'
          +'</div>'
          +'<div class="form-group"><label class="form-label">Rekomendasi Medis</label><textarea class="form-textarea" id="diag-notes" placeholder="Saran pengobatan, perubahan gaya hidup, tindak lanjut..."></textarea></div>'
          +'<div class="form-group"><label class="form-label">Resep Obat</label>'
            +'<div id="resep-list"><div class="resep-item" style="display:flex;gap:.5rem;margin-bottom:.5rem">'
              +'<input type="text" class="form-input" placeholder="Nama obat (mis. Amlodipin 5mg)" style="flex:2"/>'
              +'<input type="text" class="form-input" placeholder="Dosis (mis. 1x1)" style="flex:1"/>'
            +'</div></div>'
            +'<button class="btn btn-ghost btn-sm" id="add-resep-btn" style="width:100%;margin-top:.3rem">+ Tambah Obat</button>'
          +'</div>'
          +'<div class="form-group"><label class="form-label">Jadwal Kontrol Berikutnya</label><input type="date" class="form-input" id="diag-followup"/></div>'
          +'<div style="display:flex;gap:.65rem;margin-top:.5rem">'
            +'<button class="btn btn-outline" style="flex:1" onclick="showToast(\'Draft disimpan\',\'💾\')">Simpan Draft</button>'
            +'<button class="btn btn-primary" style="flex:1" id="save-diag-btn">✅ Simpan & Kirim ke Pasien</button>'
          +'</div>'
        +'</div>'
      +'</div>';
  }

  function pageDocMonitoring() {
    var kritis=PATIENTS_LIST.filter(function(p){ return p.bp[p.bp.length-1]>145||p.glucose[p.glucose.length-1]>180; });
    var stabil=PATIENTS_LIST.filter(function(p){ return p.bp[p.bp.length-1]<=145&&p.glucose[p.glucose.length-1]<=180; });
    return ph('Monitoring Pasien Kronis','Pantau kondisi pasien hipertensi dan diabetes mellitus secara berkala')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('👥','Total Dipantau',''+PATIENTS_LIST.length+' Pasien','','','teal')
        +sc('⚠️','Nilai Kritis',''+kritis.length+' Pasien','Perlu tindakan','down','rose')
        +sc('✅','Kondisi Stabil',''+stabil.length+' Pasien','','up','green')
        +sc('📊','Data Masuk Hari Ini','4 Laporan','','','blue')
      +'</div>'
      +(kritis.length?'<div class="card" style="margin-bottom:1rem;border-left:4px solid var(--error)">'
        +'<div class="card-title" style="color:var(--error)">⚠️ Pasien dengan Nilai Kritis — Perlu Tindakan Segera</div>'
        +kritis.map(function(p){
          var lb=p.bp[p.bp.length-1],lg=p.glucose[p.glucose.length-1];
          return '<div style="display:flex;align-items:center;gap:.85rem;padding:.75rem;background:#fff1f2;border-radius:10px;margin-bottom:.5rem">'
            +'<div class="avatar" style="background:linear-gradient(135deg,var(--error),#e57272);width:38px;height:38px;font-size:.75rem">'+p.initial+'</div>'
            +'<div style="flex:1"><div style="font-weight:700;font-size:.9rem">'+p.display+'</div>'
              +'<div style="font-size:.76rem;color:var(--slate-600)">'+p.penyakit.join(' · ')+'</div>'
              +'<div style="display:flex;gap:.75rem;margin-top:.3rem">'
                +(lb>145?'<span style="font-size:.75rem;font-weight:700;color:var(--error)">TD: '+lb+' mmHg ↑</span>':'')
                +(lg>180?'<span style="font-size:.75rem;font-weight:700;color:var(--warn)">GDS: '+lg+' mg/dL ↑</span>':'')
              +'</div></div>'
            +'<div style="display:flex;flex-direction:column;gap:.4rem">'
              +'<button class="btn btn-sm btn-danger doc-emr-btn" data-pid="'+p.id+'">Lihat EMR</button>'
              +'<button class="btn btn-sm btn-outline doc-diag-btn" data-pid="'+p.id+'">Diagnosis</button>'
            +'</div></div>';
        }).join('')
      +'</div>':'')
      +'<div class="card"><div class="card-title">📊 Status Semua Pasien</div>'
        +'<div class="table-wrap"><table><thead><tr><th>Pasien</th><th>Penyakit</th><th>TD Terbaru</th><th>GDS Terbaru</th><th>Tren TD</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
          +PATIENTS_LIST.map(function(p){
            var lb=p.bp[p.bp.length-1],lg=p.glucose[p.glucose.length-1];
            var bpOk=lb<=140,glOk=lg<=140;
            var mini=p.bp.map(function(v){ var h=Math.max(4,Math.round((v-100)/80*28)); return '<div style="width:5px;height:'+h+'px;background:'+(v>150?'var(--error)':'var(--teal-400)')+';border-radius:2px 2px 0 0"></div>'; }).join('');
            return '<tr><td><div style="display:flex;align-items:center;gap:.5rem"><div class="avatar" style="width:28px;height:28px;font-size:.65rem">'+p.initial+'</div>'+p.display+'</div></td>'
              +'<td>'+p.penyakit.map(function(d){ return '<span class="badge badge-info" style="font-size:.65rem">'+d+'</span>'; }).join(' ')+'</td>'
              +'<td><span style="font-weight:700;color:'+(bpOk?'var(--success)':'var(--error)')+'">'+lb+' mmHg</span></td>'
              +'<td><span style="font-weight:700;color:'+(glOk?'var(--success)':'var(--warn)')+'">'+lg+' mg/dL</span></td>'
              +'<td><div style="display:flex;align-items:flex-end;gap:2px;height:30px">'+mini+'</div></td>'
              +'<td><span class="badge '+(bpOk&&glOk?'badge-success':'badge-warn')+'">'+(bpOk&&glOk?'Stabil':'Perhatian')+'</span></td>'
              +'<td><div style="display:flex;gap:.35rem"><button class="btn btn-sm btn-outline doc-emr-btn" data-pid="'+p.id+'">EMR</button><button class="btn btn-sm btn-primary doc-diag-btn" data-pid="'+p.id+'">Diagnosis</button></div></td>'
            +'</tr>';
          }).join('')
        +'</tbody></table></div></div>';
  }

  function pageDocRiwayat() {
    return ph('Riwayat Konsultasi','Seluruh riwayat konsultasi pasien sebagai bahan evaluasi medis')
      +'<div class="grid-3" style="margin-bottom:1.25rem">'
        +sc('📋','Total Konsultasi',''+CONSULT_HISTORY.length+' Sesi','Semua waktu','','teal')
        +sc('✅','Konsultasi Saya',''+CONSULT_HISTORY.filter(function(k){ return k.doctor===CU.display; }).length+' Sesi','','up','green')
        +sc('📊','Rata-rata per Hari','2.4 Sesi','Bulan ini','','blue')
      +'</div>'
      +'<div class="card">'
        +'<div class="search-bar"><div class="search-input-wrap"><svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input class="search-input" placeholder="Cari pasien, diagnosis..."/></div>'
          +'<select class="form-select" style="width:auto;min-width:140px"><option>Semua Tipe</option><option>Teleconsultation</option><option>Kontrol Rutin</option></select>'
          +'<input type="date" class="form-input" style="width:auto"/>'
        +'</div>'
        +'<div class="table-wrap"><table><thead><tr><th>ID</th><th>Pasien</th><th>Tanggal</th><th>Tipe</th><th>Diagnosis</th><th>Resep</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
          +CONSULT_HISTORY.map(function(k){
            return '<tr><td style="font-family:monospace;font-size:.78rem">'+k.id+'</td><td style="font-weight:500">'+k.patient+'</td>'
              +'<td style="font-size:.8rem">'+k.date+'</td><td><span class="badge badge-info">'+k.type+'</span></td>'
              +'<td style="font-size:.8rem">'+k.diag+'</td><td style="font-size:.78rem;color:var(--slate-500)">'+k.resep+'</td>'
              +'<td><span class="badge badge-success">'+k.status+'</span></td>'
              +'<td><button class="btn btn-sm btn-outline" onclick="showDetailKonsul(\''+k.id+'\')">Detail</button></td></tr>';
          }).join('')
        +'</tbody></table></div>'
      +'</div>';
  }

  /* ═══════════ ADMIN PAGES ═══════════ */
  function pageAdmUsers() {
    var users=[
      {initial:'P1',display:'Pasien 1',email:'pasien1@gmail.com',role:'Pasien',faskes:'Pusk. Tanjung',tgl:'1 Jan 2025',status:'Aktif'},
      {initial:'P2',display:'Pasien 2',email:'pasien2@gmail.com',role:'Pasien',faskes:'Pusk. Gangga',tgl:'10 Feb 2025',status:'Aktif'},
      {initial:'P3',display:'Pasien 3',email:'pasien3@gmail.com',role:'Pasien',faskes:'Pusk. Bayan',tgl:'5 Mar 2025',status:'Aktif'},
      {initial:'DA',display:'Dokter A',email:'dokter1@gmail.com',role:'Dokter',faskes:'RSUD Tanjung',tgl:'15 Des 2024',status:'Aktif'},
      {initial:'DB',display:'Dokter B',email:'dokter2@gmail.com',role:'Dokter',faskes:'RSUD Tanjung',tgl:'1 Nov 2024',status:'Aktif'},
      {initial:'DC',display:'Dokter C',email:'dokter3@gmail.com',role:'Dokter',faskes:'Pusk. Tanjung',tgl:'20 Jan 2025',status:'Aktif'},
      {initial:'AD',display:'Admin MTH',email:'admin@mth.id',role:'Admin',faskes:'RSUD Tanjung',tgl:'1 Jan 2024',status:'Aktif'},
    ];
    return ph('Manajemen Pengguna','Kelola akun pasien dan dokter dalam sistem')
      +'<div class="grid-3" style="margin-bottom:1.25rem">'
        +sc('👤','Total Pasien','229','↑ 10 bulan ini','up','teal')
        +sc('👨‍⚕️','Total Dokter','18','9 puskesmas','','blue')
        +sc('⚙️','Administrator','3','Terverifikasi','','green')
      +'</div>'
      +'<div class="card"><div class="search-bar">'
        +'<div class="search-input-wrap"><svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input class="search-input" placeholder="Cari nama, email..."/></div>'
        +'<select class="form-select" style="width:auto;min-width:120px"><option>Semua Role</option><option>Pasien</option><option>Dokter</option></select>'
        +'<button class="btn btn-primary btn-sm" onclick="openAddUserModal()">+ Tambah Pengguna</button>'
      +'</div>'
      +'<div class="table-wrap"><table><thead><tr><th>Pengguna</th><th>Email</th><th>Role</th><th>Fasilitas</th><th>Terdaftar</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
        +users.map(function(u){
          var isAdmin=u.role==='Admin';
          return '<tr><td><div style="display:flex;align-items:center;gap:.6rem"><div class="avatar" style="width:28px;height:28px;font-size:.68rem">'+u.initial+'</div>'+u.display+'</div></td>'
            +'<td style="font-size:.78rem;color:var(--slate-500)">'+u.email+'</td>'
            +'<td><span class="badge '+(u.role==='Dokter'?'badge-info':u.role==='Admin'?'badge-warn':'badge-neutral')+'">'+u.role+'</span></td>'
            +'<td style="font-size:.8rem">'+u.faskes+'</td><td style="font-size:.78rem;color:var(--slate-400)">'+u.tgl+'</td>'
            +'<td><span class="badge badge-success">'+u.status+'</span></td>'
            +'<td><div style="display:flex;gap:.35rem"><button class="btn btn-sm btn-outline" onclick="showToast(\'Edit pengguna...\',\'✏️\')">Edit</button>'
              +(isAdmin?'':'<button class="btn btn-sm btn-danger" onclick="showToast(\'Pengguna dinonaktifkan\',\'⛔\')">Nonaktif</button>')
            +'</div></td></tr>';
        }).join('')
      +'</tbody></table></div></div>';
  }

  function pageAdmJadwal() {
    return ph('Pengaturan Jadwal Layanan','Atur jadwal konsultasi agar pelayanan berjalan terstruktur')
      +'<div class="grid-2" style="align-items:start">'
        +'<div class="card"><div class="card-title">📅 Jadwal Dokter</div>'
          +DOCTORS.map(function(d){
            return '<div style="padding:.85rem;border:1.5px solid var(--slate-100);border-radius:12px;margin-bottom:.75rem">'
              +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem">'
                +'<div style="display:flex;align-items:center;gap:.6rem"><div class="avatar" style="width:32px;height:32px;font-size:.72rem">'+d.initial+'</div>'
                  +'<div><div style="font-weight:600;font-size:.88rem">'+d.display+'</div><div style="font-size:.72rem;color:var(--teal-600)">'+d.spec+' · '+d.faskes+'</div></div></div>'
                +'<span class="badge '+(d.online?'badge-success':'badge-neutral')+'">'+(d.online?'Aktif':'Non-aktif')+'</span>'
              +'</div>'
              +'<div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.6rem">'
                +['Sen','Sel','Rab','Kam','Jum'].map(function(h,i){ var on=[true,true,false,true,true][i]; return '<span style="font-size:.72rem;padding:.25rem .6rem;border-radius:6px;background:'+(on?'var(--teal-100)':'var(--slate-100)')+';color:'+(on?'var(--teal-700)':'var(--slate-400)')+'">'+h+'</span>'; }).join('')
                +'<span style="font-size:.72rem;color:var(--slate-400);margin-left:.25rem">08:00–14:00</span>'
              +'</div>'
              +'<div style="display:flex;gap:.4rem"><button class="btn btn-sm btn-outline" style="flex:1" onclick="showToast(\'Edit jadwal '+d.display+'...\',\'📅\')">Edit Jadwal</button><button class="btn btn-sm btn-ghost" style="flex:1" onclick="showToast(\'Blokir tanggal...\',\'🚫\')">Blokir Tgl</button></div>'
            +'</div>';
          }).join('')
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">📋 Daftar Semua Janji</div>'
            +'<div class="table-wrap"><table><thead><tr><th>Pasien</th><th>Dokter</th><th>Tgl</th><th>Waktu</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
              +APPOINTMENTS.map(function(a){
                return '<tr><td style="font-size:.82rem">'+a.patient+'</td><td style="font-size:.82rem">'+a.doctor+'</td>'
                  +'<td style="font-size:.78rem">'+a.date+'</td><td style="font-size:.82rem;font-weight:600;color:var(--teal-700)">'+a.time+'</td>'
                  +'<td><span class="badge '+(a.status==='confirmed'?'badge-success':a.status==='pending'?'badge-warn':'badge-neutral')+'">'+(a.status==='confirmed'?'Konfirmasi':a.status==='pending'?'Menunggu':'Selesai')+'</span></td>'
                  +'<td><button class="btn btn-sm btn-outline" onclick="showToast(\'Edit janji...\',\'📅\')">Edit</button></td></tr>';
              }).join('')
            +'</tbody></table></div></div>'
          +'<div class="card"><div class="card-title">⚡ Aksi Cepat</div>'
            +'<div style="display:flex;flex-direction:column;gap:.6rem">'
              +'<button class="btn btn-outline" onclick="showToast(\'Membuka form tambah slot...\',\'📅\')">+ Tambah Slot Konsultasi</button>'
              +'<button class="btn btn-outline" onclick="showToast(\'Notifikasi jadwal dikirim ke semua pasien\',\'📤\')">📤 Kirim Pengingat Jadwal</button>'
              +'<button class="btn btn-ghost" onclick="showToast(\'Jadwal berhasil diekspor\',\'📊\')">📊 Ekspor Jadwal Excel</button>'
            +'</div></div>'
        +'</div>'
      +'</div>';
  }

  function pageAdmEMR() {
    return ph('Pengelolaan Database EMR','Kelola penyimpanan dan akses data rekam medis elektronik')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('📂','Total Rekam Medis','912 Entri','','','teal')
        +sc('📅','Ditambah Bulan Ini','47 Entri','','up','blue')
        +sc('💾','Ukuran Database','2.4 GB','','','green')
        +sc('🔒','Enkripsi','100%','AES-256','','amber')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📊 Distribusi EMR per Puskesmas</div>'
          +[['Pusk. Tanjung',312],['Pusk. Gangga',198],['Pusk. Kayangan',154],['Pusk. Bayan',123],['Pusk. Nipah',87],['Pusk. Pemenang',38]].map(function(r){ return hBar(r[0],r[1],312); }).join('')
        +'</div>'
        +'<div class="card"><div class="card-title">🔍 Kelola Rekam Medis</div>'
          +'<div class="form-group"><div class="search-input-wrap"><svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input class="search-input" placeholder="No. RM, nama pasien, puskesmas..."/></div></div>'
          +'<div style="display:flex;flex-direction:column;gap:.6rem;margin-top:.75rem">'
            +'<button class="btn btn-outline" onclick="showToast(\'Membuka semua EMR...\',\'📂\')">📂 Lihat Semua EMR</button>'
            +'<button class="btn btn-outline" onclick="showToast(\'Ekspor database EMR...\',\'📊\')">📊 Ekspor ke Excel</button>'
            +'<button class="btn btn-ghost" onclick="showToast(\'Membersihkan duplikat...\',\'🧹\')">🧹 Bersihkan Duplikat</button>'
            +'<button class="btn btn-danger btn-sm" onclick="showToast(\'Konfirmasi diperlukan\',\'⚠️\')">⚠️ Hapus Rekam Kadaluarsa</button>'
          +'</div>'
        +'</div>'
      +'</div>'
      +'<div class="card" style="margin-top:1rem"><div class="card-title">📋 Rekam Medis Terbaru</div>'
        +'<div class="table-wrap"><table><thead><tr><th>No.RM</th><th>Pasien</th><th>Tanggal</th><th>Dokter</th><th>Diagnosis</th><th>Puskesmas</th><th>Aksi</th></tr></thead><tbody>'
          +CONSULT_HISTORY.map(function(k){
            var p=PATIENTS_LIST.find(function(x){ return x.display===k.patient; })||{initial:'?',puskesmas:'-'};
            return '<tr><td style="font-family:monospace;font-size:.78rem">'+k.id+'</td>'
              +'<td><div style="display:flex;align-items:center;gap:.5rem"><div class="avatar" style="width:26px;height:26px;font-size:.65rem">'+p.initial+'</div>'+k.patient+'</div></td>'
              +'<td style="font-size:.8rem">'+k.date+'</td><td style="font-size:.8rem">'+k.doctor+'</td>'
              +'<td style="font-size:.8rem">'+k.diag+'</td><td style="font-size:.78rem">'+p.puskesmas+'</td>'
              +'<td><div style="display:flex;gap:.35rem"><button class="btn btn-sm btn-outline" onclick="showToast(\'Membuka EMR...\',\'📂\')">Lihat</button><button class="btn btn-sm btn-ghost" onclick="showToast(\'Mengunduh PDF...\',\'📥\')">PDF</button></div></td></tr>';
          }).join('')
        +'</tbody></table></div></div>';
  }

  function pageAdmMonitoring() {
    var logs=[
      {time:'13:45:22',user:'Dokter A',action:'Membuat diagnosis untuk Pasien 1',type:'diag',tc:'badge-info'},
      {time:'13:30:11',user:'Pasien 2',action:'Login ke sistem',type:'Autentikasi',tc:'badge-neutral'},
      {time:'13:15:44',user:'Dokter B',action:'Memulai teleconsultasi dengan Pasien 2',type:'Konsultasi',tc:'badge-success'},
      {time:'12:58:33',user:'Admin MTH',action:'Menambahkan akun Pasien 3',type:'Admin',tc:'badge-warn'},
      {time:'12:40:05',user:'Pasien 1',action:'Menginput data monitoring tekanan darah',type:'Data',tc:'badge-info'},
      {time:'12:22:17',user:'Dokter C',action:'Mengakses EMR Pasien 3',type:'EMR',tc:'badge-neutral'},
      {time:'12:05:50',user:'Sistem',action:'Backup otomatis berhasil (2.4 GB)',type:'Sistem',tc:'badge-neutral'},
    ];
    return ph('Monitoring Aktivitas Sistem','Pantau seluruh aktivitas dalam sistem telemedicine secara real-time')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('🔄','Aktivitas Hari Ini','142 Aksi','↑ 18%','up','teal')
        +sc('👤','Pengguna Aktif','23','Saat ini','','blue')
        +sc('❌','Error / Gagal','2','24 jam terakhir','down','rose')
        +sc('⚡','Response Time','42 ms','Rata-rata','up','green')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📊 Aktivitas per Jam (Hari Ini)</div>'+barChart([12,18,8,25,32,28,35,42,38,30,22,15],[8,9,10,11,12,13,14,15,16,17,18,19],0,50,'var(--teal-500)')+'</div>'
        +'<div class="card"><div class="card-title">📈 Distribusi Tipe Aktivitas</div>'
          +[['Konsultasi','38%',0.38],['Autentikasi','22%',0.22],['Akses EMR','18%',0.18],['Data Monitoring','12%',0.12],['Lainnya','10%',0.10]].map(function(r){
            return '<div style="display:flex;align-items:center;gap:.75rem;padding:.45rem 0;border-bottom:1px solid var(--slate-100)">'
              +'<div style="flex:1;font-size:.82rem">'+r[0]+'</div>'
              +'<div style="width:100px;height:8px;background:var(--slate-100);border-radius:99px"><div style="height:100%;width:'+Math.round(r[2]*100)+'%;background:var(--teal-400);border-radius:99px"></div></div>'
              +'<div style="font-size:.8rem;font-weight:600;width:36px;text-align:right;color:var(--teal-700)">'+r[1]+'</div></div>';
          }).join('')
        +'</div>'
      +'</div>'
      +'<div class="card" style="margin-top:1rem"><div class="card-title">📋 Log Aktivitas Terbaru</div>'
        +'<div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Pengguna</th><th>Aktivitas</th><th>Tipe</th></tr></thead><tbody>'
          +logs.map(function(l){ return '<tr><td style="font-family:monospace;font-size:.78rem">'+l.time+'</td><td style="font-size:.82rem;font-weight:500">'+l.user+'</td><td style="font-size:.82rem">'+l.action+'</td><td><span class="badge '+l.tc+'">'+l.type+'</span></td></tr>'; }).join('')
        +'</tbody></table></div></div>';
  }

  function pageAdmBackup() {
    var backups=[
      {id:'BK-20250613',tgl:'13 Jun 2025 23:00',size:'2.41 GB',tipe:'Otomatis',ok:true},
      {id:'BK-20250612',tgl:'12 Jun 2025 23:00',size:'2.38 GB',tipe:'Otomatis',ok:true},
      {id:'BK-20250610',tgl:'10 Jun 2025 15:30',size:'2.33 GB',tipe:'Manual',  ok:true},
      {id:'BK-20250609',tgl:'9 Jun 2025 23:00', size:'—',      tipe:'Otomatis',ok:false},
    ];
    return ph('Backup & Recovery Data','Jaga keamanan data dengan pencadangan dan pemulihan sistem')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('💾','Backup Terakhir','Kemarin 23:00','Berhasil','up','green')
        +sc('📅','Jadwal Backup','Setiap hari 23:00','Otomatis','','teal')
        +sc('📦','Total Backup','14 File','30 hari terakhir','','blue')
        +sc('⚠️','Backup Gagal','1 Kali','Bulan ini','down','rose')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">⚙️ Konfigurasi Backup</div>'
          +'<div class="form-group"><label class="form-label">Jadwal Backup Otomatis</label><select class="form-select"><option>Setiap hari pukul 23:00</option><option>Setiap 12 jam</option><option>Setiap minggu</option></select></div>'
          +'<div class="form-group"><label class="form-label">Retensi Data Backup</label><select class="form-select"><option>30 Hari</option><option>60 Hari</option><option>90 Hari</option></select></div>'
          +'<div class="form-group"><label class="form-label">Lokasi Penyimpanan</label><input type="text" class="form-input" value="Cloud Storage — Google Cloud Platform" readonly/></div>'
          +'<div style="display:flex;gap:.65rem"><button class="btn btn-outline" style="flex:1" onclick="showToast(\'Konfigurasi disimpan\',\'💾\')">Simpan Config</button><button class="btn btn-primary" style="flex:1" id="run-backup-btn">▶ Jalankan Backup</button></div>'
        +'</div>'
        +'<div class="card"><div class="card-title">🔁 Recovery Data</div>'
          +'<div style="background:#fff1f2;border:1.5px solid #fecdd3;border-radius:10px;padding:1rem;margin-bottom:1rem"><div style="font-size:.82rem;font-weight:700;color:var(--error);margin-bottom:.4rem">⚠️ Peringatan</div><div style="font-size:.78rem;color:var(--slate-600)">Recovery akan menimpa data saat ini. Pastikan backup terbaru sudah tersedia.</div></div>'
          +'<div class="form-group"><label class="form-label">Pilih Titik Pemulihan</label><select class="form-select"><option>BK-20250613 — 13 Jun 2025 23:00</option><option>BK-20250612 — 12 Jun 2025 23:00</option><option>BK-20250610 — 10 Jun 2025 15:30</option></select></div>'
          +'<div class="form-group"><label class="form-label">Konfirmasi dengan mengetik "RECOVERY"</label><input type="text" class="form-input" id="recovery-confirm" placeholder="RECOVERY"/></div>'
          +'<button class="btn btn-danger" style="width:100%" id="run-recovery-btn">🔁 Mulai Recovery</button>'
        +'</div>'
      +'</div>'
      +'<div class="card" style="margin-top:1rem"><div class="card-title">📋 Riwayat Backup</div>'
        +'<div class="table-wrap"><table><thead><tr><th>ID Backup</th><th>Tanggal & Waktu</th><th>Ukuran</th><th>Tipe</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
          +backups.map(function(b){
            return '<tr><td style="font-family:monospace;font-size:.78rem">'+b.id+'</td><td style="font-size:.82rem">'+b.tgl+'</td><td style="font-size:.82rem">'+b.size+'</td>'
              +'<td><span class="badge badge-neutral">'+b.tipe+'</span></td><td><span class="badge '+(b.ok?'badge-success':'badge-error')+'">'+(b.ok?'Berhasil':'Gagal')+'</span></td>'
              +'<td><div style="display:flex;gap:.35rem"><button class="btn btn-sm btn-outline" onclick="showToast(\'Mengunduh backup...\',\'📥\')">Unduh</button>'+(b.ok?'<button class="btn btn-sm btn-ghost" onclick="showToast(\'Recovery dari titik ini...\',\'🔁\')">Pulihkan</button>':'')+'</div></td></tr>';
          }).join('')
        +'</tbody></table></div></div>';
  }

  function pageAdmLaporan() {
    return ph('Laporan Statistik Layanan Kesehatan','Data statistik untuk evaluasi kinerja sistem telemedicine')
      +'<div class="grid-4" style="margin-bottom:1.25rem">'
        +sc('📋','Total Konsultasi','1.284','Juni 2025','up','teal')
        +sc('👥','Pasien Terlayani','247','Unik','up','blue')
        +sc('⏱️','Rata-rata Durasi','18 Menit','Per sesi','','green')
        +sc('⭐','Kepuasan','4.7/5','198 rating','up','amber')
      +'</div>'
      +'<div class="grid-2">'
        +'<div class="card"><div class="card-title">📊 Kunjungan per Kecamatan</div>'
          +[['Tanjung',5650],['Pemenang',4357],['Gangga',4004],['Kayangan',3200],['Bayan',1817]].map(function(r){ return hBar('Kec. '+r[0],r[1],5650); }).join('')
        +'</div>'
        +'<div class="card"><div class="card-title">📈 Tren Konsultasi (6 Bulan)</div>'+barChart([842,967,1105,1198,1241,1284],['Jan','Feb','Mar','Apr','Mei','Jun'],700,1400,'var(--teal-500)')+'</div>'
      +'</div>'
      +'<div class="grid-3" style="margin-top:1rem">'
        +'<div class="card"><div class="card-title">🏥 Penyakit Terbanyak</div>'
          +[['Hipertensi','19.730 kasus'],['Diabetes Mellitus','7.519 kasus'],['Vertigo','1.245 kasus'],['ISPA','892 kasus']].map(function(r){ return '<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.82rem">'+r[0]+'</span><span style="font-size:.8rem;font-weight:600;color:var(--teal-700)">'+r[1]+'</span></div>'; }).join('')+'</div>'
        +'<div class="card"><div class="card-title">👨‍⚕️ Kinerja Dokter</div>'
          +DOCTORS.map(function(d,i){var n=[32,28,25,18][i]; return '<div style="display:flex;align-items:center;gap:.65rem;padding:.5rem 0;border-bottom:1px solid var(--slate-100)"><div class="avatar" style="width:28px;height:28px;font-size:.65rem">'+d.initial+'</div><div style="flex:1"><div style="font-size:.82rem;font-weight:600">'+d.display+'</div><div style="font-size:.7rem;color:var(--slate-500)">'+d.spec+'</div></div><div style="font-size:.82rem;font-weight:700;color:var(--teal-700)">'+n+' sesi</div></div>'; }).join('')+'</div>'
        +'<div class="card"><div class="card-title">📤 Ekspor Laporan</div>'
          +'<div style="display:flex;flex-direction:column;gap:.6rem">'
            +'<div class="form-group"><label class="form-label">Periode</label><select class="form-select"><option>Juni 2025</option><option>Mei 2025</option><option>Q2 2025</option></select></div>'
            +'<button class="btn btn-primary" onclick="showToast(\'Mengunduh laporan Excel...\',\'📊\')">📊 Ekspor Excel</button>'
            +'<button class="btn btn-outline" onclick="showToast(\'Mengunduh laporan PDF...\',\'📥\')">📥 Ekspor PDF</button>'
            +'<button class="btn btn-ghost" onclick="showToast(\'Mengirim via email...\',\'📧\')">📧 Kirim via Email</button>'
          +'</div></div>'
      +'</div>';
  }

  function pageAdmSettings() {
    return ph('Pengaturan Sistem','Konfigurasi dan pengelolaan sistem telemedicine MTH')
      +'<div class="grid-2">'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔧 Konfigurasi Umum</div>'
            +[{l:'Nama Sistem',v:'MTH — Micro Telemedicine Healthcare'},{l:'Versi Sistem',v:'v2.0.1'},{l:'Server Region',v:'Jakarta, Indonesia'},{l:'Zona Waktu',v:'WIB (UTC+7)'}].map(function(r){ return '<div class="form-group"><label class="form-label">'+r.l+'</label><input class="form-input" type="text" value="'+r.v+'"/></div>'; }).join('')
            +'<button class="btn btn-primary" onclick="showToast(\'Konfigurasi disimpan\',\'✓\')">Simpan Konfigurasi</button>'
          +'</div>'
          +'<div class="card"><div class="card-title">🔔 Notifikasi Sistem</div>'
            +[['Notifikasi Jadwal Konsultasi',true],['Notifikasi Nilai Kritis',true],['Pengingat Kontrol Pasien',true],['Laporan Harian Otomatis',false]].map(function(r){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.84rem">'+r[0]+'</span><div class="toggle-switch'+(r[1]?' on':'')+'" onclick="this.classList.toggle(\'on\')"></div></div>';
            }).join('')+'</div>'
        +'</div>'
        +'<div>'
          +'<div class="card" style="margin-bottom:1rem"><div class="card-title">🔒 Keamanan</div>'
            +'<div class="form-group"><label class="form-label">Sesi Timeout (menit)</label><input class="form-input" type="number" value="30"/></div>'
            +'<div class="form-group"><label class="form-label">Max Percobaan Login</label><input class="form-input" type="number" value="5"/></div>'
            +'<div class="form-group"><label class="form-label">Enkripsi Data</label><select class="form-select"><option selected>AES-256</option><option>AES-128</option></select></div>'
            +'<button class="btn btn-outline" style="width:100%" onclick="showToast(\'Keamanan diperbarui\',\'🔒\')">Perbarui Keamanan</button>'
          +'</div>'
          +'<div class="card"><div class="card-title">⚙️ Status Layanan</div>'
            +[{n:'Server Cloud',ok:true},{n:'Database',ok:true},{n:'API Gateway',ok:true},{n:'Pusk. Bayan',ok:false}].map(function(s){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.55rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.82rem">'+s.n+'</span><span class="badge '+(s.ok?'badge-success':'badge-error')+'">'+(s.ok?'Online':'Gangguan')+'</span></div>';
            }).join('')
            +'<button class="btn btn-outline" style="width:100%;margin-top:.85rem" onclick="showToast(\'Mode pemeliharaan diaktifkan\',\'⚙️\')">Aktifkan Mode Pemeliharaan</button>'
          +'</div>'
        +'</div>'
      +'</div>';
  }

  function pageNotification() {
    return ph('Notifikasi','Pengingat jadwal, hasil pemeriksaan, dan informasi sistem')
      +'<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'
        +'<span style="font-size:.84rem;color:var(--slate-500)">'+notifications.filter(function(n){ return n.unread; }).length+' belum dibaca</span>'
        +'<button class="btn btn-ghost btn-sm" onclick="markAllRead()">Tandai semua dibaca</button>'
      +'</div>'
      +'<div id="full-notif-list">'
        +notifications.map(function(n){
          return '<div class="notif-item'+(n.unread?' unread':'')+'" data-id="'+n.id+'" style="margin:0 -1.25rem;padding-left:1.25rem;padding-right:1.25rem">'
            +'<div class="notif-item-icon" style="background:'+n.bg+'">'+n.icon+'</div>'
            +'<div class="notif-item-body"><div class="notif-item-title">'+n.title+'</div><div class="notif-item-msg">'+n.msg+'</div><div class="notif-item-time">'+n.time+'</div></div>'
            +(n.unread?'<div style="width:8px;height:8px;border-radius:50%;background:var(--teal-400);flex-shrink:0"></div>':'')
          +'</div>';
        }).join('')
      +'</div></div>';
  }

  /* ═══════════ PAGE INTERACTIONS ═══════════ */
  function bindPage(page) {
    if (page==='p-teleconsult')  bindPatTeleconsult();
    if (page==='p-booking')      bindBooking();
    if (page==='p-monitoring')   bindPatMonitoring();
    if (page==='d-teleconsult')  bindDocTeleconsult();
    if (page==='d-pasien-list')  bindDocPasienList();
    if (page==='d-emr')          bindDocEMR();
    if (page==='d-diagnosis')    bindDocDiagnosis();
    if (page==='d-monitoring')   bindDocMonitoring();
    if (page==='notification')   bindNotifPage();
    if (page==='a-backup')       bindAdmBackup();
  }

  /* PASIEN: teleconsult */
  function bindPatTeleconsult() {
    document.querySelectorAll('.doctor-card').forEach(function(c) {
      c.addEventListener('click', function() {
        selectedDoctor = parseInt(c.dataset.doc);
        document.querySelectorAll('.doctor-card').forEach(function(x){ x.classList.remove('selected'); });
        c.classList.add('selected');
        var doc = DOCTORS.find(function(d){ return d.id===selectedDoctor; });
        var nn = document.getElementById('chat-name'); if(nn) nn.textContent = doc.display;
        var ci = document.getElementById('chat-inp'), cs = document.getElementById('chat-send');
        if(ci) ci.disabled = false; if(cs) cs.disabled = false;
      });
    });
    bindChat(chatMsgsPasien, 'pasien');
    var kb = document.getElementById('send-keluhan-btn');
    kb && kb.addEventListener('click', function() {
      var v = document.getElementById('keluhan-input').value.trim();
      if (!v) { showToast('Isi keluhan terlebih dahulu','!'); return; }
      if (!selectedDoctor) { showToast('Pilih dokter terlebih dahulu','!'); return; }
      chatMsgsPasien.push({ from:'sent', text:'📋 Keluhan: '+v, time:nowTime() });
      document.getElementById('keluhan-input').value = '';
      renderChat(chatMsgsPasien);
      showToast('Keluhan dikirim ke dokter','✓');
    });
  }

  /* PASIEN: booking */
  function bindBooking() {
    var ml = document.getElementById('cal-month-lbl');
    function reCal() {
      document.getElementById('cal-grid').innerHTML = buildCal(calYear, calMonth);
      if (ml) ml.textContent = MN[calMonth]+' '+calYear;
      bindCalDays();
    }
    document.getElementById('cal-prev') && document.getElementById('cal-prev').addEventListener('click', function(){ calMonth--; if(calMonth<0){calMonth=11;calYear--;} reCal(); });
    document.getElementById('cal-next') && document.getElementById('cal-next').addEventListener('click', function(){ calMonth++; if(calMonth>11){calMonth=0;calYear++;} reCal(); });
    bindCalDays();
    document.querySelectorAll('.time-slot:not(.full)').forEach(function(s) {
      s.addEventListener('click', function(){ document.querySelectorAll('.time-slot').forEach(function(x){ x.classList.remove('selected'); }); s.classList.add('selected'); selectedTime = s.dataset.time; });
    });
    var cb = document.getElementById('book-confirm-btn');
    cb && cb.addEventListener('click', function() {
      var docId = document.getElementById('book-doctor').value;
      if (!docId)        { showToast('Pilih dokter terlebih dahulu','!'); return; }
      if (!selectedDate) { showToast('Pilih tanggal konsultasi','!'); return; }
      if (!selectedTime) { showToast('Pilih waktu konsultasi','!'); return; }
      var doc = DOCTORS.find(function(d){ return d.id==docId; });
      openModal('Konfirmasi Janji',
        '<div style="background:var(--teal-50);border:1.5px solid var(--teal-200);border-radius:12px;padding:1rem;margin-bottom:1rem">'
        +[['Dokter',doc?doc.display:'-'],['Spesialisasi',doc?doc.spec:'-'],['Tanggal',selectedDate],['Waktu',selectedTime],['Jenis','Teleconsultation']].map(function(r){
          return '<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid var(--teal-100)"><span style="font-size:.82rem;color:var(--slate-500)">'+r[0]+'</span><span style="font-size:.84rem;font-weight:600">'+r[1]+'</span></div>';
        }).join('') + '</div>'
        +'<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="confirmBooking()">Konfirmasi</button></div>');
    });
  }

  /* PASIEN: monitoring */
  function bindPatMonitoring() {
    var btn = document.getElementById('save-mon-btn');
    btn && btn.addEventListener('click', function() {
      var s = document.getElementById('in-sys').value, g = document.getElementById('in-glu').value;
      if (!s && !g) { showToast('Isi minimal satu data kesehatan','!'); return; }
      showToast('Data kesehatan berhasil disimpan','💾');
      ['in-sys','in-dia','in-glu','in-pul','in-note'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
    });
  }

  /* DOKTER: teleconsult dengan pasien */
  function bindDocTeleconsult() {
    document.querySelectorAll('.doc-queue-item').forEach(function(c) {
      c.addEventListener('click', function() {
        var pid = c.dataset.pid; if (!pid) return;
        selectedPatient = pid;
        renderPage('d-teleconsult');
      });
    });
    if (selectedPatient) {
      bindChat(chatMsgsDokter, 'dokter');
      var nb = document.getElementById('doc-send-note-btn');
      nb && nb.addEventListener('click', function() {
        var v = document.getElementById('doc-note').value.trim();
        if (!v) { showToast('Isi catatan terlebih dahulu','!'); return; }
        showToast('Catatan konsultasi disimpan','✓');
        document.getElementById('doc-note').value = '';
      });
    }
  }

  /* DOKTER: pasien list */
  function bindDocPasienList() {
    document.querySelectorAll('.doc-emr-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-emr'); });
    });
    document.querySelectorAll('.doc-mon-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-monitoring'); });
    });
    document.querySelectorAll('.doc-diag-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-diagnosis'); });
    });
  }

  /* DOKTER: EMR pasien */
  function bindDocEMR() {
    document.querySelectorAll('.emr-select-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; renderPage('d-emr'); });
    });
    document.querySelectorAll('.doc-emr-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-emr'); });
    });
  }

  /* DOKTER: diagnosis */
  function bindDocDiagnosis() {
    document.querySelectorAll('.diag-select-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; renderPage('d-diagnosis'); });
    });
    var addR = document.getElementById('add-resep-btn');
    addR && addR.addEventListener('click', function() {
      var rl = document.getElementById('resep-list');
      if (rl) {
        var row = document.createElement('div');
        row.className = 'resep-item';
        row.style.cssText = 'display:flex;gap:.5rem;margin-bottom:.5rem';
        row.innerHTML = '<input type="text" class="form-input" placeholder="Nama obat" style="flex:2"/><input type="text" class="form-input" placeholder="Dosis" style="flex:1"/>';
        rl.appendChild(row);
      }
    });
    var sb = document.getElementById('save-diag-btn');
    sb && sb.addEventListener('click', function() {
      var diag = document.getElementById('diag-select').value;
      if (!diag || diag==='Pilih diagnosis...') { showToast('Pilih diagnosis terlebih dahulu','!'); return; }
      showToast('Diagnosis berhasil disimpan & dikirim ke pasien','✓');
    });
  }

  /* DOKTER: monitoring — bind tombol aksi tabel */
  function bindDocMonitoring() {
    document.querySelectorAll('.doc-emr-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-emr'); });
    });
    document.querySelectorAll('.doc-diag-btn').forEach(function(b) {
      b.addEventListener('click', function(){ selectedPatient=b.dataset.pid; navi('d-diagnosis'); });
    });
  }

  /* ADMIN: backup */
  function bindAdmBackup() {
    var rb = document.getElementById('run-backup-btn');
    rb && rb.addEventListener('click', function() {
      rb.disabled = true; rb.textContent = '⏳ Backup berjalan...';
      setTimeout(function(){ rb.disabled=false; rb.textContent='▶ Jalankan Backup'; showToast('Backup berhasil disimpan!','💾'); }, 2000);
    });
    var rr = document.getElementById('run-recovery-btn');
    rr && rr.addEventListener('click', function() {
      var cf = document.getElementById('recovery-confirm').value;
      if (cf !== 'RECOVERY') { showToast('Ketik "RECOVERY" untuk mengkonfirmasi','⚠️'); return; }
      showToast('Recovery dimulai... Sistem akan restart dalam 30 detik','🔁');
    });
  }

  /* NOTIF page */
  function bindNotifPage() {
    document.querySelectorAll('#full-notif-list .notif-item').forEach(function(el) {
      el.addEventListener('click', function(){
        var n = notifications.find(function(x){ return x.id==el.dataset.id; });
        if (n) n.unread = false;
        renderPage('notification');
        updateBadge();
      });
    });
  }

  /* ═══════════ GLOBAL EXPORTS ═══════════ */
  window.navi        = navigateTo;
  window.showToast   = showToast;
  window.closeModal  = closeModal;
  window.markAllRead = function() {
    notifications.forEach(function(n){ n.unread=false; });
    renderPage('notification');
    updateBadge();
    showToast('Semua notifikasi ditandai dibaca','✓');
  };
  window.confirmBooking = function() {
    closeModal();
    showToast('Janji berhasil dibuat! Notifikasi akan dikirim.','🎉');
    selectedDate = null; selectedTime = null;
  };
  window.showDetailKonsul = function(id) {
    var k = CONSULT_HISTORY.find(function(x){ return x.id===id; }); if (!k) return;
    openModal('Detail Konsultasi '+k.id,
      [['Pasien',k.patient],['Dokter',k.doctor],['Tanggal',k.date],['Tipe',k.type],['Diagnosis',k.diag],['Resep',k.resep],['Status',k.status]].map(function(r){
        return '<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--slate-100)"><span style="font-size:.82rem;color:var(--slate-500)">'+r[0]+'</span><span style="font-size:.84rem;font-weight:600">'+r[1]+'</span></div>';
      }).join('')
      +'<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn btn-ghost" onclick="closeModal();showToast(\'Mengunduh PDF...\',\'📥\')">Unduh PDF</button></div>');
  };
  window.openAddUserModal = function() {
    openModal('Tambah Pengguna Baru',
      '<div class="form-row-2">'
        +'<div class="form-group"><label class="form-label">Nama / ID</label><input type="text" class="form-input" placeholder="Pasien 7 / Dokter D"/></div>'
        +'<div class="form-group"><label class="form-label">Role</label><select class="form-select"><option>Pasien</option><option>Dokter</option></select></div>'
      +'</div>'
      +'<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="user@email.com"/></div>'
      +'<div class="form-group"><label class="form-label">Kata Sandi</label><input type="password" class="form-input" placeholder="Min. 8 karakter"/></div>'
      +'<div class="form-group"><label class="form-label">Fasilitas Kesehatan</label>'
        +'<select class="form-select"><option>RSUD Tanjung</option><option>Pusk. Tanjung</option><option>Pusk. Gangga</option><option>Pusk. Kayangan</option><option>Pusk. Bayan</option></select>'
      +'</div>'
      +'<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="closeModal();showToast(\'Pengguna berhasil ditambahkan\',\'✓\')">Simpan</button></div>');
  };

  /* INJECT STYLES */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '.toggle-switch{width:40px;height:22px;border-radius:11px;background:var(--slate-200);cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}'
      +'.toggle-switch::after{content:"";position:absolute;width:16px;height:16px;border-radius:50%;background:white;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.15)}'
      +'.toggle-switch.on{background:var(--teal-500)}.toggle-switch.on::after{transform:translateX(18px)}'
      +'.resep-item{display:flex;gap:.5rem;margin-bottom:.5rem}'
      +'.doc-queue-item{cursor:pointer;border-radius:var(--radius-md);border:1.5px solid var(--slate-100);transition:all var(--transition)}'
      +'.doc-queue-item:hover{border-color:var(--teal-300);background:var(--teal-50)}'
      +'.doc-queue-item.selected{border-color:var(--teal-500);background:var(--teal-50);box-shadow:0 0 0 3px rgba(25,147,140,.10)}';
    document.head.appendChild(s);
  }

  init();
})();
