

const PersonForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>name: <input onChange={props.handleNameChange} value={props.name} required /></div>
            <div>number: <input onChange={props.handleNumberChange} value={props.number} required/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}


export default PersonForm