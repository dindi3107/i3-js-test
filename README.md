# Aplikacija za Kviz i3-js-test

- Zadatak je bio da se ne koriste gotove JS/HTML/CSS. Za ovaj zadatak sam koristila svoj css, html i js. 

## Purpose:
Cilj zadatka je omogučiti korisniku da odgovara na pitanja. Kviz se sastoji od 4 slidea, svaki slide sadrži pitanje i 2-8 odgovora (broj nasumičan). Svako pitanje ima 2+n mogućih odgovora, gdje n predstavlja broj slidea. 
Primjerice na slideu broj 1(prvo pitanje) moguće je odabrati 2+1 odogovora, na slideu 2 moguće je odabrati 2+2 odogovora... Kviz ne mora imati smislena pitanja, a odgovori su jednostavno redni broj odgovora na tom slideu. 
Primjerice ako je nasumično odabrano za treci slide da ima 7 odgovora, onda se odgovori biti jednostavno 1,2,3,4,5,6,7. Rezultat kviza su svi odabrani odgovori prema pitanju. 

Rezultat primjer:
- Quastion 1: 1, 3, 2
- Quastion 2: 3
- Quastion 3: 7, 1
- Quastion 4: 5, 8

## Acceptance criteria
1. Kviz se sastoji od točno 4 slidea, svaki slide se sastoji od pitanja i 2-8 odgovora na to pitanje.
2. Broj odgovora je nasumično odabran
3. Odgovori na pitanja su redni broj odgovora (1-8)
4. Između slideova(pitanja) navigira se pritiskom na next i previous buttone.
5. Na prvom slideu previous button se ne prikazuje
6. Na zadnjem slideu umjesto "next" button prikazuje se show results button
7. Ako sva pitanja nemaju bar 1 odgovor, "show results" button je disablean.
8. Svako pitanje ima 2+n mogućih odgovora, gdje n predstavlja broj slidea. Primjerice na slideu broj 1 (prvo pitanje) moguće je odabrati 2+1 odgovora, na slideu 2 moguće je odabrati 2+2 odgovora itd.
9. Ako korisnik pokuša odabrati više odgovora nego je dozvoljeno, prikazuje se poruka upozorenja koja nestane nakon 3 sekunde.
10. Potrebno je implementirati traku odgovora gdje korisnik pritiskom na bilo koje pitanje u traci odlazi na to pitanje. Pitanje na koje je odabran barem 1 odgovor prikazana su drugom bojom u traci.
11. Rješenje mora raditi na svim modernim browserima (chrome, firefox,..) poželjno je da radi i na IE11.
12. Rješenje mora raditi na svim rezolucijama 375-8000u chrome dev toolsu ili njegovom ekvivalentu u drugim browserima.


Dijana Grbus - [GitHub Profile](https://github.com/dindi3107/i3-js-test.git)
