export function cloneScratchCardMini(originalContainer: HTMLDivElement, cardId: number) {
    const container = document.getElementById("carousel-inner");
    if (!container) return;
  
    const cards = container.querySelectorAll('.card');
    const nextIndex = cards.length; // policz ile już jest kart
  
    const clone = originalContainer.cloneNode(true) as HTMLDivElement;
    
    // 📌 Nadaj klasę .card (żeby miały styl jak wszystkie karty)
    // clone.classList.remove('miniCard'); // usuń miniCard jeśli było
    clone.classList.add('miniCard');
  
    clone.style.width = ("100%");
    clone.style.scale=("0.5");
  
    // 📌 Nadaj numer pozycji (--i) nowej karcie
    clone.style.setProperty('--i', nextIndex.toString());
  
    // 📌 Upewnij się, że transformacja będzie taka jak inne
   // clone.style.transform = translate(-50%, -50%) rotateY(${nextIndex * 72}deg) rotateX(-7deg) translateZ(150px);
    clone.style.transform = `translate(-50%, -50%) rotateY(${nextIndex * 72}deg) rotateX(-7deg) translateZ(150px)`;

    
    clone.style.transformOrigin = "center center";
    clone.style.marginBottom = "0px"; // w karuzeli nie potrzebujesz marginesu
    clone.style.cursor = "pointer";
  
    clone.addEventListener("click", () => {
      clone.style.transition = "transform 0.5s";
      clone.style.transform += " scale(1.2)";
      setTimeout(() => {
        clone.style.transform = clone.style.transform.replace(" scale(1.2)", "");
      }, 500);
    });
  
    container.appendChild(clone);
  }