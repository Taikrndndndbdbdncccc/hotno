// --- 1. SETINGAN DATA (UBAH DI SINI) ---
const pribadiCatatan = [
    "Catatan Rahasia MUHAJI yang ditulis di koding.",
    "PIN: 4718.",
    "Jadwal sholat otomatis Sungai Puyu."
];

// Media untuk galeri PRIBADI
const pribadiMedia = [
    { type: 'image', src: 'pribadi1.jpg' },
    { type: 'video', src: 'video1.mp4' }
];

const pagesData = {
    'foto': { 
        title: 'Momen Foto', 
        html: `
        <div class="media-grid">
            <div class="media-card" onclick="openViewer('foto1.jpg', 'image')"><img src="foto1.jpg" onerror="this.src='https://picsum.photos/400/600?sig=1'"></div>
            <div class="media-card" onclick="openViewer('foto2.jpg', 'image')"><img src="foto2.jpg" onerror="this.src='https://picsum.photos/400/600?sig=2'"></div>
        </div>` 
    },
    'kawan': { 
        title: 'Daftar Kawan', 
        html: `
        <div class="friend-item"><img src="https://i.pravatar.cc/150?u=11" class="friend-pp"><span>Ahmad Syah</span></div>
        <div class="friend-item"><img src="https://i.pravatar.cc/150?u=22" class="friend-pp"><span>Lee Chong Wei</span></div>` 
    },
    'kerja': { 
        title: 'Pekerjaan', 
        html: `
        <textarea id="work-note" style="width:100%; height:150px; background:rgba(0,0,0,0.2); border:1px solid var(--accent); color:white; border-radius:15px; padding:15px; font-family:inherit;"></textarea>
        <button onclick="saveWork()" style="background:var(--accent); color:black; border:none; padding:12px; border-radius:12px; width:100%; font-weight:800; margin-top:10px; cursor:pointer;">SIMPAN</button>` 
    },
    'hobi': { 
        title: 'Hobi Saya', 
        html: `
        <div class="media-grid">
            <div class="media-card" onclick="openViewer('hobi1.jpg', 'image')"><img src="hobi1.jpg" onerror="this.src='https://picsum.photos/400/600?sig=10'"></div>
        </div>` 
    },
    'mantan': { 
        title: 'Mantan', 
        html: `<div style="background:rgba(255,255,255,0.05); padding:25px; border-radius:25px; border:1px dashed var(--accent); text-align:center; font-style:italic;">"Melupakan adalah cara terbaik untuk mencintai dirimu kembali, MUHAJI."</div>` 
    }
};

// --- 2. LOGIKA UTAMA ---
function clock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.getHours().toString().padStart(2,'0') + "." + now.getMinutes().toString().padStart(2,'0');
    const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
    document.getElementById('current-day').innerText = days[now.getDay()];
    const h = now.getHours();
    let g = h >= 5 && h < 12 ? "Selamat Pagi ☀️" : h >= 12 && h < 15 ? "Selamat Siang 🌤️" : h >= 15 && h < 19 ? "Selamat Petang 🌅" : "Selamat Malam 🌙";
    document.getElementById('day-greeting').innerText = g;
}
setInterval(clock, 1000); clock();

async function getPrayer() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByAddress?address=Sungai%20Puyu,Penang,Malaysia&method=11');
        const d = await res.json(); const t = d.data.timings;
        document.getElementById('fajr').innerText = t.Fajr; document.getElementById('dhuhr').innerText = t.Dhuhr;
        document.getElementById('asr').innerText = t.Asr; document.getElementById('maghrib').innerText = t.Maghrib;
        document.getElementById('isha').innerText = t.Isha;
        const hj = d.data.date.hijri;
        document.getElementById('hijri-date').innerText = hj.day + " " + hj.month.en.toUpperCase() + " " + hj.year + "H";
    } catch(e) {}
}
getPrayer();

let inputPin = "";
function openPin() { document.getElementById('pin-overlay').style.display = 'flex'; }
function closePin() { document.getElementById('pin-overlay').style.display = 'none'; clearPin(); }
function clearPin() { inputPin = ""; updateDots(); }
function pressKey(n) {
    if(inputPin.length < 4) {
        inputPin += n; updateDots();
        if(inputPin.length === 4) {
            if(inputPin === "4718") { closePin(); showPage('pribadi_vault'); }
            else { alert("PIN SALAH!"); clearPin(); }
        }
    }
}
function updateDots() {
    for(let i=1; i<=4; i++) {
        const dot = document.getElementById('dot' + i);
        if(dot) dot.classList.toggle('active', i <= inputPin.length);
    }
}

function showPage(id) {
    document.getElementById('home-menu').style.display = 'none';
    document.getElementById('details').classList.add('active');
    
    if(id === 'pribadi_vault') {
        document.getElementById('det-title').innerText = "PRIBADI VAULT";
        let notesHtml = pribadiCatatan.map(n => `<div class="note-box">${n}</div>`).join('');
        let mediaHtml = pribadiMedia.map(m => {
            if(m.type === 'image') return `<div class="media-card" onclick="openViewer('${m.src}', 'image')"><img src="${m.src}" onerror="this.src='https://via.placeholder.com/400x600?text=Private+Foto'"></div>`;
            return `<div class="media-card" onclick="openViewer('${m.src}', 'video')"><video src="${m.src}"></video><i class="fas fa-play-circle video-icon"></i></div>`;
        }).join('');
        document.getElementById('det-content').innerHTML = `<h3>Catatan</h3>${notesHtml}<hr style="opacity:0.1; margin:20px 0;"><h3>Media Galeri</h3><div class="media-grid">${mediaHtml}</div>`;
    } else {
        document.getElementById('det-title').innerText = pagesData[id].title;
        document.getElementById('det-content').innerHTML = pagesData[id].html;
        if(id === 'kerja') document.getElementById('work-note').value = localStorage.getItem('muhaji_work') || "";
    }
}

function goHome() { 
    document.getElementById('details').classList.remove('active'); 
    document.getElementById('home-menu').style.display = 'flex'; 
}

function saveWork() { localStorage.setItem('muhaji_work', document.getElementById('work-note').value); alert('Catatan Kerja Tersimpan!'); }

function openViewer(src, type) {
    const vBox = document.getElementById('v-box');
    vBox.innerHTML = type === 'video' ? `<video src="${src}" id="viewer-content" controls autoplay></video>` : `<img src="${src}" id="viewer-content">`;
    document.getElementById('media-viewer').style.display = "flex";
}
function closeViewer() { document.getElementById('v-box').innerHTML = ''; document.getElementById('media-viewer').style.display = "none"; }
