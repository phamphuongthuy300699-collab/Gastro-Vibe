-- 1. Добавляем колонки, если их нет
DO $$
BEGIN
    -- Добавляем related_item_ids (для рекомендаций)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'related_item_ids') THEN
        ALTER TABLE dishes ADD COLUMN related_item_ids text[] DEFAULT '{}';
    END IF;

    -- Добавляем slug (текстовый ID для связок в коде, например 'br_eggs')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'slug') THEN
        ALTER TABLE dishes ADD COLUMN slug text;
        ALTER TABLE dishes ADD CONSTRAINT dishes_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- 2. Массовое обновление данных (Связываем по ИМЕНИ блюда)
-- Исправлено: ingredients приводим к to_jsonb(), так как в базе это колонка типа JSONB

UPDATE dishes AS d
SET
    slug = v.slug,
    ingredients = to_jsonb(v.ingredients::text[]), 
    related_item_ids = v.related_item_ids::text[]
FROM (VALUES
    -- ЗАВТРАКИ
    ('Яйца на выбор', 'br_eggs', '{}', '{cof_cap,fr_orange,add_bacon,st_bread}'),
    ('Творожная запеканка', 'br_tvorog', '{Творог,Яйцо,Сметана,Вишневое варенье}', '{cof_lat,tea_berry,fr_grape}'),
    ('Бриошь с лососем', 'br_salmon', '{Бриошь,Лосось с/с,Яйцо пашот,Сливочный сыр,Зелень}', '{cof_filter,fr_grape,add_avocado}'),
    ('Бургер с говядиной', 'br_burger', '{Булочка Бриошь,Котлета из говядины,Яйцо,Лук конфи,Соус BBQ,Огурцы}', '{dr_cola,sd_fries,beer_margo}'),
    ('Овсяная каша сладкая', 'br_oat_banana', '{Овсяные хлопья,Банан,Грецкий орех,Мята}', '{cof_cacao,tea_curr,fr_apple}'),
    ('Овсяная каша сытная', 'br_oat_parm', '{Овсяные хлопья,Пармезан,Бекон,Яйцо пашот,Бульон}', '{cof_filter,fr_orange}'),
    ('Бриошь с мороженым', 'br_icecream', '{Бриошь,Мороженое ванильное,Клубника,Голубика,Мята}', '{tea_classic,cof_raf,lem_berry}'),

    -- ЗАКУСКИ
    ('Чесночные гренки', 'st_croutons', '{}', '{beer_spaten}'),
    ('Тарелка к вину', 'st_wineplate', '{}', '{wine_prosecco,wine_cava}'),
    ('Сырные палочки', 'st_cheese_sticks', '{}', '{beer_margo}'),
    ('Паштет', 'st_pate', '{}', '{st_bread}'),
    ('Брускетта с томатами', 'brusc_tomato', '{}', '{wine_prosecco}'),
    ('Брускетта с креветками', 'brusc_shrimp', '{}', '{wine_balaklava}'),
    ('Тартар из лосося', 'tar_salmon', '{}', '{wine_prosecco}'),
    ('Тартар из говядины', 'tar_beef', '{}', '{stk_machete}'),
    ('Мидии блю чиз', 'mussels', '{}', '{foc_parm,wine_balaklava}'),

    -- САЛАТЫ
    ('Цезарь с индейкой', 'sal_caesar_turk', '{Романо,Индейка,Пармезан,Соус Цезарь,Сухарики}', '{}'),
    ('Цезарь с креветками', 'sal_caesar_shrimp', '{Романо,Креветки,Пармезан,Соус Цезарь,Сухарики}', '{}'),
    ('Греческий салат', 'sal_greek', '{Томаты,Огурцы,Перец,Брынза,Оливки,Лук красный}', '{}'),
    ('Зеленый салат', 'sal_green', '{}', '{fr_apple}'),
    ('Стейк-салат', 'sal_steak', '{}', '{wine_cava}'),
    ('Буррата', 'sal_burrata', '{}', '{foc_rose}'),

    -- ПИЦЦА
    ('Маргарита', 'piz_margo', '{Тесто,Томатный соус,Моцарелла,Базилик}', '{lem_mojito}'),
    ('Маргарита со страчателлой', 'piz_margo_strat', '{Тесто,Томатный соус,Моцарелла,Страчателла}', '{}'),
    ('4 Сыра', 'piz_4cheese', '{Тесто,Сливочный соус,Моцарелла,Горгонзола,Пармезан,Камамбер}', '{}'),
    ('Пепперони', 'piz_pep', '{Тесто,Томатный соус,Моцарелла,Пепперони}', '{}'),
    ('С тунцом', 'piz_tuna', '{Тесто,Томатный соус,Тунец консерв.,Лук красный}', '{}'),
    ('С морепродуктами', 'piz_sea', '{}', '{wine_balaklava}'),
    ('С пармой и грушей', 'piz_parma', '{}', '{wine_prosecco}'),

    -- СУПЫ
    ('Борщ', 'soup_borsch', '{Говядина,Свекла,Картофель,Капуста,Сметана}', '{st_bread,st_pate,dr_mors}'),
    ('Куриный бульон', 'soup_chicken', '{Куриный бульон,Лапша,Яйцо,Зелень}', '{sal_caesar_turk,tea_classic,foc_parm}'),
    ('Крем-суп из грибов', 'soup_mushroom', '{Белые грибы,Сливки,Картофель,Лук}', '{st_croutons,sal_green,wine_cava}'),
    ('Сливочный с морепродуктами', 'soup_seafood', '{Лосось,Креветки,Сливки,Томаты}', '{wine_balaklava,sal_greek,lem_mangolime}'),

    -- СТЕЙКИ
    ('Стейк Рибай', 'stk_ribeye', '{}', '{sd_grill,wine_cava,sal_green}'),
    ('Стейк Стриплойн', 'stk_strip', '{}', '{sd_grill,wine_cava}'),
    ('Стейк Мачете', 'stk_machete', '{}', '{sd_fries,beer_spaten}'),

    -- ГОРЯЧЕЕ
    ('Куриные котлеты', 'hot_cutlets', '{Куриное филе,Сливки,Лук,Панировка}', '{sd_mash,sal_green,dr_mors}'),
    ('Стейк из индейки', 'hot_turkey', '{Филе индейки,Травы,Сливочное масло}', '{sd_rice,sal_caesar_turk,wine_prosecco}'),
    ('Бефстроганов', 'hot_bef', '{Говядина,Сливки,Грибы,Лук,Огурцы}', '{sd_mash,dr_redbull,st_bread}'),
    ('Сибас в белом вине', 'hot_seabass', '{Сибас,Белое вино,Тимьян,Лимон}', '{sd_grill,wine_balaklava,sal_green}'),
    ('Говяжьи щечки', 'hot_cheeks', '{Говяжьи щечки,Демиглас,Морковь}', '{sd_mash,wine_cava,st_bread}'),
    ('Стейк из лосося', 'hot_salmon', '{Стейк лосося,Лимон,Специи}', '{sd_rice,lem_mangolime,sal_burrata}'),

    -- ГАРНИРЫ
    ('Картофель фри', 'sd_fries', '{}', '{dr_cola}'),

    -- ПАСТА
    ('Карбонара', 'pst_carb', '{Спагетти,Бекон,Сливки,Пармезан,Желток}', '{wine_prosecco,sal_caesar_turk,foc_parm}'),
    ('Лазанья', 'pst_las', '{Мясное рагу,Бешамель,Моцарелла,Пармезан,Томаты}', '{wine_prosecco,sal_burrata,st_wineplate}'),
    ('Фетучини с креветками', 'pst_fet', '{Фетучини,Креветки,Сливочный соус,Песто}', '{wine_balaklava,foc_rose,sal_greek}'),
    ('Орзо с морепродуктами', 'pst_orzo', '{Орзо,Кальмар,Креветки,Мидии,Биск}', '{wine_balaklava,sal_green,st_croutons}'),
    ('Равиоли', 'pst_rav', '{Тесто,Рикотта,Шпинат,Сливочное масло,Шалфей}', '{wine_prosecco,sal_burrata}'),

    -- ДЕСЕРТЫ
    ('Чизкейк Баскский', 'des_basque', '{}', '{cof_cap,tea_berry}'),
    ('Чизкейк Классический', 'des_classic', '{}', '{cof_lat}'),
    ('Чизкейк Сникерс', 'des_snickers', '{}', '{cof_raf}'),
    ('Тирамису', 'des_tira', '{}', '{cof_esp}'),
    ('Павлова', 'des_pavlova', '{}', '{wine_prosecco}'),
    ('Наполеон', 'des_napoleon', '{}', '{tea_classic}'),
    ('Творожное кольцо', 'des_curd_ring', '{}', '{cof_cap}'),

    -- КОФЕ
    ('Эспрессо / Доппио / Американо', 'cof_esp', '{}', '{des_tira}'),
    ('Капучино', 'cof_cap', '{}', '{des_basque}'),
    ('Латте', 'cof_lat', '{}', '{des_macaron}')

) AS v(name, slug, ingredients, related_item_ids)
WHERE d.name = v.name;