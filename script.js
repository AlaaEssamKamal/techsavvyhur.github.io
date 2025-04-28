// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });
  
  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach(el => observer.observe(el));
  
  // Form Submit with Formspree
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formData = new FormData(form);
  
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        successMessage.style.display = 'block';
        form.reset();
      } else {
        alert('حصلت مشكلة حاول تاني 😥');
      }
    }).catch(error => {
      alert('حصلت مشكلة حاول تاني 😥');
    });
  });
  
  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  