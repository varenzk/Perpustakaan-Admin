/* Kata sandi admin (prototipe: hanya dicek di browser, ganti sebelum dipakai) */
const ADMIN_PASSWORD='Brolughoh123';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const fmt=d=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const TH={"Fiksi":"#FF6B6B","Sains & Teknologi":"#12B8A6","Sejarah":"#E0A800","Anak & Remaja":"#8B5CF6","Bisnis & Ekonomi":"#2ECC71"};
const AC=['#FF6B6B','#12B8A6','#8B5CF6'], CAP=4;
let CAT=[
 {id:1,title:"Laskar Pelangi",author:"Andrea Hirata",theme:"Fiksi",due:null},
 {id:2,title:"Sapiens",author:"Yuval Noah Harari",theme:"Sains & Teknologi",due:null},
 {id:3,title:"Negeri 5 Menara",author:"Ahmad Fuadi",theme:"Fiksi",due:day(5)},
 {id:4,title:"Sejarah Nusantara",author:"Tim Penulis",theme:"Sejarah",due:null},
 {id:5,title:"Dongeng Sebelum Tidur",author:"Kumpulan Cerita",theme:"Anak & Remaja",due:null},
 {id:6,title:"Rich Dad Poor Dad",author:"Robert Kiyosaki",theme:"Bisnis & Ekonomi",due:day(-2)},
 {id:7,title:"Bumi Manusia",author:"Pramoedya Ananta Toer",theme:"Fiksi",due:null},
 {id:8,title:"Cosmos",author:"Carl Sagan",theme:"Sains & Teknologi",due:null},
 {id:9,title:"Gajah Mada",author:"Langit Kresna Hariadi",theme:"Sejarah",due:null},
 {id:10,title:"Petualangan Si Kancil",author:"Cerita Rakyat",theme:"Anak & Remaja",due:null}];
let ANN=[
 {id:1,t:"🎈 Festival Baca Ceria",b:"Ikuti lomba resensi buku bulan ini, hadiah menarik menanti pembaca paling aktif!"},
 {id:2,t:"🧹 Penataan Ulang Rak",b:"Rak tema Sejarah & Sains sedang dirapikan supaya makin mudah dicari."},
 {id:3,t:"🕒 Jam Buka Diperpanjang",b:"Mulai bulan ini, perpustakaan buka hingga pukul 20.00 setiap hari kerja."}];
let LOG=[], tabNow='ringkasan', editId=null;
/* Kunci yang sama dengan situs publik, jadi harus dibuka dari domain/server yang sama. */
const SK='pc-shared';
function loadShared(){try{const s=JSON.parse(localStorage.getItem(SK));if(s&&s.c){CAT=s.c;ANN=s.a||[];LOG=s.l||[];return true}}catch(e){}return false}
const hadShared=loadShared();
const save=()=>{try{localStorage.setItem(SK,JSON.stringify({c:CAT,a:ANN,l:LOG.slice(0,20)}))}catch(e){}};
if(!hadShared) save();
const nid=a=>a.reduce((m,x)=>Math.max(m,x.id),0)+1;
const note=t=>{LOG.unshift(t)};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('show'),1800)}
const ds=d=>{const n=Math.round((new Date(d)-new Date(day(0)))/864e5);return n<0?['late','Terlambat '+(-n)+' hari']:n<=3?['mid','Segera jatuh tempo']:['ok','Aman']};

function login(){if($('#pw').value===ADMIN_PASSWORD){$('#pw').value='';$('#login').classList.add('hide');$('#app').classList.remove('hide');render()}else toast('Kata sandi salah')}
function logout(){$('#app').classList.add('hide');$('#login').classList.remove('hide')}
function tab(t){tabNow=t;render();scrollTo(0,0)}

function render(){
  $$('#app section').forEach(s=>s.classList.toggle('hide',s.id!=='t-'+tabNow));
  $$('.pill[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tabNow));
  const out=CAT.filter(b=>b.due), late=out.filter(b=>ds(b.due)[0]!=='ok');
  $('#stats').innerHTML=[['📚',CAT.length,'Total Buku'],['🔖',out.length,'Sedang Dipinjam'],['⏰',late.length,'Perlu Perhatian'],['🎨',Object.keys(TH).length,'Tema Rak']].map(x=>`<div class="stat"><div style="font-size:1.5rem">${x[0]}</div><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
  $('#shelves').innerHTML=Object.keys(TH).map(t=>{const n=CAT.filter(b=>b.theme===t&&!b.due).length;return `<div class="shelf"><div class="t"><span>Rak — ${t}</span><span>${n}/${CAP} ${n>=CAP?'<span class="warn">⚠️ penuh</span>':''}</span></div><div class="track"><i style="width:${Math.min(100,n/CAP*100)}%;background:${TH[t]}"></i></div></div>`}).join('');
  $('#attn').innerHTML=late.length?late.map(b=>{const s=ds(b.due);return `<div class="shelf" style="display:flex;justify-content:space-between;gap:8px"><span><b>${esc(b.title)}</b></span><span class="mono ${s[0]}" style="font-size:.74rem">${s[1]}</span></div>`}).join(''):'<div class="empty">Semua aman 🎉</div>';
  $('#log').innerHTML=LOG.length?LOG.slice(0,8).map(l=>`<div style="padding:7px 0;border-bottom:1px dashed var(--ln);font-size:.85rem">${l}</div>`).join(''):'<div class="empty">Belum ada aktivitas.</div>';
  $('#ft').innerHTML=Object.keys(TH).map(t=>`<option>${t}</option>`).join('');
  if(editId){const b=CAT.find(x=>x.id===editId);if(b)$('#ft').value=b.theme}
  $('#abooks').innerHTML=CAT.map(b=>`<tr><td><b>${esc(b.title)}</b><br><span class="mut" style="font-size:.78rem">${esc(b.author)}</span></td><td><span class="tag" style="background:${TH[b.theme]}">${esc(b.theme)}</span></td><td class="mono ${b.due?'mid':'ok'}" style="font-size:.74rem">● ${b.due?'Dipinjam':'Tersedia'}</td><td><div class="act"><button class="btn teal" onclick="editBook(${b.id})">Ubah</button><button class="btn out" onclick="delBook(${b.id})">Hapus</button></div></td></tr>`).join('')||'<tr><td colspan="4" class="empty">Belum ada buku. Tambahkan lewat formulir di atas.</td></tr>';
  $('#aloans').innerHTML=out.map(b=>{const s=ds(b.due);return `<tr><td><b>${esc(b.title)}</b></td><td class="mono" style="font-size:.78rem">${fmt(b.due)}</td><td class="mono ${s[0]}" style="font-size:.74rem">${s[1]}</td><td><div class="act"><button class="btn teal" onclick="extend(${b.id})">Perpanjang</button><button class="btn" onclick="giveBack(${b.id})">Terima kembali</button></div></td></tr>`}).join('')||'<tr><td colspan="4" class="empty">Tidak ada buku yang sedang dipinjam.</td></tr>';
  $('#aann').innerHTML=ANN.map((a,i)=>`<div class="item" style="background:${AC[i%3]}"><div><h3>${esc(a.t)}</h3><p>${esc(a.b)}</p></div><button class="btn out" style="color:#fff;border-color:#fff" onclick="delAnn(${a.id})">Hapus</button></div>`).join('')||'<div class="empty">Belum ada pengumuman. Terbitkan satu lewat formulir di atas.</div>';
}

function giveBack(id){const b=CAT.find(x=>x.id===id);b.due=null;note('✅ Menerima pengembalian <strong>'+esc(b.title)+'</strong>');save();render();toast('Buku dikembalikan')}
function extend(id){const b=CAT.find(x=>x.id===id),d=new Date(b.due);d.setDate(d.getDate()+7);b.due=d.toISOString().slice(0,10);note('⏳ Memperpanjang <strong>'+esc(b.title)+'</strong> sampai '+fmt(b.due));save();render();toast('Diperpanjang sampai '+fmt(b.due))}
function saveBook(){
  const t=$('#fj').value.trim(),a=$('#fp').value.trim(),th=$('#ft').value;
  if(!t||!a){toast('Isi judul dan penulis');return}
  if(editId){Object.assign(CAT.find(x=>x.id===editId),{title:t,author:a,theme:th});note('✏️ Mengubah <strong>'+esc(t)+'</strong>');toast('Perubahan disimpan')}
  else{CAT.push({id:nid(CAT),title:t,author:a,theme:th,due:null});note('➕ Menambah <strong>'+esc(t)+'</strong>');toast('Buku ditambahkan')}
  resetForm();save();render();
}
function editBook(id){const b=CAT.find(x=>x.id===id);editId=id;$('#fj').value=b.title;$('#fp').value=b.author;$('#ft').value=b.theme;$('#ftitle').textContent='✏️ Ubah buku';$('#fc').classList.remove('hide');$('#fj').focus();scrollTo(0,0)}
function resetForm(){editId=null;$('#fj').value=$('#fp').value='';$('#ftitle').textContent='➕ Tambah buku';$('#fc').classList.add('hide')}
function delBook(id){const b=CAT.find(x=>x.id===id);if(!confirm('Hapus “'+b.title+'” dari katalog?'))return;CAT=CAT.filter(x=>x.id!==id);note('🗑️ Menghapus <strong>'+esc(b.title)+'</strong>');save();render();toast('Buku dihapus')}
function addAnn(){const t=$('#nj').value.trim(),b=$('#ni').value.trim();if(!t){toast('Isi judul pengumuman');return}ANN.unshift({id:nid(ANN),t,b});$('#nj').value=$('#ni').value='';save();render();toast('Pengumuman diterbitkan')}
function delAnn(id){ANN=ANN.filter(a=>a.id!==id);save();render();toast('Pengumuman dihapus')}

/* ================= ANIMASI ANGKA ================= */
function animateNums(sel){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll(sel).forEach(el=>{
    const to=+el.textContent; if(!to) return;
    const t0=performance.now();
    (function step(t){
      const p=Math.min(1,(t-t0)/700);
      el.textContent=Math.round(to*(1-Math.pow(1-p,3)));
      if(p<1) requestAnimationFrame(step);
    })(t0);
  });
}
const _render=render;
render=function(){_render();animateNums('#stats .n');};

/* Perubahan dari situs publik (peminjaman, dll) langsung tampil di admin */
addEventListener('storage',e=>{if(e.key===SK&&loadShared()&&!$('#app').classList.contains('hide'))render()});
