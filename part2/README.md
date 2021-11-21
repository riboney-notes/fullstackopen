# Part 2: Communicating with server

## A: Rendering a collection, modules

- Generating HTML tags from array
  - Note: Be sure to define the key attribute for components or array items when generating them

  - Ex (wrong way cuz hardcoding elements)

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App

```

  - Ex (wrong way cuz missing key)

```js
const App = (props) => {
    const {notes} = props

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => <li>{note.content}</li>)}
            </ul>
        </div>
    )
}
```

  - Ex (Correct Way)

```js
const App = (props) => {
    const{notes} = props

    // Each child in an array must have key property
    // What to do if id/key property is missing:
    /**
     * // Not recommended
     * // Using array index as keys
     * notes.map( (note,i) => <li key={i}>{note.content}</li>)
     * 
    */

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => <li key={note.id}>{note.content}</li>)}
            </ul>
        </div>
    )
}
```

  - Ex (Even better way)

```js

const Note = ({note}) => <li>{note.content}</li>

const App = ({notes}) => {
    return (
        <div>
            <h1>Notes</h1>
            <ul>
                // components must have key attribute defined
                {notes.map(note => <Note key={note.id} note={note}>)}
            </ul>
    )
}

```

- Componets often reside in a directory named `components`