-- Очистка старых данных меню перед наполнением
TRUNCATE TABLE categories, dishes RESTART IDENTITY CASCADE;

-- 1. КАТЕГОРИИ
INSERT INTO categories (id, name, sort_order) VALUES
('cat_breakfast', 'Завтраки', 1),
('cat_starters', 'Закуски', 2),
('cat_salads', 'Салаты', 3),
('cat_pizza', 'Пицца', 4),
('cat_soups', 'Супы', 5),
('cat_steaks', 'Стейки', 6),
('cat_hot', 'Горячее', 7),
('cat_sides', 'Гарниры', 8),
('cat_pasta', 'Паста', 9),
('cat_dessert', 'Десерты', 10),
('cat_bar_cocktails', 'Коктейли', 11),
('cat_bar_coffee', 'Кофе', 15),
('cat_drinks', 'Напитки', 12);

-- 2. БЛЮДА (Используем ID, на которые ссылаются Коллекции)
INSERT INTO dishes (id, category_id, name, description, price, image_url, type) VALUES

-- СУПЫ (Бизнес-ланч)
('soup_chicken', 'cat_soups', 'Куриный бульон', 'С домашней лапшой и яйцом', 340, 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800', 'food'),
('soup_borsch', 'cat_soups', 'Борщ', 'С пампушкой и салом', 410, 'https://images.unsplash.com/photo-1575850931587-c50e2714c1d6?auto=format&fit=crop&q=80&w=800', 'food'),
('soup_mushroom', 'cat_soups', 'Крем-суп из грибов', 'Из белых грибов с трюфельным маслом', 490, 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800', 'food'),

-- ГОРЯЧЕЕ
('hot_cutlets', 'cat_hot', 'Куриные котлеты', 'С картофельным пюре', 480, 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800', 'food'),
('hot_turkey', 'cat_hot', 'Стейк из индейки', 'С овощами гриль', 620, 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800', 'food'),
('pst_carb', 'cat_pasta', 'Карбонара', 'Классическая на желтках', 490, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800', 'food'),
('hot_salmon', 'cat_hot', 'Стейк из лосося', 'С лимоном и травами', 1090, 'https://images.unsplash.com/photo-1580476262798-bddd9dd90d3e?auto=format&fit=crop&q=80&w=800', 'food'),
('hot_seabass', 'cat_hot', 'Сибас в белом вине', 'Целая рыба', 990, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800', 'food'),
('stk_machete', 'cat_steaks', 'Стейк Мачете', 'Альтернативный стейк', 500, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800', 'food'),
('stk_ribeye', 'cat_steaks', 'Стейк Рибай', 'Мраморная говядина', 800, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800', 'food'),

-- ПИЦЦА
('piz_pep', 'cat_pizza', 'Пепперони', 'Пикантная', 620, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', 'food'),
('piz_4cheese', 'cat_pizza', '4 Сыра', 'С горгонзолой и медом', 630, 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=800', 'food'),
('piz_margo', 'cat_pizza', 'Маргарита', 'Классика', 530, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800', 'food'),
('piz_margo_strat', 'cat_pizza', 'Маргарита со страчателлой', 'Свежий сыр', 680, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 'food'),

-- ЗАКУСКИ
('st_wineplate', 'cat_starters', 'Тарелка к вину', 'Сыры, прошутто, оливки', 750, 'https://images.unsplash.com/photo-1562920616-0b16ae67b6e9?auto=format&fit=crop&q=80&w=800', 'food'),
('brusc_tomato', 'cat_starters', 'Брускетта с томатами', 'На чиабатте', 490, 'https://images.unsplash.com/photo-1572695157363-bc31c5d53149?auto=format&fit=crop&q=80&w=800', 'food'),
('brusc_shrimp', 'cat_starters', 'Брускетта с креветками', 'С авокадо', 590, 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?auto=format&fit=crop&q=80&w=800', 'food'),
('st_cheese_sticks', 'cat_starters', 'Сырные палочки', 'С ягодным соусом', 480, 'https://images.unsplash.com/photo-1531513251670-07ae439f3792?auto=format&fit=crop&q=80&w=800', 'food'),
('st_croutons', 'cat_starters', 'Чесночные гренки', 'Бородинский хлеб', 290, 'https://images.unsplash.com/photo-1621857426350-ddab819cf0cc?auto=format&fit=crop&q=80&w=800', 'food'),
('st_bread', 'cat_starters', 'Хлеб с маслом', 'Собственная выпечка', 290, 'https://images.unsplash.com/photo-1575558983952-47408f65682c?auto=format&fit=crop&q=80&w=800', 'food'),

-- ДЕСЕРТЫ
('des_classic', 'cat_dessert', 'Чизкейк Нью-Йорк', '', 320, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=800', 'food'),
('des_pavlova', 'cat_dessert', 'Павлова', 'Свежие ягоды', 490, 'https://images.unsplash.com/photo-1525152573539-78b1767e2343?auto=format&fit=crop&q=80&w=800', 'food'),
('des_basque', 'cat_dessert', 'Чизкейк Сан-Себастьян', 'Обожженный', 350, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800', 'food'),
('des_tira', 'cat_dessert', 'Тирамису', 'Классический рецепт', 450, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800', 'food'),
('sd_fries', 'cat_sides', 'Картофель фри', '', 270, 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?auto=format&fit=crop&q=80&w=800', 'food'),

-- НАПИТКИ (Кофе, Бар, Лимонады)
('cof_esp', 'cat_bar_coffee', 'Эспрессо', '', 150, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800', 'drink'),
('dr_mors', 'cat_drinks', 'Морс Домашний', 'Клюква / Облепиха', 150, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', 'drink'),
('tea_classic', 'cat_drinks', 'Чай (Чайник)', 'Ассам / Сенча', 200, 'https://images.unsplash.com/photo-1576092768241-dec231844f74?auto=format&fit=crop&q=80&w=800', 'drink'),
('des_milkshake', 'cat_drinks', 'Милкшейк', 'Ваниль / Клубника', 350, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=800', 'drink'),
('lem_berry', 'cat_drinks', 'Лимонад Ягодный', 'Малина-Базилик', 350, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', 'drink'),
('lem_mango', 'cat_drinks', 'Лимонад Манго', 'Манго-Маракуйя', 350, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', 'drink'),
('tea_sea', 'cat_drinks', 'Чай Облепиховый', 'Согревающий', 250, 'https://images.unsplash.com/photo-1576092768241-dec231844f74?auto=format&fit=crop&q=80&w=800', 'drink'),
('beer_spaten', 'cat_drinks', 'Spaten', 'Lager, Germany', 450, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800', 'drink'),
('beer_margo', 'cat_drinks', 'Фирменное пиво', 'Светлое нефильтрованное', 350, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800', 'drink'),
('dr_cola', 'cat_drinks', 'Cola', '0.33', 180, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', 'drink');
