import {Icons} from "@/components/Icons";

export default function NotFound() {
    return (
        <div className="h-full flex items-center justify-center px-4 font-nunito text-blue-950">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                {/* SVG / Hình ảnh minh họa */}
                <div className="flex items-center justify-center">
                    <Icons.planet className="w-full h-auto max-w-md"/>
                </div>

                {/* Nội dung 404 */}
                <div className="flex flex-col justify-center items-start text-left">
                    <h1 className="text-[7.5rem] font-bold leading-none">404</h1>
                    <h2 className="text-2xl font-bold mb-4">UH OH! You are lost.</h2>
                    <p className="text-base text-gray-600 mb-6">
                        The page you are looking for does not exist.
                        How you got here is a mystery. But you can click the button below
                        to go back to the homepage.
                    </p>
                    <a href="/"
                       className="relative inline-block px-10 py-2 rounded-full border-4 text-blue-950 font-bold tracking-widest hover:bg-blue-950 hover:text-white transition-all duration-200">
                        HOME
                    </a>
                </div>
            </div>
        </div>
    );
}