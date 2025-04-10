import re
import datetime
from pathlib import Path
from dateutil import parser


def move_expired():
    # Path to README.md
    readme_path = Path(__file__).parents[1] / "README.md"

    # Read the file content
    with open(readme_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Today's date
    today = datetime.datetime.now().date()

    # Find the upcoming and past hackathons sections
    upcoming_section_match = re.search(
        r'### 🟢 Upcoming Hackathons\n\n(.*?)(?=\n### 🔵)', content, re.DOTALL)
    past_section_match = re.search(
        r'### 🔴 Past Hackathons\n\n(.*?)(?=\n---|$)', content, re.DOTALL)

    if not upcoming_section_match or not past_section_match:
        print("Unable to find the required sections in README.")
        return

    upcoming_table = upcoming_section_match.group(1).strip()
    past_table = past_section_match.group(1).strip()

    # Extract rows from the upcoming hackathons table
    upcoming_rows = upcoming_table.split('\n')
    header = upcoming_rows[0:2]  # Table header
    data_rows = upcoming_rows[2:]  # Data rows

    # Filter expired hackathons
    expired_hackathons = []
    current_hackathons = []

    for row in data_rows:
        # Extract date from row
        date_match = re.search(r'\| ([^|]+) \|', row, re.DOTALL)

        if not date_match or len(date_match.groups()) < 1:
            # If we can't find the date, keep the row in the current section
            current_hackathons.append(row)
            continue

        # Extract the third column containing the date
        columns = row.split('|')
        if len(columns) < 4:
            current_hackathons.append(row)
            continue

        date_str = columns[3].strip()

        try:
            # Case 1: "Apr 12 - 13, 2025" (same month)
            if '-' in date_str and ',' in date_str and date_str.count(',') == 1:
                parts = date_str.split('-')
                if len(parts) == 2:
                    start_part = parts[0].strip()
                    end_part = parts[1].strip()

                    # If the start part doesn't have a year, add it from the end part
                    if ',' not in start_part:
                        year = end_part.split(',')[1].strip()
                        month = start_part.split()[0]
                        start_day = start_part.split()[1] if len(
                            start_part.split()) > 1 else start_part
                        start_date = parser.parse(
                            f"{month} {start_day}, {year}")
                    else:
                        start_date = parser.parse(start_part)

                    start_date = start_date.date()

            # Case 2: "Apr 5 - Apr 6, 2025" (different months)
            elif '-' in date_str and date_str.count(',') == 1:
                parts = date_str.split('-')
                if len(parts) == 2:
                    start_part = parts[0].strip()

                    # Analyze the start part
                    if ',' not in start_part:
                        # No year in first part, take it from the second part
                        end_part = parts[1].strip()
                        year = end_part.split(',')[1].strip()
                        start_date = parser.parse(f"{start_part}, {year}")
                    else:
                        start_date = parser.parse(start_part)

                    start_date = start_date.date()

            # Case 3: "Apr 11, 2025" (single date)
            elif ',' in date_str and '-' not in date_str:
                start_date = parser.parse(date_str).date()

            # Case 4: "Nov 22-24, 2024" (compact format)
            elif '-' in date_str and ',' in date_str:
                month = date_str.split()[0]
                day_range = date_str.split()[1].split('-')[0]
                year = date_str.split(',')[1].strip()
                start_date = parser.parse(
                    f"{month} {day_range}, {year}").date()

            # Generic format for other cases
            else:
                start_date = parser.parse(date_str).date()

        except Exception as e:
            print(f"Error parsing date '{date_str}': {e}")
            current_hackathons.append(row)
            continue

        # Compare with today's date
        if start_date < today:
            expired_hackathons.append(row)
        else:
            current_hackathons.append(row)

    # If there are expired events, update the sections
    if expired_hackathons:
        # Get rows from past hackathons table
        past_rows = past_table.split('\n')
        past_header = past_rows[0:2]
        past_data_rows = past_rows[2:] if len(past_rows) > 2 else []

        # Merge expired hackathons with existing past ones
        all_past_hackathons = expired_hackathons + past_data_rows

        # Sort past hackathons by date (most recent at the top)
        # Date extraction and sorting
        dated_rows = []
        for row in all_past_hackathons:
            columns = row.split('|')
            if len(columns) >= 4:
                date_str = columns[3].strip()
                try:
                    # Try to extract the event's end date
                    if '-' in date_str:
                        # For date ranges, take the last date
                        parts = date_str.split('-')
                        end_part = parts[1].strip()
                        if ',' in end_part:
                            # If the end part has a comma, it's a complete date
                            event_date = parser.parse(end_part).date()
                        else:
                            # Otherwise, we need to reconstruct it
                            start_part = parts[0].strip()
                            if ',' in start_part:
                                # If first part has a comma and year
                                month = start_part.split()[0]
                                year = start_part.split(',')[1].strip()
                                day = end_part.split()[0] if len(
                                    end_part.split()) > 0 else end_part
                                event_date = parser.parse(
                                    f"{month} {day}, {year}").date()
                            else:
                                # Assume the year is at the end
                                if len(parts) > 1 and ',' in parts[1]:
                                    year = parts[1].split(',')[1].strip()
                                    event_date = parser.parse(
                                        f"{date_str}").date()
                                else:
                                    # Fallback: use the complete date
                                    event_date = parser.parse(date_str).date()
                    else:
                        # Single date
                        event_date = parser.parse(date_str).date()

                    dated_rows.append((event_date, row))
                except:
                    # If we can't extract the date, add it to the end
                    dated_rows.append((datetime.date(1900, 1, 1), row))
            else:
                # Rows with incorrect format go to the end
                dated_rows.append((datetime.date(1900, 1, 1), row))

        # Sort by date (most recent at the top)
        dated_rows.sort(key=lambda x: x[0], reverse=True)

        # Take only the sorted rows
        sorted_past_hackathons = [row for _, row in dated_rows]

        # Rebuild the "Upcoming Hackathons" section
        new_upcoming_section = "### 🟢 Upcoming Hackathons\n\n" + \
            "\n".join(header + current_hackathons) + "\n"

        # Rebuild the "Past Hackathons" section
        new_past_section = "### 🔴 Past Hackathons\n\n" + \
            "\n".join(past_header + sorted_past_hackathons) + "\n"

        # Update the file content
        new_content = content.replace(
            upcoming_section_match.group(0),
            new_upcoming_section
        ).replace(
            past_section_match.group(0),
            new_past_section
        )

        # Write the new content to the file
        with open(readme_path, 'w', encoding='utf-8') as file:
            file.write(new_content)

        print(
            f"Update completed! {len(expired_hackathons)} hackathons moved to 'Past Hackathons' section.")
    else:
        print("No expired hackathons to move.")


if __name__ == "__main__":
    move_expired()
