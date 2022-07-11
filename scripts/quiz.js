import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/quiz.scss'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import {
  app
} from "./firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

const travels = document.querySelector('#travels');
if (travels != null) {
   const travelsdb = collection(db, "travels");
   let dateNow = new Date();
   async function travels(){
    let docsTravels = query(travelsdb, where("lastEdit", "<", dateNow), orderBy("lastEdit", "desc"), limit(3));
    docsTravels = await getDocs(docsTravels);

    docsTravels.forEach(doc => {
      const travels = document.querySelector('#travels');
      let div = document.createElement('div');
      div.classList.add('travel');
      div.innerHTML = `
      <div class="travel-img" style="background-image:url(${doc.data().image[0]});">
      </div>
      <div class="travel-info">
        <div>
          <h2>${doc.data().name}</h2>
          <p>${doc.data().desc}</p>
        </div>
        <div>
        <a href="../travels/read/index.html?id=${doc.id}">Sélectioner</a>
        </div>
      </div>
      `;
      travels.appendChild(div);
    });
   }
   travels();
}





var s = document.createElement('style');
document.head.appendChild(s);
var inputDiv = document.querySelector('#inputDiv');
var w = parseInt(window.getComputedStyle(inputDiv, null).getPropertyValue("width"));
var elInput = document.querySelector("input[type='range']");
elInput.style.width = w + "px";
var inputMin = elInput.getAttribute('min');
var inputMax = elInput.getAttribute('max');
var k = w / (inputMax);


var etiquette = document.querySelector('#etiqueta');
var ew = parseInt(window.getComputedStyle(etiquette, null).getPropertyValue("width"));


etiquette.innerHTML = elInput.value;
etiquette.style.left = ((elInput.value * k) - (ew / 2)) + "px";
s.textContent = "input[type=range]::-webkit-slider-runnable-track{ background-image:-webkit-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"
s.textContent += "input[type=range]::-moz-range-track{ background-image:-moz-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"


elInput.addEventListener('input', function () {
  etiquette.innerHTML = elInput.value;
  etiquette.style.left = ((elInput.value * k) - (ew / 2)) + "px";
  s.textContent = "input[type=range]::-webkit-slider-runnable-track{ background-image:-webkit-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"
  s.textContent += "input[type=range]::-moz-range-track{ background-image:-moz-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"

}, false);




