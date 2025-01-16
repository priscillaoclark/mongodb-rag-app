import React from "react";
import NavBar from "./component/navbar";
import Image from "next/image";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <NavBar />
      <div className="relative">
        <div
          className="absolute inset-0 w-screen bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"
          style={{ height: "100vh", minWidth: "100vw" }}
        ></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8 text-gray-100">
          <div className="relative py-20 px-4 w-full">
            <div className="absolute inset-0 w-screen bg-[url('/background.jpg')] bg-cover bg-center opacity-20 z-0" style={{ minWidth: "100vw", left: "50%", transform: "translateX(-50%)" }}></div>
            <div className="relative z-10">
              <header className="text-center mb-16">
                <h1 className="text-6xl font-bold mt-6 mb-4 bg-gradient-to-r from-red-500 via-blue-700 to-yellow-300 text-transparent bg-clip-text animate-gradient">
                  Welcome to Zeno
                </h1>
                <p className="text-xl text-gray-300">
                  Your Free, Personalized AI Tutor for Students and Teachers
                </p>
              </header>

              <section className="mb-2 flex justify-center items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </section>

              <section className="mb-6 p-6 text-center rounded-lg backdrop-blur-sm bg-black/30">
                <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                  10 Million Children in the US Need a Tutor But Can&apos;t
                  Afford One
                </h2>
                <p className="text-xl text-gray-300">
                  Zeno is here to change that.
                </p>
              </section>
            </div>
          </div>

          <section className="mb-6 p-6 bg-gray-900 rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-red-500">Meet Zeno</h2>
            <p className="mb-6 text-gray-300">
              Zeno is the first{" "}
              <strong className="text-blue-400">100% free AI tutor</strong>{" "}
              designed to collaborate with teachers, helping every student
              succeed in their academic journey.
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 text-blue-400">•</span>
                <div>
                  <strong className="text-blue-400">
                    Personalized Tutoring:
                  </strong>{" "}
                  Zeno works one-on-one with each student, offering tailored
                  guidance based on classroom materials.
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-400">•</span>
                <div>
                  <strong className="text-blue-400">
                    Teacher Collaboration:
                  </strong>{" "}
                  Zeno seamlessly integrates with Learning Management Systems
                  (LMS), ensuring it aligns with lesson plans, homework, and
                  curriculum updates.
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-400">•</span>
                <div>
                  <strong className="text-blue-400">Ethical Learning:</strong>{" "}
                  Zeno doesn&apos;t do homework for students. Instead, it
                  coaches them, building critical thinking and problem-solving
                  skills.
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-6 p-6 bg-gray-900 rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-red-500">
              How Zeno Works
            </h2>
            <ol className="space-y-4 text-gray-300 list-decimal list-inside">
              <li className="flex items-start">
                <div className="ml-2">
                  <strong className="text-blue-400">
                    Engage in Real-Time:
                  </strong>{" "}
                  Zeno chats with students to help them understand concepts and
                  complete assignments without giving away answers.
                </div>
              </li>
              <li className="flex items-start">
                <div className="ml-2">
                  <strong className="text-blue-400">Classroom-Ready:</strong>{" "}
                  Automatically updates when teachers modify lesson plans,
                  keeping everything relevant.
                </div>
              </li>
              <li className="flex items-start">
                <div className="ml-2">
                  <strong className="text-blue-400">Empowers Teachers:</strong>{" "}
                  Provides insights to teachers, helping them track progress and
                  tailor their teaching strategies.
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12 p-6 bg-gray-900 rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-red-500">Why Zeno?</h2>
            <p className="mb-4 text-gray-300">Unlike other AI tools, Zeno:</p>
            <ul className="space-y-2 mb-6 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2 text-blue-400">•</span>
                <strong>Doesn&apos;t encourage cheating</strong>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-400">•</span>
                <strong>Knows what&apos;s happening in the classroom</strong>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-400">•</span>
                <strong>
                  Communicates with teachers to provide meaningful insights
                </strong>
              </li>
            </ul>
            <p className="text-gray-300">
              Best of all, Zeno is{" "}
              <strong className="text-yellow-400">free</strong> and easy to
              use&mdash;no changes required to how teachers teach or manage
              their classrooms.
            </p>
          </section>

          <section className="text-center p-8 bg-blue-700 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              Join Us in Shaping the Future of Education
            </h2>
            <p className="mb-6 text-gray-100">
              Millions of children are struggling in school, and Zeno can make a
              difference. Together, we can create a world where every child has
              access to personalized, effective, and ethical tutoring.
            </p>
            <a
              href="mailto:hellozeno.tutor@gmail.com?subject=Starting%20My%20Journey%20with%20Zeno&body=Hi%20Zeno%2C%0A%0AI'm%20interested%20in%20learning%20more%20about%20your%20tutoring%20services."
              className="inline-block px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Zeno to Get Started
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
