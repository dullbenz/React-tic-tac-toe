import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

function Square(props) {
	return (
		<button style={props.isWinnerSquare ? {backgroundColor: 'orange'}: {}} className="square" onClick={() => props.onClick()}>
			{props.value ?? ''}
		</button>
	);
}
class Board extends React.Component {
	renderSquare(i) {
		return <Square isWinnerSquare={this.props.winningSquares?.includes(i) || false} key={'square-' + i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
	}

	render() {
		return (
			<div>
				{
					Array(3).fill(1).map((row, i) => (
						<div key={'row' + i} className="board-row">
							{Array(3).fill(1).map((square, index) => this.renderSquare(i * 3 + index))}
						</div>
					))
				}
				{/* <div className="board-row">
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
				</div> */}
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
					squares: Array(9).fill(null),
					location: null
				}
			],
			xIsNext: true,
			stepNumber: 0,
			asc: true
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	handleClickSquare(i) {
		// Reset history if playing after jumping to a particular move
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		
		const currentSquares = history[history.length - 1].squares;
		if (calculateWinner(currentSquares) != null || currentSquares[i] != null) {
			return;
		}

		const newSquares = currentSquares.map((square, index) => index === i
			? this.state.xIsNext ? 'X' : 'O'
			: square
		);

		this.setState({
			// history: [...this.state.history, { squares: newSquares }],
			history: history.concat([{
				squares: newSquares,
				location: [Math.floor(i / 3), i % 3]
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});

		// // Or
		// const squares = this.state.squares.slice();
		// squares.splice(i, 1, 'X'); // or better still squares[i] = 'X'
		// this.setState({ squares: squares });
	}

	render() {
		const history = this.state.history;
		const currentSquares = this.state.history[this.state.stepNumber].squares;

		const moves = history.map((step, move) => {
			const desc = move
				? 'Go to move #' + move
				: 'Go to game start';

			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>
						{
							move === this.state.stepNumber
								? <strong>{desc}</strong>
								: desc
						}
					</button>
					{
						step.location
							? <label> Move Location: ({step.location?.toString()})</label>
							: ''
					}
				</li>
			);
		});

		if (!this.state.asc) {
			moves.reverse()
		}

		const winner = calculateWinner(currentSquares);

		let status;
		if (winner == null) {
			status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
		} else if(winner === 'draw') {
			status = 'Game is a tie';
		} else {
			status = `Winner: ${winner.player}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board winningSquares={winner?.squares} xIsNext={this.state.xIsNext} squares={currentSquares} onClick={(index) => this.handleClickSquare(index)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.setState({ asc: !this.state.asc })}>Sort: {this.state.asc ? 'desc' : 'asc'}</button>
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
			return {
				player: squares[a],
				squares: [a, b, c]
			}
		}
	}

	// Check whether game is draw
	if(squares.every(square => square != null)) return 'draw';

	return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);

// Another way
// ReactDOM.render(<Game />, document.getElementById('root'));
