import re
import datetime
from pathlib import Path
from dateutil import parser


def parse_date(date_str):
    """
    Estrae la data di inizio e fine da una stringa di data.
    Restituisce una tupla (data_inizio, data_fine).
    """
    try:
        # Case: date range (e.g. "Apr 7-14, 2025", "Apr 12-13, 2025")
        if '-' in date_str:
            parts = date_str.split('-')
            start_part = parts[0].strip()
            end_part = parts[1].strip()

            # Estrai l'anno
            year = None
            if ',' in end_part:
                year = end_part.split(',')[1].strip()
            elif ',' in start_part:
                year = start_part.split(',')[1].strip()

            # Parsing data iniziale
            if ',' in start_part:
                start_date = parser.parse(start_part).date()
            else:
                month = start_part.split(
                )[0] if ' ' in start_part else start_part
                day = start_part.split()[1] if ' ' in start_part and len(
                    start_part.split()) > 1 else '1'
                start_date = parser.parse(f"{month} {day}, {year}").date()

            # Parsing data finale
            if ',' in end_part:
                if any(m in end_part for m in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']):
                    end_date = parser.parse(end_part).date()
                else:
                    month = start_part.split(
                    )[0] if ' ' in start_part else start_part
                    day = end_part.split(',')[0].strip()
                    end_date = parser.parse(f"{month} {day}, {year}").date()
            else:
                if ' ' in end_part:
                    end_date = parser.parse(f"{end_part}, {year}").date()
                else:
                    month = start_part.split(
                    )[0] if ' ' in start_part else start_part
                    end_date = parser.parse(
                        f"{month} {end_part}, {year}").date()
        else:
            # Singola data (es. "Apr 11, 2025")
            start_date = parser.parse(date_str).date()
            end_date = start_date

        return start_date, end_date

    except Exception as e:
        print(f"Errore nel parsing della data '{date_str}': {e}")
        return None, None


def get_hackathon_date(row):
    """
    Estrae la data da una riga di tabella.
    Restituisce una tupla (data_inizio, data_fine) o (None, None) in caso di errore.
    """
    columns = row.split('|')
    if len(columns) >= 4:
        date_str = columns[3].strip()
        return parse_date(date_str)
    return None, None


def is_expired(row, today):
    """
    Verifica se un hackathon è scaduto rispetto alla data odierna.
    """
    start_date, _ = get_hackathon_date(row)
    return start_date and start_date < today


def sort_hackathons_by_date(hackathons):
    """
    Ordina gli hackathon per data (i più recenti in cima).
    """
    dated_rows = []

    for row in hackathons:
        start_date, end_date = get_hackathon_date(row)
        # Usa la data di inizio come criterio primario e la data di fine come secondario
        sort_key = (start_date or datetime.date(1900, 1, 1),
                    end_date or datetime.date(1900, 1, 1))
        dated_rows.append((sort_key, row))

    # Ordina per data (le più recenti in cima)
    dated_rows.sort(key=lambda x: x[0], reverse=True)

    # Estrai solo le righe ordinate
    return [row for _, row in dated_rows]


def move_expired():
    # Path del README.md
    readme_path = Path(__file__).parents[1] / "README.md"

    # Leggi il contenuto del file
    with open(readme_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Data odierna
    today = datetime.datetime.now().date()

    # Trova le sezioni degli hackathon futuri e passati
    upcoming_section_match = re.search(
        r'<h3>🟢 Upcoming Hackathons</h3>\n\n(.*?)(?=\n<details>)', content, re.DOTALL)
    past_section_match = re.search(
        r'<details>\n<summary><h3 style="display:inline-block">🔴 Past Hackathons</h3></summary>\n\n(.*?)(?=\n</details>)', content, re.DOTALL)

    if not upcoming_section_match or not past_section_match:
        print("Impossibile trovare le sezioni richieste nel README.")
        return

    # Estrai tabelle
    upcoming_table = upcoming_section_match.group(1).strip()
    past_table = past_section_match.group(1).strip()

    # Estrai righe dalle tabelle
    upcoming_rows = upcoming_table.split('\n')
    past_rows = past_table.split('\n')

    # Separa intestazioni e dati
    upcoming_header = upcoming_rows[0:2]
    upcoming_data = upcoming_rows[2:] if len(upcoming_rows) > 2 else []

    past_header = past_rows[0:2]
    past_data = past_rows[2:] if len(past_rows) > 2 else []

    # Step 1: Identifica gli hackathon scaduti
    expired_hackathons = [
        row for row in upcoming_data if is_expired(row, today)]
    current_hackathons = [
        row for row in upcoming_data if row not in expired_hackathons]

    # Se ci sono hackathon scaduti, aggiorna le sezioni
    if expired_hackathons:
        # Step 2: Unisci gli hackathon scaduti con quelli già passati
        all_past_hackathons = expired_hackathons + past_data

        # Step 3: Riordina entrambe le sezioni per data
        sorted_current = sort_hackathons_by_date(current_hackathons)
        sorted_past = sort_hackathons_by_date(all_past_hackathons)

        # Step 4: Ricostruisci le sezioni
        new_upcoming_section = "<h3>🟢 Upcoming Hackathons</h3>\n\n" + \
            "\n".join(upcoming_header + sorted_current) + "\n"

        new_past_section = "<details>\n<summary><h3 style=\"display:inline-block\">🔴 Past Hackathons</h3></summary>\n\n" + \
            "\n".join(past_header + sorted_past) + "\n"

        # Step 5: Aggiorna il contenuto del file
        new_content = content.replace(
            upcoming_section_match.group(0),
            new_upcoming_section
        ).replace(
            past_section_match.group(0),
            new_past_section
        )

        # Scrivi il nuovo contenuto nel file
        with open(readme_path, 'w', encoding='utf-8') as file:
            file.write(new_content)

        print(
            f"Aggiornamento completato! {len(expired_hackathons)} hackathon spostati nella sezione 'Past Hackathons'.")
    else:
        print("Nessun hackathon scaduto da spostare.")


if __name__ == "__main__":
    move_expired()
