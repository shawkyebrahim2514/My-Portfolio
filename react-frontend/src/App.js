import './App.css';
import ThemeContext from './contexts/ThemeContext';
import Portfolio from './Portfolio';

// import { createClient } from '@sanity/client'

// const client = createClient({
//   projectId: 'h48br789', // replace with your Sanity project ID
//   dataset: 'production', // replace with your Sanity dataset
//   useCdn: true // `false` if you want to ensure fresh data
// })

// const query = '*[_type == "skills"]'
// client.fetch(query).then(skillsCategories => {
//   console.log('Skills Categories', skillsCategories)
// }).catch(err => {
//   console.error('Error:', err)
// })

// const style = { width: "1000px", height: "600px", backgroundColor: "rgb(102 204 255 / 5%)", color: "#fff", backdropFilter: "blur(30px) brightness(115%)", border: "1px solid #66CCFF", boxShadow: "#0000003b 0px 1px 6px 0" }

function App() {
  return (
    <ThemeContext>
      <Portfolio />
    </ThemeContext>
  );
}

export default App;
