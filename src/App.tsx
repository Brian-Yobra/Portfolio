import { Route, Routes } from "react-router-dom";
import  React from "react"
import "./css/App.css";
import ContactsPage from "./pages/Contacts.tsx";
import ProjectsPage from "./pages/Project.tsx";
import HomePage from "./pages/Home.tsx";
import NavBar from "./components/navbar.tsx";

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
