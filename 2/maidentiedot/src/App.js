import { useEffect, useState } from 'react';
import './index.css'
import countryService from './services/countryService';
import SearchInput from './components/SearchInput';
import CountryList from './components/CountryList';
import KeepTyping from './components/KeepTyping';


function App() {

  const [countries, setCountries] = useState([])
  const [shownCountries, setShownCountries] = useState([])
  const [searchString, setSearchString] = useState("")


  useEffect(() => getAndSetAllCountries, [])

  const getAndSetAllCountries = () => {
    countryService.getAllCountries()
      .then(allCountries => setCountries([...allCountries]))
      .catch(err => console.log(err.response))
  }

  const handleSearchChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
    setShownCountries([...countries.filter(c => c.name.common.toLowerCase().includes(e.target.value.toLowerCase().trim()))])
  }

  const handleShowCountry = (cca3) => {
    setShownCountries(countries.filter(c => c.cca3 === cca3))
  }

  if (!countries) return <p>Loading...</p>


  return (
    <div className="App">
      <h2>Countries information service</h2>
      <SearchInput handleSearchChange={handleSearchChange} value={searchString} />
      {!searchString ? <KeepTyping message="Search countries to filter results..." />
        :
        <CountryList countries={shownCountries} searchString={searchString} handleShowCountry={handleShowCountry} />
      }
    </div>
  );
}

export default App;
