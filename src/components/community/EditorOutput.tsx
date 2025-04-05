"use client"

import {FC} from 'react';
import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
    async () => (await import('editorjs-react-renderer')).default,
    {ssr: false}
);

interface EditorOutputProps {
    content: any;
}

const style = {
    paragraph: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }
};

function customImageRenderer({data}: any) {
    console.log(data);

    const src = data.file.url

    return (
        <div className='relative w-full min-h-[15rem]'>
            <Image
                alt='image'
                className='object-contain'
                src={src}
                fill
            />
        </div>
    )
}

function customCodeRenderer({data}: any) {
    return (
        <pre className='bg-gray-800 rounded-md p-4'>
            <code className='text-gray-100 text-sm'>{data.code}</code>
        </pre>
    );
}

const renderers = {
    image: customImageRenderer,
    code: customCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({content}) => {

    console.log(content.blocks[0].type);

    return (
        <Output
            style={style}
            className='text-sm'
            renderers={renderers}
            data={content}
        />
    );
}

export default EditorOutput;