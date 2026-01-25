
import { Dish } from '../types';

export interface SeedCategory {
    id: string; 
    name: string;
    sortOrder: number;
    items: Partial<Dish>[];
}

// Helper for modifiers
const MOD_MILK = [
    { id: 'milk_cow', name: 'На обычном молоке', priceDelta: 0, group: 'milk', isSingleSelect: true },
    { id: 'milk_alt', name: 'На альтернативном', priceDelta: 50, group: 'milk', isSingleSelect: true },
    { id: 'syrup_vanilla', name: 'Сироп Ваниль', priceDelta: 40, group: 'syrup' },
    { id: 'syrup_caramel', name: 'Сироп Карамель', priceDelta: 40, group: 'syrup' },
    { id: 'syrup_lavender', name: 'Сироп Лаванда', priceDelta: 40, group: 'syrup' }
];

const MOD_STEAK = [
    { id: 'rare', name: 'Rare (С кровью)', priceDelta: 0, group: 'doneness', isSingleSelect: true },
    { id: 'med_rare', name: 'Medium Rare', priceDelta: 0, group: 'doneness', isSingleSelect: true },
    { id: 'medium', name: 'Medium (Средняя)', priceDelta: 0, group: 'doneness', isSingleSelect: true },
    { id: 'well', name: 'Well Done (Полная)', priceDelta: 0, group: 'doneness', isSingleSelect: true }
];

export const SEED_DATA: SeedCategory[] = [
    // --- ОСНОВНОЕ МЕНЮ ---

    // 1. ЗАВТРАКИ
    {
        id: 'cat_breakfast',
        name: 'Завтраки',
        sortOrder: 1,
        items: [
            { 
                id: 'br_eggs', 
                name: 'Яйца на выбор', 
                description: 'Подаются с тартином и взбитым маслом.', 
                price: 180, 
                imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800', 
                type: 'food', 
                modifiers: [
                    { id: 'egg_fried', name: 'Глазунья', priceDelta: 0, group: 'prep', isSingleSelect: true },
                    { id: 'egg_scramble', name: 'Скрембл', priceDelta: 0, group: 'prep', isSingleSelect: true },
                    { id: 'egg_omelet', name: 'Омлет', priceDelta: 0, group: 'prep', isSingleSelect: true },
                    { id: 'add_bacon', name: 'Бекон', priceDelta: 150, group: 'add' },
                    { id: 'add_salmon', name: 'Лосось', priceDelta: 420, group: 'add' },
                    { id: 'add_avocado', name: 'Авокадо', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['cof_cap', 'fr_orange', 'add_bacon', 'st_bread'] 
            },
            { 
                id: 'br_tvorog', 
                name: 'Творожная запеканка', 
                description: 'Из печи со сметаной и вареньем из вишни.', 
                price: 370, 
                imageUrl: 'https://images.unsplash.com/photo-1567327613485-fbc7bf196198?auto=format&fit=crop&q=80&w=800', 
                type: 'food',
                ingredients: ['Творог', 'Яйцо', 'Сметана', 'Вишневое варенье'],
                modifiers: [
                    { id: 'add_sour_cream', name: 'Доп. сметана', priceDelta: 50, group: 'add' },
                    { id: 'add_berries', name: 'Свежие ягоды', priceDelta: 200, group: 'add' }
                ],
                relatedItemIds: ['cof_lat', 'tea_berry', 'fr_grape'] 
            },
            { 
                id: 'br_salmon', 
                name: 'Бриошь с лососем', 
                description: 'Со слабосоленым лососем, сливочным сыром и яйцом пашот.', 
                price: 550, 
                imageUrl: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800', 
                type: 'food', 
                ingredients: ['Бриошь', 'Лосось с/с', 'Яйцо пашот', 'Сливочный сыр', 'Зелень'],
                modifiers: [
                    { id: 'add_egg_extra', name: 'Доп. яйцо', priceDelta: 80, group: 'add' },
                    { id: 'add_avocado', name: 'Авокадо', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['cof_filter', 'fr_grape', 'add_avocado'] 
            },
            { 
                id: 'br_burger', 
                name: 'Бургер с говядиной', 
                description: 'С рваной говядиной, яйцом и маринованными огурчиками.', 
                price: 550, 
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 
                type: 'food',
                ingredients: ['Булочка Бриошь', 'Котлета из говядины', 'Яйцо', 'Лук конфи', 'Соус BBQ', 'Огурцы'],
                modifiers: [
                     { id: 'burg_cheese', name: 'Сыр Чеддер', priceDelta: 100, group: 'add' },
                     { id: 'burg_bacon', name: 'Бекон', priceDelta: 150, group: 'add' },
                     { id: 'burg_jalapeno', name: 'Халапеньо', priceDelta: 50, group: 'add' }
                ],
                relatedItemIds: ['dr_cola', 'sd_fries', 'beer_margo'] 
            },
            { 
                id: 'br_oat_banana', 
                name: 'Овсяная каша сладкая', 
                description: 'С карамелизированным бананом и орехами.', 
                price: 370, 
                imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800', 
                type: 'food', 
                ingredients: ['Овсяные хлопья', 'Банан', 'Грецкий орех', 'Мята'],
                modifiers: [
                    { id: 'base_water', name: 'На воде', priceDelta: 0, group: 'base', isSingleSelect: true },
                    { id: 'base_milk', name: 'На молоке', priceDelta: 0, group: 'base', isSingleSelect: true },
                    { id: 'base_coco', name: 'На кокосовом', priceDelta: 100, group: 'base', isSingleSelect: true },
                    { id: 'add_berries', name: 'Свежие ягоды', priceDelta: 200, group: 'add' }
                ],
                relatedItemIds: ['cof_cacao', 'tea_curr', 'fr_apple'] 
            },
            { 
                id: 'br_oat_parm', 
                name: 'Овсяная каша сытная', 
                description: 'С пармезаном, беконом и яйцом пашот.', 
                price: 370, 
                imageUrl: 'https://images.unsplash.com/photo-1621255567709-6454d4f8f413?auto=format&fit=crop&q=80&w=800', 
                type: 'food', 
                ingredients: ['Овсяные хлопья', 'Пармезан', 'Бекон', 'Яйцо пашот', 'Бульон'],
                modifiers: [
                    { id: 'add_parm', name: 'Больше сыра', priceDelta: 80, group: 'add' },
                    { id: 'add_avocado', name: 'Авокадо', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['cof_filter', 'fr_orange'] 
            },
            { 
                id: 'br_icecream', 
                name: 'Бриошь с мороженым', 
                description: 'С ванильным мороженым и свежими ягодами.', 
                price: 370, 
                imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800', 
                type: 'food',
                ingredients: ['Бриошь', 'Мороженое ванильное', 'Клубника', 'Голубика', 'Мята'],
                relatedItemIds: ['tea_classic', 'cof_raf', 'lem_berry'] 
            }
        ]
    },

    // 2. ЗАКУСКИ
    {
        id: 'cat_starters',
        name: 'Закуски',
        sortOrder: 2,
        items: [
            { id: 'st_bread', name: 'Хлеб с маслом', description: 'Свежий хлеб со взбитым маслом', price: 290, imageUrl: 'https://images.unsplash.com/photo-1575558983952-47408f65682c?auto=format&fit=crop&q=80&w=800' },
            { id: 'st_croutons', name: 'Чесночные гренки', description: 'С пармезаном', price: 290, imageUrl: 'https://images.unsplash.com/photo-1621857426350-ddab819cf0cc?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['beer_spaten'] },
            { id: 'st_wineplate', name: 'Тарелка к вину', description: 'Фуа-гра, прошутто, камамбер, оливки и др.', price: 750, imageUrl: 'https://images.unsplash.com/photo-1562920616-0b16ae67b6e9?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_prosecco', 'wine_cava'] },
            { id: 'st_cheese_sticks', name: 'Сырные палочки', description: 'С ягодным соусом', price: 480, imageUrl: 'https://images.unsplash.com/photo-1531513251670-07ae439f3792?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['beer_margo'] },
            { id: 'st_herring', name: 'Сельдь с картофелем', description: 'С поджаренным картофелем и луком', price: 550, imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80&w=800' },
            { id: 'st_pate', name: 'Паштет', description: 'Из куриной печени с соусом из вишни', price: 450, imageUrl: 'https://images.unsplash.com/photo-1590556409324-73d76e73c333?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['st_bread'] },
            { id: 'brusc_tomato', name: 'Брускетта с томатами', price: 490, imageUrl: 'https://images.unsplash.com/photo-1572695157363-bc31c5d53149?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_prosecco'] },
            { id: 'brusc_shrimp', name: 'Брускетта с креветками', price: 590, imageUrl: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_balaklava'] },
            { id: 'tar_salmon', name: 'Тартар из лосося', description: 'С авокадо', price: 820, imageUrl: 'https://images.unsplash.com/photo-1562166695-1f912df082bc?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_prosecco'] },
            { id: 'tar_beef', name: 'Тартар из говядины', price: 590, imageUrl: 'https://images.unsplash.com/photo-1628294896516-3444223bb357?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['stk_machete'] },
            { id: 'mussels', name: 'Мидии блю чиз', description: 'В соусе блю чиз', price: 670, imageUrl: 'https://images.unsplash.com/photo-1626084627192-36b325990288?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['foc_parm', 'wine_balaklava'] }
        ]
    },

    // 3. САЛАТЫ
    {
        id: 'cat_salads',
        name: 'Салаты',
        sortOrder: 3,
        items: [
            { id: 'sal_caesar_turk', name: 'Цезарь с индейкой', price: 490, imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800', ingredients: ['Романо', 'Индейка', 'Пармезан', 'Соус Цезарь', 'Сухарики'] },
            { id: 'sal_caesar_shrimp', name: 'Цезарь с креветками', price: 590, imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800', ingredients: ['Романо', 'Креветки', 'Пармезан', 'Соус Цезарь', 'Сухарики'] },
            { id: 'sal_greek', name: 'Греческий салат', description: 'С брынзой и оливками', price: 550, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800', ingredients: ['Томаты', 'Огурцы', 'Перец', 'Брынза', 'Оливки', 'Лук красный'] },
            { id: 'sal_green', name: 'Зеленый салат', description: 'С креветками и авокадо', price: 790, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['fr_apple'] },
            { id: 'sal_steak', name: 'Стейк-салат', price: 890, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_cava'] },
            { id: 'sal_burrata', name: 'Буррата', description: 'С помидорами и песто', price: 750, imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['foc_rose'] }
        ]
    },

    // 4. ПИЦЦА
    {
        id: 'cat_pizza',
        name: 'Пицца',
        sortOrder: 4,
        items: [
            { id: 'foc_rose', name: 'Фокачча с розмарином', price: 150, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800' },
            { id: 'foc_parm', name: 'Фокачча с пармезаном', price: 190, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800' },
            { id: 'piz_margo', name: 'Маргарита', price: 530, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800', ingredients: ['Тесто', 'Томатный соус', 'Моцарелла', 'Базилик'], relatedItemIds: ['lem_mojito'] },
            { id: 'piz_margo_strat', name: 'Маргарита со страчателлой', price: 680, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', ingredients: ['Тесто', 'Томатный соус', 'Моцарелла', 'Страчателла'] },
            { id: 'piz_4cheese', name: '4 Сыра', price: 630, imageUrl: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=800', ingredients: ['Тесто', 'Сливочный соус', 'Моцарелла', 'Горгонзола', 'Пармезан', 'Камамбер'] },
            { id: 'piz_pep', name: 'Пепперони', price: 620, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', ingredients: ['Тесто', 'Томатный соус', 'Моцарелла', 'Пепперони'] },
            { id: 'piz_tuna', name: 'С тунцом', description: 'И красным луком', price: 750, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', ingredients: ['Тесто', 'Томатный соус', 'Тунец консерв.', 'Лук красный'] },
            { id: 'piz_sea', name: 'С морепродуктами', price: 890, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_balaklava'] },
            { id: 'piz_chicken', name: 'С курицей', description: 'И трюфельным соусом', price: 650, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
            { id: 'piz_parma', name: 'С пармой и грушей', description: 'И горгонзолой', price: 890, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_prosecco'] }
        ]
    },

    // 5. СУПЫ
    {
        id: 'cat_soups',
        name: 'Супы',
        sortOrder: 5,
        items: [
            { 
                id: 'soup_borsch', 
                name: 'Борщ', 
                price: 410, 
                imageUrl: 'https://images.unsplash.com/photo-1575850931587-c50e2714c1d6?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Говядина', 'Свекла', 'Картофель', 'Капуста', 'Сметана'],
                modifiers: [
                    { id: 'add_pampushka', name: 'Пампушка', priceDelta: 60, group: 'add' },
                    { id: 'add_salo', name: 'Сало', priceDelta: 90, group: 'add' },
                    { id: 'add_sour_cream', name: 'Доп. сметана', priceDelta: 50, group: 'add' }
                ],
                relatedItemIds: ['st_bread', 'st_pate', 'dr_mors'] 
            },
            { 
                id: 'soup_chicken', 
                name: 'Куриный бульон', 
                price: 340, 
                imageUrl: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Куриный бульон', 'Лапша', 'Яйцо', 'Зелень'],
                modifiers: [
                    { id: 'add_quail_egg', name: 'Перепелиное яйцо', priceDelta: 60, group: 'add' },
                    { id: 'st_croutons', name: 'Сухарики', priceDelta: 40, group: 'add' }
                ],
                relatedItemIds: ['sal_caesar_turk', 'tea_classic', 'foc_parm']
            },
            { 
                id: 'soup_mushroom', 
                name: 'Крем-суп из грибов', 
                description: 'Из белых грибов', 
                price: 490, 
                imageUrl: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Белые грибы', 'Сливки', 'Картофель', 'Лук'],
                modifiers: [
                    { id: 'add_truffle', name: 'Трюфельное масло', priceDelta: 100, group: 'add' },
                    { id: 'add_parm', name: 'Пармезан', priceDelta: 80, group: 'add' }
                ],
                relatedItemIds: ['st_croutons', 'sal_green', 'wine_cava'] 
            },
            { 
                id: 'soup_seafood', 
                name: 'Сливочный с морепродуктами', 
                price: 690, 
                imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Лосось', 'Креветки', 'Сливки', 'Томаты'],
                modifiers: [
                    { id: 'add_shrimp', name: 'Креветка (1 шт)', priceDelta: 150, group: 'add' },
                    { id: 'foc_rose', name: 'Фокачча', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['wine_balaklava', 'sal_greek', 'lem_mangolime']
            }
        ]
    },

    // 6. СТЕЙКИ
    {
        id: 'cat_steaks',
        name: 'Стейки',
        sortOrder: 6,
        items: [
            { id: 'stk_ribeye', name: 'Стейк Рибай', description: 'Цена за 100г сырого веса. Мраморная говядина зернового откорма.', price: 800, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800', modifiers: MOD_STEAK, relatedItemIds: ['sd_grill', 'wine_cava', 'sal_green'] },
            { id: 'stk_strip', name: 'Стейк Стриплойн', description: 'Цена за 100г сырого веса. Тонкий край, насыщенный мясной вкус.', price: 770, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800', modifiers: MOD_STEAK, relatedItemIds: ['sd_grill', 'wine_cava'] },
            { id: 'stk_machete', name: 'Стейк Мачете', description: 'Цена за 100г сырого веса. Альтернативный стейк с ярким вкусом.', price: 500, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800', modifiers: MOD_STEAK, relatedItemIds: ['sd_fries', 'beer_spaten'] }
        ]
    },

    // 7. ГОРЯЧЕЕ
    {
        id: 'cat_hot',
        name: 'Горячее',
        sortOrder: 7,
        items: [
            { 
                id: 'hot_cutlets', 
                name: 'Куриные котлеты', 
                price: 480, 
                imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Куриное филе', 'Сливки', 'Лук', 'Панировка'],
                modifiers: [
                    { id: 'add_sour_cream', name: 'Сметана', priceDelta: 50, group: 'add' },
                    { id: 'add_mushroom_sauce', name: 'Грибной соус', priceDelta: 80, group: 'add' }
                ],
                relatedItemIds: ['sd_mash', 'sal_green', 'dr_mors'] 
            },
            { 
                id: 'hot_turkey', 
                name: 'Стейк из индейки', 
                price: 620, 
                imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Филе индейки', 'Травы', 'Сливочное масло'],
                modifiers: [
                    { id: 'add_berry_sauce', name: 'Соус Ягодный', priceDelta: 60, group: 'add' },
                    { id: 'add_cheese_sauce', name: 'Сырный соус', priceDelta: 60, group: 'add' }
                ],
                relatedItemIds: ['sd_rice', 'sal_caesar_turk', 'wine_prosecco'] 
            },
            { 
                id: 'hot_bef', 
                name: 'Бефстроганов', 
                price: 690, 
                imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Говядина', 'Сливки', 'Грибы', 'Лук', 'Огурцы'],
                modifiers: [
                    { id: 'add_pickle', name: 'Маринованный огурец', priceDelta: 40, group: 'add' }
                ],
                relatedItemIds: ['sd_mash', 'dr_redbull', 'st_bread'] 
            },
            { 
                id: 'hot_seabass', 
                name: 'Сибас в белом вине', 
                price: 990, 
                imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Сибас', 'Белое вино', 'Тимьян', 'Лимон'],
                modifiers: [
                    { id: 'add_olives', name: 'Оливки', priceDelta: 80, group: 'add' },
                    { id: 'add_capers', name: 'Каперсы', priceDelta: 60, group: 'add' }
                ],
                relatedItemIds: ['sd_grill', 'wine_balaklava', 'sal_green'] 
            },
            { 
                id: 'hot_cheeks', 
                name: 'Говяжьи щечки', 
                price: 790, 
                imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Говяжьи щечки', 'Демиглас', 'Морковь'],
                modifiers: [
                    { id: 'add_parm', name: 'Пармезан', priceDelta: 80, group: 'add' }
                ],
                relatedItemIds: ['sd_mash', 'wine_cava', 'st_bread'] 
            },
            { 
                id: 'hot_salmon', 
                name: 'Стейк из лосося', 
                price: 1090, 
                imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9dd90d3e?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Стейк лосося', 'Лимон', 'Специи'],
                modifiers: [
                    { id: 'add_tartar', name: 'Соус Тар-тар', priceDelta: 60, group: 'add' },
                    { id: 'add_asparagus', name: 'Спаржа', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['sd_rice', 'lem_mangolime', 'sal_burrata'] 
            }
        ]
    },

    // 8. ГАРНИРЫ
    {
        id: 'cat_sides',
        name: 'Гарниры',
        sortOrder: 8,
        items: [
            { id: 'sd_fries', name: 'Картофель фри', price: 270, imageUrl: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['dr_cola'] },
            { id: 'sd_mash', name: 'Пюре', price: 200, imageUrl: 'https://images.unsplash.com/photo-1619898862963-3522be742e97?auto=format&fit=crop&q=80&w=800' },
            { id: 'sd_grill', name: 'Овощи гриль', price: 330, imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800' },
            { id: 'sd_rice', name: 'Рис', price: 190, imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800' }
        ]
    },

    // 9. ПАСТА (UPDATED)
    {
        id: 'cat_pasta',
        name: 'Паста',
        sortOrder: 9,
        items: [
            { 
                id: 'pst_carb', 
                name: 'Карбонара', 
                price: 490, 
                imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Спагетти', 'Бекон', 'Сливки', 'Пармезан', 'Желток'],
                modifiers: [
                    { id: 'add_parm', name: 'Доп. Пармезан', priceDelta: 80, group: 'add' },
                    { id: 'add_truffle', name: 'Трюфельное масло', priceDelta: 100, group: 'add' }
                ],
                relatedItemIds: ['wine_prosecco', 'sal_caesar_turk', 'foc_parm']
            },
            { 
                id: 'pst_las', 
                name: 'Лазанья', 
                price: 650, 
                imageUrl: 'https://images.unsplash.com/photo-1574868309219-98e47535d464?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Мясное рагу', 'Бешамель', 'Моцарелла', 'Пармезан', 'Томаты'],
                modifiers: [
                    { id: 'add_parm', name: 'Доп. Пармезан', priceDelta: 80, group: 'add' }
                ],
                relatedItemIds: ['wine_prosecco', 'sal_burrata', 'st_wineplate'] 
            },
            { 
                id: 'pst_fet', 
                name: 'Фетучини с креветками', 
                price: 680, 
                imageUrl: 'https://images.unsplash.com/photo-1626084627192-36b325990288?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Фетучини', 'Креветки', 'Сливочный соус', 'Песто'],
                modifiers: [
                    { id: 'add_shrimp', name: 'Креветка (1 шт)', priceDelta: 150, group: 'add' },
                    { id: 'add_parm', name: 'Доп. Пармезан', priceDelta: 80, group: 'add' }
                ],
                relatedItemIds: ['wine_balaklava', 'foc_rose', 'sal_greek'] 
            },
            { 
                id: 'pst_orzo', 
                name: 'Орзо с морепродуктами', 
                price: 790, 
                imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Орзо', 'Кальмар', 'Креветки', 'Мидии', 'Биск'],
                modifiers: [
                    { id: 'add_shrimp', name: 'Креветка (1 шт)', priceDelta: 150, group: 'add' }
                ],
                relatedItemIds: ['wine_balaklava', 'sal_green', 'st_croutons']
            },
            { 
                id: 'pst_rav', 
                name: 'Равиоли', 
                price: 750, 
                imageUrl: 'https://images.unsplash.com/photo-1587740908056-9d479c0093c9?auto=format&fit=crop&q=80&w=800',
                ingredients: ['Тесто', 'Рикотта', 'Шпинат', 'Сливочное масло', 'Шалфей'],
                modifiers: [
                    { id: 'add_parm', name: 'Доп. Пармезан', priceDelta: 80, group: 'add' },
                    { id: 'add_truffle', name: 'Трюфельное масло', priceDelta: 100, group: 'add' }
                ],
                relatedItemIds: ['wine_prosecco', 'sal_burrata']
            }
        ]
    },

    // 10. ДЕСЕРТЫ
    {
        id: 'cat_dessert',
        name: 'Десерты',
        sortOrder: 10,
        items: [
            { id: 'des_basque', name: 'Чизкейк Баскский', price: 350, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['cof_cap', 'tea_berry'] },
            { id: 'des_classic', name: 'Чизкейк Классический', price: 320, imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['cof_lat'] },
            { id: 'des_snickers', name: 'Чизкейк Сникерс', price: 390, imageUrl: 'https://images.unsplash.com/photo-1621245941913-c971eb058092?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['cof_raf'] },
            { id: 'des_tira', name: 'Тирамису', price: 450, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['cof_esp'] },
            { id: 'des_pavlova', name: 'Павлова', description: 'С манго и маракуйей', price: 490, imageUrl: 'https://images.unsplash.com/photo-1525152573539-78b1767e2343?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['wine_prosecco'] },
            { id: 'des_napoleon', name: 'Наполеон', price: 390, imageUrl: 'https://images.unsplash.com/photo-1559599524-78330541982b?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['tea_classic'] },
            { id: 'des_curd_ring', name: 'Творожное кольцо', price: 190, imageUrl: 'https://images.unsplash.com/photo-1616031033380-c2dfb2385153?auto=format&fit=crop&q=80&w=800', relatedItemIds: ['cof_cap'] },
            { id: 'des_macaron', name: 'Макарон', price: 190, imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800' },
            { id: 'des_zefir', name: 'Зефир', price: 60, imageUrl: 'https://images.unsplash.com/photo-1527960669566-f881763ef841?auto=format&fit=crop&q=80&w=800' }
        ]
    },

    // 11-14 (Other Drinks) ... Skipped for brevity, assume they exist as before

    // 15. КОФЕ / МАТЧА (UPDATED: All items aligned with Capuccino structure)
    {
        id: 'cat_bar_coffee',
        name: 'Кофе / Матча',
        sortOrder: 15,
        items: [
            { 
                id: 'cof_esp', 
                name: 'Эспрессо / Доппио / Американо', 
                price: 150, 
                imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                variants: [
                    { id: 'esp_s', name: '40 мл', price: 150, volume: '40 ml' },
                    { id: 'esp_d', name: '80 мл', price: 210, volume: '80 ml' },
                    { id: 'esp_a', name: 'Американо', price: 180, volume: '200 ml' }
                ],
                relatedItemIds: ['des_tira'] 
            },
            { 
                id: 'cof_cap', 
                name: 'Капучино', 
                price: 180, 
                imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800', 
                type: 'drink', 
                modifiers: [...MOD_MILK], 
                variants: [
                    { id: 'cap_s', name: '220 мл', price: 180, volume: '220 ml' },
                    { id: 'cap_l', name: '300 мл', price: 240, volume: '300 ml' }
                ], 
                relatedItemIds: ['des_basque'] 
            },
            { 
                id: 'cof_lat', 
                name: 'Латте', 
                price: 190, 
                imageUrl: 'https://images.unsplash.com/photo-1570968992193-96ab73cbb9b9?auto=format&fit=crop&q=80&w=800', 
                type: 'drink', 
                modifiers: [...MOD_MILK], 
                variants: [
                    { id: 'lat_s', name: '300 мл', price: 190, volume: '300 ml' },
                    { id: 'lat_l', name: '400 мл', price: 250, volume: '400 ml' }
                ],
                relatedItemIds: ['des_macaron'] 
            },
            { 
                id: 'cof_flat', 
                name: 'Флэт Уайт', 
                price: 240, 
                imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800', 
                type: 'drink', 
                modifiers: [...MOD_MILK],
                variants: [
                    { id: 'flat_std', name: '200 мл', price: 240, volume: '200 ml' }
                ]
            },
            { 
                id: 'cof_raf', 
                name: 'Раф', 
                price: 240, 
                imageUrl: 'https://images.unsplash.com/photo-1620360389360-120531818274?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                modifiers: [...MOD_MILK],
                variants: [
                    { id: 'raf_s', name: '300 мл', price: 240, volume: '300 ml' },
                    { id: 'raf_l', name: '400 мл', price: 290, volume: '400 ml' }
                ]
            },
            { 
                id: 'cof_filter', 
                name: 'Фильтр кофе', 
                price: 200, 
                imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                variants: [
                    { id: 'filt_s', name: '200 мл', price: 200, volume: '200 ml' },
                    { id: 'filt_l', name: '300 мл', price: 250, volume: '300 ml' }
                ]
            },
            { 
                id: 'cof_bumble', 
                name: 'Бамбл', 
                price: 250, 
                imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b5c5090c?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                modifiers: [{ id: 'syrup_caramel', name: 'Сироп Карамель', priceDelta: 40, group: 'syrup' }],
                variants: [
                    { id: 'bumb_s', name: '350 мл', price: 250, volume: '350 ml' }
                ]
            },
            { 
                id: 'cof_tonic', 
                name: 'Лаймовый эспрессо тоник', 
                price: 240, 
                imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b5c5090c?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                variants: [
                    { id: 'ton_s', name: '350 мл', price: 240, volume: '350 ml' }
                ]
            },
            { 
                id: 'cof_matcha', 
                name: 'Матча Латте', 
                price: 240, 
                imageUrl: 'https://images.unsplash.com/photo-1515823664-b6eb921b0051?auto=format&fit=crop&q=80&w=800', 
                type: 'drink', 
                modifiers: [...MOD_MILK], 
                variants: [
                    { id: 'mat_s', name: '250 мл', price: 240, volume: '250 ml' },
                    { id: 'mat_l', name: '350 мл', price: 310, volume: '350 ml' }
                ] 
            },
            { 
                id: 'cof_cacao', 
                name: 'Горячий шоколад / Какао', 
                price: 220, 
                imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800', 
                type: 'drink', 
                modifiers: [...MOD_MILK],
                variants: [
                    { id: 'cacao_s', name: '300 мл', price: 220, volume: '300 ml' }
                ]
            },
            { 
                id: 'cof_decaf', 
                name: 'Декаф', 
                price: 230, 
                imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800', 
                type: 'drink',
                modifiers: [...MOD_MILK],
                variants: [
                    { id: 'decaf_s', name: '200 мл', price: 230, volume: '200 ml' }
                ]
            }
        ]
    }
];
