-- Crea la tabella hackathons
CREATE TABLE hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  country_code TEXT,
  date_start TIMESTAMP WITH TIME ZONE NOT NULL,
  date_end TIMESTAMP WITH TIME ZONE,
  topics TEXT[],
  notes TEXT,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'luma',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'estimated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);

-- Crea indici per performance
CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_hackathons_date_start ON hackathons(date_start);
CREATE INDEX idx_hackathons_notified ON hackathons(notified);
CREATE INDEX idx_hackathons_country ON hackathons(country_code);
CREATE INDEX idx_hackathons_url ON hackathons(url); -- Per deduplicazione veloce
CREATE INDEX idx_hackathons_status_notified ON hackathons(status, notified); -- Indice composto per notifiche

-- Abilita RLS
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica
CREATE POLICY "Allow public read access" ON hackathons
FOR SELECT USING (true);

-- Policy per inserimento/aggiornamento solo da servizi autenticati
CREATE POLICY "Allow service role full access" ON hackathons
FOR ALL USING (auth.role() = 'service_role');

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_hackathons_updated_at 
    BEFORE UPDATE ON hackathons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Funzione migliorata per aggiornare automaticamente lo status
CREATE OR REPLACE FUNCTION update_hackathon_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Determina lo status basandosi sulla data
    IF NEW.date_start < NOW() THEN
        NEW.status = 'past';
    ELSIF NEW.status = 'past' AND NEW.date_start >= NOW() THEN
        NEW.status = 'upcoming';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_hackathon_status
    BEFORE INSERT OR UPDATE ON hackathons
    FOR EACH ROW
    EXECUTE FUNCTION update_hackathon_status();

-- Funzione per aggiornare massivamente gli stati degli hackathons
CREATE OR REPLACE FUNCTION update_hackathon_statuses()
RETURNS TABLE(updated_count INTEGER) AS $$
DECLARE
    updated_upcoming INTEGER;
    updated_past INTEGER;
BEGIN
    -- Sposta hackathons scaduti da upcoming a past
    UPDATE hackathons 
    SET status = 'past'
    WHERE status = 'upcoming' 
    AND date_start < NOW();
    
    GET DIAGNOSTICS updated_past = ROW_COUNT;
    
    -- Sposta hackathons futuri da past a upcoming (se necessario)
    UPDATE hackathons 
    SET status = 'upcoming'
    WHERE status = 'past' 
    AND date_start >= NOW();
    
    GET DIAGNOSTICS updated_upcoming = ROW_COUNT;
    
    -- Ritorna il numero totale di record aggiornati
    RETURN QUERY SELECT (updated_past + updated_upcoming);
END;
$$ LANGUAGE plpgsql;

-- Funzione per ottenere hackathons non notificati
CREATE OR REPLACE FUNCTION get_unnotified_hackathons()
RETURNS TABLE(
    id UUID,
    name TEXT,
    location TEXT,
    city TEXT,
    country_code TEXT,
    date_start TIMESTAMP WITH TIME ZONE,
    date_end TIMESTAMP WITH TIME ZONE,
    topics TEXT[],
    notes TEXT,
    url TEXT,
    source TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        h.id, h.name, h.location, h.city, h.country_code,
        h.date_start, h.date_end, h.topics, h.notes, h.url,
        h.source, h.status, h.created_at, h.updated_at
    FROM hackathons h
    WHERE h.notified = false 
    AND h.status = 'upcoming'
    ORDER BY h.date_start ASC;
END;
$$ LANGUAGE plpgsql;

-- Funzione per marcare hackathons come notificati
CREATE OR REPLACE FUNCTION mark_hackathons_notified(hackathon_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE hackathons 
    SET notified = true
    WHERE id = ANY(hackathon_ids)
    AND notified = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Funzione per pulire hackathons molto vecchi (opzionale)
CREATE OR REPLACE FUNCTION cleanup_old_hackathons(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM hackathons 
    WHERE status = 'past' 
    AND date_start < (NOW() - INTERVAL '1 day' * days_old);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Funzione per statistiche
CREATE OR REPLACE FUNCTION get_hackathon_stats()
RETURNS TABLE(
    total_hackathons BIGINT,
    upcoming_hackathons BIGINT,
    past_hackathons BIGINT,
    estimated_hackathons BIGINT,
    countries_count BIGINT,
    sources_count BIGINT
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        COUNT(*) as total_hackathons,
        COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming_hackathons,
        COUNT(*) FILTER (WHERE status = 'past') as past_hackathons,
        COUNT(*) FILTER (WHERE status = 'estimated') as estimated_hackathons,
        COUNT(DISTINCT country_code) FILTER (WHERE country_code IS NOT NULL) as countries_count,
        COUNT(DISTINCT source) as sources_count
    FROM hackathons;
END;
$$ LANGUAGE plpgsql;

-- Crea una vista per hackathons upcoming con informazioni aggiuntive
CREATE OR REPLACE VIEW upcoming_hackathons AS
SELECT 
    *,
    EXTRACT(DAYS FROM (date_start - NOW())) as days_until_start,
    CASE 
        WHEN date_end IS NOT NULL THEN EXTRACT(DAYS FROM (date_end - date_start))
        ELSE NULL 
    END as duration_days
FROM hackathons 
WHERE status = 'upcoming'
ORDER BY date_start ASC;

-- Crea una vista per hackathons per paese
CREATE OR REPLACE VIEW hackathons_by_country AS
SELECT 
    country_code,
    COUNT(*) as total_hackathons,
    COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming_count,
    COUNT(*) FILTER (WHERE status = 'past') as past_count,
    MAX(date_start) as latest_hackathon_date
FROM hackathons 
WHERE country_code IS NOT NULL
GROUP BY country_code
ORDER BY total_hackathons DESC;

-- Aggiungi commenti per documentazione
COMMENT ON TABLE hackathons IS 'Tabella principale per memorizzare informazioni sui hackathons europei';
COMMENT ON COLUMN hackathons.date_start IS 'Data e ora di inizio del hackathon (con timezone)';
COMMENT ON COLUMN hackathons.date_end IS 'Data e ora di fine del hackathon (opzionale, con timezone)';
COMMENT ON COLUMN hackathons.topics IS 'Array di topic/categorie del hackathon (es: AI, Crypto, Web3)';
COMMENT ON COLUMN hackathons.notified IS 'Flag per tracciare se sono state inviate notifiche per questo hackathon';
COMMENT ON FUNCTION update_hackathon_statuses() IS 'Aggiorna massivamente gli stati dei hackathons basandosi sulle date';
COMMENT ON FUNCTION get_unnotified_hackathons() IS 'Restituisce tutti i hackathons upcoming che non sono stati ancora notificati';
COMMENT ON FUNCTION mark_hackathons_notified(UUID[]) IS 'Marca una lista di hackathons come notificati';