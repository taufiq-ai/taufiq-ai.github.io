// assets/js/header.js
fetch('nav.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    const navLink = document.querySelector(`#navbar a[href='${currentPage}']`);
    if (navLink) {
      document.querySelectorAll('#navbar a').forEach(link => link.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
