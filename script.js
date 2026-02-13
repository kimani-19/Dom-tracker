//LOGIN AND SIGNUP FUNCTIONALITY
//get the login and signup elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');

//profile logic
const profileUsername = document.getElementById('ProfileUsename');
const gamesPlayesDisplay = document.getElementById('gamesPlayed');
const logoutButton = document.getElementById('logoutButton');
// sign up logic
signupButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    localStorage.setItem('user', JSON.stringify({
        username: username,
        password: password
    }));
    alert("Sign up successful! You can now log in.");
});
// login logic
loginButton.addEventListener('click', () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
        alert("User not found. Please sign up first.");
        return;
    }

    if (
        usernameInput.value === savedUser.username &&
        passwordInput.value === savedUser.password
    )
    {
        alert("Login successful!");
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        localStorage.setItem("loggedIn", "true");
        profileUsername.textContent = "Welcome, " + savedUser.username;
    } else {
        alert("Invalid username or password.");
    }
});


//SCOREKEEPER FUNCTIONALITY
//get the input fields and display elements for team names
const teamAinput = document.getElementById('teamA-name');
const teamBinput = document.getElementById('teamB-name');
const teamATitle = document.getElementById('teamATitle');
const teamBTitle = document.getElementById('teamBTitle');

//update team names when input fields change and user types
teamAinput.addEventListener('input', () => {
    teamATitle.textContent = teamAinput.value || "Team A";
    saveGameState();
});
teamBinput.addEventListener('input', () => {
    teamBTitle.textContent = teamBinput.value || "Team B";
    saveGameState();
});



//saveGame state variables  
function saveGameState() {
    localStorage.setItem("scoreA", scoreA);
    localStorage.setItem("scoreB", scoreB);
    localStorage.setItem("teamAName", teamATitle.textContent);
    localStorage.setItem("teamBName", teamBTitle.textContent);
    localStorage.setItem("winningScore", winningScoreInput.value);
    localStorage.setItem("gameOver", gameOver);
}
//store the scores for each team or player
let scoreA = 0;
let scoreB = 0;

//function to update the score display
const scoreADisplay = document.getElementById('teamA-score');
const scoreBDisplay = document.getElementById('teamB-score');

//set winning score and game over flag
const winningScoreInput = document.getElementById('winningScoreInput');
let gameOver = false; 
const winnerMessage = document.getElementById('winnerMessage');

//get all buttons on the page
//const buttons = document.querySelectorAll('button');



//Reset Button code

//get the reset button
const resetButton = document.getElementById('reset-button');

//reset the scores when the reset button is clicked
resetButton.addEventListener('click', () => {
    winningScoreInput.disabled = false
    scoreA = 0;
    scoreB = 0;
    gameOver = false;
    winnerMessage.textContent = "";
    scoreADisplay.textContent = scoreA;
    scoreBDisplay.textContent = scoreB;

});

//Load saved game state from localStorage on page load
window.addEventListener('load', () => {
    //addPoint buttons
    const addPointAButton = document.getElementById('teamA-addPoint');
    const addPointBButton = document.getElementById('teamB-addPoint');
    
    const savedScoreA = localStorage.getItem("scoreA");
    const savedScoreB = localStorage.getItem("scoreB");

    if (savedScoreA !== null) {
        scoreA = parseInt(savedScoreA);
        scoreADisplay.textContent = scoreA;
    }
    if (savedScoreB !== null) {
        scoreB = parseInt(savedScoreB);
        scoreBDisplay.textContent = scoreB;
    }

    const savedTeamAName = localStorage.getItem("teamAName");
    const savedTeamBName = localStorage.getItem("teamBName");

    if (savedTeamAName) {
        teamATitle.textContent = savedTeamAName;
        teamAinput.value = savedTeamAName;
    }
    if (savedTeamBName) {
        teamBTitle.textContent = savedTeamBName;
        teamBinput.value = savedTeamBName;
    }

    const savedWinningScore = localStorage.getItem("winningScore");
    if (savedWinningScore) {
        winningScoreInput.value = savedWinningScore;
    }

    const savedGameOver = localStorage.getItem("gameOver");
    if (savedGameOver === "true") {
        gameOver = true;
        winnerMessage.textContent = (scoreA > scoreB ? teamATitle.textContent : teamBTitle.textContent) + " Wins!";
        winningScoreInput.disabled = true;
    }
    //check if user is logged in
    const loggedIn = localStorage.getItem("loggedIn");
    if(loggedIn === "true") {
        authSection.style.display = "none";
        appSection.style.display = "block";
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        profileUsername.textContent = "Welcome, " + savedUser.username;
    }
    } else {
        authSection.style.display = "block";
        appSection.style.display = "none";
    }

    //Button for Team A
addPointAButton.addEventListener('click', () => {
    if (gameOver) return; // Prevent further scoring if game is over
    scoreA ++;
    scoreADisplay.textContent = scoreA;
    winningScoreInput.disabled = true;

    if (scoreA >= Number(winningScoreInput.value)) {        
        winnerMessage.textContent = teamATitle.textContent + " Wins!";
        gameOver = true;

    }
    saveGameState();
});

//Button for Team B
addPointBButton.addEventListener('click', () => {
    if (gameOver) return; // Prevent further scoring if game is over
    scoreB ++;
    scoreBDisplay.textContent = scoreB;
    winningScoreInput.disabled = true;

    if (scoreB >= Number(winningScoreInput.value)) {
        gameOver = true;
        winnerMessage.textContent = teamBTitle.textContent + " Wins!";
    }
    saveGameState();

});

//logout button functionality
logoutButton.addEventListener('click', () => {
    localStorage.removeItem("loggedIn");
    authSection.style.display = "block";
    appSection.style.display = "none";
});
});
