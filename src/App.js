import './App.css';
import NavBar from './components/NavBar';
import { ContextProvider } from './components/Context';


function App() {
  return (
    <ContextProvider>
      <div>
        <NavBar />
      </div>
    </ContextProvider>
  );
}

export default App;
