import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Users from './components/users'
import GenerateContent from './Pages/Genrate'

function App() {

  return (
<>
    <BrowserRouter>
      <Routes> 
        <Route path='/generate' element={<GenerateContent />} ></Route>
        <Route path='/' element={<Users/>} />
      </Routes>
    </BrowserRouter>
  </>
  )
}
export default App
