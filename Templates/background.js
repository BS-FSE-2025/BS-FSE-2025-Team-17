
const images = [
    'Templates/Photos/photo1.jpg',
    'Templates/Photos/1.jpg', 
    'Templates/Photos/2.jpg',
    'Templates/Photos/3.jpg',
    'Templates/Photos/4.jpg'
];


const mainElement = document.querySelector('main');


let currentIndex = 0;


function changeBackground() {
    mainElement.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length; 
}


setInterval(changeBackground, 4000);


changeBackground();
