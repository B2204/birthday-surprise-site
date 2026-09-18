document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('introScreen');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const musicToggle = document.getElementById('musicToggle');
  const audio = document.getElementById('birthdayAudio');
  const surpriseBtn = document.getElementById('finalSurpriseBtn');
  const surpriseMessage = document.getElementById('surpriseMessage');
  const galleryButtons = document.querySelectorAll('.gallery-button');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.querySelector('.lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  openSurpriseBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const imageSrc = button.dataset.image;
      const imageCaption = button.dataset.caption || 'A beautiful memory';

      lightboxImage.src = imageSrc;
      lightboxImage.alt = imageCaption;
      lightboxCaption.textContent = imageCaption;
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
  };

  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });

  const setMusicState = (isPlaying) => {
    musicToggle.classList.toggle('is-playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.querySelector('.music-label').textContent = isPlaying ? 'Playing' : 'Music';
  };

  musicToggle.addEventListener('click', async () => {
    if (!audio.src) {
      return;
    }

    const isPlaying = !audio.paused;

    if (isPlaying) {
      audio.pause();
      setMusicState(false);
      return;
    }

    try {
      await audio.play();
      setMusicState(true);
    } catch (error) {
      console.warn('Audio playback was blocked:', error);
      setMusicState(false);
    }
  });

  const createBurst = (count, type = 'confetti') => {
    const container = document.getElementById('confettiLayer');
    const palette = ['#ff5f8f', '#ffb347', '#ffd166', '#ff9fb8', '#d8c0ff', '#ffffff'];

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('span');
      const xOffset = (Math.random() - 0.5) * 260;
      const rotation = (Math.random() - 0.5) * 720;

      piece.style.left = `${50 + (Math.random() - 0.5) * 12}%`;
      piece.style.setProperty('--x', `${xOffset}px`);
      piece.style.setProperty('--r', `${rotation}deg`);
      piece.style.background = palette[Math.floor(Math.random() * palette.length)];

      if (type === 'heart') {
        piece.className = 'heart-piece';
        piece.textContent = ['❤', '✨', '💖'][Math.floor(Math.random() * 3)];
        piece.style.fontSize = `${Math.random() * 1.4 + 1.1}rem`;
      } else {
        piece.className = 'confetti-piece';
        piece.style.width = `${Math.random() * 0.8 + 0.4}rem`;
        piece.style.height = `${Math.random() * 1.2 + 0.9}rem`;
      }

      container.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, 3400);
    }
  };

  surpriseBtn.addEventListener('click', () => {
    createBurst(110, 'confetti');
    createBurst(30, 'heart');
    surpriseMessage.classList.add('visible');
    surpriseBtn.textContent = 'Made You Smile ✨';
    surpriseBtn.disabled = true;
    surpriseBtn.style.opacity = '0.9';
  });

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    surpriseMessage.classList.add('visible');
  }
});
