-- 1. СБРОС (Удаляем всё старое, чтобы исправить типы данных)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS dish_modifier_groups CASCADE;
DROP TABLE IF EXISTS modifiers CASCADE;
DROP TABLE IF EXISTS modifier_groups CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;

-- 2. СОЗДАНИЕ ТАБЛИЦ (Используем TEXT для ID, чтобы работали 'br_eggs', 'cat_breakfast' и т.д.)

-- Рестораны
CREATE TABLE restaurants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    currency text DEFAULT '₽'
);

-- Категории (ID = text)
CREATE TABLE categories (
    id text PRIMARY KEY, -- Важно: text, не uuid
    restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
    name text NOT NULL,
    sort_order integer DEFAULT 0
);

-- Блюда (ID = text)
CREATE TABLE dishes (
    id text PRIMARY KEY, -- Важно: text, не uuid
    category_id text REFERENCES categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    image_url text,
    video_url text,
    old_price numeric,
    xp_reward integer DEFAULT 10,
    type text DEFAULT 'food', -- 'food' или 'drink'
    ingredients text[] DEFAULT '{}',
    badges text[] DEFAULT '{}',
    variants jsonb DEFAULT '[]'::jsonb, -- Храним варианты как JSON для простоты
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Группы модификаторов (Тут ID пусть будет UUID, это внутренняя кухня БД)
CREATE TABLE modifier_groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
    name text NOT NULL,
    min_selection integer DEFAULT 0,
    max_selection integer DEFAULT 1,
    required boolean DEFAULT false
);

-- Модификаторы
CREATE TABLE modifiers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name text NOT NULL,
    price numeric DEFAULT 0,
    sort_order integer DEFAULT 0
);

-- Связь Блюдо <-> Группа (dish_id ссылается на text id)
CREATE TABLE dish_modifier_groups (
    dish_id text REFERENCES dishes(id) ON DELETE CASCADE,
    modifier_group_id uuid REFERENCES modifier_groups(id) ON DELETE CASCADE,
    sort_order integer DEFAULT 0,
    PRIMARY KEY (dish_id, modifier_group_id)
);

-- Заказы
CREATE TABLE order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    dish_id text REFERENCES dishes(id),
    participant_id text, 
    session_id text,
    quantity integer DEFAULT 1,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. ВКЛЮЧЕНИЕ RLS (Безопасность - разрешаем всем читать всё для демо)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_modifier_groups ENABLE ROW LEVEL SECURITY;

-- Простые политики для публичного доступа (для разработки)
CREATE POLICY "Public Read All" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public Read Cats" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Dishes" ON dishes FOR SELECT USING (true);
CREATE POLICY "Public Read ModGroups" ON modifier_groups FOR SELECT USING (true);
CREATE POLICY "Public Read Mods" ON modifiers FOR SELECT USING (true);
CREATE POLICY "Public Read Links" ON dish_modifier_groups FOR SELECT USING (true);


-- 4. НАПОЛНЕНИЕ ДАННЫМИ

-- Создаем ресторан
WITH new_rest AS (
    INSERT INTO restaurants (name) VALUES ('Gastro-Vibe') RETURNING id
)
-- Вставляем Категории (используя ID ресторана)
INSERT INTO categories (id, restaurant_id, name, sort_order)
SELECT id, (SELECT id FROM new_rest), name, sort_order FROM (VALUES
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
    ('cat_bar_coffee', 'Кофе', 15),
    ('cat_drinks', 'Напитки', 12)
) AS data(id, name, sort_order);

-- Вставляем Блюда (БЕЗ Авокадо и прочих допов, только основные)
INSERT INTO dishes (id, category_id, name, description, price, image_url, type) VALUES
('br_eggs', 'cat_breakfast', 'Яйца на выбор', 'Подаются с тартином', 180, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800', 'food'),
('br_oat_banana', 'cat_breakfast', 'Овсяная каша', 'С бананом', 370, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800', 'food'),
('br_salmon', 'cat_breakfast', 'Бриошь с лососем', 'Со сливочным сыром', 550, 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800', 'food'),
('stk_ribeye', 'cat_steaks', 'Стейк Рибай', 'Мраморная говядина', 800, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800', 'food'),
('cof_cap', 'cat_bar_coffee', 'Капучино', '', 180, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800', 'drink'),
('cof_lat', 'cat_bar_coffee', 'Латте', '', 190, 'https://images.unsplash.com/photo-1570968992193-96ab73cbb9b9?auto=format&fit=crop&q=80&w=800', 'drink');


-- 5. СОЗДАНИЕ СИСТЕМЫ МОДИФИКАТОРОВ

-- === ГРУППА 1: ДОБАВКИ К ЗАВТРАКУ ===
WITH new_group AS (
  INSERT INTO modifier_groups (restaurant_id, name, min_selection, max_selection, required)
  SELECT id, 'Добавить к блюду', 0, 5, false FROM restaurants LIMIT 1
  RETURNING id
)
INSERT INTO modifiers (group_id, name, price, sort_order)
SELECT id, 'Авокадо', 150, 1 FROM new_group
UNION ALL
SELECT id, 'Лосось с/с', 420, 2 FROM new_group
UNION ALL
SELECT id, 'Бекон жареный', 150, 3 FROM new_group
UNION ALL
SELECT id, 'Сметана', 50, 4 FROM new_group;

-- === ГРУППА 2: ВЫБОР МОЛОКА ===
WITH new_group AS (
  INSERT INTO modifier_groups (restaurant_id, name, min_selection, max_selection, required)
  SELECT id, 'Выбор молока', 1, 1, true FROM restaurants LIMIT 1
  RETURNING id
)
INSERT INTO modifiers (group_id, name, price, sort_order)
SELECT id, 'На обычном', 0, 1 FROM new_group
UNION ALL
SELECT id, 'На кокосовом', 100, 2 FROM new_group
UNION ALL
SELECT id, 'На миндальном', 100, 3 FROM new_group;

-- === ГРУППА 3: СТЕПЕНЬ ПРОЖАРКИ ===
WITH new_group AS (
  INSERT INTO modifier_groups (restaurant_id, name, min_selection, max_selection, required)
  SELECT id, 'Степень прожарки', 1, 1, true FROM restaurants LIMIT 1
  RETURNING id
)
INSERT INTO modifiers (group_id, name, price, sort_order)
SELECT id, 'Rare', 0, 1 FROM new_group
UNION ALL
SELECT id, 'Medium Rare', 0, 2 FROM new_group
UNION ALL
SELECT id, 'Medium', 0, 3 FROM new_group
UNION ALL
SELECT id, 'Well Done', 0, 4 FROM new_group;


-- 6. ПРИВЯЗКА ГРУПП К БЛЮДАМ (Теперь работает, так как dishes.id это TEXT)

-- Привязка Допов к Завтракам
INSERT INTO dish_modifier_groups (dish_id, modifier_group_id)
SELECT d.id, g.id
FROM dishes d, modifier_groups g
WHERE d.id IN ('br_eggs', 'br_oat_banana', 'br_salmon') 
  AND g.name = 'Добавить к блюду';

-- Привязка Молока к Кофе
INSERT INTO dish_modifier_groups (dish_id, modifier_group_id)
SELECT d.id, g.id
FROM dishes d, modifier_groups g
WHERE d.id IN ('cof_cap', 'cof_lat')
  AND g.name = 'Выбор молока';

-- Привязка Прожарки к Стейку
INSERT INTO dish_modifier_groups (dish_id, modifier_group_id)
SELECT d.id, g.id
FROM dishes d, modifier_groups g
WHERE d.id = 'stk_ribeye'
  AND g.name = 'Степень прожарки';