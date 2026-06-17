// --- 1. CATATAN PRIBADI (TULIS DI CODING) ---
const catatanPribadiMuhaji = [
    "Ini adalah catatan rahasia Muhaji yang disimpan langsung di koding.",
    "Jangan lupa untuk selalu bersyukur hari ini.",
    "Projek koding ini selesai dengan fitur lengkap."
];

// --- 2. DATA HALAMAN ---
const pagesData = {
    'foto': { 
        title: 'Momen Foto', 
        html: `
        <div class="media-grid">
            <div class="media-card" onclick="openViewer('muhajir.jpg', 'image')"><img src="muhajir.jpg"></div>
            <div class="media-card" onclick="openViewer('https://picsum.photos/800/1200?sig=2', 'image')"><img src="https://picsum.photos/400/600?sig=2"></div>
            <div class="media-card" onclick="openViewer('https://picsum.photos/800/1200?sig=3', 'image')"><img src="https://picsum.photos/400/600?sig=3"></div>
            <div class="media-card" onclick="openViewer('https://picsum.photos/800/1200?sig=4', 'image')"><img src="https://picsum.photos/400/600?sig=4"></div>
        </div>` 
    },
    'kawan': { 
        title: 'Daftar Kawan', 
        html: `
        <div class="friend-item"><img src="saya.jpg" class="friend-pp"><span>Ahmad Syah</span></div>
        <div class="friend-item"><img src="https://i.pravatar.cc/150?u=22" class="friend-pp"><span>Lee Chong Wei</span></div>
        <div class="friend-item"><img src="https://i.pravatar.cc/150?u=33" class="friend-pp"><span>Siti Aminah</span></div>` 
    },
    'kerja': { 
        title: 'Pekerjaan', 
        html: `
        <textarea id="work-note" style="width:100%; height:150px; background:rgba(0,0,0,0.2); border:1px solid var(--accent); color:white; border-radius:15px; padding:15px; font-family:inherit;"></textarea>
        <button onclick="saveWorkNote()" style="background:var(--accent); color:black; border:none; padding:12px; border-radius:12px; width:100%; font-weight:800; margin-top:10px; cursor:pointer;">SIMPAN CATATAN KERJA</button>` 
    },
    'hobi': { 
        title: 'Hobi Saya', 
        html: `
        <div class="media-grid">
            <div class="media-card" onclick="openViewer('https://picsum.photos/800/1200?sig=10', 'image')"><img src="https://picsum.photos/400/600?sig=10"></div>
            <div class="media-card" onclick="openViewer('https://picsum.photos/800/1200?sig=11', 'image')"><img src="https://picsum.photos/400/600?sig=11"></div>
        </div>` 
    },
    'mantan': { 
        title: 'Melupakan', 
        html: `<div style="background:rgba(255,255,255,0.05); padding:25px; border-radius:25px; border:1px dashed var(--accent); text-align:center; font-style:italic;">"Ikhlaskan masa lalu, MUHAJI. Melupakan bukan menghapus kenangan, tapi merelakan apa yang sudah berlalu demi masa depan yang lebih baik."</div>` 
    }
};

// --- 3. JAM & SHOLAT ---
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
    } catch(e) {}
}
getPrayer();

// --- 4. PIN LOGIC ---
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
    for(let i=1; i<=4; i++) document.getElementById(`dot${i}`).classList.toggle('active', i <= inputPin.length);
}

// --- 5. NAVIGATION ---
function showPage(id) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('details').classList.add('active');
    
    if(id === 'pribadi_vault') {
        document.getElementById('det-title').innerText = "PRIBADI VAULT";
        let notesHtml = catatanPribadiMuhaji.map(n => `<div class="note-box">${n}</div>`).join('');
        document.getElementById('det-content').innerHTML = `
            <h3>Catatan Hardcoded</h3>${notesHtml}
            <hr style="opacity:0.1; margin:20px 0;">
            <h3>Unggah Media (MP4/JPG)</h3>
            <input type="file" id="p-upload" style="display:none" onchange="saveVault(this)" accept="image/*,video/mp4">
            <button onclick="document.getElementById('p-upload').click()" style="background:var(--accent); border:none; padding:12px; width:100%; border-radius:12px; font-weight:800; cursor:pointer; margin-bottom:20px;">+ UNGGAH KE VAULT</button>
            <div id="vault-grid" class="media-grid"></div>
        `;
        loadVault();
    } else {
        document.getElementById('det-title').innerText = pagesData[id].title;
        document.getElementById('det-content').innerHTML = pagesData[id].html;
        if(id === 'kerja') document.getElementById('work-note').value = localStorage.getItem('muhaji_workNote') || "";
    }
}
function goHome() {
    document.getElementById('details').classList.remove('active');
    document.getElementById('home').style.display = 'block';
}

function saveWorkNote() {
    localStorage.setItem('muhaji_workNote', document.getElementById('work-note').value);
    alert('Catatan Kerja Tersimpan!');
}

// --- 6. STORAGE (INDEXED DB) ---
let db;
const dbReq = indexedDB.open("MuhajiVaultDB", 1);
dbReq.onupgradeneeded = e => e.target.result.createObjectStore("files", {keyPath: "id"});
dbReq.onsuccess = e => db = e.target.result;

function saveVault(input) {
    const file = input.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const tx = db.transaction("files", "readwrite");
        tx.objectStore("files").add({ id: Date.now(), type: file.type, data: e.target.result });
        tx.oncomplete = () => loadVault();
    };
    reader.readAsDataURL(file);
}

function loadVault() {
    const grid = document.getElementById('vault-grid'); if(!grid) return;
    grid.innerHTML = "";
    const tx = db.transaction("files", "readonly");
    tx.objectStore("files").openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if(cursor) {
            const item = cursor.value;
            const div = document.createElement('div'); div.className = "media-card";
            div.onclick = () => openViewer(item.data, item.type);
            let content = item.type.includes('image') ? `<img src="${item.data}">` : `<video src="${item.data}"></video><i class="fas fa-play-circle video-icon"></i>`;
            div.innerHTML = `${content}<button class="del-btn" onclick="event.stopPropagation(); deleteVault(${item.id})">&times;</button>`;
            grid.appendChild(div);
            cursor.continue();
        }
    };
}

function deleteVault(id) {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").delete(id);
    tx.oncomplete = () => loadVault();
}

// --- 7. VIEWER ---
function openViewer(src, type) {
    const vBox = document.getElementById('v-box');
    vBox.innerHTML = type.includes('video') ? 
        `<video src="${src}" id="viewer-content" controls autoplay></video>` : 
        `<img src="${src}" id="viewer-content">`;
    document.getElementById('media-viewer').style.display = "flex";
}
function closeViewer() {
    document.getElementById('v-box').innerHTML = '';
    document.getElementById('media-viewer').style.display = "none";
}