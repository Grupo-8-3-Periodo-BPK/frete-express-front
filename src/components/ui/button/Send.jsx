export default function BotaoEnviar({onClick, type, message}){
    return (
        <button className="w-full p-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-blue-800 transition-all shadow-md text-lg cursor-pointer"
        type={type}
        onClick={onClick}
        >{message}
        </button>
    )
}