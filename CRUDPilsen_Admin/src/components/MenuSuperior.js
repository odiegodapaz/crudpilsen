import { Link } from 'react-router-dom'

const MenuSuperior = () => {
  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Concurso Pilsen Gaúcha 2022
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link active">
              Listagem
            </Link>
          </li>
          <li className="nav-item">
            <Link to="inclusao" className="nav-link">
              Inclusão
            </Link>
          </li>
          <li className="nav-item">
            <Link to="gerencia" className="nav-link">
              Controle
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default MenuSuperior