import './App.css'
import { GridLayout } from './components/GridLayout'
import { PhysicalUI } from './components/PhysicalUI'

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
        <PhysicalUI></PhysicalUI>
      </div> 
    </>
  )
}

export default App
