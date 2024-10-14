import "./App.css";
import { AuthProvider } from "./providers/AuthProvider";
import { Router } from "./providers/Router";
import { ThemeProvider } from "./providers/Theme";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
