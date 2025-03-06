import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Users = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setPersons(JSON.parse(storedUsers)); 
      
    }
  }, []);
  const user = () =>
    axios
      .get("http://localhost:3000/test")
      .then((response) => {
        setPersons(response.data);
        localStorage.setItem("users", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  return (
    <>
      <button
        onClick={user}
        className="bg-red-200 p-3 m-2 rounded-full cursor-pointer mt-16"
      >
        Get Users
      </button>

      <div className="users">
        <ul className="text-white text-2xl font-semibold flex gap-4 flex-col mt-8">
          {persons.map((person) => (
            <li key={person.id}>
              {person.fullname} - {person.dob} - {person.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Users;
