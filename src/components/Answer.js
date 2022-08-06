import React from "react";

export default function Answer(props) {
	let styles = {};
	if (props.checkedAnswers) {
		if (props.selected && props.isCorrect) {
			styles = {
				backgroundColor: "#94D7A2",
			};
		} else if (props.selected && !props.isCorrect) {
			styles = {
				backgroundColor: "#F8BCBC",
			};
		} else if (!props.selected && props.isCorrect) {
			styles = {
				backgroundColor: "#94D7A2",
			};
		}
	}

	return (
		<button
			className={props.selected ? "selected" : "unselected"}
			style={styles}
			onClick={props.runSelect}
		>
			{props.text}
		</button>
	);
}
