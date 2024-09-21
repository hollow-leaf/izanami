import './App.css'
import { Header } from './component/header'
import { AppKitProvider } from './AppKitProvider'
import { AddrStatusList } from './component/addrStatusList'

function App() {

  return (
    <AppKitProvider>
      <main className="w-full bg-white flex flex-col items-center">
        <Header />
        <div className='w-[1200px]'>
          <AddrStatusList/>
        </div>
      </main>
    </AppKitProvider>
  )
}

export default App
