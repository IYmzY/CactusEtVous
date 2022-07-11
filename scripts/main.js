import Globe from 'globe.gl';
import Swiper from 'swiper';
import { globeConfig } from './globe-config/globe-testimony-info';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/main.scss'

import { app } from "./firebaseConfig";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const db = getFirestore(app);






const colorScale = d3.scaleOrdinal(['#041B1B',]);

const labelsTopOrientation = new Set(['Arles, Italie', 'Quito, Equateur ', 'Chichaoua, Maroc', 'Tour de la Sicile', 'Iquitos, Pérou', 'Val-Des-Près, France', 'Île de Sulawesi, Indonésie', 'Ormara, Pakistan']);

const labelContainer = document.querySelector('.testimony-label-container');


let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
const globeSize = 0.5;



const elem = document.getElementById('testimony-globe');
const testimonyGlobe = Globe()
    .bumpImageUrl('../globe-bumpmap.svg')
    .globeImageUrl('../globe-texture.svg')
    .backgroundColor('rgba(0,0,0,0)')
    .width(globeSize * screenWidth)
    .height(globeSize * screenWidth)
    .showGraticules(true)
    .showAtmosphere(false)
    .labelText('title')
    .labelSize(4)
    .labelDotRadius(1)
    .labelIncludeDot(true)
    .labelDotOrientation(d => labelsTopOrientation.has(d.title) ? 'top' : 'bottom')
    .labelColor(d => colorScale(d.title))
    .onLabelClick(d => {
        window.open(d.url, '_blank')
    })
    .onLabelHover((d) => {
        testimonyGlobe.controls().autoRotate = false;
        if (!d) {
            testimonyGlobe.controls().autoRotate = true;
            return;
        };
        labelContainer.innerHTML = `
            <h3 class="testimony-label-title" >${d.title}</h3>
            <div class="testimony-content-container">
                <p class="testimony-label-content">${d.content}</p>
                <img class="testimony-label-quoteUp" src="./images/icon/quoteUp.svg">
                <img class="testimony-label-quoteDown" src="./images/icon/quoteDown.svg">
            </div>
            <span><a class="testimony-label-button" href="${d.url}">En savoir plus</a></span>
        `
    })
    (elem)
    ;


// fetch('..//globe-config/globe-testimony-info').then(r => r.text()).then(testimonies => {
//     testimonyGlobe.labelsData(testimonies);
// });


testimonyGlobe.labelsData(globeConfig);


console.log(globeConfig)

testimonyGlobe.resumeAnimation()
testimonyGlobe.controls().autoRotate = true;
testimonyGlobe.controls().autoRotateSpeed = 0.5;
testimonyGlobe.controls().enableZoom = false
testimonyGlobe.controls().minPolarAngle = Math.PI / 2.7
testimonyGlobe.controls().maxPolarAngle = Math.PI / 1.8

window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    testimonyGlobe.width(globeSize * screenWidth)
    testimonyGlobe.height(globeSize * screenWidth)
});

// recuperation des articles de blog
async function docs() {
    const slide = document.querySelector('.swiper-wrapper');
    const articles = collection(db, "articles");
    let dateNow = new Date();
    let docsLastArticles = query(articles, where("lastEdit", "<", dateNow), orderBy("lastEdit", "desc"), limit(5));
    docsLastArticles = await getDocs(docsLastArticles).then((docs) => {
        docs.forEach((doc) => {
            let data = doc.data();
            let blogSlide = `
                <div class="swiper-slide">
                    <div class="slide-container" style="background-image:url(${data.url_picture})">
                        <div class="slide-content">
                            <h3 class="slide-title">${data.title}</h3>
                            <p class="slide-content">${data.synopsis}</p>
                            <a class="slide-button" href="blog/article/index.html?id=${doc.id}">En savoir plus</a>
                        </div>
                    </div>
                </div>
            `;
            slide.innerHTML += blogSlide;
        });
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 2,
            spaceBetween: 0,
            centeredSlides: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    });
}
docs()

//Explainer 
//open Explainer
document.querySelector('.explainer-preview-container')
    .addEventListener('click', () => {

        let currentScrollY = `${window.scrollY + (screenHeight * 0.2)}px`

        const explainerYtb = document.querySelector('.explainer-ytb-container')
        explainerYtb.style.display = "flex"
        explainerYtb.style.top = currentScrollY

        document.querySelector('.close-explainer-container').style.display = "flex"

        // block scroll
        document.querySelector('body').style.overflow = 'hidden'
    })
//Close Explainer
document.querySelector('.close-explainer-container img').addEventListener('click', () => {

    //close "close" button
    document.querySelector('.close-explainer-container').style.display = "none"

    //close explainer
    document.querySelector('.explainer-ytb-container').style.display = "none"

    //restore scroll
    document.querySelector('body').style.overflow = 'auto'
})

// explainer play & pause

const handleExplainerPlayPause = () => {
    const ytbVideo = document.querySelector('.ytbIframe-explainer')
    console.log(ytbVideo)
    console.log(ytbVideo.contentWindow)
    const explainerYtbContainer = document.querySelector('.explainer-ytb-container')

    if (explainerYtbContainer.style.display === "flex") {
        ytbVideo.contentWindow.playVideo()
    } else {
        ytbVideo.contentWindow.pauseVideo()
    }
}
handleExplainerPlayPause()









// window.onload = function () {
//     // menu mobil
//     var navbar = document.querySelector('.navbar')
//     var openMenu = document.querySelector('.burger');
//     var closeMenu = document.querySelector('.close-navbar');
//     openMenu.addEventListener('click', function () {
//         this.style.display = 'none';
//         navbar.style.display = 'flex';
//         closeMenu.style.display = 'block';
//     });
//     closeMenu.addEventListener('click', function () {
//         this.style.display = 'none';
//         navbar.style.display = 'none';
//         openMenu.style.display = 'block';
//     });

//     let nav = document.querySelector('header')
//     let sticky = nav.offsetHeight

//     // var formNewsletter = document.getElementById('mc-embedded-subscribe-form');
//     // if (formNewsletter != null) {
//     //     formNewsletter.addEventListener('submit', function (event) {
//     //         var result = document.getElementById('result_news');
//     //         result.style.display = 'block';
//     //         formNewsletter.style.display = 'none';
//     //         result.innerHTML = '<strong>Success!</strong> Merci pour votre inscription.';

//     //     }
//     //     );
//     // }


//     window.onscroll = () => {

//         if (window.pageYOffset > sticky ) {
//             nav.classList.add('sticky')
//             nav.classList.remove('default')
//         }else{
//             nav.classList.remove('sticky')
//             nav.classList.add('default')
//         }

//         let topWindow = window.scrollY;
//         topWindow = topWindow * 3;
//         let windowHeight = window.innerHeight;
//         let position = topWindow / windowHeight;
//         position = 1 - position;
//         document.querySelector('.mouse').style.opacity = position;
//     }

//     document.body.addEventListener('touchmove', mobilScroll);

//     function mobilScroll() {
//         if (window.pageYOffset > sticky ) {
//             nav.classList.add('sticky')
//             nav.classList.remove('default')
//         }else{
//             nav.classList.remove('sticky')
//             nav.classList.add('default')
//         }

//         let topWindow = window.scrollY;
//         topWindow = topWindow * 3;
//         let windowHeight = window.innerHeight;
//         let position = topWindow / windowHeight;
//         position = 1 - position;
//         document.querySelector('.mouse').style.opacity = position;
//     }
// }

// if (cross != null) {
//     cross.addEventListener('click', () => {
//         if (modalForm.style.display = "flex") {
//             modalForm.style.display = "none"
//         }
//     })
// }

// if (cross != null) {
//     btnEnquete.addEventListener('click', () => {
//         if (modalForm.style.display = "none") {
//             modalForm.style.display = "flex"
//         }
//     })
// }






