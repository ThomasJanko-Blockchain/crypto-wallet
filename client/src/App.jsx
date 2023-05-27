import { useState } from 'react'
import { NavBar, Welcome, Footer, Services, Transations } from './components'
import './App.css'

const App = () => {

  return (
    <>
      <div className='min-h-screen'>
        <div className='gradient-bg-welcome'>
          <NavBar />
          <Welcome />
        </div>
        <Services />
        <Transations />
        <Footer />
      </div>
    </>
  )
}

export default App
