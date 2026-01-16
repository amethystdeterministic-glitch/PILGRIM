(function () {
  const input = document.querySelector('.search input');
  if (!input) return;

  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const q = input.value.trim().toLowerCase();
    if (!q) return;

    const routes = {
      source: '/source/',
      pipeline: '/pipeline/',
      guards: '/guards/',
      settings: '/settings/',
      write: '/write/',
      matrix: '/matrix/',
      post: '/post/',
      mundo: '/mundo/',
      forge: '/forge/'
    };

    if (routes[q]) {
      window.location.href = routes[q];
      return;
    }

    if (q.startsWith('/')) {
      window.location.href = q;
    }
  });
})();
