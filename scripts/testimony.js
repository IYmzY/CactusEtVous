import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/testimony.scss'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';


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
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        uploadByFile(file) {
                            let fileName = renameImg(file.name);
                            let storageRef = ref(storage, fileName);
                            return uploadBytes(storageRef, file).then(async (snapshot) => {
                                let url = await getDownloadURL(storageRef).then((url) => {
                                    return url;
                                }).catch((error) => {
                                    console.log(error);
                                });
                                return {
                                    success: 1,
                                    file: {
                                        url: url,
                                    }
                                }
                            });
                        }
                    }
                },
            },
        }
    });
    const travels = collection(db, "travels");
    const travelers = collection(db, "users");
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
            let travels = document.getElementById('travels-testimony').innerHTML;
            
            let file = document.getElementById('image-input').files[0];
            let fileName = renameImg(file.name);

            let fileRef = ref(storage, fileName);
            let fileUrl = await uploadBytes(fileRef, file).then(async (snapshot) => {
                let url = await getDownloadURL(fileRef).then((url) => {
                    return url;
                }).catch((error) => {
                    console.log(error);
                });
                return url;
            });

            let traveler = document.getElementById('travelers-testimony').value;
            let content = document.getElementById('content-testimony').value;

            // recupérer les données du voyages
            let travel = await getDoc(db, 'travels', travels);
            let travelData = travel.data();
            let travelId = travel.id;
            let travelTitle = travelData.title;
            let travelDescription = travelData.description;
            let travelImage = travelData.image;
            let travelDate = travelData.date;
            let travelPrice = travelData.price;


            addDoc(collection(db, 'testimonies'), {
                title: title,
                travels: travels,
                traveler: traveler,
                content: content,
                image: fileUrl,
            }).then((snapshot) => {
                window.location.href = "../../index.html";
            }).catch((error) => {
                console.log(error)
            });
        })
    })
    const image_input = document.querySelector("#image-input");

    image_input.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
        });
        reader.readAsDataURL(this.files[0]);
    });

}

// edit the date to the database

// affichage en fonction de l'id du testimony


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