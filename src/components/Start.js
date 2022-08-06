export default function Start (props) {
    return (
        <div className="start">
            <h1>Quizzical</h1>
            <p>Welcome to Quizzical! The best quiz game in the world.</p>
            <button onClick={props.startGame}>Start Quiz</button>
        </div>
    )
}