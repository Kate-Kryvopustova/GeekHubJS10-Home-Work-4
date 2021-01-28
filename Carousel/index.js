const slider = document.getElementById('slider');
const sliderItems = document.getElementById('items');
const prevSlide = document.getElementById('previousSlide');
const nextSlide = document.getElementById('nextSlide');
const dots = document.querySelectorAll('.slider__dots--dot');

const threshold = 100;
let posTouchStart = 0;
let posTouchMove = 0;
let posInitial;
let posFinal;

slide(sliderItems);

function slide(items) {
  const slides = items.getElementsByClassName('slide');
  const slidesLength = slides.length;
  const slideSize = items.getElementsByClassName('slide')[0].offsetWidth;
  const firstSlide = slides[0];
  const lastSlide = slides[slidesLength - 1];
  const cloneFirstSlide = firstSlide.cloneNode(true);
  const cloneLastSlide = lastSlide.cloneNode(true);

  let indexSlide = 0;
  let allowShiftSlide = true;

  // Clone first and last slide
  items.appendChild(cloneFirstSlide);
  items.insertBefore(cloneLastSlide, firstSlide);

  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prevSlide.addEventListener('click', function () { shiftSlide(-1) });
  nextSlide.addEventListener('click', function () { shiftSlide(1) });

  // Transition events
  items.addEventListener('transitionend', checkIndex);

  addActiveDots();

  // Find out the starting position
  function dragStart(e) {
    if (!allowShiftSlide) return;

    e.preventDefault();

    posInitial = items.offsetLeft;

    if (e.type === 'touchstart') {
      posTouchStart = e.touches[0].clientX;
    } else {
      posTouchStart = e.clientX;

      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  // Get the end positions of the movement
  function dragAction(e) {

    if (e.type === 'touchmove') {
      posTouchMove = posTouchStart - e.touches[0].clientX;
      posTouchStart = e.touches[0].clientX;
    } else {
      posTouchMove = posTouchStart - e.clientX;
      posTouchStart = e.clientX;
    }
    
    items.style.left = (items.offsetLeft - posTouchMove) + "px";
  }

  // Compare the difference between the start and end position
  function dragEnd() {
    posFinal = items.offsetLeft;

    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  // Moves the slides to the next or to the previous slide.
  function shiftSlide(direction, action) {
    items.classList.add('shifting');

    if (allowShiftSlide) {
      if (!action) { posInitial = items.offsetLeft; }

      if (direction === 1) {
        items.style.left = (posInitial - slideSize) + "px";
        indexSlide++;
      } else if (direction === -1) {
        items.style.left = (posInitial + slideSize) + "px";
        indexSlide--;
      }

    };

    allowShiftSlide = false;
  }

  function checkIndex() {
    items.classList.remove('shifting');

    if (indexSlide === -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      indexSlide = slidesLength - 1;
    }

    if (indexSlide === slidesLength) {
      items.style.left = -slideSize + "px";
      indexSlide = 0;
    }

    clearActiveDots();
    addActiveDots();

    allowShiftSlide = true;
  }

  function addActiveDots() {
    dots.forEach((dot, indexDot) => {
      if(indexDot === indexSlide) {
        dot.classList.add('active');
      }
    })
  }

  function clearActiveDots() {
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove('active');
    }
  };

  dots.forEach((dot, indexDot) => {
    dot.addEventListener('click', () => {

      if (indexDot !== indexSlide) {
        items.style.left = -((1 + indexDot) * slideSize) + 'px';
        indexSlide = indexDot;
      } else {
        items.style.left = -slideSize + 'px';
        indexSlide   = 0;
      }

      clearActiveDots();
      dot.classList.add('active');
    })
  })
}