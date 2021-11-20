# Part 1: React Basics

## A: React Intro

- Create react app: `npx create-react-app <name>`
- Launch app: `npm start` (need to be inside app directory)
- Components: all content to be rendered is defined with react component, which is a javascript function that returns HTML code, using JSX which is a templating language that is translated into js with Babel
  - Rules:
    - Component names must begin with a capital letter
    - Must be wrapped in an enclosing tag (like div or just plain `<>` tags which are empty elements called fragments)
  - Ex:
  ```js
  const myComponent = () => {
      <div>
        <p>Hello Wordl</p>
      </div>
  }
  ```
  - Ex of rendering dynamic content within component:
  ```js
  const App = () => {
      const now = new Date();
      const a=10;
      const b=20;

      return (
          <div>
            <p>Hello world, it is {now.toString()}</p>
            <p>{a} plus {b} is {a+b}</p>
          </div>
      )
  }
  ```
  - Ex of defining another component to be used in a component:
  ```js
  const Hello = () => {
      return (
          <div>
            <p>Hello World</p>
          </div>
      )
  }

  const App = () => {
      return (
          <div>
            <h1>Greetings</h1>
            <Hello />
            <Hello />
          </div>
      )
  }
  ```
- props are used to transmit data between and to components
  - Ex:
  ```js
  const Hello = (props) => {
      <div>
        <p>Hello {props.name}</p>
        <p>You are {props.age} years old</p>
      </div>
  }

  // props being defined

  const App = () => {
      const a = 43;

      return (
          <div>
            <h1>Greetings</h1>
            <Hello name="Bob" age = {3}/>
            <Hello name="Jones" age={a} />

          </div>
      )
  }
  ```

## C: Component status and event handling

- You can use destructuring to make working with props much easier
  - Ex:
  ```js
  const Hello = ({ name, age }) => {
    return (
      <div>
        <p>Hello {name}. You are {age} years old </p>
      </div>
    )
  }
  ```

- Page re-rendering can occur by calling the `ReactDOM.render()`
  - However, repeated calls to the `ReactDOM.render` is not recommended
  
- State hooks can be used to render state changes in components
  - Ex: ` const [left, setLeft] = useState(0)`...`left` is the state and `setLeft` is the function that modifies the state
  - Ex:
  ```js
  // displays a counter 
  import React, { useState } from 'react'

  const = () => {
    // counter is assigned initial state of 0
    // setCounter is assigned to a function that will be used to 
    //     modify the state; when invoked, React re-renders the component and the function body of this function gets re-executed
    const [ counter, setCounter ] = useState(0)

    setTimeout(() => setCounter(counter+1), 1000)

    return (<div>{counter}</div>)
  }

  export default App
  ```
  - Ex: (using object for state)
  ```js

  const App = () => {
    const [clicks, setClicks] = useState({
      left: 0, right: 0
    })

    const handleLeftClick = () => {
      const newClicks = { 
        left: clicks.left + 1, 
        right: clicks.right 
      }
      setClicks(newClicks)
    }

    const handleRightClick = () => {
      const newClicks = { 
        left: clicks.left, 
        right: clicks.right + 1 
      }
      setClicks(newClicks)
    }

    // or better yet
    const handleLeftClick = () => {
      // ...clicks creates a new object that has copies of all the properties of the clicks object
      const newClicks = {
        ...clicks,
        left: clicks.left + 1
      }
      setClicks(newClicks)
    }

    const handleRightClicks = () => {
      const newClicks = {
        ...clicks,
        right: clicks.right+1
      }
      setClicks(newClicks)
    }

    // OR EVEN BETTER

    const handleLeftClicks = () => {
      setClicks({...clicks, left: clicks.left+1})
    }

    const handleRightClicks = () => {
      setClicks({...clicks, right: clicks.right+1})
    }

    return (
      <div>
        {clicks.left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {clicks.right}
      </div>
    )
  }
  ```
  - Ex: (Very bad practice to update state directly)
  ```js
  const handleLeftClicks = () => {
    clicks.left++
    setClicks(clicks)
  }
  ```


- Event Handlers and HTML elements
  - Event handlers are supposed to be function or function reference, not a function call
    - Ex (Okay):
    ```js
    // defining event handlers with jsx like this is not always the best idea
    // also its better practice to separate event handlers into separate functions
    <button onClick={() => setCounter(counter+1)}>plus</button>
    ```
    - Ex (Not okay usually):
    ```js
    // React will re-render this too many times leading to error
    <button onClick=[setCounter(counter+1)]>plus</button>
    ```
    - Ex (better way to do it; separating function)
    ```js
    const App = () => {
      const [counter, setCounter] = useState(0)

      const increaseByOne = () => setCounter(counter+1)

      const setToZero = () => setCounter(0)

      return(
        <div>
          <div>{counter}</div>
          <button onClick={increaseByOne}>plus</button>
          <button onClick={setToZero}>reset</button>
        </div>
      )
    }
    ```
    - Ex (button as component)
    ```js
    const Button = (props) => {
      return (
        <button onClick={props.onClick}>
          {props.text}
        </button>
      )
    }

    // or better yet
    const Button = ({onClick, text}) => {
      return (
        <button onClick={onClick}>
          {text}
        </button>
      )
    }

    // using component
    <Button onClick = {setToZero} text="reset" />
    ```

  
