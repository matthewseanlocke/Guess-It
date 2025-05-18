document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        players: [],
        currentPlayerIndex: 0,
        numberOfPlayers: 0,
        statToGuess: 'height', // Default to height
        currentRound: 1,
        gameOver: false,
        losingScores: {
            height: 20,  // Default threshold for height
            weight: 100  // Default threshold for weight
        },
        selectedSports: [], // Array to hold selected sports
        eliminatedPlayers: [], // Array to track eliminated players
        gameThreshold: 50 // Default game threshold
    };

    // Mouse interaction for splash screen question marks
    const splashScreenEl = document.getElementById('splash-screen');
    const largeQuestions = document.querySelectorAll('.large-question');
    
    // Mouse move effect for question marks
    splashScreenEl.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        largeQuestions.forEach(question => {
            const offsetX = (mouseX - 0.5) * 20; // Max 10px movement
            const offsetY = (mouseY - 0.5) * 20; // Max 10px movement
            
            // Random multiplier for varied movement
            const factor = parseFloat(question.dataset.factor || 1);
            
            // Apply the 3D transformation
            question.style.transform = `translate3d(${offsetX * factor}px, ${offsetY * factor}px, 0)`;
        });
    });
    
    // Assign random movement factors
    largeQuestions.forEach(question => {
        // Random factor between 0.5 and 1.5
        question.dataset.factor = (Math.random() + 0.5).toFixed(2);
    });

    // Athletes data (height in cm, weight in kg)
    const athletes = [
        // Famous Basketball players (Men, including Hall of Famers)
        { name: "LeBron James", sport: "Basketball", height: 206, weight: 113 },
        { name: "Michael Jordan", sport: "Basketball", height: 198, weight: 98 },
        { name: "Kobe Bryant", sport: "Basketball", height: 198, weight: 96 },
        { name: "Shaquille O'Neal", sport: "Basketball", height: 216, weight: 147 },
        { name: "Kareem Abdul-Jabbar", sport: "Basketball", height: 218, weight: 102 },
        { name: "Magic Johnson", sport: "Basketball", height: 206, weight: 100 },
        { name: "Larry Bird", sport: "Basketball", height: 206, weight: 100 },
        { name: "Wilt Chamberlain", sport: "Basketball", height: 216, weight: 125 },
        { name: "Bill Russell", sport: "Basketball", height: 208, weight: 100 },
        { name: "Tim Duncan", sport: "Basketball", height: 211, weight: 113 },
        { name: "Kevin Durant", sport: "Basketball", height: 208, weight: 109 },
        { name: "Stephen Curry", sport: "Basketball", height: 188, weight: 84 },
        { name: "Giannis Antetokounmpo", sport: "Basketball", height: 211, weight: 110 },
        { name: "Hakeem Olajuwon", sport: "Basketball", height: 213, weight: 115 },
        { name: "Dirk Nowitzki", sport: "Basketball", height: 213, weight: 111 },
        { name: "Charles Barkley", sport: "Basketball", height: 198, weight: 114 },
        { name: "Allen Iverson", sport: "Basketball", height: 183, weight: 75 },
        { name: "Karl Malone", sport: "Basketball", height: 206, weight: 113 },
        { name: "Julius Erving", sport: "Basketball", height: 201, weight: 95 },
        { name: "Oscar Robertson", sport: "Basketball", height: 196, weight: 93 },
        { name: "Jerry West", sport: "Basketball", height: 193, weight: 79 },
        // { name: "Isiah Thomas", sport: "Basketball", height: 185, weight: 84 },
        { name: "Scottie Pippen", sport: "Basketball", height: 203, weight: 95 },
        { name: "David Robinson", sport: "Basketball", height: 216, weight: 107 },
        // { name: "John Stockton", sport: "Basketball", height: 185, weight: 77 },
        { name: "Patrick Ewing", sport: "Basketball", height: 213, weight: 114 },
        // { name: "Dominique Wilkins", sport: "Basketball", height: 203, weight: 98 },
        // { name: "Clyde Drexler", sport: "Basketball", height: 201, weight: 95 },
        // { name: "Elgin Baylor", sport: "Basketball", height: 196, weight: 102 },
        // { name: "Bob Cousy", sport: "Basketball", height: 185, weight: 79 },
        { name: "Nikola Jokić", sport: "Basketball", height: 211, weight: 129 },
        { name: "Joel Embiid", sport: "Basketball", height: 213, weight: 127 },
        // { name: "Jayson Tatum", sport: "Basketball", height: 203, weight: 95 },
        { name: "Luka Dončić", sport: "Basketball", height: 201, weight: 104 },
        { name: "Anthony Davis", sport: "Basketball", height: 208, weight: 114 },
        
        // Soccer players
        { name: "Cristiano Ronaldo", sport: "Soccer", height: 187, weight: 83 },
        { name: "Lionel Messi", sport: "Soccer", height: 170, weight: 72 },
        { name: "Kylian Mbappé", sport: "Soccer", height: 178, weight: 73 },
        { name: "Erling Haaland", sport: "Soccer", height: 194, weight: 88 },
        { name: "Neymar Jr.", sport: "Soccer", height: 175, weight: 68 },
        // { name: "Kevin De Bruyne", sport: "Soccer", height: 181, weight: 70 },
        // { name: "Vinícius Júnior", sport: "Soccer", height: 176, weight: 73 },
        { name: "Robert Lewandowski", sport: "Soccer", height: 185, weight: 81 },
        { name: "Harry Kane", sport: "Soccer", height: 188, weight: 86 },
        { name: "Megan Rapinoe", sport: "Soccer", height: 170, weight: 57 },
        { name: "Alex Morgan", sport: "Soccer", height: 170, weight: 62 },
        // { name: "Sam Kerr", sport: "Soccer", height: 167, weight: 66 },
        // { name: "Ada Hegerberg", sport: "Soccer", height: 177, weight: 70 },
        // Add soccer legends
        { name: "Pelé", sport: "Soccer", height: 173, weight: 70 },
        { name: "Diego Maradona", sport: "Soccer", height: 165, weight: 70 },
        { name: "Zinedine Zidane", sport: "Soccer", height: 185, weight: 80 },
        { name: "Ronaldinho", sport: "Soccer", height: 182, weight: 80 },
        { name: "David Beckham", sport: "Soccer", height: 183, weight: 74 },
        
        // Tennis players
        { name: "Roger Federer", sport: "Tennis", height: 185, weight: 85 },
        { name: "Rafael Nadal", sport: "Tennis", height: 185, weight: 85 },
        { name: "Novak Djokovic", sport: "Tennis", height: 188, weight: 77 },
        { name: "Serena Williams", sport: "Tennis", height: 175, weight: 72 },
        // { name: "Carlos Alcaraz", sport: "Tennis", height: 183, weight: 74 },
        // { name: "Iga Świątek", sport: "Tennis", height: 176, weight: 68 },
        { name: "Coco Gauff", sport: "Tennis", height: 175, weight: 66 },
        // { name: "Jannik Sinner", sport: "Tennis", height: 188, weight: 76 },
        { name: "Naomi Osaka", sport: "Tennis", height: 180, weight: 69 },
        // Add tennis legends
        { name: "Andre Agassi", sport: "Tennis", height: 180, weight: 74 },
        { name: "Pete Sampras", sport: "Tennis", height: 185, weight: 77 },
        { name: "Steffi Graf", sport: "Tennis", height: 176, weight: 64 },
        { name: "Martina Navratilova", sport: "Tennis", height: 173, weight: 66 },
        { name: "Venus Williams", sport: "Tennis", height: 185, weight: 74 },
        
        // American Football players
        { name: "Tom Brady", sport: "American Football", height: 193, weight: 102 },
        { name: "Patrick Mahomes", sport: "American Football", height: 188, weight: 102 },
        { name: "Lamar Jackson", sport: "American Football", height: 188, weight: 98 },
        { name: "Aaron Donald", sport: "American Football", height: 185, weight: 127 },
        { name: "Travis Kelce", sport: "American Football", height: 196, weight: 113 },
        { name: "Christian McCaffrey", sport: "American Football", height: 180, weight: 93 },
        { name: "Jerry Rice", sport: "American Football", height: 188, weight: 91 },
        { name: "Lawrence Taylor", sport: "American Football", height: 191, weight: 108 },
        { name: "Joe Montana", sport: "American Football", height: 188, weight: 93 },
        { name: "Peyton Manning", sport: "American Football", height: 196, weight: 104 },
        { name: "Walter Payton", sport: "American Football", height: 180, weight: 91 },
        { name: "Barry Sanders", sport: "American Football", height: 173, weight: 91 },
        { name: "Emmitt Smith", sport: "American Football", height: 175, weight: 96 },
        { name: "Jim Brown", sport: "American Football", height: 188, weight: 105 },
        { name: "Ray Lewis", sport: "American Football", height: 183, weight: 108 },
        // Add more NFL stars
        { name: "Brett Favre", sport: "American Football", height: 188, weight: 101 },
        { name: "Aaron Rodgers", sport: "American Football", height: 188, weight: 102 },
        { name: "Dan Marino", sport: "American Football", height: 193, weight: 101 },
        { name: "J.J. Watt", sport: "American Football", height: 196, weight: 131 },
        { name: "Rob Gronkowski", sport: "American Football", height: 198, weight: 120 },
        
        // Track & Field athletes
        { name: "Usain Bolt", sport: "Track & Field", height: 195, weight: 94 },
        // { name: "Noah Lyles", sport: "Track & Field", height: 180, weight: 74 },
        // { name: "Sydney McLaughlin", sport: "Track & Field", height: 175, weight: 60 },
        // { name: "Mondo Duplantis", sport: "Track & Field", height: 181, weight: 79 },
        // { name: "Shelly-Ann Fraser-Pryce", sport: "Track & Field", height: 152, weight: 52 },
        // { name: "Eliud Kipchoge", sport: "Track & Field", height: 167, weight: 57 },
        { name: "Carl Lewis", sport: "Track & Field", height: 188, weight: 80 },
        { name: "Jesse Owens", sport: "Track & Field", height: 178, weight: 75 },
        // { name: "Allyson Felix", sport: "Track & Field", height: 168, weight: 56 },
        // Add track legends
        { name: "Florence Griffith Joyner", sport: "Track & Field", height: 170, weight: 57 },
        { name: "Michael Johnson", sport: "Track & Field", height: 185, weight: 82 },
        { name: "Jackie Joyner-Kersee", sport: "Track & Field", height: 178, weight: 70 },
        { name: "Bob Beamon", sport: "Track & Field", height: 191, weight: 75 },
        { name: "Tyson Gay", sport: "Track & Field", height: 180, weight: 75 },
        
        // Swimming athletes
        { name: "Michael Phelps", sport: "Swimming", height: 193, weight: 88 },
        { name: "Katie Ledecky", sport: "Swimming", height: 183, weight: 70 },
        // { name: "Caeleb Dressel", sport: "Swimming", height: 191, weight: 88 },
        // { name: "Adam Peaty", sport: "Swimming", height: 191, weight: 86 },
        { name: "Mark Spitz", sport: "Swimming", height: 183, weight: 73 },
        // { name: "Ian Thorpe", sport: "Swimming", height: 196, weight: 104 },
        // Add swimming legends
        { name: "Ryan Lochte", sport: "Swimming", height: 188, weight: 88 },
        { name: "Missy Franklin", sport: "Swimming", height: 188, weight: 75 },
        { name: "Janet Evans", sport: "Swimming", height: 168, weight: 54 },
        { name: "Dara Torres", sport: "Swimming", height: 180, weight: 68 },
        { name: "Matt Biondi", sport: "Swimming", height: 198, weight: 91 },
        
        // Gymnastics athletes
        { name: "Simone Biles", sport: "Gymnastics", height: 142, weight: 47 },
        // { name: "Sunisa Lee", sport: "Gymnastics", height: 157, weight: 50 },
        // { name: "Nikita Nagornyy", sport: "Gymnastics", height: 166, weight: 65 },
        { name: "Nadia Comăneci", sport: "Gymnastics", height: 162, weight: 53 },
        // { name: "Kohei Uchimura", sport: "Gymnastics", height: 161, weight: 57 },
        // Add gymnastics legends
        { name: "Mary Lou Retton", sport: "Gymnastics", height: 145, weight: 42 },
        { name: "Nastia Liukin", sport: "Gymnastics", height: 163, weight: 50 },
        { name: "Shawn Johnson", sport: "Gymnastics", height: 147, weight: 45 },
        { name: "Gabby Douglas", sport: "Gymnastics", height: 157, weight: 50 },
        { name: "Kerri Strug", sport: "Gymnastics", height: 145, weight: 41 },
        
        // Add new sports and more famous athletes
        // Boxing
        { name: "Muhammad Ali", sport: "Boxing", height: 191, weight: 107 },
        { name: "Mike Tyson", sport: "Boxing", height: 178, weight: 109 },
        { name: "Floyd Mayweather", sport: "Boxing", height: 173, weight: 70 },
        { name: "Manny Pacquiao", sport: "Boxing", height: 169, weight: 67 },
        { name: "Tyson Fury", sport: "Boxing", height: 206, weight: 126 },

        // Golf
        { name: "Tiger Woods", sport: "Golf", height: 185, weight: 84 },
        { name: "Rory McIlroy", sport: "Golf", height: 175, weight: 73 },
        { name: "Jack Nicklaus", sport: "Golf", height: 180, weight: 84 },
        { name: "Phil Mickelson", sport: "Golf", height: 191, weight: 91 },
        { name: "Annika Sorenstam", sport: "Golf", height: 172, weight: 62 },
    ];

    // Function to convert cm to feet and inches
    function cmToFeetInches(cm) {
        const totalInches = cm * 0.393701;
        let feet = Math.floor(totalInches / 12);
        let inches = Math.round(totalInches % 12);
        
        // If inches is 12, increment feet and set inches to 0
        if (inches === 12) {
            feet++;
            inches = 0;
        }
        
        return { feet, inches };
    }

    // Function to convert feet and inches to cm
    function feetInchesToCm(feet, inches) {
        return Math.round((feet * 12 + inches) * 2.54);
    }

    // Function to convert kg to pounds
    function kgToPounds(kg) {
        return Math.round(kg * 2.20462);
    }

    // Function to convert pounds to kg
    function poundsToKg(pounds) {
        return Math.round(pounds / 2.20462);
    }

    // DOM Elements - Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // DOM Elements - Setup Screen
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const playerButtons = document.querySelectorAll('.player-btn');
    const statButtons = document.querySelectorAll('.stat-btn');
    const thresholdButtons = document.querySelectorAll('.threshold-btn');
    const customThresholdInput = document.getElementById('custom-threshold');
    const startGameButton = document.getElementById('start-game');
    const playerNamesContainer = document.getElementById('player-names-container');
    const playerInputsContainer = document.getElementById('player-inputs');
    
    // Sport selection elements
    const sportCheckboxes = document.querySelectorAll('.sport-checkbox');
    const selectAllSportsButton = document.getElementById('select-all-sports');
    const deselectAllSportsButton = document.getElementById('deselect-all-sports');

    // Game Screen Elements
    const currentPlayerElement = document.getElementById('current-player');
    const currentRoundElement = document.getElementById('current-round');
    const athleteNameElement = document.getElementById('athlete-name');
    const athleteInfoElement = document.getElementById('athlete-info');
    const weightInputContainer = document.getElementById('weight-input-container');
    const heightInputContainer = document.getElementById('height-input-container');
    const weightInput = document.getElementById('weight-input');
    const feetInput = document.getElementById('feet-input');
    const inchesInput = document.getElementById('inches-input');
    const submitGuessButton = document.getElementById('submit-guess');
    const resultContainer = document.getElementById('result-container');
    const actualValueElement = document.getElementById('actual-value');
    const guessValueElement = document.getElementById('guess-value');
    const differenceValueElement = document.getElementById('difference-value');
    const nextTurnButton = document.getElementById('next-turn');
    const playerScoresContainer = document.getElementById('player-scores');
    const statTypeElement = document.getElementById('stat-type');
    const unitDisplayElement = document.getElementById('unit-display');
    const unitDisplay2Element = document.getElementById('unit-display2');
    const gameScoreboardElement = document.getElementById('game-scoreboard');

    // Game Over Elements
    const finalScoreboard = document.getElementById('final-scoreboard');
    const playAgainButton = document.getElementById('play-again');
    
    // Game threshold display elements
    const thresholdDisplayElement = document.getElementById('threshold-display');
    const thresholdUnitElement = document.getElementById('threshold-unit');

    // Current athlete
    let currentAthlete = null;
    let usedAthletesIndices = [];
    let filteredAthletes = []; // Will hold athletes filtered by selected sports

    // Show appropriate input fields based on what we're guessing
    function updateInputFields() {
        if (gameState.statToGuess === 'height') {
            weightInputContainer.classList.add('hidden');
            heightInputContainer.classList.remove('hidden');
            feetInput.value = '';
            inchesInput.value = '';
            
            // Update unit display for threshold
            if (thresholdUnitElement) {
                thresholdUnitElement.textContent = 'inches';
            }
        } else {
            heightInputContainer.classList.add('hidden');
            weightInputContainer.classList.remove('hidden');
            weightInput.value = '';
            
            // Update unit display for threshold
            if (thresholdUnitElement) {
                thresholdUnitElement.textContent = 'pounds';
            }
        }

        // Update the stat type display
        if (statTypeElement) {
            statTypeElement.textContent = gameState.statToGuess;
        }
        
        // Display the losing score threshold
        const losingScoreElement = document.getElementById('losing-score-threshold');
        if (losingScoreElement) {
            const threshold = gameState.losingScores[gameState.statToGuess];
            const unit = gameState.statToGuess === 'height' ? 'inches' : 'lbs';
            losingScoreElement.textContent = `${threshold} ${unit}`;
        }
    }

    // Auto-transition from splash screen after 2.5 seconds
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }, 2500);

    // Setup Event Listeners
    playerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.numberOfPlayers = parseInt(btn.getAttribute('data-players'));
            
            // Generate player name inputs
            playerInputsContainer.innerHTML = '';
            for (let i = 0; i < gameState.numberOfPlayers; i++) {
                const inputDiv = document.createElement('div');
                inputDiv.className = 'mb-2';
                inputDiv.innerHTML = `
                    <label class="block text-gray-700 mb-1">Player ${i + 1}:</label>
                    <input type="text" class="player-name-input border-2 border-gray-300 rounded px-3 py-2 w-full" 
                           placeholder="Enter name" value="Player ${i + 1}">
                `;
                playerInputsContainer.appendChild(inputDiv);
            }
            
            playerNamesContainer.classList.remove('hidden');
            
            // Stop the pulse animation on the "Start Here" section
            document.querySelector('.start-here-section').classList.add('selection-made');
            
            checkStartButtonState();
        });
    });

    statButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            statButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.statToGuess = btn.getAttribute('data-stat');
            
            // Update input fields and threshold display when stat type changes
            updateInputFields();
            
            checkStartButtonState();
        });
    });

    // Threshold button event listeners
    thresholdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            thresholdButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Clear custom threshold input
            customThresholdInput.value = '';
            
            // Set game threshold
            const threshold = parseInt(btn.getAttribute('data-threshold'));
            gameState.gameThreshold = threshold;
            
            // Update losing scores based on selected threshold
            updateLosingScores(threshold);
            
            // Update threshold display
            if (thresholdDisplayElement) {
                thresholdDisplayElement.textContent = threshold;
            }
            
            checkStartButtonState();
        });
    });
    
    // Custom threshold input event
    customThresholdInput.addEventListener('input', () => {
        const customValue = parseInt(customThresholdInput.value);
        
        if (customValue && customValue >= 10 && customValue <= 500) {
            // Remove active class from preset buttons
            thresholdButtons.forEach(btn => btn.classList.remove('active'));
            
            // Set game threshold
            gameState.gameThreshold = customValue;
            
            // Update losing scores based on custom threshold
            updateLosingScores(customValue);
            
            // Update threshold display
            if (thresholdDisplayElement) {
                thresholdDisplayElement.textContent = customValue;
            }
            
            checkStartButtonState();
        }
    });
    
    // Function to update losing scores based on selected threshold
    function updateLosingScores(threshold) {
        // Update the losing scores based on the selected threshold
        if (gameState.statToGuess === 'height') {
            gameState.losingScores.height = threshold;
        } else {
            gameState.losingScores.weight = threshold;
        }
    }

    // Sport selection event listeners
    sportCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedSports();
            checkStartButtonState();
        });
    });

    // Select all sports button
    selectAllSportsButton.addEventListener('click', () => {
        sportCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        updateSelectedSports();
        checkStartButtonState();
    });

    // Deselect all sports button
    deselectAllSportsButton.addEventListener('click', () => {
        sportCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectedSports();
        checkStartButtonState();
    });

    // Update the array of selected sports
    function updateSelectedSports() {
        gameState.selectedSports = [];
        sportCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                gameState.selectedSports.push(checkbox.value);
            }
        });
        
        // Filter athletes based on selected sports
        filteredAthletes = athletes.filter(athlete => 
            gameState.selectedSports.includes(athlete.sport)
        );
    }

    startGameButton.addEventListener('click', startGame);
    submitGuessButton.addEventListener('click', submitGuess);
    nextTurnButton.addEventListener('click', nextTurn);
    playAgainButton.addEventListener('click', resetGame);

    // Check if start button should be enabled
    function checkStartButtonState() {
        // Need at least one sport selected and number of players
        if (gameState.numberOfPlayers > 0 && gameState.selectedSports.length > 0) {
            startGameButton.disabled = false;
        } else {
            startGameButton.disabled = true;
        }
    }

    // Initialize selected sports on page load
    updateSelectedSports();

    // Make sure we start with the correct sports selected by default
    sportCheckboxes.forEach(checkbox => {
        // Only Basketball and American Football should be checked initially
        if (checkbox.value === "Basketball" || checkbox.value === "American Football") {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
    // Call updateSelectedSports again to set the filtered athletes correctly
    updateSelectedSports();

    // Function to update the current player display with the right color
    function updateCurrentPlayerDisplay() {
        // Get the index for color
        const colorIndex = gameState.currentPlayerIndex % 4;
        
        // Clear previous color classes
        currentPlayerElement.classList.remove('player-color-0', 'player-color-1', 'player-color-2', 'player-color-3');
        
        // Add the appropriate color class
        currentPlayerElement.classList.add(`player-color-${colorIndex}`);
        
        // Set the text content
        currentPlayerElement.textContent = gameState.players[gameState.currentPlayerIndex].name;

        // Update the game background with a very subtle tint of the player's color
        updateGameBackground(colorIndex);
    }

    // Function to update the game background with a subtle tint based on player color
    function updateGameBackground(colorIndex) {
        // Optional: If you want to add a subtle tint to the entire game screen
        // This can make the current player's "turn" even more prominent
        const gameScreen = document.getElementById('game-screen');
        
        // Clear previous background classes
        gameScreen.classList.remove('bg-blue-50', 'bg-red-50', 'bg-green-50', 'bg-yellow-50');
        
        // Add the appropriate background class
        switch(colorIndex) {
            case 0:
                gameScreen.classList.add('bg-blue-50');
                break;
            case 1:
                gameScreen.classList.add('bg-red-50');
                break;
            case 2:
                gameScreen.classList.add('bg-green-50');
                break;
            case 3:
                gameScreen.classList.add('bg-yellow-50');
                break;
        }
    }

    // Start the game
    function startGame() {
        // Make sure we have some athletes to play with
        if (filteredAthletes.length === 0) {
            alert('Please select at least one sport to play with!');
            return;
        }
        
        // Initialize players
        gameState.players = [];
        const playerInputs = document.querySelectorAll('.player-name-input');
        
        playerInputs.forEach((input, index) => {
            const name = input.value.trim() || `Player ${index + 1}`;
            gameState.players.push({
                name,
                score: 0,
                markedForElimination: false
            });
        });

        // Setup game screen
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Show the scoreboard
        gameScoreboardElement.classList.remove('hidden');
        
        // Update display with correct color
        updateCurrentPlayerDisplay();
        
        // Update unit labels and inputs
        updateInputFields();
        
        // Initialize scoreboard
        updateScoreboard();
        
        // Make sure threshold display is up to date
        updateThresholdDisplay();
        
        // Reset used athletes for new game
        usedAthletesIndices = [];
        
        // Start first round
        selectNewAthlete();
    }

    // Select a new athlete for guessing
    function selectNewAthlete() {
        // If we've used all the filtered athletes, reset the used indices
        if (usedAthletesIndices.length >= filteredAthletes.length) {
            usedAthletesIndices = [];
        }
        
        // Find a new athlete that hasn't been used yet from the filtered list
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * filteredAthletes.length);
        } while (usedAthletesIndices.includes(randomIndex));
        
        usedAthletesIndices.push(randomIndex);
        currentAthlete = filteredAthletes[randomIndex];
        
        // Update display
        athleteNameElement.textContent = currentAthlete.name;
        athleteInfoElement.textContent = currentAthlete.sport;
        
        // Reset form and ensure submit button is enabled
        updateInputFields();
        submitGuessButton.disabled = false;
        submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
        resultContainer.classList.add('hidden');
    }

    // Submit a guess
    function submitGuess() {
        let guess;
        let difference;
        
        // Get current losing score based on stat being guessed
        const currentLosingScore = gameState.losingScores[gameState.statToGuess];
        
        if (gameState.statToGuess === 'height') {
            // Get height in feet and inches
            const feet = parseInt(feetInput.value) || 0;
            const inches = parseInt(inchesInput.value) || 0;
            
            if (feet === 0 && inches === 0) {
                alert('Please enter a valid height!');
                return;
            }
            
            // Convert to cm for calculation
            guess = feetInchesToCm(feet, inches);
            
            // Calculate difference in inches (not cm)
            const actualInches = currentAthlete[gameState.statToGuess] * 0.393701; // Convert cm to inches
            const guessInches = (feet * 12) + inches; // Total inches
            difference = Math.abs(guessInches - actualInches);
        } else {
            // Get weight in pounds
            guess = parseInt(weightInput.value);
            if (isNaN(guess) || guess <= 0) {
                alert('Please enter a valid weight!');
                return;
            }
            
            // Convert to kg for calculation with database
            const guessKg = poundsToKg(guess);
            
            // Calculate difference in pounds
            const actualValue = currentAthlete[gameState.statToGuess];
            difference = Math.abs(guess - kgToPounds(actualValue));
        }
        
        // Round difference to nearest whole number
        difference = Math.round(difference);
        
        // Update player score
        gameState.players[gameState.currentPlayerIndex].score += difference;
        
        // Show result
        resultContainer.classList.remove('hidden');
        
        if (gameState.statToGuess === 'height') {
            const { feet, inches } = cmToFeetInches(currentAthlete[gameState.statToGuess]);
            actualValueElement.textContent = `${feet}'${inches}"`;
            guessValueElement.textContent = `${feetInput.value}'${inchesInput.value}"`;
            
            // Disable height inputs
            feetInput.disabled = true;
            inchesInput.disabled = true;
        } else {
            const actualPounds = kgToPounds(currentAthlete[gameState.statToGuess]);
            actualValueElement.textContent = actualPounds;
            guessValueElement.textContent = guess;
            unitDisplayElement.textContent = 'lbs';
            unitDisplay2Element.textContent = 'lbs';
            
            // Disable weight input
            weightInput.disabled = true;
        }
        
        differenceValueElement.textContent = difference;
        
        // Disable submit button after guessing
        submitGuessButton.disabled = true;
        submitGuessButton.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Update scoreboard
        updateScoreboard();
        
        // Check if player is eliminated but don't advance to next player automatically
        const isPlayerEliminated = checkPlayerElimination();
        
        // If player is eliminated, update the result message
        if (isPlayerEliminated) {
            // Add eliminated message to the result container
            const eliminatedMessage = document.createElement('p');
            eliminatedMessage.className = 'mt-3 text-red-600 font-bold text-xl';
            eliminatedMessage.textContent = `${gameState.players[gameState.currentPlayerIndex].name} has been ELIMINATED!`;
            resultContainer.appendChild(eliminatedMessage);
            
            // Highlight the next turn button more prominently
            nextTurnButton.classList.add('eliminated-player-next');
        }
    }

    // Check if the current player is eliminated
    function checkPlayerElimination() {
        // Get current losing score based on stat being guessed
        const currentLosingScore = gameState.losingScores[gameState.statToGuess];
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        // Check if player score equals or exceeds the losing score threshold
        if (currentPlayer.score >= currentLosingScore) {
            // Mark player for elimination but don't actually eliminate until round ends
            if (!gameState.eliminatedPlayers.includes(gameState.currentPlayerIndex) && 
                !currentPlayer.markedForElimination) {
                
                // Mark them for elimination but proceed with the round
                currentPlayer.markedForElimination = true;
                
                // Add an eliminated message to the result container
                const eliminatedMessage = document.createElement('p');
                eliminatedMessage.className = 'mt-3 text-red-600 font-bold text-xl';
                eliminatedMessage.textContent = `${currentPlayer.name} will be ELIMINATED at the end of this round!`;
                resultContainer.appendChild(eliminatedMessage);
                
                // Highlight the next turn button
                nextTurnButton.classList.add('eliminated-player-next');
                
                // Check if we're in a two-player game and both players are now eliminated or marked
                if (gameState.numberOfPlayers === 2) {
                    const otherPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
                    const otherPlayer = gameState.players[otherPlayerIndex];
                    
                    // If other player is already eliminated or marked for elimination, game is over
                    if (gameState.eliminatedPlayers.includes(otherPlayerIndex) || 
                        otherPlayer.markedForElimination) {
                        
                        // Mark game as over immediately in 2-player scenario
                        gameState.gameOver = true;
                    }
                }
            }
            
            return true;
        }
        
        return false;
    }

    // Check if game is over (all but one player reached losing score)
    function showGameOverScreen() {
        // Find the winner (the only player not eliminated)
        const winnerIndex = Array.from({length: gameState.numberOfPlayers}, (_, i) => i)
            .find(index => !gameState.eliminatedPlayers.includes(index));
        
        // Sort players by score (lowest first, which is better)
        const sortedPlayers = [...gameState.players].sort((a, b) => a.score - b.score);
        
        // Display final results
        finalScoreboard.innerHTML = '';
        
        sortedPlayers.forEach((player, index) => {
            const playerIndex = gameState.players.indexOf(player);
            const playerResult = document.createElement('div');
            playerResult.className = 'mb-2 p-2 rounded player-color-' + (playerIndex % 4);
            
            // Winner is the only non-eliminated player
            if (playerIndex === winnerIndex) {
                playerResult.classList.add('winner');
                playerResult.innerHTML = `
                    <p class="font-semibold">${index + 1}. ${player.name} - WINNER!</p>
                    <p class="text-xl">${player.score} points</p>
                `;
            } else {
                playerResult.classList.add('loser');
                playerResult.innerHTML = `
                    <p class="font-semibold">${index + 1}. ${player.name} - ELIMINATED</p>
                    <p class="text-xl">${player.score} points</p>
                `;
            }
            
            finalScoreboard.appendChild(playerResult);
        });
        
        // Show game over screen
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }

    // Update the scoreboard display
    function updateScoreboard() {
        playerScoresContainer.innerHTML = '';
        
        // Get current losing score based on stat being guessed
        const currentLosingScore = gameState.losingScores[gameState.statToGuess];
        
        gameState.players.forEach((player, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'player-score player-color-' + (index % 4); // Apply color based on player index
            
            // If player has reached or exceeded the losing score, mark them
            const isEliminated = player.score >= currentLosingScore;
            if (isEliminated) {
                scoreElement.classList.add('loser');
                
                // Add to eliminated players if not already there
                if (!gameState.eliminatedPlayers.includes(index)) {
                    gameState.eliminatedPlayers.push(index);
                }
            }
            
            // Highlight the active player (only if not eliminated)
            if (index === gameState.currentPlayerIndex && !isEliminated) {
                scoreElement.classList.add('active-player');
            }
            
            // Add a border and better styling
            scoreElement.classList.add('border-2', 'rounded-lg', 'p-3', 'text-center');
            
            // Show status for eliminated players
            if (isEliminated) {
                scoreElement.innerHTML = `
                    <p class="font-semibold">${player.name}</p>
                    <p class="text-2xl">${player.score}</p>
                    <p class="text-xs mt-1 font-bold text-red-600">ELIMINATED</p>
                `;
            } else {
                scoreElement.innerHTML = `
                    <p class="font-semibold">${player.name}</p>
                    <p class="text-2xl">${player.score}</p>
                `;
            }
            
            playerScoresContainer.appendChild(scoreElement);
        });
    }

    // Update the threshold display in the footer
    function updateThresholdDisplay() {
        // Update the threshold value
        if (thresholdDisplayElement) {
            thresholdDisplayElement.textContent = gameState.statToGuess === 'height' 
                ? gameState.losingScores.height 
                : gameState.losingScores.weight;
        }
        
        // Update the threshold unit
        if (thresholdUnitElement) {
            thresholdUnitElement.textContent = gameState.statToGuess === 'height' ? 'inches' : 'pounds';
        }
    }

    // Reset the game to play again
    function resetGame() {
        // Reset game state
        gameState.players = [];
        gameState.currentPlayerIndex = 0;
        gameState.numberOfPlayers = 0;
        gameState.statToGuess = 'height'; // Reset to default
        gameState.currentRound = 1;
        gameState.gameOver = false;
        gameState.eliminatedPlayers = []; // Reset eliminated players array
        
        // Hide the scoreboard
        gameScoreboardElement.classList.add('hidden');
        
        // Reset UI
        playerButtons.forEach(btn => btn.classList.remove('active'));
        statButtons.forEach(btn => {
            if (btn.getAttribute('data-stat') === 'height') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Reset the start-here highlight
        document.querySelector('.start-here-section').classList.remove('selection-made');
        
        startGameButton.disabled = true;
        playerNamesContainer.classList.add('hidden');
        playerInputsContainer.innerHTML = '';
        
        // Keep the sport selections as they were
        
        // Make sure submit button is enabled for new game
        submitGuessButton.disabled = false;
        submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Re-enable input fields
        feetInput.disabled = false;
        inchesInput.disabled = false;
        weightInput.disabled = false;
        
        // Show setup screen
        gameOverScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        
        // Reset used athletes
        usedAthletesIndices = [];
    }

    // Next player's turn
    function nextTurn() {
        // Add visual feedback for button click
        nextTurnButton.classList.add('clicked');
        nextTurnButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
        
        // Add a small delay for visual effect
        setTimeout(() => {
            // If game is already over, show the game over screen and exit
            if (gameState.gameOver) {
                showGameOverScreen();
                return;
            }
            
            // Handle special case for two players where both bust
            if (gameState.numberOfPlayers === 2) {
                const player0 = gameState.players[0];
                const player1 = gameState.players[1];
                
                // If both players are eliminated or marked for elimination, end the game
                const player0Out = gameState.eliminatedPlayers.includes(0) || player0.markedForElimination;
                const player1Out = gameState.eliminatedPlayers.includes(1) || player1.markedForElimination;
                
                if (player0Out && player1Out) {
                    gameState.gameOver = true;
                    showGameOverScreen();
                    return;
                }
            }
            
            // Move to the next player
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.numberOfPlayers;
            
            // Track if we've completed a round (everyone had a turn)
            const roundComplete = gameState.currentPlayerIndex === 0;
            
            // If we've reached the start of a new round, process eliminations and increment round
            if (roundComplete) {
                // Process any players marked for elimination
                processEliminationsAtRoundEnd();
                
                // If game became over after processing eliminations, exit the function
                if (gameState.gameOver) {
                    return;
                }
                
                // Increment round number
                gameState.currentRound++;
                currentRoundElement.textContent = gameState.currentRound;
            }
            
            // Skip any already eliminated players
            let attemptCount = 0;
            const maxAttempts = gameState.numberOfPlayers; // Prevent infinite loop
            
            while (gameState.eliminatedPlayers.includes(gameState.currentPlayerIndex) && 
                    attemptCount < maxAttempts) {
                gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.numberOfPlayers;
                attemptCount++;
                
                // If we've checked all players and they're all eliminated except one,
                // the game should end
                if (attemptCount >= maxAttempts - 1 && 
                    gameState.eliminatedPlayers.length >= gameState.numberOfPlayers - 1) {
                    gameState.gameOver = true;
                    showGameOverScreen();
                    return;
                }
            }
            
            // Update current player display with correct color
            updateCurrentPlayerDisplay();
            
            // Update scoreboard to highlight new active player
            updateScoreboard();
            
            // Select new athlete
            selectNewAthlete();
            
            // Re-enable submit button
            submitGuessButton.disabled = false;
            submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
            
            // Re-enable input fields
            feetInput.disabled = false;
            inchesInput.disabled = false;
            weightInput.disabled = false;
            
            // Reset button appearance
            nextTurnButton.classList.remove('clicked');
            nextTurnButton.classList.remove('eliminated-player-next');
            nextTurnButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                NEXT TURN
            `;
        }, 500); // 500ms delay for visual effect
    }
    
    // Process players marked for elimination at the end of a round
    function processEliminationsAtRoundEnd() {
        // Find all players marked for elimination and add them to the eliminated array
        let newEliminationsOccurred = false;
        
        gameState.players.forEach((player, index) => {
            if (player.markedForElimination && !gameState.eliminatedPlayers.includes(index)) {
                gameState.eliminatedPlayers.push(index);
                newEliminationsOccurred = true;
            }
        });
        
        // Count non-eliminated players
        const nonEliminatedCount = gameState.numberOfPlayers - gameState.eliminatedPlayers.length;
        
        // If there's only one player left, the game is over
        if (nonEliminatedCount <= 1) {
            gameState.gameOver = true;
            // Small delay to ensure UI updates properly
            setTimeout(() => {
                showGameOverScreen();
            }, 100);
            return;
        }
        
        // If new eliminations occurred, show notification
        if (newEliminationsOccurred) {
            // Display a notification about eliminated players
            const roundEndMessage = document.createElement('div');
            roundEndMessage.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 text-center font-bold z-50';
            roundEndMessage.textContent = `Round ${gameState.currentRound - 1} complete! ${gameState.eliminatedPlayers.length} player(s) eliminated.`;
            document.body.appendChild(roundEndMessage);
            
            // Remove the message after 3 seconds
            setTimeout(() => {
                roundEndMessage.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(roundEndMessage)) {
                        document.body.removeChild(roundEndMessage);
                    }
                }, 500);
            }, 3000);
        }
    }
}); 