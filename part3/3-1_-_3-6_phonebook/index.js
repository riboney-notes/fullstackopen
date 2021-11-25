const { response } = require('express')
const express = require('express')

const app = express()
app.use(express.json())  //if omitted, req.body will be undefined
const port = 3001
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
  // need to do ... to destructure array into parameters
  const maxID = persons.length > 0 ? Math.max(...persons.map(p=>p.id)): 0
  console.log('maxID:', maxID)
  return maxID+1
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
  const info = `Phonebook has info for ${persons.length} people`
  const today = new Date().toString()
  // \n doesn't work...need to add <br> for new line
  // can't do multiple res.send()
  res.send(info + '<br/>' + today)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === parseInt(req.params.id))
  return person ? res.json(person): res.status(404).json({error:'person is missing'})
})

app.delete('/api/persons/:id', (req, res) => {
  if(!persons.some(p => p.id === parseInt(req.params.id))) 
    return res.status(404).json({error:'person not found'})
  
  persons = persons.filter(p => p.id !== parseInt(req.params.id))

  console.log(`Person with ID:${req.params.id} is removed`)
  res.status(204).end()
})

app.post('/api/persons', (req,res) => {

  if(!req.body.name || !req.body.number)
    return res.status(400).json({error:"Missing required data for person"})

  if(persons.some(p=>p.name === req.body.name) || persons.some(p=>p.id === parseInt(req.body.id)))
    return res.status(400).json({error:`${req.body.name} already exists in phonebook!`})

  const person = {
    id: generateID(),
    name: req.body.name,
    number: req.body.number
  }

  console.log(person)

  persons = persons.concat(person)

  res.json(person)
})

app.listen(port, () => {
    console.log(`Phonebook app listening at http://localhost:${port}`)
})