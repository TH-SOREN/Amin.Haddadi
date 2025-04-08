const langFaSwitch = document.getElementById('lang-fa');
const langEnSwitch = document.getElementById('lang-en');
let isPersian = true;

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    if (lang === 'en') {
        toggleLanguage(); 
    }
});

langFaSwitch.addEventListener('click', () => {
    if (isPersian) {
        toggleLanguage(); // تغییر به انگلیسی
        window.history.pushState({}, document.title, '?lang=en'); // اضافه کردن ?lang=en به URL
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

langEnSwitch.addEventListener('click', () => {
    if (!isPersian) {
        toggleLanguage(); // تغییر به فارسی
        window.history.pushState({}, document.title, window.location.pathname); // حذف پارامتر lang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

function toggleLanguage() {
    const faElements = document.querySelectorAll('.lang-fa');
    const enElements = document.querySelectorAll('.lang-en');
    if (isPersian) {
        faElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = 'block');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        document.title = 'Amin Haddadi';
    } else {
        faElements.forEach(el => el.style.display = 'block');
        enElements.forEach(el => el.style.display = 'none');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'fa');
        document.title = 'امین حدادی';
    }
    isPersian = !isPersian;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        const navUl = document.querySelector('nav ul');
        if (window.innerWidth <= 768 && navUl.classList.contains('active')) {
            navUl.classList.remove('opening');
            navUl.classList.add('closing');
            setTimeout(() => {
                navUl.classList.remove('active', 'closing');
                navUl.style.display = 'none';
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 400);
        } else {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    if (navUl.classList.contains('active')) {
        navUl.classList.remove('opening');
        navUl.classList.add('closing');
        setTimeout(() => {
            navUl.classList.remove('active', 'closing');
            navUl.style.display = 'none';
        }, 400);
    } else {
        navUl.style.display = 'flex';
        navUl.classList.add('active', 'opening');
        setTimeout(() => {
            navUl.classList.remove('opening');
        }, 400);
    }
});

const form = document.getElementById('contact-form');
const notification = document.getElementById('notification');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isPersian) {
        showNotification('Contact feature is only available in Persian');
        return;
    }
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://formspree.io/f/xldjodaq', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            showNotification('پیام با موفقیت ارسال شد!');
            form.reset();
        } else {
            showNotification('ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.');
        }
    } catch (error) {
        showNotification('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
});

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
}
let isMediaPlaying = false;
let currentMedia = null;

function setupSlider(gridSelector, cardSelector, dotsSelector) {
    const grid = document.querySelector(gridSelector);
    const cards = document.querySelectorAll(`${gridSelector} ${cardSelector}`);
    const dots = document.querySelectorAll(`${dotsSelector} .dot`);
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let sliderInterval;
    let isAnimating = false;

    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            @keyframes slideFadeIn {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideFadeOut {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(-100%); opacity: 0; }
            }
            @keyframes slideFadeInReverse {
                0% { transform: translateX(-100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideFadeOutReverse {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
            .slide-fade-in { animation: slideFadeIn 0.5s ease-out forwards; }
            .slide-fade-out { animation: slideFadeOut 0.5s ease-out forwards; }
            .slide-fade-in-reverse { animation: slideFadeInReverse 0.5s ease-out forwards; }
            .slide-fade-out-reverse { animation: slideFadeOutReverse 0.5s ease-out forwards; }
            .slider-nav {
                display: flex;
                justify-content: space-between;
                position: absolute;
                width: 100%;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                z-index: 100;
                pointer-events: none;
                padding: 0 10px;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            .slider-container:hover .slider-nav {
                opacity: 1;
            }
            .slider-nav button {
                background: rgba(255, 255, 255, 0.95);
                color: #1A1A1A;
                border: 1px solid #E0E0E0;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                pointer-events: auto;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            }
            .slider-nav button:hover {
                background: #1A1A1A;
                color: #FFFFFF;
                border-color: #1A1A1A;
                transform: scale(1.15);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            ${gridSelector} { position: relative; }
        }
    `;
    document.head.appendChild(style);

    const sliderNav = document.createElement('div');
    sliderNav.className = 'slider-nav';
    sliderNav.innerHTML = `
        <button class="prev-btn"><i class="fas fa-chevron-right"></i></button>
        <button class="next-btn"><i class="fas fa-chevron-left"></i></button>
    `;
    grid.parentNode.classList.add('slider-container');
    grid.parentNode.style.position = 'relative';
    grid.parentNode.insertBefore(sliderNav, grid.nextSibling);

    const prevBtn = sliderNav.querySelector('.prev-btn');
    const nextBtn = sliderNav.querySelector('.next-btn');

    const allMedia = document.querySelectorAll('audio, video');

    allMedia.forEach(media => {
        media.addEventListener('play', () => {
            if (currentMedia && currentMedia !== media && !currentMedia.paused) {
                currentMedia.pause();
            }
            currentMedia = media;
            isMediaPlaying = true;
            clearInterval(sliderInterval);
        });

        media.addEventListener('pause', () => {
            if (currentMedia === media) {
                isMediaPlaying = false;
                startSlider();
            }
        });

        media.addEventListener('ended', () => {
            if (currentMedia === media) {
                isMediaPlaying = false;
                startSlider();
            }
        });
    });

    if (gridSelector === '.poems-grid') {
        const audioElements = document.querySelectorAll('#poems .poem-card audio');
        const videoElements = document.querySelectorAll('#poems .poem-card video');

        audioElements.forEach(audio => {
            audio.addEventListener('play', () => {
                isMediaPlaying = true;
                clearInterval(sliderInterval);
            });
            audio.addEventListener('pause', () => {
                isMediaPlaying = false;
                startSlider();
            });
            audio.addEventListener('ended', () => {
                isMediaPlaying = false;
                startSlider();
            });
        });

        videoElements.forEach(video => {
            video.addEventListener('play', () => {
                isMediaPlaying = true;
                clearInterval(sliderInterval);
                video.requestFullscreen();
            });
            video.addEventListener('pause', () => {
                isMediaPlaying = false;
                startSlider();
            });
            video.addEventListener('ended', () => {
                isMediaPlaying = false;
                startSlider();
            });
        });
    }

    function updateSlider(newIndex, direction = 'next') {
        if (isAnimating || window.innerWidth > 768) return;
        isAnimating = true;

        const currentCard = cards[currentIndex];
        const newCard = cards[newIndex];

        dots.forEach((dot, i) => dot.classList.toggle('active', i === newIndex));

        currentCard.classList.remove('active');
        currentCard.classList.add(direction === 'next' ? 'slide-fade-out' : 'slide-fade-out-reverse');

        setTimeout(() => {
            currentCard.style.display = 'none';
            currentCard.classList.remove(direction === 'next' ? 'slide-fade-out' : 'slide-fade-out-reverse');
            newCard.style.display = 'flex';
            newCard.classList.add('active');
            newCard.classList.add(direction === 'next' ? 'slide-fade-in' : 'slide-fade-in-reverse');
            setTimeout(() => {
                newCard.classList.remove(direction === 'next' ? 'slide-fade-in' : 'slide-fade-in-reverse');
                currentIndex = newIndex;
                isAnimating = false;
            }, 500);
        }, 500);
    }

    function startSlider() {
        if (window.innerWidth <= 768) {
            clearInterval(sliderInterval);
            cards.forEach((card, i) => {
                if (i === currentIndex) {
                    card.style.display = 'flex';
                    card.classList.add('active');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
            if (isMediaPlaying) return;
            sliderInterval = setInterval(() => {
                if (!isAnimating && !isMediaPlaying) {
                    const nextIndex = (currentIndex + 1) % cards.length;
                    updateSlider(nextIndex, 'next');
                }
            }, 6000);
        } else {
            clearInterval(sliderInterval);
            cards.forEach(card => card.style.display = 'flex');
        }
    }

    function goToNext() {
        if (!isAnimating && window.innerWidth <= 768) {
            clearInterval(sliderInterval);
            const nextIndex = (currentIndex + 1) % cards.length;
            updateSlider(nextIndex, 'next');
            setTimeout(startSlider, 7000);
        }
    }

    function goToPrev() {
        if (!isAnimating && window.innerWidth <= 768) {
            clearInterval(sliderInterval);
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlider(prevIndex, 'prev');
            setTimeout(startSlider, 7000);
        }
    }

    startSlider();
    window.addEventListener('resize', startSlider);

    grid.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768) {
            touchStartX = e.changedTouches[0].screenX;
        }
    }, { passive: true });

    grid.addEventListener('touchend', (e) => {
        if (window.innerWidth <= 768) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        if (window.innerWidth <= 768) {
            if (swipeDistance > 50) goToNext();
            else if (swipeDistance < -50) goToPrev();
        }
    }

    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (window.innerWidth <= 768 && !isAnimating) {
                clearInterval(sliderInterval);
                const newIndex = parseInt(dot.getAttribute('data-index'));
                const direction = newIndex > currentIndex ? 'next' : 'prev';
                updateSlider(newIndex, direction);
                setTimeout(startSlider, 7000);
            }
        });
    });
}

setupSlider('.books-grid', '.book-card', '#books .dots');
setupSlider('.poems-grid', '.poem-card', '#poems .dots');
setupSlider('.notes-grid', '.note-card', '#notes .dots');
setupSlider('.gallery-grid', '.gallery-card', '#gallery .dots');

document.querySelectorAll('#gallery .gallery-card img').forEach(img => {
    img.addEventListener('click', function() {
        window.open(this.src, '_blank');
    });
});