        
        
        
    const carouselInner = document.getElementById('carousel-inner');
		const prevBtn = document.getElementById('prev-btn');
		const nextBtn = document.getElementById('next-btn');


let angle = 0;
const baseZ = -400;
// Aktualizuj indeksy (--i) wszystkich kart
export function updateCardIndices() {
  const cards = document.querySelectorAll('.mainContainer.active.miniCard');
  cards.forEach((card, index) => {
    // card.setAttribute('style', `--i: ${index};`); //Nadpisuje cały styl!!
    (card as HTMLElement).style.setProperty('--i', `${index}`);

  });
}

// Aktualizuj obrót
export function updateRotation() {
  const carouselInner = document.getElementById('carousel-inner');
  if (!carouselInner) return;

  // carouselInner.style.transform = `rotateY(${angle}deg)`;
  carouselInner.style.transform = `translateZ(${baseZ}px) rotateY(${angle}deg)`;
}

// Dynamicznie wylicz krok
function getStep() {
  const cards = document.querySelectorAll('.mainContainer.active.miniCard');
  const count = cards.length || 1; // zabezpieczenie przed dzieleniem przez 0
  return 360 / count;
}

// Obsługa przycisków
document.getElementById('prev-btn')?.addEventListener('click', () => {
  console.log ('butek OK');
  angle += getStep();
  updateRotation();
});

document.getElementById('next-btn')?.addEventListener('click', () => {
  angle -= getStep();
  updateRotation();
});



  // updateCardIndices(); // przelicz indeksy --i dla WSZYSTKICH kart
  // updateRotation();    // odśwież obrót