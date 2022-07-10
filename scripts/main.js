import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/main.scss'
import '../styles/flickity.min.css'




const colorScale = d3.scaleOrdinal(['green']);
const labelsTopOrientation = new Set(['Arles, Italie', 'Quito, Equateur ', 'Chichaoua, Maroc', 'Tour de la Sicile', 'Iquitos, Pérou', 'Val-Des-Près, France', 'Île de Sulawesi, Indonésie', 'Ormara, Pakistan']);

const elem = document.getElementById('testimony-globe');
const testimonyGlobe = Globe()
    .globeImageUrl('../images/imgContainers/globe-texture.png')
    .bumpImageUrl('../images/imgContainers/globe-bumpmap.png')
    .backgroundColor('rgba(0,0,0,0)')
    .width([500])
    .showGraticules(true)
    .showAtmosphere(false)
    .labelText('title')
    .labelSize(4)
    .labelDotRadius(2)
    .labelDotOrientation(d => labelsTopOrientation.has(d.title) ? 'top' : 'bottom')
    .labelColor(d => colorScale(d.title))
    .labelLabel(d => `
    <div class="testimony-content-container">
                    <h3>${d.title}</h3>
                    <div class=" testimony-content">
                        <p>${d.content}</p>
                        <img class="quote-up" src="./images/icon/quoteUp.svg">
                        <img class="quote-down" src="./images/icon/quoteDown.svg">
                    </div>
                    <span><a href="${d.url}">En savoir plus</a></span>
                </div>
      `)

    .onLabelClick(d => window.open(d.url, '_blank'))
    (elem)
    // .onLabelHover(onHoverLaber())
    ;

const onHoverLaber = async () => {
    await testimonyGlobe.pauseAnimation().then(() => {
        setTimeout(() => {
            testimonyGlobe.resumeAnimation()
        }, 2000)
    })
}


fetch('../globe-config/globe-testimony-info.json').then(r => r.json()).then(testimonies => {
    testimonyGlobe.labelsData(testimonies);
});
testimonyGlobe.resumeAnimation()
testimonyGlobe.controls().autoRotate = true;
testimonyGlobe.controls().autoRotateSpeed = 0.5;
testimonyGlobe.controls().enableZoom = false
testimonyGlobe.controls().minPolarAngle = Math.PI / 2
testimonyGlobe.controls().maxPolarAngle = Math.PI / 2







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






