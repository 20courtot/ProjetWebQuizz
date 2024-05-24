import './App.css';
import axios from 'axios';
import {useEffect, useState} from "react";

function App() {

  const [listUsers, setListOfUsers] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:3001/users").then((response)=>{
      setListOfUsers(response.data)
    })
  },[])

  return (
    <div className="App">
    {
      listUsers.map((value, key)=>{ 
        return <div>{value.name}</div>
      })
    }
    </div>
  );
}

export default App;
