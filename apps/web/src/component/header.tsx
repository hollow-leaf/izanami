import ConnectButton from "./connectButton"

export function Header() {

    return (
        <nav className="w-full bg-white border-gray-200 shadow">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <a className="flex items-center space-x-3">
                    <img src="logo.png" className="h-8"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">Izanami</span>
                </a>
                <div className="flex gap-x-4 items-center">
                    <ConnectButton />
                </div>
            </div>
        </nav>
    )
}