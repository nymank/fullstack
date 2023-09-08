
import { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import SearchInput from './components/SearchInput'
import PersonList from './components/PersonList'
import Error from './components/Error'
import Notification from './components/Notification'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')
  const [notification, setNotification] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const STANDARD_POPUP_MSECS = 4000

  const getAndSetPersons = () => {
    personService.getAllPersons()
      .then(allPersons => allPersons ? setPersons([...allPersons]): console.log("allPersons undefined"))
      .catch(err => setErrorMessage(`Fetching persons failed: ${err}`))
  }

  const showErrorPopup = (errMsg, msecs) => {
    setErrorMessage(errMsg)
    setTimeout(() => setErrorMessage(null), msecs)
  }
  
  const showNotificationPopup = (notification, msecs) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), msecs)
  }

  // get starting state
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
            showNotificationPopup(`Number of ${updatedPerson.name} updated to ${updatedPerson.number}`, STANDARD_POPUP_MSECS)
            setErrorMessage(null)
          })
          .catch(err => showErrorPopup(`Updating person failed: ${err}`, STANDARD_POPUP_MSECS))
      }
    } else if (!nameInPersons && !numberInPersons) {
      // add new person
      personService.addPerson({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          resetInputs()
          showNotificationPopup(`Added new person: ${newPerson.name}`, STANDARD_POPUP_MSECS)
          setErrorMessage(null)
        })
        .catch(err => {
          setNotification(null)
          showErrorPopup(`Adding new person failed: ${err}`, STANDARD_POPUP_MSECS)
        })
    } else if (numberInPersons) {
      resetInputs()
      setNotification(null)
      showErrorPopup(`Number ${persons[numberIndex].number} is already listed in phonebook`, STANDARD_POPUP_MSECS)
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
          getAndSetPersons()
          showNotificationPopup(`${person.name} removed from phonebook`, STANDARD_POPUP_MSECS)
          setErrorMessage(null)
        })
        .catch(err => {
          showErrorPopup(`Deleting person failed: ${err}`, STANDARD_POPUP_MSECS)
          setNotification(null)
        })
    }
  }


  return (
    <div>
      <h2>Snooker professionals Phonebook</h2>
      <Notification message={notification} />
      <Error message={errorMessage} />
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