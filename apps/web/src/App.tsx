import './App.css'
import { Header } from './component/header'
import { AppKitProvider } from './AppKitProvider'
import { AddrStatusList } from './component/addrStatusList'
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

  return (
    <Router>
      <AppKitProvider>
        <main className="w-full bg-white flex flex-col items-center">
          <Header />
          <div className='w-[1200px]'>
            <AddrStatusList/>
          </div>
        </main>
      </AppKitProvider>
    </Router>
  )
}

export default App
