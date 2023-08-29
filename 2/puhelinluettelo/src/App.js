
import { useState } from 'react'

import Person from './components/Person'
import PersonForm from './components/PersonForm'
import SearchInput from './components/SearchInput'
import PhonebookHeader from './components/PhonebookHeader'
import PersonList from './components/PersonList'

const App = () => {
  const testData = [
    { name: 'Joe Mama', number: '000-000123424' },
    { name: 'Duuds', number: '4321' }
  ]
  const [persons, setPersons] = useState([...testData])
  const [visiblePersons, setVisiblePersons] = useState([...testData])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newName) return
    console.log("submit", e)
    if (persons.findIndex(p => p.name === newName) === -1) {
      setPersons([...persons, { name: newName, number: newNumber }])
      setVisiblePersons([...persons, { name: newName, number: newNumber }])
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
    setSearchString(e.target.value)
    if (e.target.value) {
      const searchName = e.target.value.toLowerCase().trim()
      setVisiblePersons(visiblePersons.filter((p) => p.name.toLowerCase().includes(searchName)))
    } else {
      setVisiblePersons([...persons])
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchInput handleSearchChange={handleSearchChange} searchString={searchString} />
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        name={newName}
        number={newNumber} />
      <h2>Numbers:</h2>
      <PersonList persons={visiblePersons} />
    </div>
  )

}

export default App