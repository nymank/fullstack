
import { useState, useEffect } from 'react'
import axios from 'axios'

import PersonForm from './components/PersonForm'
import SearchInput from './components/SearchInput'
import PersonList from './components/PersonList'

const App = () => {
  const testData = [
    { name: 'Joe Mama', number: '000-000123424' },
    { name: 'Duuds', number: '4321' }
  ]
  const [persons, setPersons] = useState([...testData])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    // get starting state
    const URL = "http://localhost:3001/persons"
    axios.get(URL)
    .then((response) => {
      console.log(response)
      if( response.data) {
        setPersons([...response.data])
      }
    })
    .catch((err) => {
      alert("Fetching phone numbers failed: ", err)
    })
  }, [])

  const handlePersonSubmit = (e) => {
    e.preventDefault()
    if (!newName || !newNumber) return
    if (persons.findIndex(p => p.name === newName) === -1) {
      setPersons([...persons, { name: newName, number: newNumber }])
      setSearchString("")
      setNewName("")
      setNewNumber("")
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
    setSearchString(e.target.value.toLowerCase().trim())
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
      <PersonList persons={persons} searchString={searchString} />
    </div>
  )

}

export default App