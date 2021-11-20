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