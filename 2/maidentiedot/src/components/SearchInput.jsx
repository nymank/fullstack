


const SearchInput = (props) => {
    return (
        <div>
            Search countries: <input onChange={props.handleSearchChange} value={props.searchString}></input>
        </div>
    )
}


export default SearchInput