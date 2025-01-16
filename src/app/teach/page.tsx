'use client';

import { FilePond } from 'react-filepond';
import NavBar from '../component/navbar';
import 'filepond/dist/filepond.min.css';

export default function Home() {

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
            <NavBar />
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-gray-100">
                <header className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 text-transparent bg-clip-text animate-gradient">Train Zeno</h1>
                    <p className="text-xl text-gray-300">Upload your course materials to customize Zeno for your classroom</p>
                </header>
                <FilePond 
                    allowMultiple={false}
                    credits={false}
                    server={{
                        url: "/api/upload"
                    }}
                />
            </div>
        </main>

    );
}