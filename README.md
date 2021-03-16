# FilmwebExporter
## O Projekcie

Skrypty eksportują oceny filmów/seriali i "Chcę zobaczyć" z Filmweb'a do formatu csv.
Pliku csv ma następujące kolumny:
* _title_ - oryginalny tytuł programu, a jak nie znajdzie, to polski;
* _movie_id_ - unikalne id programu (w bazie Filmeb'a);
* _year_ - rok produkcji programu;
* _full_rate_ - ocena społeczności Filmweb'u;
* _vote_count_ - ilość ocen programu;
* _user_vote_ - ocena użytkownika;
* _timestamp_ - date timestamp ocenienia programu przez użytkownika;
* _iso_date_ - data obejrzenia programu przez użytkownika (w formacie YYYY-MM-DD).

Kod powstał na podstawie projektu [tomasz152/filmweb-export](https://github.com/tomasz152/filmweb-export).

## Jak używać
### Pobranie obejrzanych filmów
1. Zaloguj się do Filmweb'a.
2. Przejdź do `https://www.filmweb.pl/user/<username>/films`.
3. Otwórz konsolę (*ctrl+shift+i*  -> _Console_).
4. Wklej skrypt z pliku [filmweb-exporter.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/filmweb-exporter.js)

### Pobranie obejrzanych seriali
1. Zaloguj się do Filmweb'a.
2. Przejdź do `https://www.filmweb.pl/user/<username>/serials`.
3. Otwórz konsolę (*ctrl+shift+i*  -> _Console_).
4. Wklej skrypt z pliku [filmweb-exporter.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/filmweb-exporter.js)

### Pobranie "Chcę zobaczyć"
1. Zaloguj się do Filmweb'a.
2. Przejdź do `https://www.filmweb.pl/user/<username>/wantToSee`.
3. Otwórz konsolę (*ctrl+shift+i* -> _Console_).
4. Wklej skrypt z pliku [filmweb-watchlist.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/filmweb-watchlist.js)

## Uwagi
- Częste zmiany na stronie Filmweb'u powodują, że skrypty i API szybko stają się nieaktualne. Gdyby tak się stało, można śmiało zgłaszać swoje _PR_ lub _Issues_.