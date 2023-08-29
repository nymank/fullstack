
import Person from "./Person"

const PersonList = (props) => {
    return(
        <div>
            {props.persons.map((person) => <Person key={person.name} name={person.name} number={person.number} />)}
        </div>
    )
}


export default PersonList