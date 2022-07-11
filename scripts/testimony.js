import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/testimony.scss'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import { globeConfig } from './globe-config/globe-testimony-info';


import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

// Save the data to the database
let addContainer = document.querySelector('#add-container');
if (addContainer != null) {
    const editorSave = new EditorJS({
        holderId: 'content-testimony',
        tools:{
            header: {
                class: Header,
                inlineToolbar: ['link'],
            },
            embed: {
                class: Embed,
                inlineToolbar: false,
                config: {
                    services: {
                        youtube: true,
                        coub: true,
                    }
                }
            },
        }
    });

    const travels = collection(db, "travels"); // séjours
    const travelers = collection(db, "users"); // voyageurs

    // ajout des séjours dans le select de la page (travels-testimony)
    const selectTravel = document.querySelector('#travels-testimony');
    async function getTravels() {
        let docs = query(travels)
        docs = await getDocs(docs);

        const option = document.createElement('option');
        option.value = "";
        option.innerHTML = "Choisir un voyage";
        selectTravel.appendChild(option);

        docs.forEach(travel => {
            const option = document.createElement('option');
            option.value = travel.id;
            option.innerHTML = travel.data().name;
            selectTravel.appendChild(option);
        }
        );
    }
    getTravels();


    // ajout du voyageurs dans le select de la page (#travelers-testimony)
    const selectTraveler = document.querySelector('#travelers-testimony');
    async function getTravelers() {
        let docs = query(travelers)
        docs = await getDocs(docs);
        docs.forEach(traveler => {
            const option = document.createElement('option');
            option.value = traveler.id;
            option.innerHTML = traveler.data().firstName + " " + traveler.data().lastName;
            selectTraveler.appendChild(option);
        }
        );
    }
    getTravelers();


    const saveBtn = document.querySelector('#save-button');
    saveBtn.addEventListener('click', () => {
        editorSave.save().then( async (outputData) => {
            let title = document.getElementById('title-testimony').value;
            let travel = document.getElementById('travels-testimony').value;

            let images = document.querySelector('#image-input').files;
            let imagesArray = [];
            let imagesUrl = [];

            for (let i = 0; i < images.length; i++) {
                const element = images[i];
                imagesArray.push(element);
            }

            for await (const element of imagesArray) {
                let fileName = renameImg(element.name);
                let storageRef = ref(storage, fileName);
                await uploadBytes(storageRef, element).then(async (snapshot) => {
                    let url = await getDownloadURL(storageRef).then((url) => {
                        return url;
                    }).catch((error) => {
                        console.log(error);
                    });
                    imagesUrl.push(url);
                }).catch((error) => {
                    console.log(error);
                })
            }

            let traveler = document.getElementById('travelers-testimony').value;


            addDoc(collection(db, 'testimonies'), {
                citation: title,
                travel: travel,
                traveler: traveler,
                content: outputData,
                image: imagesUrl,
            }).then((snapshot) => {
                // function d'ajout 
                const id = snapshot.id;
                globeConfig.push({
                    lat: 0,
                    lng: 0,
                    title: "",
                    content: title,
                    url: "../../testimonials/history/index.html?id=" + id,
                    
                })
                console.log(snapshot.id);
                //window.location.href = "../../index.html";
            }).catch((error) => {
                console.log(error)
            });


        })
    })
}

// edit the date to the database

// affichage en fonction de l'id du testimony
let readContainer = document.querySelector('#read-container');
if (readContainer != null) {
    async function testimony(){
        var url = new URL(window.location.href);
       
        var id = url.searchParams.get("id");
        let testimoniesDataRef = doc(db, "testimonies", id);

        let docs = await getDoc(testimoniesDataRef).then(async (testi) => {
           
            let imgs = readContainer.querySelector('.img');
            let quote = readContainer.querySelector('.quote');

            let data = testi.data();
            let travel = data.travel;
            let traveler = data.traveler;

            let citation = data.citation;
            quote.innerHTML = citation;

            let img = data.image;
            img.forEach(img => {
                let imgDiv = document.createElement('div');
                imgDiv.classList.add('img-div');
                imgDiv.style.backgroundImage = "url(" + img + ")";
                imgs.appendChild(imgDiv);
            });

            let travelerDataRef = doc(db, "users", traveler);
            let travelerData = await getDoc(travelerDataRef).then((doc) => {
                let travelerDiv = readContainer.querySelector('.traveler');
                let data = doc.data();
                let firstName = data.firstName;
                let lastName = data.lastName;
                let fullName = firstName + " " + lastName;
                travelerDiv.innerHTML = fullName;
            }).catch((error) => {
                console.log(error);
            });
            
            let editorWrite = new EditorJS({
                holderId: 'content',
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: ['link'],
                    },
                    embed: {
                        class: Embed,
                        inlineToolbar: false,
                        config: {
                            services: {
                                youtube: true,
                                coub: true,
                            }
                        }
                    },
                    image: {
                        class: ImageTool,
                    },
                },
                data: data.content,
                readOnly: true,
            });

        }).catch((error) => {
            console.log(error);
        });
    }
    testimony();
    
}


// function global

//fonction de hachage
function stringToHash(string) {
    var hash = 0;
    if (string.length == 0) return hash;
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

//fonction de rename file image upload
function renameImg(title) {
    // renomer les fichiers images 
    title = title.split(".");
    title[0] = stringToHash(title[0]);
    const d = new Date();
    const ms = d.getMilliseconds();
    title[0] = title[0] + ms;
    title = title.join(".");
    return title;
}