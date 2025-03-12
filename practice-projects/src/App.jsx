import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Users from "./components/users";
import GenerateContent from "./Pages/Genrate";
import SignInPage from "./Pages/SignInPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/generate" element={<GenerateContent />}></Route>
          <Route path="/" element={<Users />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
