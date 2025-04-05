import BotaoEnviar from "../components/botao";

export default function Login() {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-green-600">Página de login</h1>
            <BotaoEnviar/>
        </div>
    )
}