
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

  const resetInputs = () => {
    setSearchString("")
    setNewName("")
    setNewNumber("")
  }

  const handlePersonSubmit = (e) => {
    e.preventDefault()
    if (!newName || !newNumber) return
    const nameIndex = persons.findIndex(p => p.name === newName.trim())
    const numberIndex = persons.findIndex(p => p.number === newNumber.trim())
    const nameInPersons = nameIndex !== -1
    const numberInPersons = numberIndex !== -1
    if (nameInPersons && !numberInPersons) {
      // update number
      if (window.confirm(`${newName} is already in the phonebook. Would you like to update their number to ${newNumber}?`)) {
        personService.updatePerson({ ...persons[nameIndex], number: newNumber })
          .then(updatedPerson => {
            const copyPersons = [...persons]
            copyPersons[nameIndex] = updatedPerson
            setPersons(copyPersons)
            resetInputs()
          })
      }
    } else if (!nameInPersons && !numberInPersons) {
      personService.addPerson({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          resetInputs()
        })
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
        .then((deletedPerson) => {
          console.log(`${person.name} removed from phonebook`)
          getAndSetPersons()
        })
    }

  }


  return (
    <div>
      <h2>Snooker professionals Phonebook</h2>
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