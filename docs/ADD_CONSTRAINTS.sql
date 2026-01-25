
-- Если вы хотите, чтобы работал быстрый UPSERT (On Conflict) в будущем,
-- выполните этот скрипт в SQL Editor. Он добавит необходимые ограничения уникальности.

-- 1. Для категорий: Имя категории должно быть уникальным в рамках ресторана
ALTER TABLE categories 
ADD CONSTRAINT categories_name_unique UNIQUE (restaurant_id, name);

-- 2. Для блюд: Slug (ID из JSON) должен быть уникальным
ALTER TABLE dishes 
ADD CONSTRAINT dishes_slug_unique UNIQUE (slug);

-- 3. Для групп модификаторов (если используется)
ALTER TABLE modifier_groups 
ADD CONSTRAINT modifier_groups_name_unique UNIQUE (restaurant_id, name);
