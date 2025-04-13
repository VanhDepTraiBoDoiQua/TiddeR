'use client';

import {Icons} from "@/components/Icons";

export default function GlobalError() {
    return (
        <div className="h-full flex items-center justify-center px-4 font-nunito text-blue-950">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                {/* SVG / Hình ảnh minh họa */}
                <div className="flex items-center justify-center">
                    <Icons.planet className="w-full h-auto max-w-md"/>
                </div>
                {/* Nội dung thông báo lỗi */}
                <div className="flex flex-col justify-center items-start text-left">
                    <h1 className="text-[7.5rem] font-bold leading-none text-orange-600">500</h1>
                    <h2 className="text-2xl font-bold mb-4 text-orange-600">UH OH! An error has occurred.</h2>
                    <p className="text-base text-gray-600 mb-6">
                        There was an error when processing your request, please try again later.
                        We are trying to fix this problem. Thank you for your patient!
                    </p>
                </div>
            </div>
        </div>
    );
}
