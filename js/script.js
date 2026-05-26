// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const menuIcon = document.querySelector(".icon-menu");
  if (menuIcon) {
    menuIcon.addEventListener("click", function (event) {
      event.preventDefault();
      document.body.classList.toggle("menu-open");
    });
  }

  // FAQ functionality
  const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

  spollerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentItem = button.closest("[data-spoller]");
      const content = currentItem.querySelector(".spollers-faq__text");

      const parent = currentItem.parentNode;
      const isOneSpoller = parent.hasAttribute("data-one-spoller");

      if (isOneSpoller) {
        const allItems = parent.querySelectorAll("[data-spoller]");
        allItems.forEach((item) => {
          if (item !== currentItem) {
            const otherContent = item.querySelector(".spollers-faq__text");
            item.classList.remove("active");
            otherContent.style.maxHeight = null;
          }
        });
      }

      if (currentItem.classList.contains("active")) {
        currentItem.classList.remove("active");
        content.style.maxHeight = null;
      } else {
        currentItem.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Modal functionality
  const modal = document.getElementById('reservationModal');
  const reservationBtns = document.querySelectorAll('.main__button');
  const closeBtn = document.querySelector('.modal__close');

  if (modal && closeBtn) {
    // Open modal
    reservationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Services slider functionality
  const servicesRow = document.querySelector('.services__row');
  const prevButton = document.querySelector('.services__nav--prev');
  const nextButton = document.querySelector('.services__nav--next');
  const columns = document.querySelectorAll('.services__column');
  let currentIndex = 0;

  function getVisibleColumns() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return 1;
    if (screenWidth <= 768) return 2;
    if (screenWidth <= 992) return 3;
    return 4;
  }

  function updateSliderPosition() {
    if (!columns.length) return;
    
    const visibleColumns = getVisibleColumns();
    const slideWidth = columns[0].offsetWidth + 24; // Width + gap
    servicesRow.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // Update button visibility based on visible columns
    const maxIndex = Math.max(0, columns.length - visibleColumns);
    prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextButton.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    
    // Hide navigation buttons if all items are visible
    if (columns.length <= visibleColumns) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = 'block';
      nextButton.style.display = 'block';
    }
  }

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition();
      }
    });

    nextButton.addEventListener('click', () => {
      const visibleColumns = getVisibleColumns();
      const maxIndex = Math.max(0, columns.length - visibleColumns);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSliderPosition();
      }
    });

    // Initialize button states
    updateSliderPosition();

    // Handle window resize
    window.addEventListener('resize', () => {
      // Reset index if necessary when resizing
      const visibleColumns = getVisibleColumns();
      const maxIndex = Math.max(0, columns.length - visibleColumns);
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      updateSliderPosition();
    });
  }

  // Add touch scroll for mobile with improved logic
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  if (servicesRow) {
    servicesRow.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    servicesRow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // Only trigger horizontal swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault();
        
        const visibleColumns = getVisibleColumns();
        const maxIndex = Math.max(0, columns.length - visibleColumns);
        
        if (diffX > 0 && currentIndex < maxIndex) {
          currentIndex++;
        } else if (diffX < 0 && currentIndex > 0) {
          currentIndex--;
        }
        updateSliderPosition();
      }
    }, { passive: false });
  }

  // Timeline scroll animation
  function checkTimelineItems() {
    const items = document.querySelectorAll('.timeline__item');
    
    items.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (itemTop < windowHeight * 0.8) {
        item.classList.add('visible');
      }
    });
  }

  // Add scroll event listener
  window.addEventListener('scroll', checkTimelineItems);
  // Initial check
  checkTimelineItems();
});
