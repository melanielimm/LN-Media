// Основные понятия JavaScript для этой игры:

// 1. document.querySelector() - находит элемент на странице
// 2. document.createElement() - создает новый элемент
// 3. element.addEventListener() - добавляет обработчик события
// 4. Math.random() - генерирует случайное число
// 5. classList.add()/remove() - добавляет/удаляет CSS-класс

// Основная логика игры
document.addEventListener('DOMContentLoaded', function() {
    // Находим элементы на странице
    const gameField = document.getElementById('game-field');
    const completedCounter = document.getElementById('completed-counter');
    const resetBtn = document.getElementById('reset-btn');
    
    // Конфигурация фигур
    const shapesConfig = [
        // Фигуры для елки (в порядке сборки)
        { type: 'rect-651', group: 'tree', order: 1, rotation: 0 }, // ствол
        { type: 'poly-3', group: 'tree', order: 2, rotation: 0 },  // большой ярус
        { type: 'poly-4', group: 'tree', order: 3, rotation: 0 },  // средний ярус
        { type: 'poly-5', group: 'tree', order: 4, rotation: 0 },  // маленький ярус
        
        // Фигуры для домика (в порядке сборки)
        { type: 'rect-650', group: 'house', order: 1, rotation: 0 }, // основание
        { type: 'poly-2', group: 'house', order: 2, rotation: 0 },  // крыша
        { type: 'window', group: 'house', order: 3, rotation: 0 }   // окно
    ];
    
    // Хранилище для всех фигур
    let shapes = [];
    let completedGroups = 0;
    let draggedShape = null;
    let offsetX = 0, offsetY = 0;
    
    // Инициализация игры
    function initGame() {
        // Очищаем поле
        gameField.innerHTML = '';
        shapes = [];
        completedGroups = 0;
        completedCounter.textContent = '0';
        
        // Убираем сообщение о победе
        document.querySelector('.win-overlay')?.classList.remove('active');
        
        // Создаем все фигуры
        shapesConfig.forEach(config => {
            const shape = createShape(config);
            shapes.push({
                element: shape,
                config: config,
                rotation: getRandomRotation(), // случайный поворот
                isConnected: false,
                groupId: null
            });
            
            // Устанавливаем случайную позицию
            setRandomPosition(shape);
            
            // Применяем поворот
            shape.style.transform = `rotate(${shapes[shapes.length-1].rotation}deg)`;
            
            // Добавляем на поле
            gameField.appendChild(shape);
        });
        
        // Обновляем счетчик
        updateCounter();
    }
    
    // Создание фигуры
    function createShape(config) {
        const shape = document.createElement('div');
        shape.className = `shape ${config.type}`;
        shape.dataset.type = config.type;
        shape.dataset.group = config.group;
        shape.dataset.order = config.order;
        
        // Для окна создаем внутреннюю структуру
        if (config.type === 'window') {
            const windowParts = document.createElement('div');
            windowParts.className = 'window-parts';
            
            // Верхняя часть
            const top = document.createElement('div');
            top.className = 'window-part';
            
            // Левая часть
            const left = document.createElement('div');
            left.className = 'window-part';
            
            // Правая часть
            const right = document.createElement('div');
            right.className = 'window-part';
            
            windowParts.appendChild(top);
            windowParts.appendChild(left);
            windowParts.appendChild(right);
            shape.appendChild(windowParts);
        }
        
        // Добавляем обработчики событий
        shape.addEventListener('mousedown', startDrag);
        shape.addEventListener('contextmenu', rotateShape);
        
        return shape;
    }
    
    // Установка случайной позиции
    function setRandomPosition(element) {
        const fieldRect = gameField.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Вычисляем доступные координаты
        const maxX = fieldRect.width - elementRect.width - 40;
        const maxY = fieldRect.height - elementRect.height - 40;
        
        // Генерируем случайные координаты
        const randomX = 20 + Math.random() * maxX;
        const randomY = 20 + Math.random() * maxY;
        
        // Устанавливаем позицию
        element.style.left = `${randomX}px`;
        element.style.top = `${randomY}px`;
    }
    
    // Получение случайного угла поворота (кратного 45 градусам)
    function getRandomRotation() {
        const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
        return rotations[Math.floor(Math.random() * rotations.length)];
    }
    
    // Начало перетаскивания
    function startDrag(e) {
        e.preventDefault();
        
        // Находим объект фигуры в массиве
        const shapeObj = shapes.find(s => s.element === this);
        if (!shapeObj || shapeObj.isConnected) return;
        
        draggedShape = shapeObj;
        draggedShape.element.classList.add('dragging');
        
        // Вычисляем смещение курсора относительно фигуры
        const rect = this.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Добавляем обработчики для всего документа
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    // Перетаскивание
    function drag(e) {
        if (!draggedShape) return;
        
        // Вычисляем новую позицию
        const fieldRect = gameField.getBoundingClientRect();
        const x = e.clientX - fieldRect.left - offsetX;
        const y = e.clientY - fieldRect.top - offsetY;
        
        // Ограничиваем перемещение в пределах поля
        const elementRect = draggedShape.element.getBoundingClientRect();
        const maxX = fieldRect.width - elementRect.width;
        const maxY = fieldRect.height - elementRect.height;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        
        // Обновляем позицию
        draggedShape.element.style.left = `${boundedX}px`;
        draggedShape.element.style.top = `${boundedY}px`;
        
        // Проверяем соединения с другими фигурами
        checkConnections(draggedShape);
    }
    
    // Остановка перетаскивания
    function stopDrag() {
        if (!draggedShape) return;
        
        draggedShape.element.classList.remove('dragging');
        draggedShape = null;
        
        // Убираем обработчики
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    // Поворот фигуры
    function rotateShape(e) {
        e.preventDefault();
        
        // Находим объект фигуры
        const shapeObj = shapes.find(s => s.element === this);
        if (!shapeObj || shapeObj.isConnected) return;
        
        // Поворачиваем на 45 градусов
        shapeObj.rotation = (shapeObj.rotation + 45) % 360;
        this.style.transform = `rotate(${shapeObj.rotation}deg)`;
        
        // Проверяем соединения
        checkConnections(shapeObj);
        
        return false;
    }
    
    // Проверка соединений между фигурами
    function checkConnections(shapeObj) {
        // Если фигура уже соединена, проверяем всю группу
        if (shapeObj.isConnected) {
            checkGroupConnections(shapeObj.groupId);
            return;
        }
        
        // Ищем фигуры той же группы
        const groupShapes = shapes.filter(s => 
            s.config.group === shapeObj.config.group && 
            !s.isConnected
        );
        
        // Сортируем по порядку сборки
        groupShapes.sort((a, b) => a.config.order - b.config.order);
        
        // Проверяем, можно ли соединить фигуры
        let canConnect = true;
        for (let i = 0; i < groupShapes.length; i++) {
            const shape = groupShapes[i];
            
            // Проверяем правильный поворот (должен быть 0 градусов)
            if (shape.rotation % 360 !== 0) {
                canConnect = false;
                break;
            }
            
            // Проверяем позиции (фигуры должны быть рядом)
            if (i > 0) {
                const prevShape = groupShapes[i-1];
                if (!areShapesNearby(shape, prevShape)) {
                    canConnect = false;
                    break;
                }
            }
        }
        
        // Если можно соединить, создаем группу
        if (canConnect && groupShapes.length === getGroupSize(shapeObj.config.group)) {
            createGroup(groupShapes);
        }
    }
    
    // Проверка, находятся ли фигуры рядом
    function areShapesNearby(shape1, shape2) {
        const rect1 = shape1.element.getBoundingClientRect();
        const rect2 = shape2.element.getBoundingClientRect();
        
        // Проверяем пересечение или близость (20px)
        const isOverlapping = !(
            rect1.right < rect2.left - 20 ||
            rect1.left > rect2.right + 20 ||
            rect1.bottom < rect2.top - 20 ||
            rect1.top > rect2.bottom + 20
        );
        
        return isOverlapping;
    }
    
    // Получение размера группы
    function getGroupSize(groupType) {
        return groupType === 'tree' ? 4 : 3;
    }
    
    // Создание группы из фигур
    function createGroup(groupShapes) {
        // Генерируем ID группы
        const groupId = 'group_' + Date.now();
        
        // Помечаем фигуры как соединенные
        groupShapes.forEach(shapeObj => {
            shapeObj.isConnected = true;
            shapeObj.groupId = groupId;
            shapeObj.element.classList.add('connected');
        });
        
        // Создаем контейнер группы
        const group = document.createElement('div');
        group.className = `group ${groupShapes[0].config.group}-group`;
        group.dataset.groupId = groupId;
        
        // Позиционируем группу по центру первой фигуры
        const firstShape = groupShapes[0].element;
        const firstRect = firstShape.getBoundingClientRect();
        const fieldRect = gameField.getBoundingClientRect();
        
        group.style.left = `${firstRect.left - fieldRect.left}px`;
        group.style.top = `${firstRect.top - fieldRect.top}px`;
        
        // Переносим фигуры в группу
        groupShapes.forEach(shapeObj => {
            const shape = shapeObj.element;
            shape.style.position = 'absolute';
            shape.style.left = '0';
            shape.style.top = '0';
            
            // Позиционируем фигуры внутри группы
            if (shapeObj.config.group === 'tree') {
                positionTreeShape(shape, shapeObj.config.order);
            } else {
                positionHouseShape(shape, shapeObj.config.order);
            }
            
            group.appendChild(shape);
        });
        
        // Добавляем обработчики для перетаскивания группы
        group.addEventListener('mousedown', startDragGroup);
        
        // Добавляем группу на поле
        gameField.appendChild(group);
        
        // Увеличиваем счетчик завершенных групп
        completedGroups++;
        updateCounter();
        
        // Проверяем завершение игры
        if (completedGroups === 2) {
            completeGame();
        }
    }
    
    // Позиционирование фигур елки внутри группы
    function positionTreeShape(shape, order) {
        switch(order) {
            case 1: // ствол
                shape.style.bottom = '0';
                shape.style.left = '50px';
                break;
            case 2: // большой ярус
                shape.style.top = '0';
                shape.style.left = '0';
                break;
            case 3: // средний ярус
                shape.style.top = '40px';
                shape.style.left = '29px';
                break;
            case 4: // маленький ярус
                shape.style.top = '70px';
                shape.style.left = '41px';
                break;
        }
    }
    
    // Позиционирование фигур домика внутри группы
    function positionHouseShape(shape, order) {
        switch(order) {
            case 1: // основание
                shape.style.bottom = '0';
                shape.style.left = '22.5px';
                break;
            case 2: // крыша
                shape.style.top = '0';
                shape.style.left = '0';
                break;
            case 3: // окно
                shape.style.top = '40px';
                shape.style.left = '43px';
                break;
        }
    }
    
    // Перетаскивание группы
    function startDragGroup(e) {
        e.preventDefault();
        
        const group = this;
        group.classList.add('dragging');
        
        // Вычисляем смещение
        const rect = group.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        // Функция перетаскивания группы
        function dragGroup(e) {
            const fieldRect = gameField.getBoundingClientRect();
            const x = e.clientX - fieldRect.left - offsetX;
            const y = e.clientY - fieldRect.top - offsetY;
            
            // Ограничиваем перемещение
            const maxX = fieldRect.width - rect.width;
            const maxY = fieldRect.height - rect.height;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            group.style.left = `${boundedX}px`;
            group.style.top = `${boundedY}px`;
        }
        
        // Функция остановки перетаскивания группы
        function stopDragGroup() {
            group.classList.remove('dragging');
            document.removeEventListener('mousemove', dragGroup);
            document.removeEventListener('mouseup', stopDragGroup);
        }
        
        // Добавляем обработчики
        document.addEventListener('mousemove', dragGroup);
        document.addEventListener('mouseup', stopDragGroup);
    }
    
    // Проверка соединений в группе
    function checkGroupConnections(groupId) {
        // Находим все фигуры группы
        const groupShapes = shapes.filter(s => s.groupId === groupId);
        
        // Проверяем, все ли фигуры на месте
        const allConnected = groupShapes.every(s => s.isConnected);
        
        if (!allConnected) {
            // Разъединяем группу
            disconnectGroup(groupId);
        }
    }
    
    // Разъединение группы
    function disconnectGroup(groupId) {
        // Находим группу и ее фигуры
        const group = document.querySelector(`[data-group-id="${groupId}"]`);
        const groupShapes = shapes.filter(s => s.groupId === groupId);
        
        if (!group) return;
        
        // Удаляем группу
        group.remove();
        
        // Сбрасываем состояние фигур
        groupShapes.forEach(shapeObj => {
            shapeObj.isConnected = false;
            shapeObj.groupId = null;
            shapeObj.element.classList.remove('connected');
            
            // Возвращаем фигуры на поле
            setRandomPosition(shapeObj.element);
            gameField.appendChild(shapeObj.element);
        });
        
        // Уменьшаем счетчик
        completedGroups--;
        updateCounter();
    }
    
    // Обновление счетчика
    function updateCounter() {
        completedCounter.textContent = completedGroups;
        
        // Анимация счетчика
        completedCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            completedCounter.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Завершение игры
    function completeGame() {
        // Находим все группы
        const groups = document.querySelectorAll('.group');
        
        // Анимируем группы
        groups.forEach(group => {
            group.classList.add('animated');
        });
        
        // Показываем сообщение о победе
        const winOverlay = document.createElement('div');
        winOverlay.className = 'win-overlay active';
        
        const winMessage = document.createElement('div');
        winMessage.className = 'win-message';
        winMessage.innerHTML = `
            <h2>🎉 Поздравляем! 🎉</h2>
            <p>Вы успешно собрали обе фигуры!</p>
        `;
        
        winOverlay.appendChild(winMessage);
        gameField.appendChild(winOverlay);
        
        // Через 3 секунды останавливаем анимацию
        setTimeout(() => {
            groups.forEach(group => {
                group.classList.remove('animated');
            });
        }, 3000);
    }
    
    // Кнопка сброса
    resetBtn.addEventListener('click', initGame);
    
    // Инициализируем игру при загрузке
    initGame();
});
