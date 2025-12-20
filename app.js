async function fetchTVData() {
    const grid = document.getElementById('program-grid');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const hero = document.getElementById('hero');

    // Usiamo un proxy CORS per evitare blocchi dal browser
    const proxy = "https://api.allorigins.win/raw?url=";
    const apiUrl = "https://services.tivulaguida.it/api/epg/highlights.json";

    try {
        const response = await fetch(proxy + encodeURIComponent(apiUrl));
        const data = await response.json();
        const highlights = data.highlights;

        // 1. Impostiamo il primo programma come Hero
        const top = highlights[0];
        heroTitle.innerText = top.program_title;
        heroDesc.innerText = top.program_abstract || "Non perdere questo appuntamento TV.";
        hero.style.backgroundImage = `url(${top.program_image})`;

        // 2. Generiamo le card
        grid.innerHTML = highlights.map(item => `
            <div class="netflix-card transition-all duration-300">
                <div class="relative aspect-video md:aspect-[2/3] overflow-hidden rounded-md shadow-lg border border-zinc-800 bg-zinc-900">
                    <img src="${item.program_image}" class="w-full h-full object-cover" loading="lazy">
                    <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <span class="text-[10px] font-bold text-red-500 uppercase">${item.channel_name}</span>
                    </div>
                </div>
                <div class="mt-2">
                    <h4 class="font-bold text-sm text-zinc-100 truncate">${item.program_title}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-zinc-500">${item.air_time}</span>
                        <span class="text-[10px] border border-zinc-700 px-1 rounded text-zinc-500">HD</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Errore fetch:", error);
        grid.innerHTML = `<p class="col-span-full text-center py-10 text-zinc-500">Impossibile caricare la guida. Riprova più tardi.</p>`;
    }
}

// Registrazione Service Worker per PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

fetchTVData();
