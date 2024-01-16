# FilmwebExporter

## O projekcie

Skrypty eksportują oceny filmów/seriali i "Chcę zobaczyć" z Filmweb do formatu csv.
Plik csv może mieć następujące kolumny:

- _movieId_/_serialId_/_gameId_ - unikalne id programu (w bazie Filmweb);
- _polishTitle_ - tytuł polskiego wydania (w niektórych wypadkach może być taki sam jak oryginalny)
- _originalTitle_ - tytuł oryginalny
- _year_ - rok produkcji
- _fullRating_ - ocena społeczności Filmweb
- _voteCount_ - ilość ocen
- _voteDate_ - data obejrzenia/zagrania przez użytkownika (w formacie YYYY-MM-DD)
- _userRating_ - ocena użytkownika
- _favorite_ - czy był dodanych do ulubionych

## Jak używać

### Pobranie obejrzanych filmów

1. Zaloguj się do Filmweb.
2. Przejdź do `https://www.filmweb.pl/user/<username>#/votes/film`.
3. Otwórz konsolę (_ctrl+shift+i_ -> _Console_).
4. Wklej skrypt z pliku [watched.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watched.js)
5. Zostaw kartę otwartą i nie przełączaj na żadną inną!

### Krok po kroku

1. Zaloguj się do Filmweb'a.
2. Przejdź do `https://www.filmweb.pl/user/<username>`.
3. Otwórz konsolę
       ![image](https://github.com/JSerwatka/Filmweb2Letterboxd/assets/33938646/2b4ce2e1-0556-4fbd-b29c-1cb957918ca4)
    - Windows: `Ctrl + Shift + J`
    - Mac: `Cmd + Option + J`
5. Wklej skrypt z pliku 
    - Dla obejrzanych filmów: [watched_film.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watched_film.js)
    - Dla obejrzanych seriali: [watched_serial.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watched_serial.js)
    - Dla zagranych gier: [played_games.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/played_games.js)
    - Dla "Chcę zobaczyć" filmy: [watchlist_film.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watchlist_film.js)
    - Dla "Chcę zobaczyć" seriale: [watchlist_serial.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/watchlist_serial.js)
    - Dla "Chcę zagrać" gry: [playlist_games.js](https://github.com/JSerwatka/FilmwebExporter/blob/master/playlist_games.js)
6. Zostaw kartę otwartą i nie przełączaj na żadną inną!

## Uwagi

- Częste zmiany na stronie Filmweb'u powodują, że skrypty i API szybko stają się nieaktualne. Gdyby tak się stało, można śmiało zgłaszać swoje _PR_ lub _Issues_.
