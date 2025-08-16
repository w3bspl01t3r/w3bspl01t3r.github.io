// Function to load navigation component
function loadNavigation() {
  fetch('navigation.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navigation-placeholder').innerHTML = data;
      
      // Highlight current page in navigation
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('nav a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.style.color = '#fef200';
        }
      });
    })
    .catch(error => console.error('Error loading navigation:', error));
}

// Load navigation when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavigation);
