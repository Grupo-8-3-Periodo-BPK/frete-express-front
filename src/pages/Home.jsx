import { useState, useEffect } from 'react'
import '../index.css'
import IconeFreteExpress from '../assets/images/icone-frete-express.png'
import { sayHello } from '../../services/api'
import BotaoEnviar from '../components/botao'

function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        const msg = await sayHello()
        console.log(msg)
    }
    
    const pegarMsg = async (e) => {
      e.preventDefault()
        const msg = await sayHello()
        console.log(msg)
    }


  return (
    <>
<div className="flex h-screen w-full bg-gradient-to-br from-red-500 to-blue-900 font-sans">
      {/* Lado esquerdo - Logo */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 relative bg-gray-100">
  <div className="w-full h-[60%] bg-blue-500 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg">

    <div className="mb-6 bg-none rounded-xl p-4">
      <img 
        src={IconeFreteExpress} 
        alt="Fretes Express Logo" 
        className="w-full h-auto max-h-48 object-contain drop-shadow-lg"
      />
    </div>
    <div className="text-5xl font-bold tracking-tight text-center mb-4">
      <span className="text-gray-800 font-bold">FRETES</span>
      <span className="bg-blue-800 text-white px-4 py-1 ml-2 shadow-md rounded-md">EXPRESS</span>
    </div>

    <div className="w-full flex justify-center items-center">
      <p className="bg-blue-600 rounded-full text-yellow-400 mt-6  text-xl font-light italic py-2 px-6">Slogan foda 😎</p>
    </div>
  </div>
</div>


      {/* Divisor estilizado */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-1">
          <div className="h-full bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 shadow-lg"></div>
        </div>
        <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg z-10">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-500 shadow-lg"></div>
        <div className="absolute top-3/4 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-500 shadow-lg"></div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-2/3">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Seja Bem-vindo(a)</h1>
          <p className="text-yellow-100 mb-10 font-light">Insira seu CPF e senha cadastrado</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-yellow-100 text-sm font-medium mb-1 block">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Digite seu email"
                className="w-full p-4 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="senha" className="text-yellow-100 text-sm font-medium mb-1 block">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                className="w-full p-4 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="w-full p-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-blue-800 transition-all shadow-md text-lg cursor-pointer"
            >
              Entrar
            </button>

            <BotaoEnviar onClick={pegarMsg} type={"input"}/>
            <button
              type="button"
              className="w-full p-4 bg-transparent text-white border border-white font-medium rounded-lg hover:bg-blue-800 transition-all text-lg cursor-pointer"
            >
              Criar Conta
            </button>

            <div className="text-center mt-6">
              <a href="#" className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors underline">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home