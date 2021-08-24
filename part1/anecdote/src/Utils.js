const Header = ({name}) => <h1>{name}</h1>;
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>;

export {Header, Button};