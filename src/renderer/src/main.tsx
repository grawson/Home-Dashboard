import ReactDOM from 'react-dom/client'
import App from './App'
import Theme from './components/Theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Theme>
    <App />
  </Theme>
  // </React.StrictMode>,
)
