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

## C: Getting data from server

*TODO: Need to take better notes on this section*

- Use effect hooks are used to handle fetching data and other async, IO type processes

```js
import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      <ul>
        {notesToShow.map(note => 
            <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>  
    </div>
  )
}

export default App
```

- need to prefix .env variables with `REACT_APP_` in order for it to work
- Need to account for promise resolve time...display some default HTML while promise is not ready, to prevent errors

## D: Altering data in server

- Resources: the data objects that are the subject to REST api
- Make HTTP POST request to create new resource

```js
// adding notes to server
addNote = event => {
  event.preventDefault()
  // id is omitted because its better to let backend generate IDs
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() < 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      // the response is sent back from the server after POST request is sent
      // The newly created resource is stored in the `data` property of the response object
      console.log(response)
      // remember, concat does not mutate date...it returns new data
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
}

```

- PUT can be used to modify existing data (by replacing it entirely)

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  // creates copy of note except for the important property, which is modified accordingly 
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    // the map checks for the specific note with id and replaces it with the result from the PUT request; all the other notes are just copied back as is
    setNotes(notes.map(note => note.id !== id ? note : response.data))
  })
}
```

- REST operations as its own module

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}

// better version
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}

```

- Using REST service methods

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // ...
}
```

## E: Adding styles to react app

- Notifications

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

// using notification component
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

- inline css styles

```js
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
    </div>
  )
}
```