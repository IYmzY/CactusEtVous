let cross = document.querySelector('.cross-form')
let modalForm = document.querySelector('.modal-form')
let btnEnquete = document.querySelector('.btn-enquete')


window.onload = function () {
    // menu mobil
    var navbar = document.querySelector('.navbar')
    var openMenu = document.querySelector('.burger');
    var closeMenu = document.querySelector('.close-navbar');
    openMenu.addEventListener('click', function () {
        this.style.display = 'none';
        navbar.style.display = 'flex';
        closeMenu.style.display = 'block';
    });
    closeMenu.addEventListener('click', function () {
        this.style.display = 'none';
        navbar.style.display = 'none';
        openMenu.style.display = 'block';
    });

    let nav = document.querySelector('header')
    let sticky = nav.offsetHeight

    var formNewsletter = document.getElementById('mc-embedded-subscribe-form');
    formNewsletter.addEventListener('submit', function (event) {
        var result = document.getElementById('result_news');
        result.style.display = 'block';
        formNewsletter.style.display = 'none';
        result.innerHTML = '<strong>Success!</strong> Merci pour votre inscription.';

    }
    );

    window.onscroll = () => {

        if (window.pageYOffset > sticky ) {
            nav.classList.add('sticky')
            nav.classList.remove('default')
        }else{
            nav.classList.remove('sticky')
            nav.classList.add('default')
        }

        let topWindow = window.scrollY;
        topWindow = topWindow * 3;
        let windowHeight = window.innerHeight;
        let position = topWindow / windowHeight;
        position = 1 - position;
        document.querySelector('.mouse').style.opacity = position;
    }

    $(document.body).on('touchmove', mobilScroll);

    function mobilScroll() {
        if (window.pageYOffset > sticky ) {
            nav.classList.add('sticky')
            nav.classList.remove('default')
        }else{
            nav.classList.remove('sticky')
            nav.classList.add('default')
        }

        let topWindow = window.scrollY;
        topWindow = topWindow * 3;
        let windowHeight = window.innerHeight;
        let position = topWindow / windowHeight;
        position = 1 - position;
        document.querySelector('.mouse').style.opacity = position;
    }
}

cross.addEventListener('click', () => {
    if (modalForm.style.display = "flex") {
        modalForm.style.display = "none"
    }
})

btnEnquete.addEventListener('click', () => {
    if (modalForm.style.display = "none") {
        modalForm.style.display = "flex"
    }
})


