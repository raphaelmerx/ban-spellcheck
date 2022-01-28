
import { ThemeProvider } from '@mui/material/styles';
import customTheme from './theme';

import Home from './Home'

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={customTheme}>
        <Home></Home>
      </ThemeProvider>
    </div>
  );
}

export default App;
