document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.app-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.style.display = 'none');

            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            const targetSection = document.getElementById(target);
            if(targetSection) targetSection.style.display = 'block';
        });
    });
});
