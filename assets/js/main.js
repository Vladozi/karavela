/**
* Template Name: Restaurantly
* Template URL: https://bootstrapmade.com/restaurantly-restaurant-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  if (mobileNavToggleBtn) {
    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  }


  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  if (scrollTop) {
    function toggleScrollTop() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    if (typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });
    }

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        if (!initIsotope) return;
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit(); // Re-initialize AOS to animate new items if needed
        }
      }, false);
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      // Check if initSwiperWithCustomPagination is defined, otherwise use standard Swiper
      if (swiperElement.classList.contains("swiper-tab") && typeof initSwiperWithCustomPagination === 'function') {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200; // Offset for better activation timing
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  if (navmenulinks.length) {
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
  }

})();

// Notification function
function showNotification(message, isSuccess = true) {
  const notification = document.getElementById('notification');
  if (!notification) {
    console.warn('Notification element #notification not found.');
    alert(message); // Fallback to alert
    return;
  }
  const messageEl = document.getElementById('notification-message');
  const icon = notification.querySelector('i');

  if (!messageEl || !icon) {
    console.warn('Notification message or icon element not found within #notification.');
    notification.textContent = message; // Fallback
  } else {
    messageEl.textContent = message;
    icon.className = `bi ${isSuccess ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`;
  }
  
  notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
  notification.style.display = 'flex';
  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.style.display = 'none', 300); // Wait for transition
  }, 5000);
}

// Updated booking-form submission handler
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      people: document.getElementById('people').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch('/api/book-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        if (!response.ok) {
          throw new Error(`სერვერთან დაკავშირების შეცდომა: ${response.status} ${response.statusText}. პასუხი არ იყო JSON ფორმატში.`);
        }
        console.error('Booking API response was OK but not valid JSON:', await response.text());
        throw new Error('სერვერისგან მიღებული პასუხი არასწორი ფორმატისაა.');
      }

      console.log("Booking API Response (parsed):", result);

      if (response.ok && result.success === true) {
        showNotification('ადგილი წარმატებით დაიჯავშნა!', true);
        e.target.reset();
      } else {
        const errorMessage = result.error || result.message || `დაჯავშნა ვერ მოხერხდა (სერვერის სტატუსი: ${response.status})`;
        throw new Error(errorMessage);
      }

    } catch (error) {
      showNotification(error.message || 'კავშირის პრობლემა. გთხოვთ სცადოთ თავიდან', false);
      console.error("Booking form submission error:", error);
    }
  });
}


// Updated contact-form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const elements = form.elements;
    const submitBtn = form.querySelector('button[type="submit"]');
    const loading = form.querySelector('.loading');
    const errorDiv = form.querySelector('.error-message');
    const successDiv = form.querySelector('.sent-message');

    // Ensure UI elements exist before manipulating them
    if (loading) loading.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;

    try {
      console.log('Contact form submission started...');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: elements.name.value,
          email: elements.email.value,
          // phone: elements.phone.value, // Removed as backend /api/contact doesn't use it
          message: elements.message.value
        })
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        if (!response.ok) {
          throw new Error(`სერვერთან დაკავშირების შეცდომა: ${response.status} ${response.statusText}. პასუხი არ იყო JSON ფორმატში.`);
        }
        console.error('Server response for contact form was OK but not valid JSON:', await response.text());
        throw new Error('სერვერისგან მიღებული პასუხი არასწორი ფორმატისაა.');
      }

      console.log('Server response (parsed) for contact form:', result);

      if (response.ok && result.success === true) {
        if (loading) loading.style.display = 'none';
        if (successDiv) successDiv.style.display = 'block';
        form.reset();

        if (successDiv) {
          setTimeout(() => {
            successDiv.style.display = 'none';
          }, 5000);
        }
      } else {
        const errorMessage = result.error || result.message || `მოთხოვნის დამუშავება ვერ მოხერხდა (სერვერის სტატუსი: ${response.status})`;
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Contact form submission error:', error);
      if (loading) loading.style.display = 'none';
      if (errorDiv) {
        errorDiv.textContent = error.message || 'გაგზავნა ვერ მოხერხდა';
        errorDiv.style.display = 'block';
        setTimeout(() => {
          errorDiv.style.display = 'none';
        }, 5000);
      } else {
        // Fallback if errorDiv is not present, use the global notification
        showNotification(error.message || 'გაგზავნა ვერ მოხერხდა', false);
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}