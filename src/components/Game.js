import React, { useState, useEffect } from "react";
import Question from "./Question";
// import { fetchQuestions } from "../services";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export default function Game(props) {
	const [newGame, setNewGame] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [checkedAnswers, setCheckedAnswers] = useState(false);
	const [points, setPoints] = useState(0);

	useEffect(
		function () {
			fetch(
				"https://opentdb.com/api.php?amount=5&category=9&type=multiple"
			)
				.then((res) => res.json())
				.then((data) => setQuestions(getQuestions(data.results)));
		},
		[newGame]
	);

	// function to fetch data and set within state
	// const fetchAndSet = async () => {
	// 	const data = await fetchQuestions();
	// 	setResource(data);
	// };

	// callback to handle the useEffect for when page is loaded
	// const useEffectHandler = () => {
	// 	fetchAndSet();
	// 	return () => {};
	// };

	// useEffect(useEffectHandler, [newGame]);

	function getQuestions(data) {
		const questionsPrep = data.map((each) => ({
			questionId: nanoid(),
			question: escapeHtml(each.question),
			correct: escapeHtml(each.correct_answer),
			incorrect: [
				escapeHtml(each.incorrect_answers[0]),
				escapeHtml(each.incorrect_answers[1]),
				escapeHtml(each.incorrect_answers[2]),
			],
			answers: setAnswers(
				shuffleAnswers([
					each.correct_answer,
					...each.incorrect_answers,
				]),
				each.correct_answer
			),
		}));
		return questionsPrep;
	}

	function setAnswers(allAnswers, correctAnswer) {
		return allAnswers.map((answer) => {
			return {
				id: nanoid(),
				text: escapeHtml(answer),
				selected: false,
				isCorrect: answer === correctAnswer ? true : false,
				heldCorrect: false,
			};
		});
	}

	function shuffleAnswers(answerList) {
		return answerList.sort(() => Math.random() - 0.5);
	}

	function escapeHtml(text) {
		var map = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&quot;": '"',
			"&#039;": "'",
			"&ldquo;": "“",
			"&rdquo;": "”",
			"&rsquo;": "'",
			"&hellip;": "…",
			"&auml;": "ä",
			"&aring;": "å",
			"&ouml;": "ö",
			"&oacute;": "ó",
			"&Eacute;": "É",
		};

		return text.replace(
			/(&Eacute;)|(&oacute;)|(&ouml;)|(&auml;)|(&aring;)|(&amp;)|(&lt;)|(&gt;)|(&quot;)|(&#039;)|(&ldquo;)|(&rdquo;)|(&rsquo;)|(&hellip;)/g,
			function (m) {
				return map[m];
			}
		);
	}

	const passDown = questions.map((question) => (
		<Question
			questionId={question.questionId}
			question={question.question}
			answers={question.answers}
			runSelect={runSelect}
			checkedAnswers={checkedAnswers}
		/>
	));

	function runSelect(answer_id, question_id) {
		setQuestions((prevState) =>
			prevState.map((question) => {
				if (question.questionId === question_id) {
					const refreshAnswers = question.answers.map(
						(eachanswer) => {
							if (eachanswer.id === answer_id) {
								return {
									...eachanswer,
									selected: true,
								};
							} else {
								return { ...eachanswer, selected: false };
							}
						}
					);
					return { ...question, answers: refreshAnswers };
				} else {
					return { ...question };
				}
			})
		);
	}

	function checkAnswers() {
		setCheckedAnswers(true);
		setQuestions((prevState) =>
			prevState.map((question) => {
				const checkedAnswers = question.answers.map((eachanswer) => {
					if (eachanswer.selected && eachanswer.isCorrect) {
						setPoints((prevState) => prevState + 1);
						return {
							...eachanswer,
							heldCorrect: true,
						};
					} else if (eachanswer.selected && !eachanswer.isCorrect) {
						return {
							...eachanswer,
							heldCorrect: false,
						};
					} else if (!eachanswer.selected && eachanswer.isCorrect) {
						return {
							...eachanswer,
							heldCorrect: false,
						};
					} else {
						return { ...eachanswer };
					}
				});
				return { ...question, answers: checkedAnswers };
			})
		);
	}

	function restartGame() {
		setNewGame((prevState) => !prevState);
		setCheckedAnswers(false);
		setPoints(0);
	}

	return (
		<div>
			{questions.length ? (
				<div>
					{passDown}
					{checkedAnswers ? (
						<div className="footer">
							<p>You scored {points}/5 correct answers!</p>
							<button className="checkBtn" onClick={restartGame}>
								Play Again
							</button>
							<button
								className="exitBtn"
								onClick={props.startGame}
							>
								Exit Game
							</button>
						</div>
					) : (
						<div className="footer">
							<button className="checkBtn" onClick={checkAnswers}>
								Check Answers
							</button>
						</div>
					)}
				</div>
			) : (
				<p>loading...</p>
			)}
		</div>
	);
}
