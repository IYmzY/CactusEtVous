window.onload = function() {
   var formNewsletter = document.getElementById('mc-embedded-subscribe-form');
    formNewsletter.addEventListener('submit', function(event) {
        var result = document.getElementById('result_news');
        result.style.display = 'block';
        formNewsletter.style.display = 'none';
        result.innerHTML = '<strong>Success!</strong> Merci pour votre inscription.';
        
    }
    );
}