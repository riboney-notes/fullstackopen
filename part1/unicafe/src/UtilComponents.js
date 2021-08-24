const Display = ({name, counter}) => <tr><td>{name}</td><td>{counter}</td></tr>;
const Header = ({name}) => <h1>{name}</h1>;
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>;

export {Display, Header, Button};