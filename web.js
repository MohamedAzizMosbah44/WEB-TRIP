//reglage de menu
var menu =document.querySelector(".menu");
var menu_toggle =document.querySelector(".menu-toggle");
menu_toggle.onclick = function(){
	menu_toggle.classList.toggle('active');
	menu.classList.toggle('responsive')
}


//dark mode
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    document.body.setAttribute('data-theme', document.body.classList.contains('dark') ? 'dark' : 'light');

    // Mettre à jour le texte du bouton
    this.textContent = document.body.classList.contains('dark') ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre';
});



//partie animation
document.addEventListener('DOMContentLoaded', function() {
    gsap.to('header', {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power4.out',
        delay: 0.5
    });
	
    gsap.to('nav a', {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power4.out',
        delay: 1
    });
	gsap.to('.presentation', {
        duration: 1,
        opacity: 1,
        x: 0,
        ease: 'power4.out',
        delay: 1
    });
	gsap.to('section', {
        duration: 1,
        opacity: 1,
        x: 0,
        ease: 'power4.out',
        delay: 1.5
    });
	gsap.to('.container', {
        duration: 1,
        opacity: 1,
        x: 0,
        ease: 'power4.out',
        delay: 2
    });
});


// Charger la date depuis le fichier PHP
fetch('date.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('dynamic-content').innerHTML = data;
        });