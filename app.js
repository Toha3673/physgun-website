const content = document.getElementById("content");

// Страница 404 (не найдена)
const notFoundPage = `
    <div class="content-container error-message">
        <h2>404</h2>
        <p>Страница не найдена!</p>
    </div>
`;

async function loadPage(page) {
    // Если страница загружается - делаем fade out
    if (content.innerHTML.trim() !== '') {
        content.classList.add("fade-out");
        await new Promise(r => setTimeout(r, 200));
    }
    
    // Сначала пробуем загрузить из папки pages
    try {
        const res = await fetch(`pages/${page}.html`);
        if (res.ok) {
            content.innerHTML = await res.text();
        } else {
            content.innerHTML = notFoundPage;
        }
    } catch (error) {
        content.innerHTML = notFoundPage;
    }
    
    // Делаем fade in
    content.classList.remove("fade-out");
    content.classList.add("fade-in");
    
    setTimeout(() => {
        content.classList.remove("fade-in");
    }, 250);
    
    // Обновляем активную ссылку в навигации
    updateActiveNavLink(page);
}

function updateActiveNavLink(page) {
    document.querySelectorAll('.nav a').forEach(link => {
        if (link.dataset.page === page) {
            link.style.color = '#fff';
            link.style.fontWeight = '500';
        } else {
            link.style.color = '#ccc';
            link.style.fontWeight = 'normal';
        }
    });
}

function getPageFromHash() {
    // Получаем страницу из hash (убираем #)
    const hash = window.location.hash.substring(1);
    
    // Если hash пустой или только #, то это главная
    if (!hash || hash === '') {
        return 'home';
    }
    
    // Если в hash есть что-то вроде #home, #generators
    return hash;
}

// Инициализация навигации
document.querySelectorAll("a[data-page]").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        
        const page = link.dataset.page;
        // Обновляем hash в URL
        window.location.hash = page;
        // Страница загрузится через обработчик hashchange
    });
});

// Обработчик изменения hash
window.addEventListener("hashchange", () => {
    const page = getPageFromHash();
    loadPage(page);
});

// Обработчик загрузки страницы
window.addEventListener("DOMContentLoaded", () => {
    // Загружаем страницу из hash или главную по умолчанию
    const page = getPageFromHash() || 'home';
    loadPage(page);
});

// Также обрабатываем кнопку "Назад" в браузере
window.addEventListener("popstate", () => {
    const page = getPageFromHash();
    loadPage(page);
});