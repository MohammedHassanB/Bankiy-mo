'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo= document.querySelector('.btn--scroll-to');
const btnLeft=document.querySelector('.slider__btn--left');
const btnRight=document.querySelector('.slider__btn--right');


const sec1=document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs=document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelector('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');
const header=document.querySelector('.header');
const allSections=document.querySelectorAll('.section');
const lazyImages=document.querySelectorAll('img[data-src]');
const slides=document.querySelectorAll('.slide');
const dotContainer=document.querySelector('.dots');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//navigation hover handeling
const hoverHandel=function(e,opacity)
{
 if(e.target.classList.contains('nav__link'))
  {
    const link=e.target;
    const siblings=link.closest('.nav').querySelectorAll('.nav__link');
    const logo=link.closest('.nav').querySelector('img');

    siblings.forEach(el=>{
       if(el!==link)
        el.style.opacity=this;   
    });
    logo.style.opacity=this;
  }
};
//navigation hover handeling
nav.addEventListener('mouseover',hoverHandel.bind(0.5));
nav.addEventListener('mouseout',hoverHandel.bind(1));


//smooth scrolling
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click',function(e)
{
  /*const sec1coor=sec1.getBoundingClientRect();
  window.scrollTo({
    left:sec1coor.left,
    top:sec1coor.top+pageYOffset,
    behavior:'smooth',
  })*/
 sec1.scrollIntoView({behavior:'smooth'});
});

//tabbed component

tabsContainer.addEventListener('click',function(e){
  const clicked=e.target.closest('.operations__tab');

  if(!clicked)return;
  //remove active clases
  tabs.forEach(tab=>tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(con=>con.classList.remove('operations__content--active'));

  //activate tab

  clicked.classList.add('operations__tab--active');

  //activate content 

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//sticky nav bar
/*
const sec1coor=sec1.getBoundingClientRect();
window.addEventListener('scroll',function()
{
 if(window.scrollY>sec1coor.top)
  nav.classList.add('sticky');
else
nav.classList.remove('sticky');
});
*/
//upgraded sticky nav bar
const navHeight=nav.getBoundingClientRect().height;
const sticky=entries=>{
const [entry]=entries;
if(!entry.isIntersecting)

    nav.classList.add('sticky');
  
  
else
nav.classList.remove('sticky');
};
const headerobserver=new IntersectionObserver(sticky,{
  root:null,
  threshold:0,
  rootMargin:`${-navHeight}px`,
});

headerobserver.observe(header);

//reveal sections
const revealSection=function(entries,observer)
{
const [entry]=entries;
if(!entry.isIntersecting)return;
entry.target.classList.remove('section--hidden');
observer.unobserve(entry.target);
};
const sectionObserver=new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,
});

//add hidden section dynamicly
allSections.forEach(function(section)
{
  sectionObserver.observe(section)
 // section.classList.add('section--hidden');
});


//lazy loading images
 const loadingImg=function(entries,observe)
 {
const [entry]=entries;
if(!entry.isIntersecting)return;
//replace src with data-src
entry.target.src=entry.target.dataset.src;
entry.target.addEventListener('load',function()
{
  entry.target.classList.remove('lazy-img');
});
observe.unobserve(entry.target);
 };
const imgObserver=new IntersectionObserver(loadingImg,
  {
    root:null,
    threshold:0,
    rootMargin:'400px',
  }
);

lazyImages.forEach(img=>imgObserver.observe(img));

//implement slider
const slider=function()
{
let curSlide=0;
const maxSlide=slides.length-1;

const goToSlide=function(slide)
{
slides.forEach((s,i)=>{
  s.style.transform=`translateX(${100*(i-slide)}%)`
});
};


//next slide
const nextSlide=function()
{
  if(curSlide===maxSlide)
    curSlide=0;
  else
  curSlide++;
goToSlide(curSlide);
activateDots(curSlide);
};

//previous slide

const prevSlide=function()
{
  if(curSlide===0)
    curSlide=maxSlide;
  else
curSlide--;
goToSlide(curSlide);
activateDots(curSlide);
};

btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);
document.addEventListener('keydown',function(e)
{
e.key==='ArrowRight'&&nextSlide();
e.key==='ArrowLeft'&&prevSlide();
});

//create dots and make it control the slider
const createDots=function()
{
slides.forEach(function(_,i){
dotContainer.insertAdjacentHTML("beforeend",`
  <button class="dots__dot" data-slide="${i}"></button>`)
});
};

const activateDots=function(slide)
{
document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

dotContainer.addEventListener('click',function(e)
{
  if(e.target.classList.contains('dots__dot'))
    {
      const {slide}=e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
});
const Init=function()
{
  goToSlide(0);
  createDots();
  activateDots(0);
};
Init();
}
slider();
