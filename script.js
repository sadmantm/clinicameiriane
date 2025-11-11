// #region CONFIGURAÇÕES GLOBAIS

const CONFIG = {
  animation: {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
    cardDelay: 100,
  },
  gallery: {
    inactivityTime: 10000,
    autoSlideTime: 5000,
    dragThreshold: 90,
  },
};

//#endregion

// #region INTERSECTION OBSERVERS - ANIMAÇÕES DE ENTRADA

// Observer para animações gerais de elementos
function initGeneralObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: CONFIG.animation.threshold,
      rootMargin: CONFIG.animation.rootMargin,
    }
  );

  document
    .querySelectorAll(
      ".section-title, .section-subtitle, .about-image, .about-text"
    )
    .forEach((el) => observer.observe(el));
}

// Observer para cards de procedimentos com animação escalonada
function initProcCardsObserver() {
  const procCards = document.querySelectorAll(".proc-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(procCards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * CONFIG.animation.cardDelay);
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  procCards.forEach((card) => observer.observe(card));
}

// Observer para animação de números nos cards
function initNumberAnimation() {
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          const numbers = document.querySelectorAll(".proc-number");
          numbers.forEach((num, index) => {
            setTimeout(() => {
              num.style.animation = "fadeInScale 0.6s ease-out forwards";
            }, index * 50);
          });
          hasAnimated = true;
        }
      });
    },
    { threshold: 0.3 }
  );

  const procSection = document.querySelector(".procedimentos");
  if (procSection) observer.observe(procSection);
}

// Injeta keyframes para animação de números
function injectNumberAnimationStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.5) rotate(-180deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }
  `;
  document.head.appendChild(style);
}

//#endregion

// #region SMOOTH SCROLL

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

//#endregion

// #region SNAKE STRIPE ANIMATION

function initSnakeStripe() {
  let ticking = false;
  const snakePath = document.querySelector(".snake-stripe");
  const snakeSvg = document.querySelector(".snake-path");

  if (!snakePath || !snakeSvg) return;

  function getScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrolled / maxScroll, 1);
  }

  function updateSnake() {
    const scrolled = window.pageYOffset;
    const progress = getScrollProgress();

    // Parâmetros da cobra
    const amplitude = 150;
    const frequency = 0.01;
    const pointSpacing = 1;
    const maxSnakeHeight = window.innerHeight;
    const currentSnakeHeight = progress * maxSnakeHeight;

    // Gerar pontos da cobra
    const points = [];
    const numPoints = Math.floor(currentSnakeHeight / pointSpacing) + 2;

    for (let i = 0; i <= numPoints; i++) {
      const y = i * pointSpacing;
      if (y > currentSnakeHeight) break;

      const zigzag = Math.sin(y * frequency) * amplitude;
      const x = window.innerWidth / 2 + zigzag;
      points.push({ x, y });
    }

    // Criar path suave
    if (points.length >= 2) {
      let pathData = `M ${points[0].x} ${points[0].y}`;

      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        const cpX = (prevPoint.x + currentPoint.x) / 2;
        const cpY = (prevPoint.y + currentPoint.y) / 2;

        if (i === 1) {
          pathData += ` L ${cpX} ${cpY}`;
        }

        pathData += ` Q ${currentPoint.x} ${currentPoint.y}, `;

        if (i < points.length - 1) {
          const nextPoint = points[i + 1];
          const nextCpX = (currentPoint.x + nextPoint.x) / 2;
          const nextCpY = (currentPoint.y + nextPoint.y) / 2;
          pathData += `${nextCpX} ${nextCpY}`;
        } else {
          pathData += `${currentPoint.x} ${currentPoint.y}`;
        }
      }

      snakePath.setAttribute("d", pathData);
    }

    // Parallax no hero
    const heroContent = document.querySelector(".hero-content");
    if (heroContent && scrolled < window.innerHeight) {
      const heroProgress = Math.min(scrolled / window.innerHeight, 1);
      heroContent.style.transform = `translateY(${heroProgress * 50}px)`;
      heroContent.style.opacity = 1 - heroProgress * 0.7;
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateSnake);
      ticking = true;
    }
  });

  window.addEventListener("resize", () => {
    window.dispatchEvent(new Event("scroll"));
  });

  // Inicializar
  window.dispatchEvent(new Event("scroll"));
}

//#endregion

// #region BOTÕES - EFEITOS HOVER

function initButtonEffects() {
  const buttons = document.querySelectorAll(".cta-button, .whatsapp-btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
}

//#endregion

// #region WHATSAPP BUTTON - ANIMAÇÃO DE TEXTO

function initWhatsappAnimation() {
  const whatsappBtn = document.querySelector(".whatsapp-btn");
  const whatsappTextEl = document.querySelector(".whatsapp-text");

  if (!whatsappBtn || !whatsappTextEl) return;

  // Criar spans por caractere
  function createSpans() {
    const text = whatsappTextEl.textContent || "";
    whatsappTextEl.textContent = "";

    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${i * 0.05}s`;
      whatsappTextEl.appendChild(span);
    });
  }

  createSpans();

  // Observer para re-trigger
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          whatsappTextEl.classList.remove("animate");
          void whatsappTextEl.offsetWidth; // Force reflow
          whatsappTextEl.classList.add("animate");
        } else {
          whatsappTextEl.classList.remove("animate");
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(whatsappBtn);
}

//#endregion

// #region GALERIA - SISTEMA DE SLIDES

function initGallery() {
  const slider = document.querySelector(".galeria-slider");
  const track = document.querySelector(".galeria-track");
  const items = document.querySelectorAll(".galeria-item");
  const dots = document.querySelectorAll(".galeria-dot");

  if (!slider || !track || items.length === 0) return;

  let currentSlide = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let dragDistance = 0;
  let autoSlideInterval = null;
  let inactivityTimeout = null;

  // Funções auxiliares
  function getSliderWidth() {
    return slider.offsetWidth;
  }

  function getPointerX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  // Navegação de slides
  function goToSlide(index) {
    // Remove o Math.max e Math.min para permitir loop infinito
    if (index >= items.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = items.length - 1;
    } else {
      currentSlide = index;
    }

    currentTranslate = -currentSlide * getSliderWidth();
    prevTranslate = currentTranslate;

    track.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(${currentTranslate}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  // Sistema de slide automático
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % items.length;
      goToSlide(nextSlide);
    }, CONFIG.gallery.autoSlideTime);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  function handleUserInteraction() {
    stopAutoSlide();

    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    inactivityTimeout = setTimeout(() => {
      startAutoSlide();
    }, CONFIG.gallery.inactivityTime);
  }

  // Sistema de arraste
  function handleDragStart(e) {
    if (e.type === "mousedown") e.preventDefault();

    isDragging = true;
    dragDistance = 0;
    startPos = getPointerX(e);
    track.style.transition = "none";
    slider.classList.add("grabbing");
    handleUserInteraction();
  }

  function handleDragMove(e) {
    if (!isDragging) return;

    const currentPosition = getPointerX(e);
    dragDistance = currentPosition - startPos;
    currentTranslate = prevTranslate + dragDistance;

    const maxTranslate = 0;
    const minTranslate = -(items.length - 1) * getSliderWidth();
    currentTranslate = Math.max(
      minTranslate,
      Math.min(maxTranslate, currentTranslate)
    );

    track.style.transform = `translateX(${currentTranslate}px)`;

    if (Math.abs(dragDistance) > 10) {
      e.preventDefault();
      handleUserInteraction();
    }
  }

  function handleDragEnd() {
    if (!isDragging) return;

    isDragging = false;
    slider.classList.remove("grabbing");

    const movedBy = dragDistance;
    const threshold = CONFIG.gallery.dragThreshold;

    if (Math.abs(movedBy) > threshold) {
      if (movedBy < 0) {
        // Arrasta para esquerda - próximo slide (com loop)
        currentSlide = (currentSlide + 1) % items.length;
      } else if (movedBy > 0) {
        // Arrasta para direita - slide anterior (com loop)
        currentSlide = (currentSlide - 1 + items.length) % items.length;
      }
    }

    goToSlide(currentSlide);
    handleUserInteraction();
  }

  // Event listeners - Mouse
  slider.addEventListener("mousedown", handleDragStart);
  slider.addEventListener("mousemove", handleDragMove);
  slider.addEventListener("mouseup", handleDragEnd);
  slider.addEventListener("mouseleave", handleDragEnd);

  // Event listeners - Touch
  slider.addEventListener("touchstart", handleDragStart, { passive: true });
  slider.addEventListener("touchmove", handleDragMove, { passive: false });
  slider.addEventListener("touchend", handleDragEnd);

  // Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const slideIndex = parseInt(dot.dataset.slide);
      goToSlide(slideIndex);
      handleUserInteraction();
    });
  });

  // Sistema de revelação circular
  initRevealSystem(items, handleUserInteraction);

  // Hover (apenas desktop)
  if (window.matchMedia("(hover: hover)").matches) {
    slider.addEventListener("mouseenter", handleUserInteraction);
  }

  // Resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => goToSlide(currentSlide), 100);
  });

  // Inicializar
  goToSlide(0);
  startAutoSlide();
}

// Sistema de revelação circular por clique/tap
function initRevealSystem(items, onInteraction) {
  items.forEach((item) => {
    let tapStartTime = 0;
    let tapStartPos = { x: 0, y: 0 };
    let dragDistance = 0;

    function handleTapStart(e) {
      tapStartTime = Date.now();
      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      const clientY = e.type.includes("mouse")
        ? e.clientY
        : e.touches[0].clientY;
      tapStartPos = { x: clientX, y: clientY };
    }

    function handleTapEnd(e) {
      const tapDuration = Date.now() - tapStartTime;
      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.changedTouches[0].clientX;
      const clientY = e.type.includes("mouse")
        ? e.clientY
        : e.changedTouches[0].clientY;

      const distance = Math.sqrt(
        Math.pow(clientX - tapStartPos.x, 2) +
          Math.pow(clientY - tapStartPos.y, 2)
      );

      // Considera como tap se foi rápido e não moveu muito
      if (tapDuration < 300 && distance < 10 && Math.abs(dragDistance) < 10) {
        e.preventDefault();
        revealImage(e, item);
        onInteraction();
      }
    }

    item.addEventListener("mousedown", handleTapStart);
    item.addEventListener("mouseup", handleTapEnd);
    item.addEventListener("touchstart", handleTapStart, { passive: true });
    item.addEventListener("touchend", handleTapEnd);
  });

  function revealImage(e, item) {
    const rect = item.getBoundingClientRect();
    const clientX = e.type.includes("mouse")
      ? e.clientX
      : e.changedTouches[0].clientX;
    const clientY = e.type.includes("mouse")
      ? e.clientY
      : e.changedTouches[0].clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const afterContainer = item.querySelector(".galeria-img-after-container");
    const isRevealed = afterContainer.classList.contains("revealed");

    item.style.setProperty("--click-x", `${x}%`);
    item.style.setProperty("--click-y", `${y}%`);

    item.classList.add("clicking");
    setTimeout(() => item.classList.remove("clicking"), 800);

    if (isRevealed) {
      afterContainer.classList.remove("revealed");
      setTimeout(() => afterContainer.classList.remove("revealing"), 800);
    } else {
      afterContainer.classList.add("revealing");
      setTimeout(() => afterContainer.classList.add("revealed"), 10);
    }
  }
}

//#endregion

// #region FLIP CARDS - SISTEMA DE PROCEDIMENTOS

function initFlipCards() {
  const procCards = document.querySelectorAll(".proc-card");
  const procedimentosSection = document.querySelector(".procedimentos");

  if (procCards.length === 0) return;

  procCards.forEach((card) => {
    const cardInner = card.querySelector(".proc-card-inner");
    let touchStartTime = 0;
    let touchMoved = false;

    // Função de flip
    const flipCard = () => {
      const isFlipped = card.classList.contains("flipped");
      card.classList.toggle("flipped");

      if (cardInner) {
        cardInner.style.transform = !isFlipped
          ? "rotateY(180deg)"
          : "rotateY(0deg)";
      }
    };

    // Touch events para mobile
    card.addEventListener(
      "touchstart",
      (e) => {
        touchStartTime = Date.now();
        touchMoved = false;
      },
      { passive: true }
    );

    card.addEventListener(
      "touchmove",
      () => {
        touchMoved = true;
      },
      { passive: true }
    );

    card.addEventListener("touchend", (e) => {
      const touchDuration = Date.now() - touchStartTime;

      // Só faz flip se foi um toque rápido (não scroll)
      if (!touchMoved && touchDuration < 500) {
        e.preventDefault();
        flipCard();
      }
    });

    // Click para desktop
    card.addEventListener("click", (e) => {
      // Ignora se veio de touch
      if (e.detail === 0) return;
      flipCard();
    });

    // Efeito 3D no desktop (sem touch)
    if (!("ontouchstart" in window)) {
      card.addEventListener("mousemove", (e) => {
        if (card.classList.contains("flipped")) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        if (!card.classList.contains("flipped")) {
          card.style.transform = "";
        }
      });
    }
  });

  // Observer para resetar cards
  const flipObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          procCards.forEach((card) => {
            card.classList.remove("flipped");
            card.style.transform = "";
            const cardInner = card.querySelector(".proc-card-inner");
            if (cardInner) {
              cardInner.style.transform = "rotateY(0deg)";
            }
          });
        }
      });
    },
    { threshold: 0.1 }
  );

  if (procedimentosSection) {
    flipObserver.observe(procedimentosSection);
  }
}

//#endregion

// #region INICIALIZAÇÃO

document.addEventListener("DOMContentLoaded", function () {
  // Observers e animações
  initGeneralObserver();
  initProcCardsObserver();
  initNumberAnimation();
  injectNumberAnimationStyles();

  // Navegação e efeitos
  initSmoothScroll();
  initSnakeStripe();
  initButtonEffects();
  initWhatsappAnimation();

  // Componentes complexos
  initGallery();
  initFlipCards();

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });
});

//#endregion
