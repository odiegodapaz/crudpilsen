import MenuSuperior from './components/MenuSuperior'
import ListaCerveja from './components/ListaCerveja'
import InclusaoCerveja from './components/InclusaoCerveja'
import ControleCerveja from './components/ControleCerveja'


import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <MenuSuperior />
      <Routes>
        <Route path="/" element={<ListaCerveja />} />
        <Route path="inclusao" element={<InclusaoCerveja />} />
        <Route path="gerencia" element={<ControleCerveja />} />
      </Routes>
    </>
  );
}

export default App;
