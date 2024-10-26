import React, { useEffect } from 'react'

function App() {
  useEffect(()=>{
    fetch("http://localhost:4000")
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(err=>console.log(err))
  },[])
  return (
    <div>App</div>
  )
}

export default App