import React from "react";
import NavBar from "./component/navbar";
import Image from "next/image";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="relative">
        <div
          className="absolute inset-0 w-screen bg-[url('/background.jpg')] bg-cover bg-center opacity-30"
          style={{ height: "100vh", minWidth: "100vw" }}
        ></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8 text-gray-100">
          <div className="text-center py-20">
            <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-blue-700 to-yellow-300 text-transparent bg-clip-text animate-gradient">
              Empowering Every Student with a Free Personal Tutor
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Imagine a world where every student has access to personalized
              learning. Zeno makes this possible by integrating seamlessly with
              teachers and classrooms.
            </p>
            <a
              href="#join-us"
              className="mt-8 inline-block px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Join Us in Transforming Education!
            </a>
          </div>

          <section
            id="meet-zeno"
            className="mt-16 p-8 bg-neutral-900 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              Meet Zeno
            </h2>
            <p className="mb-6 text-gray-300 text-lg">
              Zeno is the first{" "}
              <strong className="text-blue-400">100% free AI tutor</strong>{" "}
              designed to partner with teachers to ensure every student thrives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-black rounded-lg">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  Personalized Learning
                </h3>
                <p className="text-center">
                  Zeno works one-on-one with students, adapting to their
                  learning needs.
                </p>
              </div>
              <div className="p-4 bg-black rounded-lg">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  Teacher Collaboration
                </h3>
                <p className="text-center">
                  Seamlessly integrates with Learning Management Systems to stay
                  aligned with class materials.
                </p>
              </div>
              <div className="p-4 bg-black rounded-lg">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  Ethical Guidance
                </h3>
                <p className="text-center">
                  Provides support without giving away answers, fostering
                  critical thinking.
                </p>
              </div>
            </div>
          </section>

          <section
            id="demo-zeno"
            className="mt-16 p-8 bg-neutral-900 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              Interactive Demo
            </h2>
            <p className="mb-6 text-gray-300">
              Experience how Zeno engages with students through interactive and
              supportive learning:
            </p>
            <div className="bg-black p-6 rounded-lg">
              <p>
                <strong>Student:</strong> Do problem 7 for me.
              </p>
              <p>
                <strong>Zeno:</strong> Hi Kinjal! 😀 I’m here to help you in Mr.
                Smith’s Algebra class! What are you working on?
              </p>
              <p>
                <strong>Student:</strong> It's multiplying binomials.
              </p>
              <p>
                <strong>Zeno:</strong> Great! Have you heard of the FOIL method?
                Let's apply it to Problem 7!
              </p>
            </div>
          </section>

          <section
            id="timeline"
            className="mt-16 p-8 bg-neutral-900 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              Our Roadmap
            </h2>
            <ul className="timeline">
              <li>
                <strong>Q1 2025:</strong> Launch v1 of Zeno in select summer
                school classrooms.
              </li>
              <li>
                <strong>Q2 2025:</strong> Gather feedback and build v2 based on
                student and teacher input.
              </li>
              <li>
                <strong>Q3 2025:</strong> Full deployment in multiple schools
                for one subject/grade.
              </li>
              <li>
                <strong>2026:</strong> Expand to more subjects and grade levels.
              </li>
            </ul>
          </section>

          <section
            id="comparison"
            className="mt-16 p-8 bg-neutral-900 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              Why Choose Zeno?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-black rounded-lg">
                <h3 className="text-center mb-2 text-3xl font-bold text-red-500">
                  Zeno
                </h3>
                <ul className="list-disc ml-6 text-gray-300">
                  <li>Free and easy to use</li>
                  <li>Integrates with classroom materials</li>
                  <li>Encourages learning, not cheating</li>
                  <li>Supports teachers with meaningful insights</li>
                </ul>
              </div>
              <div className="p-4 bg-black rounded-lg">
                <h3 className="text-center mb-2 text-3xl font-bold text-red-500">
                  Other AI Tutors
                </h3>
                <ul className="list-disc ml-6 text-gray-300">
                  <li>Often require payment</li>
                  <li>Lack classroom integration</li>
                  <li>Risk of enabling academic dishonesty</li>
                  <li>Minimal teacher collaboration</li>
                </ul>
              </div>
            </div>
          </section>

          <section
            id="join-us"
            className="mt-16 text-center p-8 bg-blue-700 rounded-lg shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              Join Us in Transforming Education
            </h2>
            <p className="mb-6 text-gray-100">
              Help us raise $200K to fund Zeno's next phase. Every contribution
              brings us closer to empowering millions of students.
            </p>
            <a
              href="mailto:hellozeno.tutor@gmail.com?subject=Supporting%20Zeno"
              className="inline-block px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Donate Now
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
