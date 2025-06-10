import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import Logo from "../assets/images/icone-frete-express.png";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (isAuthenticated && user) {
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/");
          break;
        case "CLIENT":
          navigate("/client/profile");
          break;
        case "DRIVER":
          navigate("/driver/profile");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="py-4 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Fretes Express" className="h-10 mr-3" />
            <span className="text-xl font-medium text-white">
              Fretes<span className="!text-blue-400">Express</span>
            </span>
          </div>
          <nav>
            <ul className="flex items-center space-x-8">
              <li>
                <a
                  href="#como-funciona"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
                  onClick={handleLogin}
                >
                  Entrar
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Transporte de cargas{" "}
                  <span className="!text-blue-400">simplificado</span>
                </h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                  Somos especialistas em simplificar e otimizar a logística para
                  empresas e autônomos em todo o país!
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition-colors"
                >
                  Começar agora
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="rounded-lg bg-gray-800 p-6">
                  <img
                    src={Logo}
                    alt="Ilustração"
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-10 px-6 bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-16">
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 text-blue-400 mb-5">
                  <span className="text-2xl font-semibold">1</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Cadastre-se
                </h3>
                <p className="text-gray-400">
                  Crie sua conta como cliente ou motorista
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 text-blue-400 mb-5">
                  <span className="text-2xl font-semibold">2</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Conecte-se
                </h3>
                <p className="text-gray-400">
                  Encontre parceiros ideais para suas cargas
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 text-blue-400 mb-5">
                  <span className="text-2xl font-semibold">3</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Transporte
                </h3>
                <p className="text-gray-400">
                  Acompanhe entregas com facilidade
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center gap-2">
            <img src={Logo} alt="Fretes Express" className="h-8 mb-2" />
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Fretes Express
            </p>
          </div>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Termos
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Privacidade
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
