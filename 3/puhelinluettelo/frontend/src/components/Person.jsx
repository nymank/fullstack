

const Person = (props) => {
    const person = props.person
    return (
        <div>
            <p>{person.name} {person.number}</p>
            <button onClick={() => props.onDeletePerson(person)}>Delete</button>
        </div>
    )
}

export default Person