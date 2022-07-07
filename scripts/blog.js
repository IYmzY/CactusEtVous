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
                    actions: [
                        {
                            name: 'new_button',
                            icon: '<svg>...</svg>',
                            title: 'New Button',
                            action: (name) => {
                                alert(`${name} button clicked`);
                                return false;
                            }
                        }
                    ]
                },
            },
        }
    );
    let saveBtn = document.querySelector('#save-button');
    if (saveBtn != null) {
    saveBtn.addEventListener('click', () => {
        editorSave.save().then((outputData) => {
            let title = document.getElementById('title-article').value;
            let synopsis = document.getElementById('synopsis-article').value;


            let title_picture = document.getElementById('file').value;
            let storageRef = ref(storage, title_picture);
            let url = uploadBytes(storageRef, title_picture).then( async (snapshot) => {
                return url = await getDownloadURL(storageRef).then((url) => {
                    return url;
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });

            addDoc(collection(db, "articles"), {
                title: title,
                content: outputData,
                synopsis: synopsis,
                createdAt: new Date(),
                url_picture: url,
            }).then((snapshot) => {
                window.location.href = "../pages/blog.html";
            }).catch((error) => {
                console.log(error);
            });
           
        }).catch((error) => {
            console.log('Saving failed: ', error);
        });
    });
    }
}

// Affichage des articles
const resultsContents = document.querySelector('#resultsContents');
if (resultsContents != null) {
    async function docs(){
        const docs = await getDocs(collection(db, "articles"));
        docs.forEach((doc) => {
            // affichage des articles
            let article = document.createElement('article');
            let title = document.createElement('h2');
            let resume = document.createElement('div');
            let lien = document.createElement('a');

            lien.href = "../pages/tArticles.html?id=" + doc.id;
            console.log(lien)
            title.innerHTML = doc.data().title;
            resume.innerHTML = doc.data().synopsis;
            article.appendChild(lien);
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
    const editorWrite = new EditorJS({
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
        readOnly: true,
    });
    async function article() {
        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        let articleDataRef = doc(db, "articles", id);
        await getDoc(articleDataRef).then((doc) => {
            let data  = doc.data();
            let title = articleDiv.querySelector('h1');
            title.innerHTML = data.title;
            editorWrite.render(data.content);
        }).catch((error) => {
            console.log(error);
        });        
    }
    article();
}





