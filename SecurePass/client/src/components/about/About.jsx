import React from 'react';
import './About.css';
import { useState } from 'react';


const About = () => {
    const people = [{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Charlie", age: 35 }, { name: "David", age: 40 }, { name: "Eve", age: 22 }, { name: "Fahim", age: 28 }, { name: "Grace", age: 32 }, { name: "Hannah", age: 27 }, { name: "Ivy", age: 29 }, { name: "Jack", age: 33 }];
    let randNum = Math.floor(Math.random() * people.length);
    const firstPerson = people[randNum];
    const [person, setPerson] = useState({ name: firstPerson.name, age: firstPerson.age })

    return (
        <>
            <div>Name: {person.name}, Age: {person.age}</div>
            <button onClick={() => {
                setPerson(
                    { name: person.name.substring(0, person.name.length - 1) + Math.floor(Math.random() * people.length), age: person.age })
            }}>Person</button>
        </>
    );



};

export default About;
