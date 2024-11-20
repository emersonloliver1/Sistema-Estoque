-- Remover funções e triggers existentes com suas dependências
DROP TRIGGER IF EXISTS refresh_stock_summary_trigger ON products;
DROP TRIGGER IF EXISTS refresh_stock_summary_trigger_movements ON stock_movements;
DROP FUNCTION IF EXISTS trigger_refresh_stock_summary() CASCADE;
DROP FUNCTION IF EXISTS refresh_stock_summary() CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_stock_summary CASCADE;

-- Recriar a view materializada com as permissões corretas
CREATE MATERIALIZED VIEW mv_stock_summary AS
SELECT 
    brand,
    COUNT(*) as total_products,
    SUM(stock) as total_stock,
    SUM(stock * selling_price) as total_value
FROM products
GROUP BY brand;

-- Conceder permissões para a função anon (usuários não autenticados)
GRANT SELECT ON mv_stock_summary TO anon;

-- Conceder permissões para a função authenticated (usuários autenticados)
GRANT SELECT ON mv_stock_summary TO authenticated;

-- Criar função para atualizar a view materializada
CREATE FUNCTION refresh_stock_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW mv_stock_summary;
END;
$$;

-- Conceder permissões para executar a função de atualização
GRANT EXECUTE ON FUNCTION refresh_stock_summary() TO anon;
GRANT EXECUTE ON FUNCTION refresh_stock_summary() TO authenticated;

-- Criar trigger para atualizar a view materializada quando houver mudanças na tabela products
CREATE FUNCTION trigger_refresh_stock_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM refresh_stock_summary();
  RETURN NEW;
END;
$$;

-- Adicionar o trigger na tabela products
CREATE TRIGGER refresh_stock_summary_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_stock_summary();

-- Adicionar o trigger na tabela stock_movements
CREATE TRIGGER refresh_stock_summary_trigger_movements
AFTER INSERT OR UPDATE OR DELETE ON stock_movements
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_stock_summary();
