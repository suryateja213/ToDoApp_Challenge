import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskPage from "./pages/TaskPage";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<AuthGuard><TaskPage /></AuthGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
