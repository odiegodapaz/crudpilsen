import './Titulo.css'

function Titulo() {
  return (
    <div className="container-fluid bg-primary text-white">
      <div className="row align-items-center">
        <div className="col-sm-4 col-md-3 text-center">
          <img src="cerveja.webp" alt="Logo Pilsen Gaúcha" className="logo" />
        </div>
        <div className="col-sm-8 col-md-6 text-center">
          <h1>Concurso Pilsen Gaúcha</h1>          
        </div>
        <div className="col-sm-12 col-md-3 text-center">
          <h3>Ano 2022</h3>
        </div>
      </div>
    </div>
  )
}

export default Titulo