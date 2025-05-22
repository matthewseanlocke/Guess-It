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

    // Debug function to log game state
    function logGameState(message) {
        console.log(`DEBUG ${message}:`, {
            gameOver: gameState.gameOver,
            currentPlayerIndex: gameState.currentPlayerIndex,
            numberOfPlayers: gameState.numberOfPlayers,
            currentRound: gameState.currentRound,
            eliminatedPlayers: [...gameState.eliminatedPlayers],
            players: gameState.players.map(p => ({
                name: p.name,
                score: p.score,
                markedForElimination: p.markedForElimination
            }))
        });
    }

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
        { name: "Brett Favre", sport: "American Football", height: 188, weight: 101 },
        { name: "Aaron Rodgers", sport: "American Football", height: 188, weight: 102 },
        { name: "Dan Marino", sport: "American Football", height: 193, weight: 101 },
        { name: "J.J. Watt", sport: "American Football", height: 196, weight: 131 },
        { name: "Rob Gronkowski", sport: "American Football", height: 198, weight: 120 },
        // Current NFL Quarterbacks
        { name: "Josh Allen", sport: "American Football", height: 196, weight: 108 },
        { name: "Jalen Hurts", sport: "American Football", height: 185, weight: 98 },
        { name: "Justin Herbert", sport: "American Football", height: 198, weight: 104 },
        { name: "Joe Burrow", sport: "American Football", height: 193, weight: 98 },
        { name: "Tua Tagovailoa", sport: "American Football", height: 185, weight: 98 },
        { name: "Trevor Lawrence", sport: "American Football", height: 196, weight: 98 },
        { name: "Justin Fields", sport: "American Football", height: 188, weight: 98 },
        { name: "Brock Purdy", sport: "American Football", height: 185, weight: 98 },
        { name: "Dak Prescott", sport: "American Football", height: 188, weight: 107 },
        { name: "Matthew Stafford", sport: "American Football", height: 193, weight: 102 },
        { name: "Kirk Cousins", sport: "American Football", height: 188, weight: 98 },
        { name: "Russell Wilson", sport: "American Football", height: 180, weight: 98 },
        { name: "Kyler Murray", sport: "American Football", height: 178, weight: 93 },
        { name: "Derek Carr", sport: "American Football", height: 188, weight: 98 },
        { name: "Jared Goff", sport: "American Football", height: 193, weight: 98 },
        { name: "Baker Mayfield", sport: "American Football", height: 185, weight: 98 },
        // Current NFL Running Backs
        { name: "Derrick Henry", sport: "American Football", height: 193, weight: 113 },
        { name: "Nick Chubb", sport: "American Football", height: 178, weight: 98 },
        { name: "Jonathan Taylor", sport: "American Football", height: 178, weight: 98 },
        { name: "Saquon Barkley", sport: "American Football", height: 183, weight: 104 },
        { name: "Alvin Kamara", sport: "American Football", height: 178, weight: 98 },
        { name: "Austin Ekeler", sport: "American Football", height: 178, weight: 91 },
        { name: "Josh Jacobs", sport: "American Football", height: 178, weight: 98 },
        { name: "Tony Pollard", sport: "American Football", height: 183, weight: 98 },
        { name: "Breece Hall", sport: "American Football", height: 183, weight: 98 },
        { name: "Travis Etienne", sport: "American Football", height: 178, weight: 98 },
        { name: "Rachaad White", sport: "American Football", height: 183, weight: 98 },
        { name: "Kenneth Walker", sport: "American Football", height: 178, weight: 98 },
        { name: "Jahmyr Gibbs", sport: "American Football", height: 178, weight: 98 },
        { name: "Bijan Robinson", sport: "American Football", height: 183, weight: 98 },
        { name: "De'Von Achane", sport: "American Football", height: 173, weight: 88 },
        
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
        
        // Actors and Actresses
        { name: "Tom Cruise", sport: "Acting", height: 170, weight: 67 },
        { name: "Dwayne Johnson", sport: "Acting", height: 196, weight: 118 },
        { name: "Scarlett Johansson", sport: "Acting", height: 160, weight: 54 },
        { name: "Chris Hemsworth", sport: "Acting", height: 191, weight: 98 },
        { name: "Jennifer Lawrence", sport: "Acting", height: 175, weight: 63 },
        { name: "Leonardo DiCaprio", sport: "Acting", height: 183, weight: 75 },
        { name: "Margot Robbie", sport: "Acting", height: 168, weight: 56 },
        { name: "Brad Pitt", sport: "Acting", height: 180, weight: 78 },
        { name: "Angelina Jolie", sport: "Acting", height: 169, weight: 54 },
        { name: "Will Smith", sport: "Acting", height: 188, weight: 82 },
        { name: "Emma Watson", sport: "Acting", height: 165, weight: 52 },
        { name: "Robert Downey Jr.", sport: "Acting", height: 174, weight: 78 },
        { name: "Gal Gadot", sport: "Acting", height: 178, weight: 58 },
        { name: "Ryan Reynolds", sport: "Acting", height: 188, weight: 84 },
        { name: "Zendaya", sport: "Acting", height: 178, weight: 57 },
        { name: "Tom Hanks", sport: "Acting", height: 183, weight: 82 },
        { name: "Meryl Streep", sport: "Acting", height: 168, weight: 61 },
        { name: "Denzel Washington", sport: "Acting", height: 185, weight: 85 },
        { name: "Charlize Theron", sport: "Acting", height: 177, weight: 61 },
        { name: "Hugh Jackman", sport: "Acting", height: 188, weight: 85 },
        { name: "Jennifer Aniston", sport: "Acting", height: 164, weight: 54 },
        { name: "George Clooney", sport: "Acting", height: 180, weight: 78 },
        { name: "Sandra Bullock", sport: "Acting", height: 171, weight: 54 },
        { name: "Morgan Freeman", sport: "Acting", height: 188, weight: 77 },
        { name: "Julia Roberts", sport: "Acting", height: 175, weight: 55 },
        { name: "Johnny Depp", sport: "Acting", height: 178, weight: 78 },
        { name: "Nicole Kidman", sport: "Acting", height: 180, weight: 54 },
        { name: "Keanu Reeves", sport: "Acting", height: 186, weight: 84 },
        { name: "Emma Stone", sport: "Acting", height: 168, weight: 55 },
        { name: "Ryan Gosling", sport: "Acting", height: 184, weight: 77 },
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

    // DOM Elements - Add for transition overlay
    const turnTransitionOverlay = document.getElementById('turn-transition-overlay');
    const transitionPlayerName = document.getElementById('transition-player-name');

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
            feetInput.max = 9; // Set max attribute for feet input
            
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
            const startHereSection = document.querySelector('.start-here-section');
            startHereSection.classList.add('selection-made');
            // Remove rainbow attract after selection
            startHereSection.classList.remove('rainbow-attract');
            
            checkStartButtonState();
        });
    });

    // Guess (stat) button logic: swap classes for selected/unselected
    function updateStatButtonStyles() {
        statButtons.forEach(btn => {
            btn.classList.remove('bg-blue-600', 'bg-white', 'text-white', 'text-blue-700', 'font-bold', 'border-blue-800', 'border-blue-300');
            // Remove any forced inline styles
            btn.style.backgroundColor = '';
            btn.style.color = '';
            if (btn.getAttribute('data-stat') === gameState.statToGuess) {
                btn.classList.add('bg-blue-600', 'text-white', 'font-bold', 'border-blue-800');
                // Force correct color with inline style
                btn.style.backgroundColor = '#2563eb'; // Tailwind blue-600
                btn.style.color = '#fff';
            } else {
                btn.classList.add('bg-white', 'text-blue-700', 'border-blue-300');
            }
        });
    }
    statButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.statToGuess = btn.getAttribute('data-stat');
            // Set default threshold based on stat
            if (gameState.statToGuess === 'height') {
                gameState.gameThreshold = 20;
                updateLosingScores(20);
                if (thresholdDisplayElement) thresholdDisplayElement.textContent = 20;
            } else {
                gameState.gameThreshold = 100;
                updateLosingScores(100);
                if (thresholdDisplayElement) thresholdDisplayElement.textContent = 100;
            }
            updateStatButtonStyles();
            // Debug: log class list and computed styles for Weight button AFTER styles are updated
            if (gameState.statToGuess === 'weight') {
                const weightBtn = Array.from(statButtons).find(b => b.getAttribute('data-stat') === 'weight');
                if (weightBtn) {
                    const computed = window.getComputedStyle(weightBtn);
                    console.log('[DEBUG] Weight button classList:', weightBtn.className);
                    console.log('[DEBUG] Weight button computed background:', computed.backgroundColor);
                    console.log('[DEBUG] Weight button computed color:', computed.color);
                }
            }
            updateThresholdButtonStyles();
            updateInputFields();
            checkStartButtonState();
        });
    });
    // Set initial state
    // Set default threshold based on default stat
    if (gameState.statToGuess === 'height') {
        gameState.gameThreshold = 20;
        updateLosingScores(20);
        if (thresholdDisplayElement) thresholdDisplayElement.textContent = 20;
    } else {
        gameState.gameThreshold = 100;
        updateLosingScores(100);
        if (thresholdDisplayElement) thresholdDisplayElement.textContent = 100;
    }
    updateStatButtonStyles();
    updateThresholdButtonStyles();

    // Threshold button logic: swap classes for selected/unselected
    function updateThresholdButtonStyles() {
        thresholdButtons.forEach(btn => {
            btn.classList.remove('bg-purple-700', 'bg-white', 'text-purple-700', 'font-bold', 'border-purple-900', 'shadow-lg', 'border-purple-300');
            // Remove any forced inline styles
            btn.style.backgroundColor = '';
            btn.style.color = '';
            if (parseInt(btn.getAttribute('data-threshold')) === gameState.gameThreshold) {
                btn.classList.add('bg-purple-700', 'text-white', 'font-bold', 'border-purple-900', 'shadow-lg');
                // Force correct color with inline style
                btn.style.backgroundColor = '#7c3aed'; // Tailwind purple-700
                btn.style.color = '#fff';
            } else {
                btn.classList.add('bg-white', 'text-purple-700', 'border-purple-300');
            }
        });
    }
    thresholdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const threshold = parseInt(btn.getAttribute('data-threshold'));
            gameState.gameThreshold = threshold;
            updateThresholdButtonStyles();
            // Clear custom threshold input
            customThresholdInput.value = '';
            updateLosingScores(threshold);
            if (thresholdDisplayElement) {
                thresholdDisplayElement.textContent = threshold;
            }
            checkStartButtonState();
        });
    });
    // Set initial state
    updateThresholdButtonStyles();
    
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
        // Only update the game background color, no DOM updates for current player
        const colorIndex = gameState.currentPlayerIndex % 4;
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

    // Show transition overlay for the next player
    function showTurnTransition(playerName, callback) {
        if (turnTransitionOverlay && transitionPlayerName) {
            // Remove any previous color classes from text
            transitionPlayerName.classList.remove('text-blue-600', 'text-red-600', 'text-green-600', 'text-yellow-600');
            // Always use semi-transparent black for scrim
            turnTransitionOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
            // Determine color class for player name
            const colorIndex = gameState.currentPlayerIndex % 4;
            let colorClass = '';
            switch (colorIndex) {
                case 0:
                    colorClass = 'text-blue-600';
                    break;
                case 1:
                    colorClass = 'text-red-600';
                    break;
                case 2:
                    colorClass = 'text-green-600';
                    break;
                case 3:
                    colorClass = 'text-yellow-600';
                    break;
            }
            if (colorClass) transitionPlayerName.classList.add(colorClass);
            transitionPlayerName.textContent = playerName;
            turnTransitionOverlay.style.display = 'flex';
            setTimeout(() => {
                turnTransitionOverlay.style.display = 'none';
                if (callback) callback();
            }, 1200); // 1.2 seconds
        } else {
            if (callback) callback();
        }
    }

    // Start the game
    function startGame() {
        console.log("DEBUG: startGame called");
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

        // Reset game state for new game
        gameState.currentPlayerIndex = 0;
        gameState.currentRound = 1;
        gameState.gameOver = false;
        gameState.eliminatedPlayers = [];
        
        // Setup game screen
        setupScreen.classList.add('hidden');
        // Show transition overlay for first player before showing game screen
        const firstPlayerName = gameState.players[0].name;
        showTurnTransition(firstPlayerName, () => {
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
            logGameState("After startGame initialization");
            // Start first round
            selectNewAthlete();
        });
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
        // athleteNameElement.textContent = currentAthlete.name;
        // athleteInfoElement.textContent = currentAthlete.sport;
        // Update front of flip card
        const frontAthleteName = document.getElementById('front-athlete-name');
        const frontAthleteInfo = document.getElementById('front-athlete-info');
        if (frontAthleteName) frontAthleteName.textContent = currentAthlete.name;
        if (frontAthleteInfo) frontAthleteInfo.textContent = currentAthlete.sport;
        // Update back of flip card
        const backAthleteName = document.getElementById('back-athlete-name');
        const backAthleteInfo = document.getElementById('back-athlete-info');
        if (backAthleteName) backAthleteName.textContent = currentAthlete.name;
        if (backAthleteInfo) backAthleteInfo.textContent = currentAthlete.sport;
        
        // Reset form and validate inputs
        updateInputFields();
        validateGuessInputs();
        resultContainer.classList.add('hidden');
        resultContainer.classList.remove('flipped');
        setGuessPulse(true);

        // In selectNewAthlete, after setGuessPulse(true):
        nextTurnButton.disabled = true;
        nextTurnButton.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Submit a guess
    function submitGuess() {
        console.log("DEBUG: submitGuess called");
        
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
        
        console.log(`DEBUG: Player ${gameState.players[gameState.currentPlayerIndex].name} new score: ${gameState.players[gameState.currentPlayerIndex].score}`);
        
        // Show result
        resultContainer.classList.remove('hidden');
        // Set athlete name and info in result card (back)
        const backAthleteName2 = document.getElementById('back-athlete-name');
        const backAthleteInfo2 = document.getElementById('back-athlete-info');
        if (backAthleteName2) backAthleteName2.textContent = currentAthlete.name;
        if (backAthleteInfo2) backAthleteInfo2.textContent = currentAthlete.sport;
        // Set athlete name and info in result card (front)
        const frontAthleteName2 = document.getElementById('front-athlete-name');
        const frontAthleteInfo2 = document.getElementById('front-athlete-info');
        if (frontAthleteName2) frontAthleteName2.textContent = currentAthlete.name;
        if (frontAthleteInfo2) frontAthleteInfo2.textContent = currentAthlete.sport;
        // Clear bust message before showing
        const bustMessageDiv = document.getElementById('bust-message');
        if (bustMessageDiv) bustMessageDiv.innerHTML = '';
        // Trigger card flip
        setTimeout(() => {
            resultContainer.classList.add('flipped');
        }, 100);
        
        if (gameState.statToGuess === 'height') {
            const { feet, inches } = cmToFeetInches(currentAthlete[gameState.statToGuess]);
            actualValueElement.textContent = `${feet}'${inches}"`;
            // Remove updating guessValueElement since the line is removed from HTML
            // feetInput.disabled = true;
            // inchesInput.disabled = true;
            feetInput.disabled = true;
            inchesInput.disabled = true;
        } else {
            const actualPounds = kgToPounds(currentAthlete[gameState.statToGuess]);
            actualValueElement.textContent = actualPounds;
            // Remove updating guessValueElement since the line is removed from HTML
            unitDisplayElement.textContent = 'lbs';
            unitDisplay2Element.textContent = 'lbs';
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
            console.log(`DEBUG: Player ${gameState.players[gameState.currentPlayerIndex].name} eliminated during turn`);
            // Set bust message inside the card
            if (bustMessageDiv) {
                bustMessageDiv.innerHTML = `<span class='text-red-600 font-bold text-lg elimination-message'>${gameState.players[gameState.currentPlayerIndex].name} has BUST!</span>`;
            }
            // Highlight the next turn button more prominently
            nextTurnButton.classList.add('eliminated-player-next');
        }
        
        logGameState("After submitting guess");

        // In submitGuess, after resultContainer.classList.remove('hidden') and before logGameState:
        nextTurnButton.disabled = false;
        nextTurnButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Check if the current player is eliminated
    function checkPlayerElimination() {
        // Get current losing score based on stat being guessed
        const currentLosingScore = gameState.losingScores[gameState.statToGuess];
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        console.log(`DEBUG: Checking elimination for player ${currentPlayer.name} (index ${gameState.currentPlayerIndex})`);
        console.log(`DEBUG: Player score: ${currentPlayer.score}, Threshold: ${currentLosingScore}`);
        
        // Check if player score equals or exceeds the losing score threshold
        if (currentPlayer.score >= currentLosingScore) {
            // Mark player for elimination but don't actually eliminate until round ends
            if (!gameState.eliminatedPlayers.includes(gameState.currentPlayerIndex) && 
                !currentPlayer.markedForElimination) {
                
                console.log(`DEBUG: Marking player ${currentPlayer.name} for elimination`);
                
                // Mark them for elimination but proceed with the round
                currentPlayer.markedForElimination = true;
                
                // Add an eliminated message to the result container
                const eliminatedMessage = document.createElement('p');
                eliminatedMessage.className = 'mt-3 text-red-600 font-bold text-xl elimination-message';
                eliminatedMessage.textContent = `${currentPlayer.name} will be BUST at the end of this round!`;
                resultContainer.appendChild(eliminatedMessage);
                
                // Highlight the next turn button
                nextTurnButton.classList.add('eliminated-player-next');
                
                // Check if we're in a two-player game and both players are now eliminated or marked
                if (gameState.numberOfPlayers === 2) {
                    const otherPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
                    const otherPlayer = gameState.players[otherPlayerIndex];
                    
                    console.log(`DEBUG: Two player game - checking other player ${otherPlayer.name}`);
                    console.log(`DEBUG: Other player eliminated: ${gameState.eliminatedPlayers.includes(otherPlayerIndex)}, marked: ${otherPlayer.markedForElimination}`);
                    
                    // If other player is already eliminated or marked for elimination, game is over
                    if (gameState.eliminatedPlayers.includes(otherPlayerIndex) || 
                        otherPlayer.markedForElimination) {
                        
                        console.log(`DEBUG: Both players eliminated or marked - game over`);
                        // Mark game as over immediately in 2-player scenario
                        gameState.gameOver = true;
                    }
                }
            }
            
            return true;
        }
        
        return false;
    }

    // Confetti effect for winner (continuous until Play Again)
    let confettiAnimationId = null;
    let confettiActive = false;
    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        function resizeCanvasAndConfetti() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
            ctx.scale(dpr, dpr);
        }
        resizeCanvasAndConfetti();
        canvas.style.display = 'block';
        const confettiCount = 300;
        const confetti = [];
        const colors = ['#ff6ec4', '#7873f5', '#42e695', '#ffe140', '#ff6ec4', '#f87171', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#facc15'];
        for (let i = 0; i < confettiCount; i++) {
            // About 1 in 8 stars will be large
            const isLarge = Math.random() < 0.125;
            const baseR = Math.random() * 10 + 6;
            const r = isLarge ? baseR * 2.5 : baseR;
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                r: r,
                d: Math.random() * confettiCount,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 20 - 10,
                tiltAngleIncremental: Math.random() * 0.09 + 0.05,
                tiltAngle: 0,
                dx: (Math.random() - 0.5) * 1.2, // random horizontal drift
                dy: Math.random() * 1.5 + 4.5    // random downward speed
            });
        }
        let angle = 0;
        let tiltAngle = 0;
        confettiActive = true;
        // Add resize handler
        window.addEventListener('resize', resizeCanvasAndConfetti);
        function drawStar(ctx, x, y, r, color) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.moveTo(0, 0 - r);
            for (let i = 0; i < 5; i++) {
                ctx.rotate(Math.PI / 5);
                ctx.lineTo(0, 0 - (r * 0.5));
                ctx.rotate(Math.PI / 5);
                ctx.lineTo(0, 0 - r);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.restore();
        }
        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                drawStar(ctx, c.x + c.tilt, c.y, c.r / 2, c.color);
            }
            updateConfetti();
        }
        function updateConfetti() {
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                c.y += c.dy;
                c.x += c.dx;
                c.tiltAngle += c.tiltAngleIncremental;
                c.tilt = Math.sin(c.tiltAngle - i) * 18;
                if (c.y > canvas.height) {
                    c.x = Math.random() * canvas.width;
                    c.y = -10;
                }
            }
        }
        function animate() {
            if (!confettiActive) return;
            drawConfetti();
            confettiAnimationId = requestAnimationFrame(animate);
        }
        animate();
        // Store the resize handler for cleanup
        canvas._resizeHandler = resizeCanvasAndConfetti;
    }
    function stopConfetti() {
        confettiActive = false;
        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
            // Remove resize handler
            if (canvas._resizeHandler) {
                window.removeEventListener('resize', canvas._resizeHandler);
                delete canvas._resizeHandler;
            }
        }
    }

    // Show game over screen (add confetti)
    function showGameOverScreen() {
        console.log("DEBUG: showGameOverScreen called");
        
        // Find the winner (the only player not eliminated)
        let winnerIndex;
        if (gameState.numberOfPlayers === 1) {
            winnerIndex = 0; // Always the single player
        } else {
            winnerIndex = Array.from({length: gameState.numberOfPlayers}, (_, i) => i)
                .find(index => !gameState.eliminatedPlayers.includes(index));
        }
        
        console.log(`DEBUG: Determined winner index: ${winnerIndex}`);
        
        // Sort players by score (lowest first, which is better)
        const sortedPlayers = [...gameState.players].sort((a, b) => a.score - b.score);
        
        // Display final results
        finalScoreboard.innerHTML = '';
        const placeEmojis = [
            { emoji: '🏆', size: '2.5rem' }, // 1st: Gold Trophy
            { emoji: '💩', size: '1.2rem' }, // 2nd: Small Poop
            { emoji: '💩', size: '1.7rem' }, // 3rd: Medium Poop
            { emoji: '💩', size: '2.2rem' }  // 4th: Large Poop
        ];
        const playerColors = [
            '#2563eb', // Blue (Player 1)
            '#dc2626', // Red (Player 2)
            '#059669', // Green (Player 3)
            '#d97706'  // Orange (Player 4)
        ];
        sortedPlayers.forEach((player, index) => {
            const playerIndex = gameState.players.indexOf(player);
            const playerResult = document.createElement('div');
            playerResult.style.marginBottom = '1rem';
            playerResult.style.padding = '1rem';
            playerResult.style.borderRadius = '0.75rem';
            playerResult.style.border = '2px solid #e5e7eb';
            playerResult.style.background = '#fff';
            playerResult.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
            playerResult.style.display = 'flex';
            playerResult.style.flexDirection = 'column';
            playerResult.style.alignItems = 'center';
            playerResult.style.boxShadow = 'none';

            let emoji = '';
            let emojiSize = '1.5rem';
            let nameColor = playerColors[playerIndex % playerColors.length] || '#222';
            if (index < 4) {
                emoji = placeEmojis[index].emoji;
                emojiSize = placeEmojis[index].size;
            } else {
                nameColor = '#6b7280'; // Muted gray
            }

            playerResult.innerHTML = `
                <div style=\"display:flex;flex-direction:column;align-items:center;justify-content:center;\">
                  <span style=\"font-size:${emojiSize};line-height:1;\">${emoji}</span>
                  <span style=\"font-weight:bold;font-size:1.3rem;color:${nameColor};\">${player.name}</span>
                </div>
            `;
            finalScoreboard.appendChild(playerResult);
        });
        
        // Clear any elimination messages
        const eliminationMessages = document.querySelectorAll('.elimination-message');
        eliminationMessages.forEach(msg => {
            msg.remove();
        });
        
        // Reset button states
        nextTurnButton.classList.remove('clicked');
        nextTurnButton.classList.remove('eliminated-player-next');
        nextTurnButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            NEXT TURN
        `;
        
        console.log("DEBUG: Showing game over screen");
        
        // Show game over screen
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        // Launch confetti!
        launchConfetti();
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
                    <p class="text-xs mt-1 font-bold text-red-600">BUST</p>
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

    // Process players marked for elimination at the end of a round
    function processEliminationsAtRoundEnd() {
        console.log("DEBUG: Processing eliminations at round end");
        
        // Find all players marked for elimination and add them to the eliminated array
        let newEliminationsOccurred = false;
        
        gameState.players.forEach((player, index) => {
            if (player.markedForElimination && !gameState.eliminatedPlayers.includes(index)) {
                console.log(`DEBUG: Player ${player.name} (index ${index}) officially eliminated at round end`);
                gameState.eliminatedPlayers.push(index);
                newEliminationsOccurred = true;
            }
        });
        
        // Count non-eliminated players
        const nonEliminatedCount = gameState.numberOfPlayers - gameState.eliminatedPlayers.length;
        console.log(`DEBUG: Non-eliminated players: ${nonEliminatedCount}`);
        
        // If there's only one player left, the game is over
        if (nonEliminatedCount <= 1) {
            console.log("DEBUG: Only one player remaining - game over");
            gameState.gameOver = true;
            // Small delay to ensure UI updates properly
            setTimeout(() => {
                showGameOverScreen();
            }, 100);
            return;
        }
        
        // If new eliminations occurred, show notification
        if (newEliminationsOccurred) {
            console.log("DEBUG: Showing round end eliminations message");
            
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

    // Reset the game to play again
    function resetGame() {
        console.log("DEBUG: resetGame called");
        
        // Reset game state
        gameState.players = [];
        gameState.currentPlayerIndex = 0;
        gameState.numberOfPlayers = 0;
        gameState.statToGuess = 'height'; // Reset to default
        gameState.currentRound = 1;
        gameState.gameOver = false;
        gameState.eliminatedPlayers = []; // Reset eliminated players array
        
        // Clear any elimination messages
        const eliminationMessages = document.querySelectorAll('.elimination-message');
        eliminationMessages.forEach(msg => {
            msg.remove();
        });
        
        // Clear result container
        resultContainer.classList.add('hidden');
        resultContainer.classList.remove('flipped');
        
        // Reset next turn button appearance
        nextTurnButton.classList.remove('clicked');
        nextTurnButton.classList.remove('eliminated-player-next');
        nextTurnButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            NEXT TURN
        `;
        
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
        const startHereSection = document.querySelector('.start-here-section');
        startHereSection.classList.remove('selection-made');
        startHereSection.classList.add('rainbow-attract');
        
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
        
        logGameState("After reset game");
        // Clear bust message on reset
        if (bustMessageDiv) bustMessageDiv.innerHTML = '';
    }

    // Next player's turn
    function nextTurn() {
        console.log("DEBUG: nextTurn called");
        try {
            // Add visual feedback for button click
            nextTurnButton.classList.add('clicked');
            nextTurnButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            
            // Clean up any existing elimination messages
            const eliminationMessages = document.querySelectorAll('.elimination-message');
            eliminationMessages.forEach(msg => {
                msg.remove();
            });
            
            // Add a small delay for visual effect
            setTimeout(() => {
                // If game is already over, show the game over screen and exit
                if (gameState.gameOver) {
                    console.log("DEBUG: Game over detected in nextTurn");
                    showGameOverScreen();
                    return;
                }
                
                // 1-player mode: just keep going until eliminated
                if (gameState.numberOfPlayers === 1) {
                    // If the player is eliminated, end the game
                    if (gameState.eliminatedPlayers.includes(0)) {
                        gameState.gameOver = true;
                        showGameOverScreen();
                        return;
                    }
                    // Otherwise, just select a new athlete and continue
                    gameState.currentRound++;
                    currentRoundElement.textContent = gameState.currentRound;
                    updateCurrentPlayerDisplay();
                    updateScoreboard();
                    selectNewAthlete();
                    submitGuessButton.disabled = false;
                    submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    feetInput.disabled = false;
                    inchesInput.disabled = false;
                    weightInput.disabled = false;
                    nextTurnButton.classList.remove('clicked');
                    nextTurnButton.classList.remove('eliminated-player-next');
                    nextTurnButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        NEXT TURN
                    `;
                    logGameState("After nextTurn processing (1-player mode)");
                    return;
                }
                
                // Move to the next player
                gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.numberOfPlayers;
                console.log(`DEBUG: Advanced to next player index: ${gameState.currentPlayerIndex}`);
                
                // Track if we've completed a round (everyone had a turn)
                const roundComplete = gameState.currentPlayerIndex === 0;
                
                // If we've reached the start of a new round, process eliminations and increment round
                if (roundComplete) {
                    console.log("DEBUG: Round complete, processing eliminations");
                    // Process any players marked for elimination
                    processEliminationsAtRoundEnd();
                    
                    // If game became over after processing eliminations, exit the function
                    if (gameState.gameOver) {
                        console.log("DEBUG: Game over after processing eliminations");
                        return;
                    }
                    
                    // Increment round number
                    gameState.currentRound++;
                    console.log(`DEBUG: New round: ${gameState.currentRound}`);
                    currentRoundElement.textContent = gameState.currentRound;
                }
                
                // Skip any already eliminated players
                let attemptCount = 0;
                const maxAttempts = gameState.numberOfPlayers; // Prevent infinite loop
                
                console.log(`DEBUG: Checking if current player ${gameState.currentPlayerIndex} is eliminated`);
                console.log(`DEBUG: Eliminated players: ${JSON.stringify(gameState.eliminatedPlayers)}`);
                
                while (gameState.eliminatedPlayers.includes(gameState.currentPlayerIndex) && 
                        attemptCount < maxAttempts) {
                    console.log(`DEBUG: Player ${gameState.currentPlayerIndex} is eliminated, moving to next`);
                    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.numberOfPlayers;
                    attemptCount++;
                    
                    // If we've checked all players and they're all eliminated except one,
                    // the game should end
                    if (attemptCount >= maxAttempts - 1 && 
                        gameState.eliminatedPlayers.length >= gameState.numberOfPlayers - 1) {
                        console.log(`DEBUG: All but one player eliminated - game over`);
                        gameState.gameOver = true;
                        showGameOverScreen();
                        return;
                    }
                }
                
                // Update current player display with correct color
                // Instead of immediately updating, show transition overlay
                const nextPlayerName = gameState.players[gameState.currentPlayerIndex].name;
                showTurnTransition(nextPlayerName, () => {
                    updateCurrentPlayerDisplay();
                    updateScoreboard();
                    selectNewAthlete();
                    submitGuessButton.disabled = false;
                    submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    feetInput.disabled = false;
                    inchesInput.disabled = false;
                    weightInput.disabled = false;
                    nextTurnButton.classList.remove('clicked');
                    nextTurnButton.classList.remove('eliminated-player-next');
                    nextTurnButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        NEXT TURN
                    `;
                    logGameState("After nextTurn processing");
                });
            }, 500); // 500ms delay for visual effect
            setGuessPulse(true);
        } catch (error) {
            console.error("Error in nextTurn:", error);
            // Reset button state in case of error
            nextTurnButton.classList.remove('clicked');
            nextTurnButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                NEXT TURN
            `;
        }
    }

    // Prevent feet input from exceeding 9
    feetInput.addEventListener('input', function() {
        if (parseInt(this.value) > 9) {
            this.value = 9;
        }
        // Automatically focus inches input after entering feet
        if (this.value.length >= 1) {
            inchesInput.focus();
        }
    });

    // Stop confetti when Play Again is pressed
    playAgainButton.addEventListener('click', stopConfetti);

    // Add input validation for submit guess button
    function validateGuessInputs() {
        if (gameState.statToGuess === 'height') {
            const feet = parseInt(feetInput.value) || 0;
            const inches = parseInt(inchesInput.value) || 0;
            submitGuessButton.disabled = feet === 0 && inches === 0;
        } else {
            const weight = parseInt(weightInput.value) || 0;
            submitGuessButton.disabled = weight <= 0;
        }
        
        // Update button appearance
        if (submitGuessButton.disabled) {
            submitGuessButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            submitGuessButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Add input event listeners for validation
    feetInput.addEventListener('input', validateGuessInputs);
    inchesInput.addEventListener('input', validateGuessInputs);
    weightInput.addEventListener('input', validateGuessInputs);

    // Dark mode logic
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    function setDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
            if (darkModeToggle) darkModeToggle.checked = false;
        }
    }
    // On page load, default to light mode (or use saved preference)
    const darkPref = localStorage.getItem('darkMode');
    if (darkPref === 'true') {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            setDarkMode(e.target.checked);
        });
    }

    // Utility to add animated highlight to guess input fields
    function setGuessPulse(active) {
        [feetInput, inchesInput, weightInput].forEach(input => {
            if (input) {
                if (active) input.classList.add('guess-pulse');
                else input.classList.remove('guess-pulse');
            }
        });
    }

    // Remove pulse on input focus
    [feetInput, inchesInput, weightInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', () => setGuessPulse(false));
        }
    });

    // Add pulse again after next turn
    function addPulseAfterNextTurn() {
        setTimeout(() => {
            setGuessPulse(true);
        }, 500);
    }
}); // End of DOMContentLoaded event listener 