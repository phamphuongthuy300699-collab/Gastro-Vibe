-- 1. ТАБЛИЦЫ (Schema)

-- Таблица Историй (Кружочки сверху)
CREATE TABLE IF NOT EXISTS stories (
    id text PRIMARY KEY,
    title text NOT NULL,
    preview_image text NOT NULL,
    color_ring text DEFAULT 'border-primary',
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Таблица Слайдов (Контент внутри истории)
CREATE TABLE IF NOT EXISTS story_slides (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id text REFERENCES stories(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    title text,
    subtitle text,
    linked_dish_id text, 
    sort_order integer DEFAULT 0
);

-- Таблица Подборок (Сеты меню)
CREATE TABLE IF NOT EXISTS collections (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    price numeric NOT NULL,
    courses jsonb DEFAULT '[]'::jsonb,
    sort_order integer DEFAULT 0
);

-- 2. БЕЗОПАСНОСТЬ (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Stories" ON stories;
DROP POLICY IF EXISTS "Public Read Slides" ON story_slides;
DROP POLICY IF EXISTS "Public Read Collections" ON collections;

CREATE POLICY "Public Read Stories" ON stories FOR SELECT USING (true);
CREATE POLICY "Public Read Slides" ON story_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Collections" ON collections FOR SELECT USING (true);

-- 3. ДАННЫЕ (Seed Data)

-- Наполнение Историй
INSERT INTO stories (id, title, preview_image, color_ring, sort_order) VALUES
('st_new', 'Новое\nМеню', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200', 'border-gold', 1),
('st_chef', 'Выбор\nШефа', 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=200', 'border-primary', 2),
('st_wine', 'Винная\nКарта', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=200', 'border-primary/50', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, preview_image = EXCLUDED.preview_image;

-- Наполнение Слайдов
DELETE FROM story_slides WHERE story_id IN ('st_new', 'st_chef', 'st_wine');
INSERT INTO story_slides (story_id, image_url, title, subtitle, linked_dish_id, sort_order) VALUES
('st_new', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', 'Завтраки весь день', 'Попробуйте наши новые бриоши', NULL, 1),
('st_chef', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800', 'Стейк Рибай', 'Идеальная прожарка', 'stk_ribeye', 1),
('st_wine', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800', 'Новые поступления', 'Попробуйте наше Prosecco', NULL, 1);

-- Наполнение Подборок
INSERT INTO collections (id, title, description, image_url, price, courses, sort_order) VALUES
('col_business', 'Бизнес-ланч', 'Быстрый и сытный обед по будням с 12 до 16', 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600', 990, '[{"courseName": "Суп", "defaultDishId": "soup_chicken", "options": ["soup_borsch", "soup_mushroom"]}, {"courseName": "Горячее", "defaultDishId": "hot_cutlets", "options": ["hot_turkey", "pst_carb"]}, {"courseName": "Напиток", "defaultDishId": "dr_mors", "options": ["tea_classic", "cof_esp"]}]'::jsonb, 1),
('col_family', 'Семейный ужин', 'Для всей семьи: пицца, десерты и напитки', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 2100, '[{"courseName": "Пицца (Основа)", "defaultDishId": "piz_pep", "options": ["piz_4cheese", "piz_margo"]}, {"courseName": "Детское / Десерт", "defaultDishId": "des_milkshake", "options": ["des_classic", "sd_fries"]}, {"courseName": "Напиток (Графин)", "defaultDishId": "lem_berry", "options": ["lem_mango", "tea_sea"]}]'::jsonb, 2),
('col_rom', 'Романтический ужин', 'Идеальный вечер для двоих с вином и изысканными блюдами', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600', 2500, '[{"courseName": "Закуска", "defaultDishId": "st_wineplate", "options": ["brusc_tomato", "brusc_shrimp"]}, {"courseName": "Горячее (x2)", "defaultDishId": "hot_salmon", "options": ["hot_seabass", "stk_machete"]}, {"courseName": "Десерт", "defaultDishId": "des_pavlova", "options": ["des_basque", "des_tira"]}]'::jsonb, 3),
('col_friends', 'Для друзей', 'Большой сет закусок и пиццы для веселой компании', 'https://images.unsplash.com/photo-1561758033-d8f3c6654d7d?auto=format&fit=crop&q=80&w=600', 3200, '[{"courseName": "Стартер", "defaultDishId": "st_cheese_sticks", "options": ["st_croutons", "st_bread"]}, {"courseName": "Пицца", "defaultDishId": "piz_pep", "options": ["piz_4cheese", "piz_margo_strat"]}, {"courseName": "Напитки (4 шт)", "defaultDishId": "beer_spaten", "options": ["beer_margo", "dr_cola"]}]'::jsonb, 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price;
