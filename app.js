async function fetchTVData() {
    const grid = document.getElementById('program-grid');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const hero = document.getElementById('hero');

    // Definiamo chiaramente le stringhe
    const proxy = "https://api.allorigins.win/raw?url=";
    const apiUrl = "https://services.tivulaguida.it/api/epg/highlights.json";
    
    // Costruiamo l'URL finale correttamente
    const finalUrl = proxy + encodeURIComponent(apiUrl);

    try {
        console.log("Tentativo di fetch su:", finalUrl); // Debug per la console
        const response = await fetch(finalUrl);
        
        if (!response.ok) throw new Error("Risposta del server non valida");
        
        const data = await response.json();
        
        // Verifichiamo che i dati esistano prima di usarli
        if (!data || !data.highlights || data.highlights.length === 0) {
            grid.innerHTML = "<p class='col-span-full text-center'>Nessun highlight disponibile al momento.</p>";
            return;
        }

        const highlights = data.highlights;

        // Impostazione Hero
        const top = highlights[0];
        if (heroTitle) heroTitle.innerText = top.program_title;
        if (heroDesc) heroDesc.innerText = top.program_abstract || "Non perdere questo appuntamento.";
        if (hero && top.program_image) hero.style.backgroundImage = `url(${top.program_image})`;

        // Generazione Grid
        grid.innerHTML = highlights.map(item => `
            <div class="netflix-card transition-all duration-300 hover:scale-105 cursor-pointer">
                <div class="relative aspect-[16/9] overflow-hidden rounded-md shadow-lg border border-zinc-800 bg-zinc-900">
                    <img src="${item.program_image}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/300x170?text=TV'">
                    <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <span class="text-[10px] font-bold text-red-500 uppercase">${item.channel_name}</span>
                    </div>
                </div>
                <div class="mt-2">
                    <h4 class="font-bold text-sm text-zinc-100 truncate">${item.program_title}</h4>
                    <p class="text-xs text-zinc-500">${item.air_time}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Errore dettagliato:", error);
        grid.innerHTML = `<p class="col-span-full text-center py-10 text-red-500">Errore: ${error.message}</p>`;
    }
}
// Registrazione Service Worker per PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

fetchTVData();
