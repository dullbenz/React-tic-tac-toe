import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={() => props.onClick()}>
			{props.value ?? ''}
		</button>
	);
}
class Board extends React.Component {
	renderSquare(i) {
		return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			xIsNext: true,
		}
	}

	handleClickSquare(i) {
		// console.log('in handle click');
		const currentSquares = this.state.history[this.state.history.length - 1].squares;
		if (calculateWinner(currentSquares) != null || currentSquares[i] != null) {
			return;
		}

		const newSquares = currentSquares.map((square, index) => index === i
			? this.state.xIsNext ? 'X' : 'O'
			: square
		);

		this.setState({
			// history: [...this.state.history, { squares: newSquares }],
			history: this.state.history.concat([{
				squares: newSquares,
			}]),
			xIsNext: !this.state.xIsNext
		})

		// // Or
		// const squares = this.state.squares.slice();
		// squares.splice(i, 1, 'X'); // or better still squares[i] = 'X'
		// this.setState({ squares: squares });
	}

	render() {
		const history = this.state.history;
		const currentSquares = this.state.history[this.state.history.length - 1].squares;

		const moves = history.map((step, move) => {
			const desc = move
				? 'Go to move #' + move
				: 'Go to game start';

			return (
				<li>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		const winner = calculateWinner(currentSquares);

		let status;
		if (winner == null) {
			status = `Next player: ${this.props.xIsNext ? 'X' : 'O'}`;
		} else {
			status = `Winner: ${winner}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board xIsNext={this.state.xIsNext} squares={currentSquares} onClick={(index) => this.handleClickSquare(index)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for (const [a, b, c] of lines) {
		if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
			return squares[a];
		}
	}

	return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);

// Another way
// ReactDOM.render(<Game />, document.getElementById('root'));
