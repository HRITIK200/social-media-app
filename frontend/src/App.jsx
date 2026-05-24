import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;