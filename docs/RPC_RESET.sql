
-- Создаем функцию для полной очистки меню
-- SECURITY DEFINER означает, что функция выполняется с правами создателя (postgres),
-- что позволяет обойти RLS, но мы вручную проверяем роль admin внутри.

CREATE OR REPLACE FUNCTION admin_wipe_menu()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Проверка безопасности: Вызывающий должен быть админом
  IF ((auth.jwt() -> 'user_metadata' ->> 'role') <> 'admin') THEN
    RAISE EXCEPTION 'Access Denied: You must be an admin to perform this action.';
  END IF;

  -- 2. Очистка таблиц (TRUNCATE быстрее и надежнее DELETE для полной очистки)
  -- CASCADE автоматически очистит зависимые таблицы (например, dishes удалятся, если удалим categories)
  -- Мы перечисляем основные таблицы, CASCADE сделает остальное.
  
  TRUNCATE TABLE 
    order_items,
    dish_modifier_groups,
    modifiers,
    modifier_groups,
    dishes,
    categories
  RESTART IDENTITY CASCADE;
  
  -- identity restart сбросит счетчики ID, если они числовые (у нас UUID, но полезно для порядка)
END;
$$;
