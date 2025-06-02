let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-bx');
    navbar.classList.toggle('active');
}
window.onscroll = () => {
    menu.classList.remove('bx-bx');
    navbar.classList.remove('active');
}


var typed = new Typed('.multiple-text', {
    strings: ['Body Building', 'weight liffting','physical fitness','running','fat loss'],
    typeSpeed: 60,
    backspeed: 60,
    backdelay: 1000,
    loop: true,
  });