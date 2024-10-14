import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./providers/AuthProvider";
import { Router } from "./providers/Router";
import { ThemeProvider } from "./providers/Theme";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
