// Основная логика игры
document.addEventListener('DOMContentLoaded', function() {
    // Находим элементы на странице
    const gameField = document.getElementById('game-field');
    const completedCounter = document.getElementById('completed-counter');
    const resetBtn = document.getElementById('reset-btn');
    
    // Конфигурация фигур с относительными позициями
    const shapesConfig = [
        // Фигуры для елки (в порядке сборки сверху вниз)
        { 
            type: 'poly-5',      // маленький ярус
            group: 'tree', 
            order: 1, 
            rotation: 0,
            relativePosition: { x: 0, y: 0 } // Верхняя точка елки
        },
        { 
            type: 'poly-4',      // средний ярус
            group: 'tree', 
            order: 2, 
            rotation: 0,
            relativePosition: { x: -29, y: 40 } // Смещение относительно первого
        },
        { 
            type: 'poly-3',      // большой ярус
            group: 'tree', 
            order: 3, 
            rotation: 0,
            relativePosition: { x: -66, y: 95 } // Смещение относительно первого
        },
        { 
            type: 'rect-651',    // ствол
            group: 'tree', 
            order: 4, 
            rotation: -90,       // Поворот ствола на -90 градусов
            relativePosition: { x: -50, y: 156 } // Смещение относительно первого
        },
        
        // Фигуры для домика
        { 
            type: 'poly-2',      // крыша
            group: 'house', 
            order: 1, 
            rotation: 0,
            relativePosition: { x: 0, y: 0 } // Верх домика
        },
        { 
            type: 'rect-650',    // основание
            group: 'house', 
            order: 2, 
            rotation: 0,
            relativePosition: { x: 22.5, y: 50 } // Смещение относительно крыши
        },
        { 
            type: 'window',      // окно
            group: 'house', 
            order: 3, 
            rotation: 0,
            relativePosition: { x: 43, y: 40 } // Смещение относительно крыши
        }
    ];
    
    // Хранилище для всех фигур
    let shapes = [];
    let draggedShape = null;
    let offsetX = 0, offsetY = 0;
    let completedGroups = 0;
    
    // Инициализация игры
    function initGame() {
        // Очищаем поле
        gameField.innerHTML = '';
        shapes = [];
        completedGroups = 0;
        completedCounter.textContent = '0';
        
        // Убираем сообщение о победе
        document.querySelector('.win-overlay')?.remove();
        
        // Создаем все фигуры
        shapesConfig.forEach(config => {
            const shape = createShape(config);
            const shapeObj = {
                element: shape,
                config: config,
                rotation: getRandomRotation(), // случайный поворот (0, 45, 90, 135, 180, 225, 270, 315)
                isConnected: false,
                groupId: null,
                isDragging: false
            };
            
            shapes.push(shapeObj);
            
            // Устанавливаем случайную позицию
            setRandomPosition(shape);
            
            // Применяем начальный поворот
            updateRotation(shapeObj);
            
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
        shape.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            rotateShape(this);
            return false;
        });
        
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
    
    // Обновление поворота фигуры
    function updateRotation(shapeObj) {
        shapeObj.element.style.transform = `rotate(${shapeObj.rotation}deg)`;
    }
    
    // Начало перетаскивания
    function startDrag(e) {
        e.preventDefault();
        
        // Находим объект фигуры в массиве
        const shapeObj = shapes.find(s => s.element === this);
        if (!shapeObj) return;
        
        draggedShape = shapeObj;
        draggedShape.element.classList.add('dragging');
        draggedShape.isDragging = true;
        
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
        checkConnections();
    }
    
    // Остановка перетаскивания
    function stopDrag() {
        if (!draggedShape) return;
        
        draggedShape.element.classList.remove('dragging');
        draggedShape.isDragging = false;
        
        // Проверяем окончательное положение
        setTimeout(() => {
            checkConnections();
        }, 10);
        
        draggedShape = null;
        
        // Убираем обработчики
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    // Поворот фигуры
    function rotateShape(element) {
        // Находим объект фигуры
        const shapeObj = shapes.find(s => s.element === element);
        if (!shapeObj) return;
        
        // Поворачиваем на 45 градусов по часовой стрелке
        shapeObj.rotation = (shapeObj.rotation + 45) % 360;
        updateRotation(shapeObj);
        
        // Проверяем соединения
        setTimeout(() => {
            checkConnections();
        }, 10);
    }
    
    // Проверка всех соединений
    function checkConnections() {
        // Сначала сбрасываем все группы
        resetGroups();
        
        // Проверяем каждую группу отдельно
        checkGroup('tree');
        checkGroup('house');
        
        // Обновляем счетчик
        updateCompletedCounter();
    }
    
    // Сброс всех групп
    function resetGroups() {
        // Удаляем все существующие группы
        document.querySelectorAll('.group').forEach(group => group.remove());
        
        // Сбрасываем состояние всех фигур
        shapes.forEach(shapeObj => {
            shapeObj.isConnected = false;
            shapeObj.groupId = null;
            shapeObj.element.classList.remove('connected');
            shapeObj.element.style.position = 'absolute';
            shapeObj.element.style.left = shapeObj.element.style.left;
            shapeObj.element.style.top = shapeObj.element.style.top;
            shapeObj.element.style.transform = `rotate(${shapeObj.rotation}deg)`;
            gameField.appendChild(shapeObj.element);
        });
        
        completedGroups = 0;
    }
    
    // Проверка конкретной группы
    function checkGroup(groupType) {
        const groupShapes = shapes.filter(s => s.config.group === groupType);
        
        // Проверяем правильные углы поворота
        const correctRotations = groupShapes.every(shapeObj => {
            // Для ствола елки нужен поворот -90 градусов
            if (groupType === 'tree' && shapeObj.config.type === 'rect-651') {
                return shapeObj.rotation === 270; // -90 градусов = 270 градусов
            }
            // Для остальных фигур нужен 0 градусов
            return shapeObj.rotation === 0;
        });
        
        if (!correctRotations) return;
        
        // Находим базовую фигуру (первую в порядке)
        const baseShape = groupShapes.find(s => s.config.order === 1);
        if (!baseShape) return;
        
        const baseRect = baseShape.element.getBoundingClientRect();
        const fieldRect = gameField.getBoundingClientRect();
        
        // Проверяем, все ли фигуры находятся в правильных позициях относительно базовой
        let allInPlace = true;
        
        for (const shapeObj of groupShapes) {
            if (shapeObj.config.order === 1) continue; // Пропускаем базовую фигуру
            
            const shapeRect = shapeObj.element.getBoundingClientRect();
            
            // Вычисляем ожидаемую позицию относительно базовой
            const expectedX = baseRect.left + shapeObj.config.relativePosition.x;
            const expectedY = baseRect.top + shapeObj.config.relativePosition.y;
            
            // Проверяем, находится ли фигура близко к ожидаемой позиции (±20px)
            const distanceX = Math.abs(shapeRect.left - expectedX);
            const distanceY = Math.abs(shapeRect.top - expectedY);
            
            if (distanceX > 25 || distanceY > 25) {
                allInPlace = false;
                break;
            }
        }
        
        if (allInPlace) {
            createGroup(groupShapes, groupType, baseRect, fieldRect);
            completedGroups++;
        }
    }
    
    // Создание группы
    function createGroup(groupShapes, groupType, baseRect, fieldRect) {
        // Генерируем ID группы
        const groupId = `${groupType}_${Date.now()}`;
        
        // Создаем контейнер группы
        const group = document.createElement('div');
        group.className = `group ${groupType}-group`;
        group.dataset.groupId = groupId;
        
        // Позиционируем группу по позиции базовой фигуры
        group.style.left = `${baseRect.left - fieldRect.left}px`;
        group.style.top = `${baseRect.top - fieldRect.top}px`;
        group.style.width = groupType === 'tree' ? '150px' : '110px';
        group.style.height = groupType === 'tree' ? '156px' : '110px';
        
        // Помечаем фигуры как соединенные и позиционируем их внутри группы
        groupShapes.forEach(shapeObj => {
            shapeObj.isConnected = true;
            shapeObj.groupId = groupId;
            shapeObj.element.classList.add('connected');
            shapeObj.element.style.position = 'absolute';
            
            // Устанавливаем позицию внутри группы
            shapeObj.element.style.left = `${shapeObj.config.relativePosition.x}px`;
            shapeObj.element.style.top = `${shapeObj.config.relativePosition.y}px`;
            
            // Для ствола елки применяем правильный поворот
            if (groupType === 'tree' && shapeObj.config.type === 'rect-651') {
                shapeObj.element.style.transform = 'rotate(-90deg)';
            } else {
                shapeObj.element.style.transform = 'rotate(0deg)';
            }
            
            group.appendChild(shapeObj.element);
        });
        
        // Добавляем обработчики для перетаскивания группы
        group.addEventListener('mousedown', function(e) {
            startDragGroup(e, this);
        });
        
        // Добавляем группу на поле
        gameField.appendChild(group);
    }
    
    // Перетаскивание группы
    function startDragGroup(e, group) {
        e.preventDefault();
        
        group.classList.add('dragging');
        
        // Вычисляем смещение
        const rect = group.getBoundingClientRect();
        const groupOffsetX = e.clientX - rect.left;
        const groupOffsetY = e.clientY - rect.top;
        
        // Функция перетаскивания группы
        function dragGroup(e) {
            const fieldRect = gameField.getBoundingClientRect();
            const x = e.clientX - fieldRect.left - groupOffsetX;
            const y = e.clientY - fieldRect.top - groupOffsetY;
            
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
    
    // Обновление счетчика завершенных групп
    function updateCompletedCounter() {
        completedCounter.textContent = completedGroups;
        
        // Анимация счетчика
        completedCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            completedCounter.style.transform = 'scale(1)';
        }, 300);
        
        // Если собраны обе группы - завершаем игру
        if (completedGroups === 2) {
            completeGame();
        }
    }
    
    // Завершение игры
    function completeGame() {
        // Находим все группы
        const groups = document.querySelectorAll('.group');
        
        // Анимируем группы
        groups.forEach(group => {
            group.classList.add('animated');
        });
        
        // Создаем и показываем сообщение о победе
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
