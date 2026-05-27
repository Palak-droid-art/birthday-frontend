alert("Frontend aur Backend jodne ke liye Script ready hai! 🚀");

const API_BASE_URL = "https://birthday-backend-swdf.onrender.com/api";
const SERVER_URL = "https://birthday-backend-swdf.onrender.com";

// ==========================================
// 1. COUNTDOWN LOGIC
// ==========================================
const targetDate = new Date("June 30, 2026 00:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        const mainHeading = document.querySelector("header h1");
        const subHeading = document.querySelector("header p");
        mainHeading.innerHTML = "🎉 Happy Birthday Himanshi! 🎉";
        mainHeading.classList.add("birthday-cursive-bold"); 
        subHeading.innerText = "Wishing you a day as beautiful and special as you are! ❤";
        subHeading.style.color = "#ff4757"; 
        document.getElementById("countdown").style.display = "none";
        createFloatingNames();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}, 1000); 

function createFloatingNames() {
    if (document.querySelector('.floating-name')) return;
    for (let i = 0; i < 25; i++) {
        const nameNode = document.createElement('div');
        nameNode.innerText = 'Himanshi ❤';
        nameNode.className = 'floating-name';
        nameNode.style.left = Math.random() * 100 + 'vw';
        nameNode.style.top = (Math.random() * 80 + 10) + 'vh'; 
        nameNode.style.animationDelay = Math.random() * 6 + 's';
        nameNode.style.fontSize = (Math.random() * 1.2 + 1) + 'rem'; 
        document.body.appendChild(nameNode);
    }
}

// ==========================================
// 2. THEME CHANGER LOGIC
// ==========================================
const darkGradients = [
    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
    "linear-gradient(135deg, #1a0b2e 0%, #3b185f 100%)", 
    "linear-gradient(135deg, #0d324d 0%, #7f5a83 100%)", 
    "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)", 
    "linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 100%)"  
];

let currentIndex = 0;
const colorBtn = document.getElementById("color-btn");

colorBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % darkGradients.length;
    document.body.style.background = darkGradients[currentIndex];
});

// ==========================================
// 3. WISHES LOGIC
// ==========================================
const addWishBtn = document.getElementById('add-wish-btn');
const wishName = document.getElementById('wish-name');
const wishText = document.getElementById('wish-text');
const wishesContainer = document.getElementById('wishes-container');

async function loadWishes() {
    try {
        const response = await fetch(`${API_BASE_URL}/wishes`);
        const wishes = await response.json();
        wishesContainer.innerHTML = '';
        wishes.forEach(wish => {
            const wishDiv = document.createElement('div');
            wishDiv.style.cssText = "background: rgba(255, 255, 255, 0.1); padding: 15px; margin-top: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2);";
            wishDiv.innerHTML = `<h4 style="margin:0; color:#ff4757;">${wish.name}</h4> <p style="margin-top:5px;">${wish.text}</p>`;
            wishesContainer.appendChild(wishDiv);
        });
    } catch (error) { console.log("Wishes error:", error); }
}

addWishBtn.addEventListener('click', async () => {
    if(wishName.value.trim() === '' || wishText.value.trim() === '') return alert("Pehle naam aur wish dono likhiye!");
    try {
        await fetch(`${API_BASE_URL}/wishes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: wishName.value, text: wishText.value })
        });
        wishName.value = ''; wishText.value = '';
        loadWishes();
    } catch (error) { console.log("Wish save error:", error); }
});
loadWishes();

// ==========================================
// 4. IMAGE UPLOAD LOGIC (Cloudinary Fixed)
// ==========================================
const imageInput = document.getElementById('image-input');
const addImageBtn = document.getElementById('add-image-btn');
const imageGallery = document.getElementById('image-gallery');

addImageBtn.addEventListener('click', () => imageInput.click());

async function loadImages() {
    try {
        const response = await fetch(`${API_BASE_URL}/images`);
        const images = await response.json();
        imageGallery.innerHTML = '';
        images.forEach(img => {
            const imgElement = document.createElement('img');
            // FIX: Agar URL Cloudinary ka full path hai, toh seedha use karo
            imgElement.src = img.imagePath.startsWith('http') ? img.imagePath : `${SERVER_URL}${img.imagePath}`;
            imgElement.style.cssText = "width: 150px; margin: 10px; border-radius: 10px; object-fit: cover;";
            imageGallery.appendChild(imgElement);
        });
    } catch (error) { console.log("Images error:", error); }
}

imageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
        await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
        loadImages();
    } catch (error) { console.log("Upload error:", error); }
});
loadImages();

// ==========================================
// 5. YOUTUBE MUSIC LOGIC
// ==========================================
const musicBtn = document.getElementById('music-btn');
const changeMusicBtn = document.getElementById('change-music-btn');
const ytLinkInput = document.getElementById('yt-link');
const ytPlayer = document.getElementById('youtube-player');
let isPlaying = false;

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

changeMusicBtn.addEventListener('click', () => {
    const url = ytLinkInput.value.trim();
    const videoId = getYouTubeID(url);
    if(videoId) {
        ytPlayer.innerHTML = `<iframe width="0" height="0" src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}" frameborder="0" allow="autoplay"></iframe>`;
        isPlaying = true;
        musicBtn.innerText = "⏸ Stop Music";
    } else { alert("Please ek sahi YouTube link daaliye!"); }
});

musicBtn.addEventListener('click', () => {
    if(isPlaying) {
        ytPlayer.innerHTML = ""; 
        musicBtn.innerText = "🎵 Play Music";
        isPlaying = false;
    } else { alert("Pehle link paste karke 'Set Song' button dabayein!"); }
});
