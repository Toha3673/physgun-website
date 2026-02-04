// app.js

// Состояние приложения
let currentPage = 'home';
let isLoading = false;

// DOM элементы
const contentEl = document.getElementById('content');
const navLinks = document.querySelectorAll('.nav a[data-page]');

// Функция загрузки страницы
async function loadPage(pageName) {
    if (isLoading || currentPage === pageName) return;
    
    isLoading = true;
    currentPage = pageName;
    
    // Обновляем активную кнопку навигации
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Показываем индикатор загрузки
    contentEl.innerHTML = `
        <div class="loading">
            Загрузка...
        </div>
    `;
    
    const response = await fetch(`pages/${pageName}.html`);
    
    if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Вставляем загруженный контент
    contentEl.innerHTML = html;

    // Если загрузили страницу tools, инициализируем фильтры
    if (pageName === 'tools') {
        initToolsPage();
    }
    
    isLoading = false;
}

// Функция инициализации страницы tools
function initToolsPage() {
    // Элементы фильтров
    const filterButtons = document.querySelectorAll('.category-filter');
    const generatorCards = document.querySelectorAll('.generator-card');
    const emptyState = document.getElementById('emptyState');
    
    // Обработчики для кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            filterGenerators(category);
        });
    });
    
    // Функция фильтрации генераторов
    function filterGenerators(category) {
        let visibleCount = 0;
        
        generatorCards.forEach(card => {
            const categories = card.getAttribute('data-categories').split(' ');
            const isVisible = category === 'all' || categories.includes(category);
            
            if (isVisible) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Показываем/скрываем сообщение "Ничего не найдено"
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Инициализируем фильтр по умолчанию (Все)
    filterGenerators('all');
}

// Обработчики кликов по навигационным ссылкам
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const pageName = link.getAttribute('data-page');
        
        // Обновляем URL в браузере без перезагрузки страницы
        //window.history.pushState({ page: pageName }, '', `/${pageName === 'home' ? '' : pageName}`);
        
        // Загружаем страницу
        loadPage(pageName);
    });
});

// Обработчик кнопки "Назад/Вперед" браузера
window.addEventListener('popstate', (event) => {
    const pageName = window.location.pathname.substring(1) || 'home';
    loadPage(pageName);
});

// Обработчик клика на кнопку "Перейти к генераторам" на главной (если раскомментируете)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('hero-button')) {
        e.preventDefault();
        
        // Переходим на страницу tools
        //window.history.pushState({ page: 'tools' }, '', '/tools');
        loadPage('tools');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Определяем текущую страницу из URL
    const initialPage = window.location.pathname.substring(1) || 'home';
    
    // Устанавливаем активную кнопку навигации
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === initialPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Загружаем начальную страницу
    loadPage(initialPage);
});

// Экспортируем функции для использования в консоли (опционально)
window.app = {
    loadPage,
    currentPage: () => currentPage
};