import '../styles/reset.css'
import '../styles/fonts.scss'
import '../styles/blog.scss'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, limit } from "firebase/firestore"; 
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
                    // endpoints: {
                    //     byFile: ',
                    //     byUrl: 'https://api.imgur.com/3/image/url',
                    // },
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
    const saveBtn = document.querySelector('#save-button');
    if (saveBtn != null) {
        saveBtn.addEventListener('click', () => {
            editorSave.save().then(async (outputData) => {
                let title = document.getElementById('title-article').value;
                let synopsis = document.getElementById('synopsis-article').value;
                let file = document.getElementById('image-input').files[0];
                let fileName = file.name;
                fileName = renameImg(fileName);

                let fileRef = ref(storage, fileName);
                let fileUrl = await uploadBytes(fileRef, file).then(async (snapshot) => {
                    let url = await getDownloadURL(fileRef).then((url) => {
                        return url;
                    }).catch((error) => {
                        console.log(error);
                    });
                    return url;
                });

                let cat = document.getElementById('cat-article').value;

                addDoc(collection(db, "articles"), {
                    title: title,
                    content: outputData,
                    synopsis: synopsis,
                    url_picture: fileUrl,
                    categories: cat,
                    // lastEdit: dateTime(),
                    lastEdit: new Date(),
                }).then((snapshot) => {
                    window.location.href = "blog.html";
                }).catch((error) => {
                    console.log(error);
                });

            }).catch((error) => {
                console.log('Saving failed: ', error);
            });
        });

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
}

// Affichage des articles en fonction de la catégorie
const resultsContents = document.querySelector('#resultsContents');
if (resultsContents != null) {
    async function docs() {
        var url = new URL(window.location.href);
        var page = url.searchParams.get("category");
        const articles = collection(db, "articles");

        if (page != null) {
            page = page.toString();
            let docs = query(articles, where("categories", "==", page))
            docs = await getDocs(docs);
            docs.forEach((doc) => {
                    if (doc.data().categories == page){
                        let article = document.createElement('div');
                        article.classList.add('card');
                        article.innerHTML = `
                            <div class="card-image" style="background-image:url('${doc.data().url_picture}');">
                            </div>
                            <div class="card-content">
                                <h3>${doc.data().title}</h3>
                                <p>${doc.data().synopsis}</p>
                                <a href="readArticles.html?id=${doc.id}">Lire l'article</a>
                            </div>
                        `;
                        resultsContents.appendChild(article);
                    }
                }
            );
        
        }else{
            let docs = query(articles, orderBy("lastEdit", "desc"))
            docs = await getDocs(docs);
            docs.forEach((doc) => {
                let article = document.createElement('div');
                article.classList.add('card');
                article.innerHTML = `
                    <div class="card-image" style="background-image:url('${doc.data().url_picture}');">
                    </div>
                    <div class="card-content">
                        <h3>${doc.data().title}</h3>
                        <p>${doc.data().synopsis}</p>
                        <a href="readArticles.html?id=${doc.id}">Lire l'article</a>
                    </div>
                `;
                resultsContents.appendChild(article);
                }
            );
        }

        let lastArticles = document.querySelector('.last-articles');
        let lastArticle = document.querySelector('#last-article'); 
        let dateNow = new Date();
        let docsLastArticles = query(articles, where("lastEdit", "<", dateNow), orderBy("lastEdit", "desc"), limit(4));
        docsLastArticles  = await getDocs(docsLastArticles);
        let docLastArticle = query(articles, where("lastEdit", "<", dateNow), orderBy("lastEdit", "desc"), limit(1));
        docLastArticle  = await getDocs(docLastArticle);

        docsLastArticles.forEach((doc) => {
            let article = document.createElement('div');
            article.classList.add('card');
            article.innerHTML = `
                <div class="card-image" style="background-image:url('${doc.data().url_picture}');">
                </div>
                <div class="card-content">
                    <h3>${doc.data().title}</h3>
                    <p>${doc.data().synopsis}</p>
                    <a href="readArticles.html?id=${doc.id}">Lire l'article</a>
                </div>
            `;
            lastArticles.appendChild(article);
        });

        docLastArticle.forEach((doc) => {
            lastArticle.style.backgroundImage = `linear-gradient(to bottom,rgba(4,27,27,.70),rgba(4,27,27,.70)), url('${doc.data().url_picture}') `;
            lastArticle.innerHTML = `
                <div class="content">
                    <h4>Notre dernier article</h4>
                    <h3>${doc.data().title}</h3>
                    <p>${doc.data().synopsis}</p>
                    <a href="readArticles.html?id=${doc.id}">Lire l'article</a>
                </div>
            `;
        })
    }
    docs();
}

// lecture d'un article à partir de L'id
const articleDiv = document.querySelector('#article');
if (articleDiv != null) {
    async function article() {
        var url = new URL(window.location.href);
        let article = document.querySelector('#article > section:first-child');
        var id = url.searchParams.get("id");
        let articleDataRef = doc(db, "articles", id);

        let docs = await getDoc(articleDataRef).then((doc) => {
            let data  = doc.data();
            let title = articleDiv.querySelector('h1');
            title.innerHTML = data.title;
            let editorWrite = new EditorJS({
                holderId: 'content-article',
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
            article.style.backgroundImage = `linear-gradient(to bottom,rgba(4,27,27,.40),rgba(4,27,27,.40)), url('${data.url_picture}')`;
            let href = "editArticle.html?id=" + id;
            let lien = articleDiv.querySelector('#article a');
            lien.href = href;
        }).catch((error) => {
            console.log(error);
        });
    }
    article();
}

// edtition des articles
const editArticle = document.querySelector('#edit');
if (editArticle != null) {
    async function edit() {

        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        let articleDataRef = doc(db, "articles", id);
        let editorWrite;

        let edit = await getDoc(articleDataRef).then((doc) => {
            let data = doc.data();
            let title = editArticle.querySelector('#title-article');
            title.value = data.title;
            let synopsis = editArticle.querySelector('#synopsis-article');
            synopsis.value = data.synopsis;
            let cat = editArticle.querySelector('#cat-article');
            cat.value = data.categories;

            editorWrite = new EditorJS({
                holderId: 'edit-content',
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
                        }
                    },
                },
                data: data.content,
            });

            const image_input = document.querySelector("#image-input");
            if (image_input != undefined) {
                image_input.addEventListener("change", function () {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        const uploaded_image = reader.result;
                        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
                    });
                    reader.readAsDataURL(this.files[0]);

                });
            }

            document.querySelector("#display-image").style.backgroundImage = `url(${data.url_picture})`;
            
            const editBtn = document.querySelector('#edit-button');
            editBtn.addEventListener('click', () => {
                editorWrite.save().then(async (outputData) => {
                    let title = document.getElementById('title-article').value;
                    let synopsis = document.getElementById('synopsis-article').value;
                    let cat = document.getElementById('cat-article').value;

                    let file = document.getElementById('image-input').files[0];
                    let fileUrl = data.url_picture;
                    if (file != null) {
                        let fileName = file.name;
                        fileName = renameImg(fileName);
                        let fileRef = ref(storage, fileName);
                        fileUrl = await uploadBytes(fileRef, file).then(async (snapshot) => {
                            let url = await getDownloadURL(fileRef).then((url) => {
                                return url;
                            }).catch((error) => {
                                console.log(error);
                            });
                            return url;
                        });
                    }

                    await setDoc(articleDataRef, {
                        title: title,
                        content: outputData,
                        synopsis: synopsis,
                        url_picture: fileUrl,
                        categories: cat,
                        lastEdit : new Date(),
                    }).then((snapshot) => {
                        window.location.href = "blog.html";
                    }).catch((error) => {
                        console.log(error);
                    });

                }).catch((error) => {
                    console.log('Saving failed: ', error);
                });
            });
        }).catch((error) => {
            console.log(error);
        });

    }
    edit()

}

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

