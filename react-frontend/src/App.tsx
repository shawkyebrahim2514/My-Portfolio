import ThemeContext from './contexts/ThemeContext';
import NavigationControllerContext from './contexts/NavigationControllerContext';
import Portfolio from './Portfolio';

function App() {
  return (
    <ThemeContext>
      <NavigationControllerContext>
        <Portfolio />
      </NavigationControllerContext>
    </ThemeContext>
  );
}

export default App;
