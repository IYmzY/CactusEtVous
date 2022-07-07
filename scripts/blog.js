import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import {app} from "./firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

// save editor content to firestore
const content = document.querySelector('#content');
if (content != null) {
    const editorSave = new EditorJS({
        holderId: 'content',
        tools: {
            header:{
                class: Header,
                inlineToolbar: ['link'],
            },
            embed:{
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
                    // endpoints: {
                    //     byFile: ',
                    //     byUrl: 'https://api.imgur.com/3/image/url',
                    // },
                    uploader: {
                         uploadByFile(file) {
                                let storageRef = ref(storage, file.name); 
                                return uploadBytes(storageRef, file).then( async (snapshot) => {
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
        }
    );
let saveBtn = document.querySelector('#save-button');
if (saveBtn != null) {
    saveBtn.addEventListener('click', () => {
        editorSave.save().then(async (outputData) => {
            let title = document.getElementById('title-article').value;
            let synopsis = document.getElementById('synopsis-article').value;

            let file = document.getElementById('image-input').files[0];
            console.log(file);
            let fileName = file.name;

            let fileRef = ref(storage, fileName);
            let fileUrl = await uploadBytes(fileRef, file).then( async (snapshot) => {
                let url = await getDownloadURL(fileRef).then((url) => {
                    return url;
                }).catch((error) => {
                    console.log(error);
                });
                return url;
            });    

            console.log("MDrr"+fileUrl);

            addDoc(collection(db, "articles"), {
                title: title,
                content: outputData,
                synopsis: synopsis,
                url_picture: fileUrl,
            }).then((snapshot) => {
                //window.location.href = "../pages/blog.html";
            }).catch((error) => {
                console.log(error);
            });
            
        }).catch((error) => {
            console.log('Saving failed: ', error);
        });
    });

    const image_input = document.querySelector("#image-input");

    image_input.addEventListener("change", function() {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
      });
      reader.readAsDataURL(this.files[0]);
    
    });
}
}


// Affichage des articles
const resultsContents = document.querySelector('#resultsContents');
if (resultsContents != null) {
    async function docs(){
        const docs = await getDocs(collection(db, "articles"));
        let count = 0;
        docs.forEach((doc) => {
            // affichage des articles
            count = count + 1;
            let article = document.createElement('article');
            let title = document.createElement('h2');
            let resume = document.createElement('div');
            let lien = document.createElement('a');
            let image = document.createElement('img');
            lien.href = "../pages/tArticles.html?id=" + doc.id;

            console.log(image)
            console.log(doc.data().url_picture);

            title.innerHTML = doc.data().title;
            resume.innerHTML = doc.data().synopsis;
            image.src = doc.data().url_picture;
            image.alt = doc.data().title;
            article.classList.add('article_'+count);

            article.appendChild(lien);
            lien.appendChild(image);
            lien.appendChild(title);
            lien.appendChild(resume);
            resultsContents.appendChild(article);
        });
    }
    docs();
}

// lecture d'un article à partir de L'id
const articleDiv = document.querySelector('#article');
if (articleDiv != null) {
    
    async function article() {
        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        let articleDataRef = doc(db, "articles", id);
        let editorWrite;
        await getDoc(articleDataRef).then((doc) => {
            let data  = doc.data();
            let title = articleDiv.querySelector('h1');
            title.innerHTML = data.title;
            editorWrite = new EditorJS({
                holderId: 'content-article',
                tools: {
                    header:{
                        class: Header,
                        inlineToolbar: ['link'],
                    },
                    embed:{
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
    article();
}

// edtition des articles
const editArticle = document.querySelector('#editArticle');
if (editArticle != null) {
    async function editArticle() {
        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        let articleDataRef = doc(db, "articles", id);
        let editorWrite;
    }
}


let titleImg = "yousef- alfuhigi-bMIlyKZHKMY-unsplash.jpg"
let titleImgBis = "yousef- alfuhigi-bMIlyKZHKMY-unsplash.jpg"

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


function renameImg(title){
    // renomer les fichiers images 
    title = title.split(".");
    title[0] = stringToHash(title[0]);
    title[0] = title[0]+Date.now();
    console.log(title[0]);
    title = title.join(".");
    return title;
}

console.log(renameImg(titleImgBis));
console.log(renameImg(titleImg));


