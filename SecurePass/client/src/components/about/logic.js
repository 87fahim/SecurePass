const setNextPerson = (people, person, setPerson)=>{
    const index = people.findIndex(p => p.name === person.name);
    const nextInLine = people[((index + 1) % people.length)]        
    setPerson(nextInLine);  

}

export default setNextPerson;