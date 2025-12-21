async function fetchTVData() {
    const grid = document.getElementById('program-grid');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const hero = document.getElementById('hero');

    const apiUrl = "https://services.tivulaguida.it/api/epg/highlights.json";
    const proxy = "https://api.allorigins.win/get?url=";
    const baseImgUrl = "https://services.tivulaguida.it";

    try {
        const response = await fetch(proxy + encodeURIComponent(apiUrl));
        const json = await response.json();
        
        // AllOrigins incapsula i dati in .contents come stringa
        const data = JSON.parse(json.contents);
        
        // Il tuo JSON è una lista diretta (array), non ha un oggetto "highlights"
        const highlights = Array.isArray(data) ? data : data.highlights;

        if (!highlights || highlights.length === 0) {
            grid.innerHTML = "<p class='col-span-full text-center'>Guida non disponibile.</p>";
            return;
        }

        // 1. Configurazione HERO (Primo elemento)
        const top = highlights[0];
        heroTitle.innerText = top.title;
        heroDesc.innerText = top.description;
        hero.style.backgroundImage = `url(${baseImgUrl + top.featured_img})`;

        // 2. Generazione GRID
        grid.innerHTML = highlights.map(item => {
            const imgPath = baseImgUrl + item.smartphone_img;
            const channelName = item.channel ? item.channel.name : "TV";
            
            // Estraiamo solo l'ora dalla stringa "21-12-2025 21:30"
            const time = item.onair.split(' ')[1];

            return `
                <div class="netflix-card group cursor-pointer">
                    <div class="relative aspect-video rounded-md overflow-hidden bg-zinc-900 shadow-lg transition-transform duration-300 group-hover:scale-105 border border-zinc-800">
                        <img src="${imgPath}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/300x200?text=TV'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
                        <div class="absolute bottom-2 left-2">
                            <p class="text-[10px] font-black text-red-600 uppercase tracking-tighter">${channelName}</p>
                        </div>
                    </div>
                    <div class="mt-2 px-1">
                        <h4 class="font-bold text-sm text-zinc-100 truncate">${item.title}</h4>
                        <p class="text-xs text-zinc-500 font-medium">${time} • ${item.duration} min</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Errore mappatura:", error);
        grid.innerHTML = `<div class="col-span-full text-center py-10">Errore nel caricamento dati.</div>`;
    }
}

fetchTVData();
