
import { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import SearchInput from './components/SearchInput'
import PersonList from './components/PersonList'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')

  const getAndSetPersons = () => {
    personService.getAllPersons()
      .then(allPersons => setPersons([...allPersons]))
      .catch((err) => {
        alert("Fetching phone numbers failed: ", err)
      })
  }


  // get starting state and update current state
  useEffect(getAndSetPersons, [])


  const handlePersonSubmit = (e) => {
    e.preventDefault()
    if (!newName || !newNumber) return
    if (persons.findIndex(p => p.name === newName || p.number === newNumber) === -1) {
      personService.addPerson({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setSearchString("")
          setNewName("")
          setNewNumber("")
        })

    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  const handleNameChange = (e) => {
    e.preventDefault()
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    e.preventDefault()
    setNewNumber(e.target.value)
  }

  const handleSearchChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }

  const sendDeletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService.deletePerson(person.id)
        .then(deletedPerson => {
          console.log(`${deletedPerson.name} removed from phonebook`)
          getAndSetPersons()
        })
    }

  }


  return (
    <div>
      <h2>Phonebook</h2>
      <SearchInput handleSearchChange={handleSearchChange} searchString={searchString} />
      <PersonForm
        handleSubmit={handlePersonSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        name={newName}
        number={newNumber} />
      <h2>Numbers:</h2>
      <PersonList persons={persons} searchString={searchString} onDeletePerson={sendDeletePerson} />
    </div>
  )

}

export default App