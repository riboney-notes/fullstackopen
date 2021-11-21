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

- Components often reside in a directory named `components`

## B: Forms

- Ex of adding/using form in component

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  // event handler for form
  const addNote = (event) => {
    // event parameter is the event that triggers the call to this function
    // preventDefault() prevents the default action of submitting the form, which normally would cause the page to reload
    event.preventDefault()
    // event target is the form html element that is defined in the component
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
    </div>
  )
} 
```

- Controlled components
  - this is where you assign a piece of component's state as the value attribute of the input element and thereby have the component control the behavior of the input element
    - requires setting `onChange` event handler that is invoked every time a change occurs in the input element

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...') 

  const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  // remember, the concat returns a new array and does not mutate the original array
  setNotes(notes.concat(noteObject))
  setNewNote('')
}

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

```

- Filtering displayed elements

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...') 
  const [showAll, setShowAll] = useState(true)

  const notesToShow = showAll ? notes
    : notes.filter(note => note.important)

  const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  // remember, the concat returns a new array and does not mutate the original array
  setNotes(notes.concat(noteObject))
  setNewNote('')
}

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

```
