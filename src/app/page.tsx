import React from "react";
import NavBar from "./component/navbar";

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="overview-text">
        <header>
          <h1>Welcome to Zeno</h1>
          <p>Your Free, Personalized AI Tutor for Students and Teachers</p>
        </header>

        <section>
          <h2>
            10 Million Children in the US Need a Tutor But Can’t Afford One
          </h2>
          <p>Zeno is here to change that.</p>
        </section>

        <section>
          <h2>Meet Zeno</h2>
          <p>
            Zeno is the first <strong>100% free AI tutor</strong> designed to
            collaborate with teachers, helping every student succeed in their
            academic journey.
          </p>
          <ul>
            <li>
              <strong>Personalized Tutoring:</strong> Zeno works one-on-one with
              each student, offering tailored guidance based on classroom
              materials.
            </li>
            <li>
              <strong>Teacher Collaboration:</strong> Zeno seamlessly integrates
              with Learning Management Systems (LMS), ensuring it aligns with
              lesson plans, homework, and curriculum updates.
            </li>
            <li>
              <strong>Ethical Learning:</strong> Zeno doesn’t do homework for
              students. Instead, it coaches them, building critical thinking and
              problem-solving skills.
            </li>
          </ul>
        </section>

        <section>
          <h2>How Zeno Works</h2>
          <ol>
            <li>
              <strong>Engage in Real-Time:</strong> Zeno chats with students to
              help them understand concepts and complete assignments without
              giving away answers.
            </li>
            <li>
              <strong>Classroom-Ready:</strong> Automatically updates when
              teachers modify lesson plans, keeping everything relevant.
            </li>
            <li>
              <strong>Empowers Teachers:</strong> Provides insights to teachers,
              helping them track progress and tailor their teaching strategies.
            </li>
          </ol>
        </section>

        <section>
          <h2>Why Zeno?</h2>
          <p>Unlike other AI tools, Zeno:</p>
          <ul>
            <li>
              <strong>Doesn't encourage cheating</strong>
            </li>
            <li>
              <strong>Knows what's happening in the classroom</strong>
            </li>
            <li>
              <strong>
                Communicates with teachers to provide meaningful insights
              </strong>
            </li>
          </ul>
          <p>
            Best of all, Zeno is <strong>free</strong> and easy to use—no
            changes required to how teachers teach or manage their classrooms.
          </p>
        </section>

        <section class="cta">
          <h2>Join Us in Shaping the Future of Education</h2>
          <p>
            Millions of children are struggling in school, and Zeno can make a
            difference. Together, we can create a world where every child has
            access to personalized, effective, and ethical tutoring.
          </p>
          <a href="#get-started">Start Your Journey with Zeno Today</a>
        </section>
      </div>
    </div>
  );
};

export default Home;
