import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Notifications from "./Notifications";
import Priority from "./Priority";

function App() {

  return (
    <BrowserRouter>

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <Link to="/">
          Notifications
        </Link>

        <Link to="/priority">
          Priority
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={<Notifications />}
        />

        <Route
          path="/priority"
          element={<Priority />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;