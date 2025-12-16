<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Назиля Латыпова | SMM-специалист</title>
    <!-- Подключим стили позже -->
    <!-- <link rel="stylesheet" href="css/style.css"> -->
</head>
<body>
    <!-- ШАПКА САЙТА -->
    <header>
        <!-- Логотип - просто текст, потом сделаем красиво -->
        <div class="logo">LN</div>
        
        <!-- Основное меню -->
        <nav>
            <ul class="main-menu">
                <li><a href="#portfolio">Портфолио</a></li>
                <li><a href="#services">Услуги</a></li>
                <li><a href="#blog">Блог</a></li>
                <li><a href="#contacts">Контакты</a></li>
            </ul>
        </nav>
        
        <!-- Контакты в шапке -->
        <div class="header-contacts">
            <span class="phone">+7 (999) 217-27-**</span>
            <button class="cta-button">Позвонить</button>
        </div>
        
        <!-- Бургер-меню для телефонов (скрыто пока) -->
        <div class="burger-menu">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </header>

    <!-- ГЛАВНЫЙ БАННЕР -->
    <section class="hero">
        <div class="hero-content">
            <h1>SMM, который увеличивает прибыль</h1>
            <p>Профессиональное ведение соцсетей для вашего бизнеса</p>
            <button>Обсудить проект</button>
        </div>
    </section>

    <!-- БЛОК "ОБО МНЕ" -->
    <section class="about" id="about">
        <!-- Фото слева -->
        <div class="about-photo">
            <img src="images/my-photo.jpg" alt="Назиля Латыпова">
        </div>
        
        <!-- Текст справа -->
        <div class="about-text">
            <h2>Приветствую вас на своей digital-площадке!</h2>
            <p>Меня зовут <strong>Назиля</strong>. Я SMM-специалист — так называемый архитектор онлайн-присутствия, который за 5 лет в интернет-маркетинге научился вести сайты, соцсети, а также <strong>строить мосты между брендами и их аудиторией</strong>.</p>
            <p>Мой опыт — это палитра проектов из абсолютно разных сфер: от элитной стоматологии и строительных компаний до уютных спа-салонов и патриотических движений. Каждый проект — это уникальная история, где я помогла <strong>увеличить охваты, запустить виральные рекламные кампании и превратить подписчиков в лояльных клиентов</strong>.</p>
            <p>Я верю, что даже самый сложный продукт можно подать так, чтобы о нем заговорили.</p>
        </div>
    </section>

    <!-- БЛОК "УСЛУГИ" -->
    <section class="services" id="services">
        <h2>Мои услуги</h2>
        
        <div class="services-list">
            <!-- Услуга 1 -->
            <div class="service-item">
                <img src="images/service1.png" alt="PR и реклама">
                <h3>PR и реклама</h3>
            </div>
            
            <!-- Услуга 2 -->
            <div class="service-item">
                <img src="images/service2.png" alt="SMM – соцсети">
                <h3>SMM – соцсети</h3>
            </div>
            
            <!-- Услуга 3 -->
            <div class="service-item">
                <img src="images/service3.png" alt="SEO – сайт">
                <h3>SEO – сайт</h3>
            </div>
            
            <!-- Услуга 4 -->
            <div class="service-item">
                <img src="images/service4.png" alt="SERM – отзывы">
                <h3>SERM – отзывы</h3>
            </div>
        </div>
    </section>

    <!-- БЛОК "ПОРТФОЛИО" -->
    <section class="portfolio" id="portfolio">
        <h2>Мои работы</h2>
        
        <div class="portfolio-slider">
            <!-- Левая карточка -->
            <div class="portfolio-card">
                <img src="images/portfolio1.png" alt="Проект 1">
                <h3>Клиника стоматологии</h3>
            </div>
            
            <!-- Центральная карточка (главная) -->
            <div class="portfolio-card main-card">
                <img src="images/portfolio2.png" alt="Проект 2">
                <h3>Патриотическое движение</h3>
            </div>
            
            <!-- Правая карточка -->
            <div class="portfolio-card">
                <img src="images/portfolio3.png" alt="Проект 3">
                <h3>Строительная компания</h3>
            </div>
        </div>
        
        <!-- Стрелки для слайдера (пока не работают) -->
        <button class="slider-arrow left-arrow">←</button>
        <button class="slider-arrow right-arrow">→</button>
    </section>

    <!-- БЛОК "БЛОГ" (для перехода на отдельную страницу) -->
    <section class="blog-preview">
        <h2>Последняя статья в блоге</h2>
        <article>
            <h3>Как увеличить вовлеченность в Instagram за 30 дней</h3>
            <p>Краткое описание статьи... При нажатии на "Читать далее" переходим на страницу блога.</p>
            <a href="blog/article1.html">Читать далее →</a>
        </article>
    </section>

    <!-- ПОДВАЛ САЙТА -->
    <footer id="contacts">
        <div class="footer-content">
            <div class="footer-logo">LN</div>
            
            <div class="footer-menu">
                <h4>Навигация</h4>
                <ul>
                    <li><a href="#portfolio">Портфолио</a></li>
                    <li><a href="#services">Услуги</a></li>
                    <li><a href="#blog">Блог</a></li>
                    <li><a href="#contacts">Контакты</a></li>
                </ul>
            </div>
            
            <div class="footer-contacts">
                <h4>Контакты</h4>
                <p>Телефон: +7 (999) 217-27-**</p>
                <p>Email: hello@nazilya.ru</p>
                <p>Санкт-Петербург</p>
            </div>
            
            <div class="footer-social">
                <h4>Социальные сети</h4>
                <a href="#">VK</a>
                <a href="#">Telegram</a>
            </div>
        </div>
        
        <div class="copyright">
            <p>© 2025 Назиля Латыпова. Все права защищены.</p>
        </div>
    </footer>
</body>
</html>
