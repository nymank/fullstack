
import Person from "./Person"

const PersonList = (props) => {
    const searchString = props.searchString

    return (
        <div>
            {
                searchString ?
                    props.persons.filter(
                        person => person.name.toLowerCase().includes(searchString.toLowerCase().trim())
                    ).map(p => <Person person={p} key={p.name} />)
                    :
                    props.persons.map(p => <Person person={p} key={p.name} />)
            }
        </div>
    )
}


export default PersonList