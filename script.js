(function() {
  // Unaprijed definirani slajdovi s pitanjima i odgovorima
  var predefinedSlides = [
    {
      id: 1,
      question: 'Koje od ovih životinja ne mogu letjeti?',
      answers: ['Pingvin', 'Orao', 'Delfin', 'Vrabac', 'Leptir', 'Jelen', 'Slon', 'Kos']
    },
    {
      id: 2,
      question: 'Koje životinje imaju krila?',
      answers: ['Kokoš', 'Lastavica', 'Roda', 'Slavuj', 'Žaba', 'Gušter', 'Pas', 'Jelen']
    },
    {
      id: 3,
      question: 'Koje su domaće životinje?',
      answers: ['Pas', 'Mačka', 'Krava', 'Ovca', 'Konj', 'Lav', 'Tigar', 'Žirava']
    },
    {
      id: 4,
      question: 'Koje životinje imaju četiri noge?',
      answers: ['Lav', 'Tigar', 'Slon', 'Mačka', 'Pas', 'Pjetao', 'Puma', 'Noj']
    }
  ];

  var totalSlides = predefinedSlides.length; // Ukupan broj slajdova (4)
  var slides = []; 
  var answersSelected = {};

  // Funkcija za miješanje niza (Fisher-Yates algoritam)
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); // Nasumičan indeks
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array; // Vraća promiješani niz
  }

  // Funkcija za generiranje nasumičnog broja između min i max (inkluzivno)
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Inicijalizacija kviza
  function initQuiz() {
    generateSlides(); 
    renderSlides(); 
    renderSidebar(); 
    updateNavigationButtons(); 
    updateSidebarSelection(); 
    addEventListeners(); 
  }

  // Generiranje slajdova s unaprijed definiranim pitanjima i odgovorima
  function generateSlides() {
    for (var i = 0; i < predefinedSlides.length; i++) {
      var slide = predefinedSlides[i];
      
      var slideNumber = slide.id; // Broj trenutnog slajda (1-4)
      var minAnswers = 2 + slideNumber; // Minimalan broj odgovora (2 + n)
      var maxAnswers = 8; // Maksimalan broj odgovora

      // Provjera da minimalan broj odgovora ne prelazi maksimalni
      if (minAnswers > maxAnswers) {
        minAnswers = maxAnswers;
      }

      // Generiranje nasumičnog broja odgovora između minAnswers i maxAnswers
      var countAnswers = getRandomNumber(minAnswers, maxAnswers);

      // Promiješaj dostupne odgovore
      var shuffledAnswers = shuffleArray(slide.answers);

      // Uzimanje samo prvih countAnswers odgovora iz promiješanih
      var selectedAnswers = shuffledAnswers.slice(0, countAnswers);

      // Dodavanje slajda u niz slides
      slides.push({
        id: slide.id,
        question: slide.question,
        answers: selectedAnswers // Koristi odabrane odgovore
      });
    }
  }

  // Renderiranje slajdova u HTML
  function renderSlides() {
      var quizForm = document.getElementById('quizForm');
      quizForm.innerHTML = ''; // Očisti prethodni sadržaj

      for (var i = 0; i < slides.length; i++) {
        var slide = slides[i];
        var slideDiv = document.createElement('div');
        slideDiv.className = 'question-slide';
        if (i === 0) {
          slideDiv.className += ' active'; 
        }
        slideDiv.setAttribute('data-slide', slide.id);

        var question = document.createElement('h3');
        question.textContent = "Pitanje " + (i + 1) + ": " + slide.question;
        slideDiv.appendChild(question);

        var answersList = document.createElement('ul');
        answersList.className = 'answers';
        for (var j = 0; j < slide.answers.length; j++) {
          var answer = slide.answers[j];
          var li = document.createElement('li');

          var button = document.createElement('button');
          button.type = 'button';
          button.id = 'slide' + slide.id + '_answer' + j;
          button.className = 'answer-btn';
          button.textContent = (j + 1) + '. ' + answer;

          // Odabir odgovora
          button.addEventListener('click', (function(slideNumber, answerText, buttonElement) {
            return function() {
                toggleAnswerSelection(slideNumber, answerText, buttonElement);
            };
          })(slide.id, answer, button));

          li.appendChild(button);
          answersList.appendChild(li);
        }

        slideDiv.appendChild(answersList);
        quizForm.appendChild(slideDiv);
      }
  }

  // Renderiranje sidebar s listom pitanja
  function renderSidebar() {
    var questionList = document.getElementById('questionList');
    questionList.innerHTML = ''; // Očisti prethodni sadržaj

    for (var i = 0; i < slides.length; i++) {
      var slide = slides[i];
      var li = document.createElement('li');
      li.textContent = 'Pitanje ' + slide.id;
      li.setAttribute('data-slide', slide.id);

      // Dodaj event listener za navigaciju
      li.addEventListener('click', function() {
        var slideNumber = parseInt(this.getAttribute('data-slide'), 10);
        navigateToSlide(slideNumber);
      });

      // Ako je pitanje već odabrano, dodaj klasu 'completed'
      if (answersSelected['slide' + slide.id] && answersSelected['slide' + slide.id].length > 0) {
        li.classList.add('completed');
      }

      questionList.appendChild(li);
    }
  }

  // Toggle selekcije odgovora
  function toggleAnswerSelection(slideNumber, answerText, buttonElement) {
    // Ako odgovor nije odabran za ovaj slajd, inicijaliziraj niz
    if (!answersSelected['slide' + slideNumber]) {
      answersSelected['slide' + slideNumber] = [];
    }

    var index = answersSelected['slide' + slideNumber].indexOf(answerText);
    
    // Izračunaj maksimalni broj dopuštenih odgovora (2 + n)
    var maxAllowed = 2 + slideNumber; // n je slideNumber

    if (index > -1) {
      // Ukloni odgovor iz odabranih
      answersSelected['slide' + slideNumber].splice(index, 1);
      buttonElement.classList.remove('selected'); // Ukloni vizualnu selekciju
      warningDisplayed = false; // Resetiraj status upozorenja
    } else {
      // Provjeri maksimalni broj odgovora
      if (answersSelected['slide' + slideNumber].length >= maxAllowed) {
        showWarning('Možete odabrati najviše ' + maxAllowed + ' odgovora za ovo pitanje.');
        return;
      }
      // Dodaj odgovor u odabrane
      answersSelected['slide' + slideNumber].push(answerText);
      buttonElement.classList.add('selected'); // Dodaj vizualnu selekciju
      warningDisplayed = false; // Resetiraj status upozorenja
    }

    // Obojavanje pitanja u sidebaru kao "completed" ako ima odabranih odgovora
    if (answersSelected['slide' + slideNumber].length > 0) {
      markSidebarAsCompleted(slideNumber);
    } else {
      unmarkSidebarAsCompleted(slideNumber);
    }

    // Provjera enable/disable "Prikaži rezultate" gumb
    checkShowResultsButton();
  }

  // Prikaz upozorenja
  function showWarning(message) {
    var warningDiv = document.getElementById('warning');
    warningDiv.textContent = message;
    warningDiv.classList.add('show');
    warningDisplayed = true; // Postavi status upozorenja
    setTimeout(function() {
      warningDiv.classList.remove('show');
    }, 3000); // Upozorenje će se prikazivati 3 sekunde
  }

  // Provjera statusa "Prikaži rezultate" gumba
  function checkShowResultsButton() {
    var allAnswered = true;
    for (var i = 1; i <= totalSlides; i++) {
      if (!answersSelected['slide' + i] || answersSelected['slide' + i].length === 0) {
        allAnswered = false;
        break;
      }
    }
    
    var showResultsBtn = document.getElementById('showResultsBtn');
    if (allAnswered) {
      showResultsBtn.disabled = false;
    } else {
      showResultsBtn.disabled = true;
    }
  }

  // Obojavanje pitanja u sidebaru kao "completed"
  function markSidebarAsCompleted(slideNumber) {
    var li = document.querySelector('.question-list li[data-slide="' + slideNumber + '"]');
    if (li) {
      li.classList.add('completed');
      li.classList.remove('active');
    }
  }

  // Odstranjivanje oznake "completed" u sidebaru
  function unmarkSidebarAsCompleted(slideNumber) {
    var li = document.querySelector('.question-list li[data-slide="' + slideNumber + '"]');
    if (li) {
      li.classList.remove('completed');
    }
  }

  // Navigacija između slajdova
  function addEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', function() {
      navigateToSlide(currentSlide + 1);
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
      navigateToSlide(currentSlide - 1);
    });

    document.getElementById('showResultsBtn').addEventListener('click', function() {
      showResults();
    });
  }

  var currentSlide = 1; // Trenutni slajd (1-4)

  // Navigacija na određeni slajd
  function navigateToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;

    var slidesDivs = document.querySelectorAll('.question-slide');
    for (var i = 0; i < slidesDivs.length; i++) {
      slidesDivs[i].classList.remove('active'); // Ukloni klasu 'active' sa svih slajdova
    }
    var currentSlideDiv = document.querySelector('.question-slide[data-slide="' + slideNumber + '"]');
    if (currentSlideDiv) {
      currentSlideDiv.classList.add('active'); // Dodaj klasu 'active' za željeni slajd
    }

    currentSlide = slideNumber;
    updateNavigationButtons(); // Ažuriraj navigacijske gumbe
    updateSidebarSelection(); // Ažuriraj selekciju u sidebaru
  }

  // Ažuriranje navigacijskih tipki
  function updateNavigationButtons() {
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var showResultsBtn = document.getElementById('showResultsBtn');

    // Ako je trenutni slajd prvi, sakrij "Prethodno" gumb
    if (currentSlide === 1) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline-block';
    }

    // Ako je trenutni slajd zadnji, sakrij "Sljedeće" gumb i prikaži "Prikaži rezultate" gumb
    if (currentSlide === totalSlides) {
      nextBtn.style.display = 'none';
      showResultsBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      showResultsBtn.style.display = 'none';
    }
  }

  // Ažuriranje selekcije u sidebaru
  function updateSidebarSelection() {
    var listItems = document.querySelectorAll('.question-list li');
    for (var i = 0; i < listItems.length; i++) {
      var li = listItems[i];
      var slideNumber = parseInt(li.getAttribute('data-slide'), 10);
      if (slideNumber === currentSlide) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    }
  }

  // Prikaz rezultata
  function showResults() {
    var resultDiv = document.getElementById('result');
    var resultHTML = '';
    for (var i = 1; i <= totalSlides; i++) {
      if (answersSelected['slide' + i] && answersSelected['slide' + i].length > 0) {
        var selectedAnswers = answersSelected['slide' + i].map(function(answer) {
          // Pronađi indeks odgovora i dodaj 1 za redni broj
          return slides[i - 1].answers.indexOf(answer) + 1;
        });
        resultHTML += '<strong>Pitanje ' + i + ':</strong> ' + selectedAnswers.join(', ') + '<br>';
      }
    }
    resultDiv.innerHTML = resultHTML;
    resultDiv.style.display = 'block';
    // Scroll na rezultat
    window.scrollTo({
      top: resultDiv.offsetTop,
      behavior: 'smooth'
    });
  }

  // Pokretanje inicijalizacije kviza nakon učitavanja stranice
  document.addEventListener('DOMContentLoaded', initQuiz);
})();


// Definiranje tema i clase
var themes = ['theme-monochromatic', 'theme-dark', 'theme-sophisticated'];
var themeNames = ['Normal', 'Tamna', 'Svijetla'];
var currentThemeIndex = 0;

// Pronađite gumb za promjenu teme
var themeToggleBtn = document.getElementById('theme-toggle-btn');
var themeNameSpan = document.getElementById('theme-name');

// Dohvatite spremljenu temu iz localStorage, ako postoji
var savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme && themes.includes(savedTheme)) {
  document.body.classList.add(savedTheme);
  currentThemeIndex = themes.indexOf(savedTheme);
  themeNameSpan.textContent = themeNames[currentThemeIndex];
} else {
  // Ako nema spremljene teme, postavite početnu temu
  document.body.classList.add(themes[currentThemeIndex]);
  themeNameSpan.textContent = themeNames[currentThemeIndex];
}

// Dodajte event listener za klik na gumb
themeToggleBtn.addEventListener('click', () => {
  // Uklonite trenutnu temu
  document.body.classList.remove(themes[currentThemeIndex]);
  
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  
  // Dodavanje nove teme
  document.body.classList.add(themes[currentThemeIndex]);
  
  // Spremanje nove teme u localStorage
  localStorage.setItem('selectedTheme', themes[currentThemeIndex]);
  
  // Ažuriranje naziva teme na gumbu
  themeNameSpan.textContent = themeNames[currentThemeIndex];
});
