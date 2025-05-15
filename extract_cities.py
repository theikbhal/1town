import re

with open('reference_cities.txt', 'r', encoding='utf-8') as infile, open('reference_city_names.txt', 'w', encoding='utf-8') as outfile:
    for line in infile:
        parts = line.strip().split()
        if not parts:
            continue
        # If the first part is a number, use the second part as city name; else, use the first part
        if parts[0].isdigit():
            city = parts[1]
        else:
            city = parts[0]
        # Remove footnotes in brackets, e.g., [3], [6], [b]
        city = re.sub(r'\[.*?\]', '', city).strip()
        if city:
            outfile.write(city + '\n') 