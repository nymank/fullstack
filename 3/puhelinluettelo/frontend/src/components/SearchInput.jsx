


const SearchInput = (props) => {
    return (
        <div>
            Search phonebook: <input onChange={props.handleSearchChange} value={props.searchString}></input>
        </div>
    )
}


export default SearchInput