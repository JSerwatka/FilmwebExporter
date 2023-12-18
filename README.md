# FilmwebExporter

## O projekcie

Skrypty eksportują oceny filmów/seriali i "Chcę zobaczyć" z Filmweb do formatu csv.
Pliku csv ma następujące kolumny:

- _movieId_ - unikalne id programu (w bazie Filmweb);
- _title_ - oryginalny tytuł programu, a jak nie znajdzie, to polski;
- _year_ - rok produkcji programu;
- _fullRating_ - ocena społeczności Filmweb'u;
- _voteCount_ - ilość ocen programu;
- _userRating_ - ocena użytkownika;
- _voteDate_ - data obejrzenia programu przez użytkownika (w formacie YYYY-MM-DD).

## Jak używać

### Pobranie obejrzanych filmów

1. Zaloguj się do Filmweb.
2. Przejdź do `https://www.filmweb.pl/user/<username>#/votes/film`.
3. Otwórz konsolę (_ctrl+shift+i_ -> _Console_).
4. Wklej skrypt z pliku [watched.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watched.js)
5. Zostaw kartę otwartą i nie przełączaj na żadną inną!

### Pobranie obejrzanych seriali

1. Zaloguj się do Filmweb.
2. Przejdź do `https://www.filmweb.pl/user/<username>#/votes/serial`.
3. Otwórz konsolę (_ctrl+shift+i_ -> _Console_).
4. Wklej skrypt z pliku [watched.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watched.js)
5. Zostaw kartę otwartą i nie przełączaj na żadną inną!

### Pobranie "Chcę zobaczyć"

1. Zaloguj się do Filmweb.
2. Przejdź do `https://www.filmweb.pl/user/<username>#/wantToSee/film`.
3. Otwórz konsolę (_ctrl+shift+i_ -> _Console_).
4. Wklej skrypt z pliku [watchlist.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watchlist.js)
5. Zostaw kartę otwartą i nie przełączaj na żadną inną!

## Uwagi

- Częste zmiany na stronie Filmweb'u powodują, że skrypty i API szybko stają się nieaktualne. Gdyby tak się stało, można śmiało zgłaszać swoje _PR_ lub _Issues_.
