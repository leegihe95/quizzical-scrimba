import React from "react";
import Answer from "./Answer";

export default function Question(props) {
	const choices = props.answers.map((answer) => {
		return (
			<Answer
				id={answer.id}
				text={answer.text}
				selected={answer.selected}
				isCorrect={answer.isCorrect}
				heldCorrect={answer.heldCorrect}
				runSelect={() => props.runSelect(answer.id, props.questionId)}
				checkedAnswers={props.checkedAnswers}
			/>
		);
	});

	return (
		<div>
			<h3>{props.question}</h3>
			<div>{choices}</div>
			<hr />
		</div>
	);
}
