/* FILE: js/script.js */
document.addEventListener('DOMContentLoaded', () => {
  // Init Header Scroll State
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Custom Cursor Implementation
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const interactiveElements = document.querySelectorAll('a, button, .card, .ba-container, input, select, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Before / After Interactive Image Dragging Implementation
  const baContainers = document.querySelectorAll('.ba-container');
  baContainers.forEach(container => {
    const overlayLayer = container.querySelector('.ba-after');
    const overlayImg = overlayLayer?.querySelector('img');
    const handle = container.querySelector('.ba-slider-handle');
    let isDragging = false;

    // Recalculate container width so clipped image doesn't warp/squish
    const syncImageDimensions = () => {
      const rect = container.getBoundingClientRect();
      if (overlayImg) {
        overlayImg.style.width = `${rect.width}px`;
      }
    };

    syncImageDimensions();
    window.addEventListener('resize', syncImageDimensions);

    const updateSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;

      if (overlayLayer) overlayLayer.style.width = `${pos}%`;
      if (handle) handle.style.left = `${pos}%`;
    };

    const startDrag = (clientX) => {
      isDragging = true;
      updateSlider(clientX);
    };

    const stopDrag = () => {
      isDragging = false;
    };

    // Pointer/Mouse events
    container.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    // Touch events for iPad/iOS Preview
    container.addEventListener('touchstart', (e) => {
      if (e.touches[0]) startDrag(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });
  });

  // Accordion FAQ Component
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Treatment Page Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      treatmentCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Interactive Form Submission Simulation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const toast = document.createElement('div');
      toast.className = 'form-toast';
      toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Request received. Our clinical coordinator will reach out shortly.</span>
      `;
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add('visible'), 100);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 4000);

      form.reset();
    });
  });
});