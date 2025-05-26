import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { Group, Tween, Easing } from '@tweenjs/tween.js';

// Pełna tablica pierwiastków: [symbol, nazwa, masa atomowa, kolumna, wiersz]
const table: (string | number)[] = [
    "H", "Hydrogen", "1.00794", 1, 1,
    "He", "Helium", "4.002602", 18, 1,
    "Li", "Lithium", "6.941", 1, 2,
    "Be", "Beryllium", "9.012182", 2, 2,
    "B", "Boron", "10.811", 13, 2,
    "C", "Carbon", "12.0107", 14, 2,
    "N", "Nitrogen", "14.0067", 15, 2,
    "O", "Oxygen", "15.9994", 16, 2,
    "F", "Fluorine", "18.9984032", 17, 2,
    "Ne", "Neon", "20.1797", 18, 2,
    "Na", "Sodium", "22.98976928", 1, 3,
    "Mg", "Magnesium", "24.305", 2, 3,
    "Al", "Aluminium", "26.9815386", 13, 3,
    "Si", "Silicon", "28.0855", 14, 3,
    "P", "Phosphorus", "30.973762", 15, 3,
    "S", "Sulfur", "32.065", 16, 3,
    "Cl", "Chlorine", "35.453", 17, 3,
    "Ar", "Argon", "39.948", 18, 3,
    "K", "Potassium", "39.0983", 1, 4,
    "Ca", "Calcium", "40.078", 2, 4,
    "Sc", "Scandium", "44.955912", 3, 4,
    "Ti", "Titanium", "47.867", 4, 4,
    "V", "Vanadium", "50.9415", 5, 4,
    "Cr", "Chromium", "51.9961", 6, 4,
    "Mn", "Manganese", "54.938045", 7, 4,
    "Fe", "Iron", "55.845", 8, 4,
    "Co", "Cobalt", "58.933195", 9, 4,
    "Ni", "Nickel", "58.6934", 10, 4,
    "Cu", "Copper", "63.546", 11, 4,
    "Zn", "Zinc", "65.38", 12, 4,
    "Ga", "Gallium", "69.723", 13, 4,
    "Ge", "Germanium", "72.63", 14, 4,
    "As", "Arsenic", "74.9216", 15, 4,
    "Se", "Selenium", "78.96", 16, 4,
    "Br", "Bromine", "79.904", 17, 4,
    "Kr", "Krypton", "83.798", 18, 4,
    "Rb", "Rubidium", "85.4678", 1, 5,
    "Sr", "Strontium", "87.62", 2, 5,
    "Y", "Yttrium", "88.90585", 3, 5,
    "Zr", "Zirconium", "91.224", 4, 5,
    "Nb", "Niobium", "92.90628", 5, 5,
    "Mo", "Molybdenum", "95.96", 6, 5,
    "Tc", "Technetium", "(98)", 7, 5,
    "Ru", "Ruthenium", "101.07", 8, 5,
    "Rh", "Rhodium", "102.9055", 9, 5,
    "Pd", "Palladium", "106.42", 10, 5,
    "Ag", "Silver", "107.8682", 11, 5,
    "Cd", "Cadmium", "112.411", 12, 5,
    "In", "Indium", "114.818", 13, 5,
    "Sn", "Tin", "118.71", 14, 5,
    "Sb", "Antimony", "121.76", 15, 5,
    "Te", "Tellurium", "127.6", 16, 5,
    "I", "Iodine", "126.90447", 17, 5,
    "Xe", "Xenon", "131.293", 18, 5,
    "Cs", "Caesium", "132.9054", 1, 6,
    "Ba", "Barium", "137.327", 2, 6,
    "La", "Lanthanum", "138.90547", 4, 9,
    "Ce", "Cerium", "140.116", 5, 9,
    "Pr", "Praseodymium", "140.90765", 6, 9,
    "Nd", "Neodymium", "144.242", 7, 9,
    "Pm", "Promethium", "(145)", 8, 9,
    "Sm", "Samarium", "150.36", 9, 9,
    "Eu", "Europium", "151.964", 10, 9,
    "Gd", "Gadolinium", "157.25", 11, 9,
    "Tb", "Terbium", "158.92535", 12, 9,
    "Dy", "Dysprosium", "162.5", 13, 9,
    "Ho", "Holmium", "164.93032", 14, 9,
    "Er", "Erbium", "167.259", 15, 9,
    "Tm", "Thulium", "168.93421", 16, 9,
    "Yb", "Ytterbium", "173.054", 17, 9,
    "Lu", "Lutetium", "174.9668", 18, 9,
    "Hf", "Hafnium", "178.49", 4, 6,
    "Ta", "Tantalum", "180.94788", 5, 6,
    "W", "Tungsten", "183.84", 6, 6,
    "Re", "Rhenium", "186.207", 7, 6,
    "Os", "Osmium", "190.23", 8, 6,
    "Ir", "Iridium", "192.217", 9, 6,
    "Pt", "Platinum", "195.084", 10, 6,
    "Au", "Gold", "196.966569", 11, 6,
    "Hg", "Mercury", "200.59", 12, 6,
    "Tl", "Thallium", "204.3833", 13, 6,
    "Pb", "Lead", "207.2", 14, 6,
    "Bi", "Bismuth", "208.9804", 15, 6,
    "Po", "Polonium", "(209)", 16, 6,
    "At", "Astatine", "(210)", 17, 6,
    "Rn", "Radon", "(222)", 18, 6,
    "Fr", "Francium", "(223)", 1, 7,
    "Ra", "Radium", "(226)", 2, 7,
    "Ac", "Actinium", "(227)", 4, 10,
    "Th", "Thorium", "232.03806", 5, 10,
    "Pa", "Protactinium", "231.0588", 6, 10,
    "U", "Uranium", "238.02891", 7, 10,
    "Np", "Neptunium", "(237)", 8, 10,
    "Pu", "Plutonium", "(244)", 9, 10,
    "Am", "Americium", "(243)", 10, 10,
    "Cm", "Curium", "(247)", 11, 10,
    "Bk", "Berkelium", "(247)", 12, 10,
    "Cf", "Californium", "(251)", 13, 10,
    "Es", "Einsteinium", "(252)", 14, 10,
    "Fm", "Fermium", "(257)", 15, 10,
    "Md", "Mendelevium", "(258)", 16, 10,
    "No", "Nobelium", "(259)", 17, 10,
    "Lr", "Lawrencium", "(262)", 18, 10,
    "Rf", "Rutherfordium", "(267)", 4, 7,
    "Db", "Dubnium", "(268)", 5, 7,
    "Sg", "Seaborgium", "(271)", 6, 7,
    "Bh", "Bohrium", "(272)", 7, 7,
    "Hs", "Hassium", "(270)", 8, 7,
    "Mt", "Meitnerium", "(276)", 9, 7,
    "Ds", "Darmstadtium", "(281)", 10, 7,
    "Rg", "Roentgenium", "(280)", 11, 7,
    "Cn", "Copernicium", "(285)", 12, 7,
    "Nh", "Nihonium", "(284)", 13, 7,
    "Fl", "Flerovium", "(289)", 14, 7,
    "Mc", "Moscovium", "(288)", 15, 7,
    "Lv", "Livermorium", "(293)", 16, 7,
    "Ts", "Tennessine", "(294)", 17, 7,
    "Og", "Oganesson", "(294)", 18, 7,
    "Xx", "Unknownium", "-", 0, 0,
    "Yy", "Mysteryon", "-", 0, 0
];

// Zmienne globalne Three.js
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
let initialCameraPosition = new THREE.Vector3();
let initialCameraRotation = new THREE.Euler();
let focused: CSS3DObject | null = null;

const objects: CSS3DObject[] = [];  // lista wszystkich obiektów CSS3D (elementów)
const targets = {
    table: [] as THREE.Object3D[],
    sphere: [] as THREE.Object3D[],
    helix: [] as THREE.Object3D[],
    grid: [] as THREE.Object3D[]
};

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const tweenGroup = new Group();     // grupa tweenów do animacji

function init() {
    // Ustawienia kamery i sceny 3D
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;
	initialCameraPosition.copy(camera.position);
    initialCameraRotation.copy(camera.rotation);
    scene = new THREE.Scene();

    // Tworzenie elementów tablicy pierwiastków
    for (let i = 0, index = 0; i < table.length; i += 5, index++) {

        // Główny kontener elementu
		const mainContainer = document.createElement('div');
		mainContainer.className = 'mainContainer';
    
    /*
		mainContainer.addEventListener('mousedown', () => {
			console.log('Najechano myszką!');
			moveToCenter(objectCSS); // jeśli chcesz coś zrobić
		  });
*/
		// Ustaw losowy kolor tła (dla wizualizacji odrębności elementów)
		mainContainer.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
		//mainContainer.style.width = (screenWidth /10) + "px";
    mainContainer.style.width = "10%";


		// Dodaj przycisk RESET do kontenera
const resetButton = document.createElement('button');
resetButton.textContent = 'RESET';
resetButton.style.marginTop = '8px';
resetButton.style.padding = '4px 8px';
resetButton.style.fontSize = '10px';
resetButton.style.cursor = 'pointer';
resetButton.style.borderRadius = '4px';
resetButton.style.border = 'none';
resetButton.style.backgroundColor = '#0ff';
resetButton.style.boxShadow = '0 0 6px rgba(0,255,255,0.5)';
resetButton.style.display = 'none'; // 👈 ukryty na starcie


resetButton.addEventListener('click', (e) => {
  //e.stopPropagation();
  console.log('Twój tekst tutaj');
  resetScene_old();
  
});

mainContainer.appendChild(resetButton);
        
       // Obszar komunikatu powitalnego/instrukcji
	   const communicationArea = document.createElement('div');
	   communicationArea.className = 'communicationArea';
	   
	   const messageParagraph = document.createElement('p');
	   messageParagraph.textContent = 'Witaj!';
	   
	   communicationArea.appendChild(messageParagraph);
	   mainContainer.appendChild(communicationArea);
	   

        // Kontener 3x3 (squareScratch) z 9 polami "zdrapek"
        const squareScratch = document.createElement('div');
        squareScratch.className = 'squareScratch';

        for (let j = 0; j < 9; j++) {
            const scratchContainer = document.createElement('div');
            scratchContainer.className = 'scratchContainer';
            // Kanwa symbolu (tło) i kanwa "zdrapki" (wierzchnia warstwa do zdrapywania)
            const symbolCanvas = document.createElement('canvas');
            symbolCanvas.className = 'symbolCanvas';
			
			      symbolCanvas.width=10;
            symbolCanvas.height=10;
            scratchContainer.appendChild(symbolCanvas);

            const scratchCanvas = document.createElement('canvas');
            scratchCanvas.className = 'scratchCanvas';

            symbolCanvas.width=10;
            symbolCanvas.height=10;

            
            scratchContainer.appendChild(scratchCanvas);
            squareScratch.appendChild(scratchContainer);
        }
        mainContainer.appendChild(squareScratch);

        // Symbol chemiczny pierwiastka (tekst)
        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = table[i] as string;
        mainContainer.appendChild(symbol);

        // Szczegóły: nazwa pierwiastka i masa atomowa
        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = `${table[i + 1]}<br>${table[i + 2]}`;
        mainContainer.appendChild(details);

        // Liczba atomowa (porządkowa)
        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = (index + 1).toString();
        mainContainer.appendChild(number);

        // Utworzenie obiektu CSS3D z przygotowanego kontenera
        const objectCSS = new CSS3DObject(mainContainer);
        // Ustaw losową pozycję startową (rozrzucenie w przestrzeni)
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);
        objects.push(objectCSS);

        // Docelowa pozycja dla układu "table" (tabela okresowa)
        const objectTarget = new THREE.Object3D();
        const indexInGrid = index; // 0-based
const columns = 12;
/**/ 
const row = Math.floor(indexInGrid / columns);
const col = indexInGrid % columns;
  // Szerokość kontenera w px (np. 8% szerokości ekranu)
  const containerWidth = screenWidth * 0.1;

const separationX = containerWidth*1.2;
const separationY = 300;
const offsetX = (columns - 1) * separationX / 2;
const offsetY = (Math.ceil(objects.length / columns) - 1) * separationY / 2+500;

objectTarget.position.x = col * separationX - offsetX;
objectTarget.position.y = -row * separationY + offsetY;
objectTarget.position.z = 0;
/**/


//----------------
//for (let i = 0; i < objects.length; i++) {
//  const position = calculateGridPosition(i, objects.length, columns);

 // objectTarget.position.set(position.x, position.y, position.z);
//}
//-----------------
        targets.table.push(objectTarget);

        // Kliknięcie w element - centrowanie kamery na danym obiekcie
        mainContainer.addEventListener('mousedown', () => {
       
            const focused = moveToCenter(objectCSS);
        });
    }

    // Układ "sphere" – pozycje docelowe rozmieszczone na kuli
    const vector = new THREE.Vector3();
    for (let i = 0, l = objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;
        const objectSphere = new THREE.Object3D();
        objectSphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        objectSphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        objectSphere.position.z = 800 * Math.cos(phi);
        vector.copy(objectSphere.position).multiplyScalar(2);
        objectSphere.lookAt(vector);
        targets.sphere.push(objectSphere);
    }

    // Układ "helix" – pozycje docelowe rozmieszczone na helisie
    for (let i = 0, l = objects.length; i < l; i++) {
        const phi = i * 0.175 + Math.PI;
        const objectHelix = new THREE.Object3D();
        objectHelix.position.x = 900 * Math.sin(phi);
        objectHelix.position.y = -(i * 8) + 450;
        objectHelix.position.z = 900 * Math.cos(phi);
        vector.set(objectHelix.position.x * 2, objectHelix.position.y, objectHelix.position.z * 2);
        objectHelix.lookAt(vector);
        targets.helix.push(objectHelix);
    }

    // Układ "grid" – pozycje docelowe w układzie siatki 3D (5x5x5)
    for (let i = 0; i < objects.length; i++) {
        const objectGrid = new THREE.Object3D();
        objectGrid.position.x = ((i % 5) * 400) - 800;
        objectGrid.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
        objectGrid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
        targets.grid.push(objectGrid);
    }

    // Konfiguracja renderera CSS3D i dodanie do DOM
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    const containerElem = document.getElementById('container');
    if (containerElem) {
        containerElem.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    // Ustawienia kontroli orbity (TrackballControls) dla kamery
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    // Można opcjonalnie ustawić ograniczenia zoom/pan, np. controls.minDistance, controls.noPan = true, itp.

    // Obsługa przycisków interfejsu (jeśli istnieją) do przełączania układów
    const tableButton = document.getElementById('table');
    const sphereButton = document.getElementById('sphere');
    const helixButton = document.getElementById('helix');
    const gridButton = document.getElementById('grid');
    if (tableButton) tableButton.addEventListener('click', () => transform(targets.table, 2000));
    if (sphereButton) sphereButton.addEventListener('click', () => transform(targets.sphere, 2000));
    if (helixButton) helixButton.addEventListener('click', () => transform(targets.helix, 2000));
    if (gridButton) gridButton.addEventListener('click', () => transform(targets.grid, 2000));

    // Początkowa animacja przekształcenia elementów do układu tablicy
    transform(targets.table, 3000);

    // Nasłuchiwanie zmiany rozmiaru okna
    window.addEventListener('resize', onWindowResize);
}

// Funkcja transform() – animuje przejście obiektów do wskazanego układu docelowego
function transform(targetArray: THREE.Object3D[], duration: number) {
    // Usuń ewentualne aktywne tweenery
    tweenGroup.removeAll();
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targetArray[i];
        // Tween zmiany pozycji obiektu
        const tweenPos = new Tween(object.position)
            .to({ 
                x: target.position.x, 
                y: target.position.y, 
                z: target.position.z 
            }, Math.random() * duration + duration)
            .easing(Easing.Exponential.InOut);
        // Tween zmiany rotacji obiektu
        const tweenRot = new Tween(object.rotation)
            .to({ 
                x: target.rotation.x, 
                y: target.rotation.y, 
                z: target.rotation.z 
            }, Math.random() * duration + duration)
            .easing(Easing.Exponential.InOut);
        // Dodaj tweenery do grupy i uruchom
        tweenGroup.add(tweenPos);
        tweenGroup.add(tweenRot);
        tweenPos.start();
        tweenRot.start();
    }
    // Dodatkowy tween wywołujący renderowanie podczas animacji (sztuczny obiekt pusty)
    const tweenUpdate = new Tween({}).to({}, duration * 2)
        .onUpdate(() => render());
    tweenGroup.add(tweenUpdate);
    tweenUpdate.start();
}



function moveToCenter(object: CSS3DObject):  CSS3DObject {

	const mainContainer = object.element as HTMLElement;
        mainContainer.classList.add('active');


	const targetPosition = object.position.clone();
  
	// Obliczamy "front" obiektu
	const normal = new THREE.Vector3(0, 0, 1)
	  .applyQuaternion(object.quaternion || new THREE.Quaternion())
	  .normalize();
  
	// Ustawiamy nową pozycję kamery przed obiektem
	const cameraPosition = targetPosition.clone().addScaledVector(normal, 200);
  
	// ✅ Określamy "pion"
	camera.up.set(0, 1, 0); // pion to oś Y
  
	// 🔄 Animacja pozycji kamery
	new Tween(camera.position, tweenGroup)
	  .to({
		x: cameraPosition.x,
		y: cameraPosition.y,
		z: cameraPosition.z
	  }, 1000)
	  .easing(Easing.Exponential.InOut)
	  .start();
  
	// 🔄 Animacja celu (punktu, na który patrzy kamera)
	new Tween(controls.target, tweenGroup)
	  .to({
		x: targetPosition.x,
		y: targetPosition.y,
		z: targetPosition.z
	  }, 1000)
	  .easing(Easing.Exponential.InOut)
	  .onComplete(() => {
		// Po zakończeniu: upewniamy się, że obiekt patrzy na kamerę
		object.lookAt(camera.position);
	  })
	  .start();

	    // Pokaż tylko przycisk w klikniętym obiekcie
  for (const obj of objects) {
    const el = obj.element as HTMLElement;
    const btn = el.querySelector('button');
    if (btn) btn.style.display = obj === object ? 'block' : 'none';
  }
 
	  controls.enabled = false;
	 

	  focusOnObject(object);
    return object;

  }
  
  function focusOnObject(clickedObject: CSS3DObject): void {
	for (const obj of objects) {
	  const el = obj.element as HTMLElement;
  
	  if (obj !== clickedObject) {
		el.style.transition = 'all 0.5s ease';
		el.style.filter = 'blur(6px)';
		el.style.opacity = '0.2';
		el.style.pointerEvents = 'none'; // 🔒 blokujemy klik
	  } else {
		el.style.filter = 'none';
		el.style.opacity = '1';
		el.style.pointerEvents = 'none'; // 🔒 opcjonalnie też blokujemy klik
	  }
	}
  }

  function resetScene(object: CSS3DObject): void {

    // Oddalenie kamery na oryginalne miejsce
    new Tween(camera.position, tweenGroup)
      .to({
        x: initialCameraPosition.x,
        y: initialCameraPosition.y,
        z: initialCameraPosition.z
      }, 1000)
      .easing(Easing.Exponential.InOut)
      .start();

      // 🔄 ROTACJA kamery
new Tween(camera.rotation, tweenGroup)
.to({
  x: initialCameraRotation.x,
  y: initialCameraRotation.y,
  z: initialCameraRotation.z
}, 1000)
.easing(Easing.Exponential.InOut)
.start();
  
    // Przywrócenie celu kamery (gdzie patrzy)
    new Tween(controls.target, tweenGroup)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(Easing.Exponential.InOut)
      .start();
  
    // Ukryj wszystkie przyciski
    for (const obj of objects) {
      const el = obj.element as HTMLElement;
      el.classList.remove('active');
      const btn = el.querySelector('button');
      if (btn) btn.style.display = 'none';
  
      // Przywróć widoczność obiektów
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    }
  
    // ❌ Usuwamy stare kontrolki
   // controls.dispose();
  
    // ✅ Tworzymy nowe kontrolki
   // controls = new TrackballControls(camera, renderer.domElement);
  //  controls.rotateSpeed = 0.5; // przywróć własne ustawienia, jeśli masz więcej
   // controls.target.set(0, 0, 0);              // 👈 to jest kluczowe!
//camera.lookAt(controls.target);            // 👈 żeby ustawić kierunek

   // controls.update();
  
     controls.enabled = true;
  
    // Odsłoń i odblokuj wszystkie elementy (dla pewności)
    for (const obj of objects) {
      const el = obj.element as HTMLElement;
      el.style.transition = 'all 0.5s ease';
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    }
  }
  
  function resetScene_old(): void {

    // Oddalenie kamery na oryginalne miejsce
    new Tween(camera.position, tweenGroup)
      .to({
        x: initialCameraPosition.x,
        y: initialCameraPosition.y,
        z: initialCameraPosition.z
      }, 1000)
      .easing(Easing.Exponential.InOut)
      .start();

      // 🔄 ROTACJA kamery
new Tween(camera.rotation, tweenGroup)
.to({
  x: initialCameraRotation.x,
  y: initialCameraRotation.y,
  z: initialCameraRotation.z
}, 1000)
.easing(Easing.Exponential.InOut)
.start();
  
    // Przywrócenie celu kamery (gdzie patrzy)
    new Tween(controls.target, tweenGroup)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(Easing.Exponential.InOut)
      .start();
  
    // Ukryj wszystkie przyciski
    for (const obj of objects) {
      const el = obj.element as HTMLElement;
      el.classList.remove('active');
      const btn = el.querySelector('button');
      if (btn) btn.style.display = 'none';
  
      // Przywróć widoczność obiektów
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    }
  
    // ❌ Usuwamy stare kontrolki
   // controls.dispose();
  
    // ✅ Tworzymy nowe kontrolki
   // controls = new TrackballControls(camera, renderer.domElement);
  //  controls.rotateSpeed = 0.5; // przywróć własne ustawienia, jeśli masz więcej
   // controls.target.set(0, 0, 0);              // 👈 to jest kluczowe!
//camera.lookAt(controls.target);            // 👈 żeby ustawić kierunek

   // controls.update();
  
     controls.enabled = true;
     controls.reset();
  
    // Odsłoń i odblokuj wszystkie elementy (dla pewności)
    for (const obj of objects) {
      const el = obj.element as HTMLElement;
      el.style.transition = 'all 0.5s ease';
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    }
  }
  
  

  document.getElementById('resetBtn')?.addEventListener('click', resetScene_old);

  
  
  
  

function moveToCenter_easy(object: CSS3DObject): void {
	new Tween(camera.position, tweenGroup)
	  .to({ x: 0, y: 0, z: 200 }, 1000)
	  .easing(Easing.Exponential.InOut)
	  .start();
	  
  }
  
  

// Funkcja onWindowResize() – dostosowuje kamerę i renderer po zmianie rozmiaru okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Funkcja animate() – główna pętla renderowania/animacji
function animate() {
    requestAnimationFrame(animate);
    tweenGroup.update();
    controls.update();
    render();
}

// Funkcja render() – renderuje scenę przy użyciu kamery
function render() {
    renderer.render(scene, camera);
}


function calculateGridPosition(index: number, totalItems: number, columns: number, spacingRatio = 0.1) {
  const screenWidth = window.innerWidth;

  // Całkowita przestrzeń na kontenery
  const totalContainerSpace = screenWidth * (1 - spacingRatio);
  const containerWidth = totalContainerSpace / columns;

  // Całkowita przestrzeń na odstępy
  const totalSpacing = screenWidth * spacingRatio;
  const separationX = totalSpacing / (columns - 1);

  // Pozycja w siatce
  const col = index % columns;
  const row = Math.floor(index / columns);

  // Centrowanie siatki względem środka sceny
  const offsetX = ((columns - 1) * (containerWidth + separationX)) / 2;

  const posX = col * (containerWidth + separationX) - offsetX;
  const posY = -row * (containerWidth + 100); // lub np. inna jednostka dla Y
  const posZ = 0;

  return { x: posX, y: posY, z: posZ };
}


// Inicjalizacja i start pętli animacji
init();
animate();
