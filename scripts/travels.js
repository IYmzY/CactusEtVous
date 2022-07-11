import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/travels.scss'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

// Add travels
let add = document.querySelector('#add-container');
if (add != null){
    const saveBtn = document.querySelector('#save-button');
    const editorSave = new EditorJS({
        holderId: 'content-travel',
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
        },
    });

    let travels = collection(db, "travels");
    travels = await getDocs(travels);
    travels.forEach(travel => {
        console.log(travel.data());
    });

    saveBtn.addEventListener('click', (e) => {
        editorSave.save().then( async (outputData) => {
            let name = document.querySelector('#title-travel').value;
            let location = document.querySelector('#lieu-travel').value;

            let description = document.querySelector('#description-travel').value;

            let images = document.querySelector('#image-input').files;
            let imagesArray = [];
            let imagesUrl = [];

            for (let i = 0; i < images.length; i++) {
                const element = images[i];
                imagesArray.push(element);
            }

            console.log(imagesArray);

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

            console.log(imagesUrl);

            let price = document.querySelector('#price-travel').value;
            
            let date = document.querySelector('#duration-travel').value;

            let activities = document.querySelector('#activities-travel').value;
            let activitiesArray = activities.split(',');
            let activitiesArrayClean = [];

            activitiesArray.forEach(item => {
                activitiesArrayClean.push(item.trim());
            });

            console.log(activitiesArrayClean);
            
            let tags = document.querySelector('#tags-travel').value;
            let tagsArray = tags.split(',');
            let tagsArrayClean = [];
            tagsArray.forEach(tag => {
                tagsArrayClean.push(tag.trim());
            });

            console.log(tagsArrayClean);
            console.log("Mdrr",imagesUrl);

            await addDoc(collection(db, "travels"), {
                name: name,
                desc: description,
                content : outputData,
                price: price,
                image: imagesUrl,
                date: date,
                location: location,
                activities: activitiesArrayClean,
                tags: tagsArrayClean,
                lastEdit: new Date()
            }).then((snapshot) => {
                //window.location.href = "../../index.html";
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        })
    })
}

// Edit Travels

// Afficher travel avec l'id

const travel = document.querySelector('#travel');
if (travel != null) {
  async function travel(){
    const travel = document.querySelector('#travel');
    const travelsdb = collection(db, "travels");
    let imgTravel = document.querySelector('.img-travel');
    let resev = document.querySelector('.reserv');


    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    let travelDataRef = doc(db, "travels", id);

    let docs = await getDoc(travelDataRef).then((doc) => {
        let data = doc.data();
        let title = imgTravel.querySelector('h1');
        title.innerHTML = data.name;
        let titleH2 = imgTravel.querySelector('h2');
        titleH2.innerHTML = data.desc;
        let price = imgTravel.querySelector('.price');
        price.innerHTML = "Coût total : "+data.price+"€";
        let date = imgTravel.querySelector('.duration');
        date.innerHTML = "Durée sur place :"+data.date;

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
            },
            data: data.content,
            readOnly: true,
        });

        let activities = travel.querySelector('.activities ul');
        data.activities.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = item;
            activities.appendChild(li);
        })

        imgTravel.style.backgroundImage = `url('${data.image[0]}')`;

    }).catch((error) => {
        console.log(error);
    });
  }
  travel()
}



// afficher trois travels par page en fonction des reponse du quizz


// global function

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

