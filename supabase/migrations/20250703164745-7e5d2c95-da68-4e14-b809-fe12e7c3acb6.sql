
-- Deletar todos os pedidos de teste
DELETE FROM public.orders;

-- Reset da sequência para começar do número 1 novamente
ALTER SEQUENCE IF EXISTS order_number_seq RESTART WITH 1;
