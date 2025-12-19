self.addEventListener('fetch', (event) => {
    // Anche se vuoto, la sua presenza abilita l'installazione su molti sistemi
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
