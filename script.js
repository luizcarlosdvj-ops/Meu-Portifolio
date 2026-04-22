/* ---------- 1. ANO DINÂMICO NO FOOTER ---------- */
document.getElementById('year').textContent = new Date().getFullYear();


/* ---------- 2. NAVBAR: sombra ao rolar ---------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.style.borderBottomColor = '#1f1f1f';
  } else {
    navbar.style.borderBottomColor = '#232323';
  }
});


/* ---------- 3. MENU MOBILE ---------- */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Fecha o menu ao clicar em um link
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


/* ---------- 4. SCROLL SUAVE (para navegadores antigos) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ---------- 5. ANIMAÇÃO FADE-IN COM INTERSECTION OBSERVER ---------- */
/*
  Elementos com classe .fade-in aparecem suavemente
  conforme o usuário rola a página.
*/
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Delay escalonado para cards em sequência
        const delay = entry.target.dataset.delay || (index % 6) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target); // Anima só uma vez
      }
    });
  },
  {
    threshold: 0.12,      // Ativa quando 12% do elemento está visível
    rootMargin: '0px 0px -40px 0px', // Pequena antecipação
  }
);

fadeElements.forEach((el, i) => {
  el.dataset.delay = i * 80; // Delay baseado na posição
  observer.observe(el);
});


/* ---------- 6. EFEITO DE DIGITAÇÃO NO TERMINAL ---------- */
/*
  Re-escreve as linhas do terminal com efeito typewriter
  após um breve delay para chamar atenção.
*/
function typeWriter(element, text, speed = 60, onDone) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (typeof onDone === 'function') onDone();
    }
  }, speed);
}

// Só roda quando o terminal entra na tela
const terminal = document.querySelector('.hero-terminal');
if (terminal) {
  const termObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        // Pequeno delay antes de animar
        setTimeout(() => {
          const outputs = terminal.querySelectorAll('.t-out');
          outputs.forEach((el, i) => {
            const originalText = el.textContent;
            el.textContent = '';
            setTimeout(() => {
              typeWriter(el, originalText, 40);
            }, i * 700);
          });
        }, 600);
        termObserver.unobserve(terminal);
      }
    },
    { threshold: 0.5 }
  );
  termObserver.observe(terminal);
}


/* ---------- 7. DESTAQUE DO LINK ATIVO NA NAVBAR ---------- */
/*
  Marca o link da seção que o usuário está visualizando.
*/
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -40% 0px', // Ativa no centro da viewport
  }
);

sections.forEach(s => sectionObserver.observe(s));


/* ---------- 8. EFEITO GLITCH NO NOME DO HERO ---------- */
/*
  Sutil tremida no nome ao passar o mouse.
*/
const nameEl = document.querySelector('.name-highlight');
if (nameEl) {
  nameEl.addEventListener('mouseenter', () => {
    nameEl.style.transition = 'letter-spacing 0.15s ease';
    nameEl.style.letterSpacing = '-1px';
    setTimeout(() => {
      nameEl.style.letterSpacing = '-2px';
    }, 80);
    setTimeout(() => {
      nameEl.style.letterSpacing = '';
    }, 200);
  });
}


/* ---------- 9. CONTADOR ANIMADO NOS STATS ---------- */
/*
  Os números no card "Sobre mim" contam do zero até o valor alvo.
*/
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const from  = 0;

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * eased)
      .toString()
      .padStart(2, '0');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.textContent, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

statNums.forEach(el => counterObserver.observe(el));
