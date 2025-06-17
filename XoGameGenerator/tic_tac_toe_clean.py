import tkinter as tk
from tkinter import messagebox, Toplevel
import random

class ChoiceDialog:
    def __init__(self, parent, title, message):
        self.top = Toplevel(parent)
        self.top.title(title)
        self.top.transient(parent)
        self.top.grab_set()

        self.choice = tk.StringVar(value="X")

        tk.Label(self.top, text=message).pack(pady=10)

        frame = tk.Frame(self.top)
        frame.pack(pady=5)

        tk.Radiobutton(frame, text="X", variable=self.choice, value="X").pack(side=tk.LEFT, padx=10)
        tk.Radiobutton(frame, text="O", variable=self.choice, value="O").pack(side=tk.LEFT, padx=10)

        tk.Button(self.top, text="OK", command=self.ok).pack(pady=10)

        self.top.protocol("WM_DELETE_WINDOW", self.cancel)
        self.top.geometry("300x150")
        self.top.resizable(False, False)

        self.result = None

    def ok(self):
        self.result = self.choice.get()
        self.top.destroy()

    def cancel(self):
        self.result = None
        self.top.destroy()

    def show(self):
        self.top.wait_window()
        return self.result

class TicTacToeGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Tic Tac Toe")

        self.player_choice = tk.StringVar(value="X")
        self.player_positions = {}
        self.buttons = {}
        self.difficulty = tk.StringVar(value="Facile")

        self.show_choice_dialog()
        self.create_difficulty_menu()
        self.create_board()
        self.create_restart_button()

        self.difficulty.trace_add("write", self.on_difficulty_change)

    def show_choice_dialog(self):
        dialog = ChoiceDialog(self.root, "Choix du symbole", "Choisissez votre symbole (X ou O) :")
        choice = dialog.show()
        if choice:
            self.player_choice.set(choice)
            if self.player_choice.get() == 'O':
                self.root.after(100, self.computer_move)
        else:
            self.root.destroy()

    def create_difficulty_menu(self):
        difficulty_frame = tk.Frame(self.root)
        difficulty_frame.grid(row=3, column=0, columnspan=3, pady=5)

        tk.Label(difficulty_frame, text="Choisissez la difficulté:").pack(side=tk.LEFT)

        difficulties = ["Facile", "Moyen", "Difficile", "Extrême"]
        for difficulty in difficulties:
            tk.Radiobutton(difficulty_frame, text=difficulty, variable=self.difficulty, value=difficulty).pack(side=tk.LEFT)

    def create_board(self):
        for i in range(3):
            for j in range(3):
                button = tk.Button(self.root, text='', font=('normal', 20), width=5, height=2,
                                   command=lambda x=i, y=j: self.on_button_click(x, y))
                button.grid(row=i, column=j, sticky='nsew')
                self.buttons[(i, j)] = button

    def create_restart_button(self):
        restart_button = tk.Button(self.root, text='Rejouer', font=('normal', 14), command=self.restart_game)
        restart_button.grid(row=4, column=0, columnspan=3, pady=10)

    def on_difficulty_change(self, *args):
        self.restart_game()

    def restart_game(self):
        dialog = ChoiceDialog(self.root, "Choix du symbole", "Choisissez votre symbole (X ou O) :")
        choice = dialog.show()
        if choice:
            self.player_choice.set(choice)
            self.player_positions = {}
            for (i, j) in self.buttons:
                self.buttons[(i, j)].config(text='', state=tk.NORMAL)
            if self.player_choice.get() == 'O':
                self.root.after(100, self.computer_move)
        else:
            self.root.destroy()

    def on_button_click(self, x, y):
        if (x, y) in self.player_positions:
            messagebox.showinfo("Position prise", "Cette position est déjà prise. Essayez à nouveau.")
            return

        self.player_positions[(x, y)] = self.player_choice.get()
        self.buttons[(x, y)].config(text=self.player_choice.get(), state=tk.DISABLED,
                                    disabledforeground='blue' if self.player_choice.get() == 'X' else 'red')

        winner = self.check_winner()
        if winner:
            messagebox.showinfo("Fin du jeu", f"Félicitations! Le joueur {winner} a gagné!")
            return

        if len(self.player_positions) == 9:
            messagebox.showinfo("Fin du jeu", "Match nul!")
            return

        self.root.after(100, self.computer_move)

    def computer_move(self):
        difficulty = self.difficulty.get()
        empty_positions = [(i, j) for (i, j) in self.buttons if (i, j) not in self.player_positions]

        if not empty_positions:
            return

        if difficulty == "Facile":
            move = random.choice(empty_positions)
        elif difficulty == "Moyen":
            if random.random() < 0.5:
                move = random.choice(empty_positions)
            else:
                move = self.find_best_move()
        elif difficulty in ["Difficile", "Extrême"]:
            move = self.find_best_move()
        else:
            move = random.choice(empty_positions)

        if move:
            i, j = move
            computer_symbol = 'O' if self.player_choice.get() == 'X' else 'X'
            self.player_positions[(i, j)] = computer_symbol
            self.buttons[(i, j)].config(text=computer_symbol, state=tk.DISABLED,
                                        disabledforeground='red' if computer_symbol == 'O' else 'blue')

        winner = self.check_winner()
        if winner:
            messagebox.showinfo("Fin du jeu", f"Félicitations! Le joueur {winner} a gagné!")
            return

        if len(self.player_positions) == 9:
            messagebox.showinfo("Fin du jeu", "Match nul!")

    def find_best_move(self):
        computer_symbol = 'O' if self.player_choice.get() == 'X' else 'X'
        best_score = -float('inf')
        best_move = None

        for (i, j) in self.buttons:
            if (i, j) not in self.player_positions:
                self.player_positions[(i, j)] = computer_symbol
                score = self.minimax(self.player_positions, False, computer_symbol, -float('inf'), float('inf'))
                self.player_positions.pop((i, j))
                if score > best_score:
                    best_score = score
                    best_move = (i, j)

        return best_move

    def minimax(self, board, is_maximizing, current_player, alpha, beta):
        winner = self.check_winner_board(board)
        if winner == current_player:
            return 1
        elif winner and winner != current_player:
            return -1
        elif len(board) == 9:
            return 0

        if is_maximizing:
            best_score = -float('inf')
            for (i, j) in self.buttons:
                if (i, j) not in board:
                    board[(i, j)] = current_player
                    score = self.minimax(board, False, current_player, alpha, beta)
                    board.pop((i, j))
                    best_score = max(score, best_score)
                    alpha = max(alpha, best_score)
                    if beta <= alpha:
                        break
            return best_score
        else:
            opponent = 'O' if current_player == 'X' else 'X'
            best_score = float('inf')
            for (i, j) in self.buttons:
                if (i, j) not in board:
                    board[(i, j)] = opponent
                    score = self.minimax(board, True, current_player, alpha, beta)
                    board.pop((i, j))
                    best_score = min(score, best_score)
                    beta = min(beta, best_score)
                    if beta <= alpha:
                        break
            return best_score

    def check_winner_board(self, board):
        winning_combinations = [
            [(0, 0), (1, 0), (2, 0)], [(0, 1), (1, 1), (2, 1)], [(0, 2), (1, 2), (2, 2)],
            [(0, 0), (0, 1), (0, 2)], [(1, 0), (1, 1), (1, 2)], [(2, 0), (2, 1), (2, 2)],
            [(0, 0), (1, 1), (2, 2)], [(0, 2), (1, 1), (2, 0)]
        ]

        for combo in winning_combinations:
            symbols = [board.get(pos, None) for pos in combo]
            if all(symbol == 'X' for symbol in symbols):
                return 'X'
            elif all(symbol == 'O' for symbol in symbols):
                return 'O'
        return None

    def check_winner(self):
        return self.check_winner_board(self.player_positions)

if __name__ == "__main__":
    root = tk.Tk()
    game = TicTacToeGame(root)
    root.mainloop()