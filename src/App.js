import React from "react";
import Start from "./components/Start";
import Game from "./components/Game";

export default function App() {
	const [gameIsOn, setGameIsOn] = React.useState(false);

	function startGame() {
		setGameIsOn((prevStatus) => !prevStatus);
	}

	return (
		<div className="app">
			{!gameIsOn ? (
				<Start startGame={startGame} />
			) : (
				<Game startGame={startGame} />
			)}
		</div>
	);
}
