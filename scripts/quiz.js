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

var s = document.createElement('style');
document.head.appendChild(s);
var inputDiv = document.querySelector('#inputDiv');
var w = parseInt(window.getComputedStyle(inputDiv, null).getPropertyValue("width"));
var elInput = document.querySelector("input[type='range']");
elInput.style.width = w + "px";
var inputMin = elInput.getAttribute('min');
var inputMax = elInput.getAttribute('max');
var k = w / (inputMax);


var etiqueta = document.querySelector('#etiqueta');
var ew = parseInt(window.getComputedStyle(etiqueta, null).getPropertyValue("width"));


etiqueta.innerHTML = elInput.value;
etiqueta.style.left = ((elInput.value * k) - (ew / 2)) + "px";
s.textContent = "input[type=range]::-webkit-slider-runnable-track{ background-image:-webkit-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"
s.textContent += "input[type=range]::-moz-range-track{ background-image:-moz-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"


elInput.addEventListener('input', function () {
  etiqueta.innerHTML = elInput.value;
  etiqueta.style.left = ((elInput.value * k) - (ew / 2)) + "px";
  s.textContent = "input[type=range]::-webkit-slider-runnable-track{ background-image:-webkit-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"
  s.textContent += "input[type=range]::-moz-range-track{ background-image:-moz-linear-gradient(left, #9CD2D2 " + elInput.value + "%,black " + elInput.value + "%)}"

}, false);
