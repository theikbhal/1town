import json

# Load your JSON file
with open('cities.json', 'r', encoding='utf-8') as f:
    my_cities = json.load(f)

# Load the reference list (one city per line, as on Wikipedia)
with open('reference_cities.txt', 'r', encoding='utf-8') as f:
    ref_cities = [line.strip() for line in f if line.strip()]

# Normalize city names for comparison (lowercase, strip spaces)
def normalize(name):
    return name.lower().replace('–', '-').replace('—', '-').replace('&', 'and').replace(',', '').replace('.', '').replace('(', '').replace(')', '').replace('[', '').replace(']', '').replace('  ', ' ').strip()

my_city_names = set(normalize(city['city']) for city in my_cities)
ref_city_names = set(normalize(city) for city in ref_cities)

missing = ref_city_names - my_city_names
extra = my_city_names - ref_city_names

print(f"Missing cities in cities.json ({len(missing)}):")
for city in sorted(missing):
    print(city)

# print(f"\nCities in cities.json not in reference ({len(extra)}):")
# for city in sorted(extra):
#     print(city) 