let cross = document.querySelector('.cross-form')
let modalForm = document.querySelector('.modal-form')
let btnEnquete = document.querySelector('.btn-enquete')

window.onload = function () {
    var formNewsletter = document.getElementById('mc-embedded-subscribe-form');
    formNewsletter.addEventListener('submit', function (event) {
        var result = document.getElementById('result_news');
        result.style.display = 'block';
        formNewsletter.style.display = 'none';
        result.innerHTML = '<strong>Success!</strong> Merci pour votre inscription.';

    }
    );
}

cross.addEventListener('click', () => {
    if (modalForm.style.display = "flex") {
        modalForm.style.display = "none"
    }
    console.log('yo')
})

btnEnquete.addEventListener('click', () => {
    if (modalForm.style.display = "none") {
        modalForm.style.display = "flex"
    }
    console.log('yo')
})


