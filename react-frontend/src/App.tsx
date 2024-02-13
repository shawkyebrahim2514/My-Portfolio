import ThemeContext from './contexts/ThemeContext';
import Portfolio from './Portfolio';

function App() {
  return (
    <ThemeContext>
        <Portfolio />
    </ThemeContext>
  );
}

export default App;
