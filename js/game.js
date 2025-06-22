const backsound = document.getElementById('backsound');
const cekrek = document.getElementById('cekrek');
const cameraFlash = document.getElementById('camera-flash');
const cameraBtn = document.getElementById('camera-btn');
const countdownEl = document.getElementById('countdown');
const meteors = document.getElementById('meteors');
const loves = document.getElementById('loves');
const polaroidStack = document.getElementById('polaroid-stack');
const stickman = document.getElementById('stickman-container');
const speech = document.getElementById('speech-bubble');
const options = document.getElementById('options');
const cameraSection = document.getElementById('camera-section');
const finalSection = document.getElementById('final-section');
const vinyl = document.getElementById('vinyl');
const vinylContainer = document.getElementById('vinyl-container');
const typewriterText = document.getElementById('typewriter-text');
const keyboardKeys = document.querySelectorAll('#keyboard-keys rect');
const typewriterSound = document.getElementById('typewriter-sound');

let firstPolaroid = false;
let polaroidCount = 0;
const MAX_POLAROID = 10;
let loveInterval;
let dedeState = 0;
let vinylRotation = 0;
let vinylAnimationFrame;

const namaOpsi = [
  {label:"Bila", salah:true},
  {label:"sayang", salah:true},
  {label:"eni", salah:true},
  {label:"endang", salah:true},
  {label:"titin", salah:true},
  {label:"jawa", salah:true},
  {label:"dede", salah:false}
];
const opsi19 = [
  {label:"kan udah.", benar:true},
  {label:"ih", benar:true}
];

// Fungsi efek meteor dan love
function meteorFirework() {
  for(let i=0;i<12;i++){
    setTimeout(()=>{
      const m = document.createElement('div');
      m.className = 'meteor';
      m.style.left = (Math.random()*90+5)+'vw';
      m.style.top = (Math.random()*10+5)+'vh';
      m.style.background = `linear-gradient(180deg, #fff, #${Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0')} 80%)`;
      meteors.appendChild(m);
      setTimeout(()=>meteors.removeChild(m),1200);
    }, i*80);
  }
}
function createLove() {
  const l = document.createElement('div');
  l.className = 'love';
  l.style.left = (Math.random()*90+5)+'vw';
  l.style.bottom = '0px';
  loves.appendChild(l);
  setTimeout(() => {
    loves.removeChild(l);
  }, 4000);
}
function startMeteorLove() {
  meteorFirework();
  loveInterval = setInterval(() => {
    meteorFirework();
    createLove();
  }, 2000);
}
function stopMeteorLove() {
  clearInterval(loveInterval);
}

// Interaksi opsi nama
function showNamaOpsi() {
  options.innerHTML = '';
  namaOpsi.slice(0,6).forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = item.label;
    btn.onclick = () => {
      if(item.salah) {
        salahNama(btn);
      }
    };
    options.appendChild(btn);
  });
  stickman.className = "bounce";
  speech.textContent = "Nama kamuu siapaa yaa?";
}
function salahNama(btn) {
  stickman.className = "shake-head";
  speech.textContent = `${btn.textContent} ? Salah tuh!`;
  btn.classList.add('wrong');
  btn.disabled = true;
  setTimeout(() => {
    btn.classList.add('hide');
    stickman.className = "bounce";
    cekSemuaSalah();
  }, 600);
}
function cekSemuaSalah() {
  const btns = [...options.querySelectorAll('.option-btn:not(.hide)')];
  if (btns.length === 0) {
    setTimeout(() => {
      options.innerHTML = '';
      tampilkanDede();
    }, 650);
  }
}
function tampilkanDede() {
  stickman.className = "bounce";
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.textContent = "dede";
  btn.onclick = () => {
    if (dedeState === 0) {
      stickman.className = "shake-head";
      btn.classList.add('wrong');
      speech.textContent = "dede ? Salah tuh!";
      dedeState = 1;
      setTimeout(() => stickman.className = "bounce", 800);
    } else if (dedeState === 1) {
      stickman.className = "aha";
      btn.classList.remove('wrong');
      btn.classList.add('right');
      btn.disabled = true;
      speech.textContent = "Oh, namamu Dede ya!";
      dedeState = 2;
      setTimeout(() => {
        stickman.className = "ask";
        speech.textContent = "ini khusus 19 tau";
        options.innerHTML = '';
        setTimeout(showOpsi19, 900);
      }, 700);
    }
  };
  options.appendChild(btn);
}
function showOpsi19() {
  options.innerHTML = '';
  opsi19.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = item.label;
    btn.onclick = () => {
      btn.classList.add('right');
      opsi19Klik();
    };
    options.appendChild(btn);
  });
}
function opsi19Klik() {
  stickman.className = "jump";
  speech.classList.add('hide');
  options.style.opacity = 0;
  setTimeout(() => {
    transisiKeKamera();
  }, 1200);
}
function transisiKeKamera() {
  stickman.style.opacity = 0;
  setTimeout(() => {
    cameraSection.style.display = 'flex';
    setTimeout(() => {
      cameraSection.style.opacity = 1;
      playBacksound();
    }, 50);
  }, 700);
}

// Tombol klik kamera
cameraBtn.onclick = () => {
  if (polaroidCount >= MAX_POLAROID) return;

  // Setelah klik pertama, sembunyikan caption
  if (!firstPolaroid) {
    document.getElementById('camera-caption').style.opacity = '0';
  }

  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.opacity = 1;
  cameraBtn.disabled = true;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(countdownInterval);
      countdownEl.textContent = '';
      cameraBtn.disabled = false;

      cameraFlash.classList.add('active');
      cekrek.currentTime = 0;
      cekrek.play();
      setTimeout(() => cameraFlash.classList.remove('active'), 350);

      if (!firstPolaroid) {
        startMeteorLove();
        firstPolaroid = true;
      }

      polaroidCount++;
      addPolaroid(polaroidCount);

      if (polaroidCount === MAX_POLAROID) {
        setTimeout(() => transisiKeFinal(), 4000);
      }
    }
  }, 700);
};

// Polaroid di pojok kiri atas
function addPolaroid(idx) {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.setProperty('--angle', `${(Math.random() - 0.5) * 10}deg`);
    polaroid.style.left = '1vw';
    polaroid.style.top = '1vh';
    polaroid.style.position = 'fixed';

    // Ambil gambar sesuai urutan idx (idx dimulai dari 1)
    const imgSrc = polaroidImages[idx - 1] || polaroidImages[0];
    polaroid.innerHTML = `<img src="${imgSrc}" alt="Polaroid ${idx}" style="width:180px;height:160px;object-fit:cover;border-radius:8px;margin-bottom:24px;" />`;

    document.body.appendChild(polaroid);

    setTimeout(() => polaroid.classList.add('show'), 100);
    setTimeout(() => polaroid.classList.add('centered'), 700);
    setTimeout(() => polaroid.classList.remove('centered'), 3200);
}

function playBacksound() {
  backsound.currentTime = 0;
  backsound.play();
}

function transisiKeFinal() {
  stopMeteorLove();
  cameraSection.style.opacity = 0;
  setTimeout(() => {
    cameraSection.style.display = 'none';
    finalSection.style.display = 'block';
    startFinalEffects();
    startVinyl();
    startTyping();
  }, 700);
}

function stopMeteorLove() {
  clearInterval(loveInterval);
}

function startFinalEffects() {
  const finalStars = document.getElementById('final-stars');
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.width = s.style.height = (Math.random() * 2 + 1) + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    finalStars.appendChild(s);
  }
}

// Animasi putar vinyl dengan JavaScript untuk rotasi halus dan pusat tepat
function startVinyl() {
  let angle = 0;
  let lastTime = null;
  // Pastikan transform-origin diatur via CSS untuk performa
  vinyl.style.transformOrigin = '50% 50%';
  function rotate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    // 60 derajat per detik (bisa diubah sesuai kecepatan yang diinginkan)
    angle = (angle + (delta * 0.06)) % 360;
    vinyl.style.transform = `rotate(${angle}deg)`;
    vinylAnimationFrame = requestAnimationFrame(rotate);
  }
  vinylAnimationFrame = requestAnimationFrame(rotate);
}
// ...kode lain...

// Tambahkan di sini (atas atau bawah file)
const polaroidImages = [
    'js/assets/foto1.jpg',
    'js/assets/foto2.jpg',
    'js/assets/foto3.jpg',
    'js/assets/foto4.jpg',
    'js/assets/foto5.jpg',
    'js/assets/foto6.jpg',
    'js/assets/foto7.jpg',
    'js/assets/foto8.jpg',
    'js/assets/foto9.jpg',
    'js/assets/foto10.jpg'
];

function showPolaroids() {
  const stack = document.getElementById('polaroid-stack');
  stack.innerHTML = '';
  polaroidImages.forEach((src, idx) => {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.innerHTML = `<img src="${src}" alt="Polaroid ${idx+1}" />`;
    stack.appendChild(polaroid);
  });
}


// Animasi mengetik teks di mesin tik dengan keyboard aktif
function startTyping() {
  typewriterText.textContent = '';
  let i = 0;
  typewriterSound.volume = 0.15;
  function type() {
    if (i < textToType.length) {
      typewriterText.textContent += textToType.charAt(i);
      if (textToType.charAt(i) !== ' ') {
        typewriterSound.currentTime = 0;
        typewriterSound.play();
        keyboardKeys.forEach(k => k.classList.remove('active'));
        const keyIndex = i % keyboardKeys.length;
        keyboardKeys[keyIndex].classList.add('active');
      } else {
        keyboardKeys.forEach(k => k.classList.remove('active'));
      }
      i++;
      setTimeout(type, 45);
    } else {
      keyboardKeys.forEach(k => k.classList.remove('active'));
    }
  }
  type();
}

const textToType = `firsttime ngucapin orangcantik aduh.. Akunih yang salting. De, aku pengen bilang sesuatu dari hati, bukan sekadar kata-kata biasa, anjay. Kenal kamu lebih dari 5 bulan ini, rasanya tuh kayak perjalanan ke Mekkah naik galon ngambang, lama panjang dan terbawa arus apadah, Ups, Aslinya aku masi malu malu juga ma kamu, kalo telpon jg aku masi malu ngobrolnya aku belum aktif banget kan yak. Iya, aku masih suka grogi gitu tiap ngobrol ma kamu, soalnya kamu cantik banget sayang

Ehem mau pidato,
di Umur kamu yang ke-19 ini mungkin terasa beda gitu kan atau sama, tapi pasti beda lebih sepi lebih terpojok diri kita tu rasanya. Aku tauu kamu sempat kehilangan sesuatu yang kamu harapin, tapi aku yakin dan percayalah, bakal ada hasil yg akan datang baik itu sebelum proses.. saat berproses ataupun akhir dari berproses.Aku yakin, ada hal yang lebih baik yang bakal dateng buat kamu. Yang penting kamu jangan nyerah, terus berjuang dan jangan bodoamat Ama masa depan yakk katanya mau jadi wanita karir independen naik mobil puter lagu gitu Ups. Aku yakin hasil yang kamu pengen itu bakal muncul sih, asal kamu tetep berteguh Ama diri kamu, aku juga mengharapkan di umur kamu yg 19, kamu pikirannya bisa lebih terbuka, dan pastiin jgn cuma cantik ma baik doang yak, jadi wanita harus pinterr, tapi kalo aku liat kamu tuh emang udh gitu sih tapi seperti aku blg tdi aku ngeharapinnya ada kata lebih, jadi lebih baik dari sebelumnya pola pikirnya, jangan mau jadi kaya cewe pada umumnya yg cuma cantik tapi pikiran value dan kepintaran logisnya tuh ngga ada yak, aku pengen kamu lakuin yg terbaik buat diri kamu, sayang sama diri kamu, jgn mau dipijak pijak harga diri ma orang lain apa lgi sama cowo yak

Hadiah kecil ini aku buat sendiri, pas lagi sakit ma ngantuk, ma sibuk tapi aku sempetin, aslinya mah konsepnya udah dari lama sih tapi baru aku buat Minggu ini, Nah Ini juga bukan cuma soal hadiah, tapi bukti kalau aku sayang banget sama kamu Kamu spesial, beda dari yg lain dan sebelumnya, baru aku kaya gini tuh ke kamu Njir.

Selamat ulang tahun yang ke-19, Sayang, Semoga kamu selalu sehat, makin dewasa, tetep waras, dan bisa bedain mana yang baik dan buruk. Semoga juga kamu selalu dijauhkan dari hal-hal yang gak enak dan orang-orang yang gak bener. Aku pengen kamu jadi versi terbaik dari diri kamu sendiri, dan aku bakal selalu ada buat dukung kamu intinya baik buat kmu yaa aku dukung

Aku pengen kita terus barengan, saling support, dan bikin banyak kenangan  bareng. Makasih ya udah jadi bagian hidup aku yang berarti, aku sayang banget sama kamu dah. Jangan lupa, aku selalu mikirin ma kangen dgn kamu walaupun kadang tuh aku gak pinter bilangnya 

Salam dari aku yak Edwin ganteng baik gemes ini`;

// Mulai aplikasi
showNamaOpsi();
