import './App.css'
import { GridLayout } from './components/GridLayout'

function App() {

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          position: "relative"
        }}
      >
        <GridLayout />
      </div> 
    </>
  )
}

export default App
