class TicTacToeGame {
    constructor() {
        this.playerSymbol = 'X';
        this.computerSymbol = 'O';
        this.board = Array(3).fill().map(() => Array(3).fill(''));
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.difficulty = 'Facile';
        
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.showSymbolModal();
    }

    setupEventListeners() {
        // Symbol choice modal
        document.getElementById('confirmSymbol').addEventListener('click', () => {
            this.handleSymbolChoice();
        });

        // Difficulty change
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.restartGame();
            });
        });

        // Cell clicks
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellClick(row, col);
            });
        });

        // Restart button
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });

        // Message modal close
        document.getElementById('closeMessage').addEventListener('click', () => {
            this.hideMessageModal();
        });
    }

    showSymbolModal() {
        document.getElementById('symbolModal').style.display = 'block';
    }

    hideSymbolModal() {
        document.getElementById('symbolModal').style.display = 'none';
    }

    handleSymbolChoice() {
        const selectedSymbol = document.querySelector('input[name="symbol"]:checked').value;
        this.playerSymbol = selectedSymbol;
        this.computerSymbol = selectedSymbol === 'X' ? 'O' : 'X';
        this.currentPlayer = 'X'; // X always starts
        
        this.hideSymbolModal();
        this.resetBoard();
        
        // If player chose O, computer makes first move
        if (this.playerSymbol === 'O') {
            setTimeout(() => this.computerMove(), 500);
        }
        
        this.updateGameStatus(`Votre symbole: ${this.playerSymbol}. ${this.currentPlayer === this.playerSymbol ? 'À votre tour!' : 'Tour de l\'ordinateur...'}`);
    }

    handleCellClick(row, col) {
        if (!this.gameActive || this.board[row][col] !== '' || this.currentPlayer !== this.playerSymbol) {
            if (this.board[row][col] !== '') {
                this.showMessage("Position prise", "Cette position est déjà prise. Essayez à nouveau.");
            }
            return;
        }

        this.makeMove(row, col, this.playerSymbol);
        
        if (this.checkWinner()) {
            this.endGame();
            return;
        }
        
        if (this.isBoardFull()) {
            this.showMessage("Fin du jeu", "Match nul!");
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.computerSymbol;
        this.updateGameStatus("Tour de l'ordinateur...");
        setTimeout(() => this.computerMove(), 500);
    }

    makeMove(row, col, symbol) {
        this.board[row][col] = symbol;
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = symbol;
        cell.disabled = true;
        cell.classList.add(symbol.toLowerCase());
    }

    computerMove() {
        if (!this.gameActive) return;

        const move = this.getBestMove();
        if (move) {
            this.makeMove(move.row, move.col, this.computerSymbol);
            
            if (this.checkWinner()) {
                this.endGame();
                return;
            }
            
            if (this.isBoardFull()) {
                this.showMessage("Fin du jeu", "Match nul!");
                this.gameActive = false;
                return;
            }

            this.currentPlayer = this.playerSymbol;
            this.updateGameStatus("À votre tour!");
        }
    }

    getBestMove() {
        const emptyPositions = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === '') {
                    emptyPositions.push({row: i, col: j});
                }
            }
        }

        if (emptyPositions.length === 0) return null;

        switch (this.difficulty) {
            case 'Facile':
                return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
            
            case 'Moyen':
                if (Math.random() < 0.5) {
                    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
                } else {
                    return this.findBestMove();
                }
            
            case 'Difficile':
            case 'Extrême':
                return this.findBestMove();
            
            default:
                return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === '') {
                    this.board[i][j] = this.computerSymbol;
                    const score = this.minimax(this.board, false, -Infinity, Infinity);
                    this.board[i][j] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {row: i, col: j};
                    }
                }
            }
        }

        return bestMove;
    }

    minimax(board, isMaximizing, alpha, beta) {
        const winner = this.checkWinnerBoard(board);
        
        if (winner === this.computerSymbol) return 1;
        if (winner === this.playerSymbol) return -1;
        if (this.isBoardFullArray(board)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '') {
                        board[i][j] = this.computerSymbol;
                        const score = this.minimax(board, false, alpha, beta);
                        board[i][j] = '';
                        bestScore = Math.max(score, bestScore);
                        alpha = Math.max(alpha, bestScore);
                        if (beta <= alpha) break;
                    }
                }
                if (beta <= alpha) break;
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '') {
                        board[i][j] = this.playerSymbol;
                        const score = this.minimax(board, true, alpha, beta);
                        board[i][j] = '';
                        bestScore = Math.min(score, bestScore);
                        beta = Math.min(beta, bestScore);
                        if (beta <= alpha) break;
                    }
                }
                if (beta <= alpha) break;
            }
            return bestScore;
        }
    }

    checkWinner() {
        return this.checkWinnerBoard(this.board);
    }

    checkWinnerBoard(board) {
        const winningCombinations = [
            // Rows
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            // Columns
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            // Diagonals
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a[0]][a[1]] && 
                board[a[0]][a[1]] === board[b[0]][b[1]] && 
                board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]];
            }
        }
        return null;
    }

    isBoardFull() {
        return this.isBoardFullArray(this.board);
    }

    isBoardFullArray(board) {
        return board.every(row => row.every(cell => cell !== ''));
    }

    endGame() {
        const winner = this.checkWinner();
        this.gameActive = false;
        
        if (winner) {
            const isPlayerWin = winner === this.playerSymbol;
            const message = isPlayerWin ? 
                `Félicitations! Vous avez gagné avec ${winner}!` : 
                `L'ordinateur a gagné avec ${winner}!`;
            
            this.showMessage("Fin du jeu", message);
            this.highlightWinningCombination();
        }
    }

    highlightWinningCombination() {
        const winningCombinations = [
            [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a[0]][a[1]] && 
                this.board[a[0]][a[1]] === this.board[b[0]][b[1]] && 
                this.board[a[0]][a[1]] === this.board[c[0]][c[1]]) {
                
                combination.forEach(([row, col]) => {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add('winning');
                });
                break;
            }
        }
    }

    restartGame() {
        this.showSymbolModal();
    }

    resetBoard() {
        this.board = Array(3).fill().map(() => Array(3).fill(''));
        this.gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
            cell.className = 'cell';
        });
        
        this.updateGameStatus('');
    }

    showMessage(title, message) {
        document.getElementById('messageTitle').textContent = title;
        document.getElementById('messageText').textContent = message;
        document.getElementById('messageModal').style.display = 'block';
    }

    hideMessageModal() {
        document.getElementById('messageModal').style.display = 'none';
    }

    updateGameStatus(message) {
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = message;
        
        if (message.includes('gagné')) {
            statusElement.className = 'game-status success';
        } else if (message.includes('nul')) {
            statusElement.className = 'game-status warning';
        } else if (message.includes('tour')) {
            statusElement.className = 'game-status info';
        } else {
            statusElement.className = 'game-status';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});
