-- Bu SQL dosyasını Turso SQL Console'da çalıştırın.
-- Yeni özellikler için gerekli kolon eklemeleri.

-- 1. Order tablosuna IP adresi kolonu (mükerrer sipariş kontrolü için)
ALTER TABLE "Order" ADD COLUMN ip TEXT;

-- 2. Event tablosuna IP adresi kolonu (oturum bazlı log için)
ALTER TABLE Event ADD COLUMN ip TEXT;

-- Hızlı sorgular için indeksler
CREATE INDEX IF NOT EXISTS idx_order_phone ON "Order"(phone);
CREATE INDEX IF NOT EXISTS idx_order_ip ON "Order"(ip);
CREATE INDEX IF NOT EXISTS idx_event_session ON Event(sessionId);
CREATE INDEX IF NOT EXISTS idx_event_createdat ON Event(createdAt);
CREATE INDEX IF NOT EXISTS idx_visit_ip ON Visit(ip);
CREATE INDEX IF NOT EXISTS idx_visit_session ON Visit(sessionId);
