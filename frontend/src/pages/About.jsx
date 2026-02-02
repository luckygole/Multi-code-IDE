import React, { useState } from "react";
import { motion } from "framer-motion";
import cppImg from "../images/c++.jpeg";
import cImg from "../images/c.jpeg";
import jsImg from "../images/javascript.jpeg";
import javaImg from "../images/java.jpeg";
import pythonImg from "../images/python.jpeg";
import bashImg from "../images/bash.jpeg";
import StarryBackground from '../components/StarryBackground.jsx';
import Navbar from '../components/Navbar.jsx';
import logo from '../images/logos/logo.png';

// About page for the multi-language code editor (dark themed)
// Uses Tailwind CSS and framer-motion for subtle animation.
// Make sure images exist at the specified paths.

const languages = [
  {
    id: "cpp",
    name: "C++",
    img: cppImg,
    desc:
      "Powerful compiled language — great for systems programming and competitive programming. We ship a ready-to-edit \"Hello World\" template for every new project.",
    code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
  },
  {
    id: "c",
    name: "C",
    img: cImg,
    desc:
      "Simple, fast and close-to-metal. Use it for low-level tasks and learning fundamentals. Default template included.",
    code: `#include <stdio.h>

int main() {
  printf("Hello, World!\n");
  return 0;
}`,
  },
  {
    id: "js",
    name: "JavaScript",
    img: jsImg,
    desc:
      "The language of the web — run small scripts, DOM code and node-style programs. A friendly live-edit experience is included.",
    code: `console.log('Hello, World!');`,
  },
  {
    id: "java",
    name: "Java",
    img: javaImg,
    desc:
      "Robust, object-oriented language used widely in backend and Android. We provide a minimal class template so you can jump straight into coding.",
    code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  },
  {
    id: "python",
    name: "Python",
    img: pythonImg,
    desc:
      "Readable and powerful scripting language — great for quick tasks, scripting and learning. Your project starts with a simple Python hello script.",
    code: `print("Hello, World!")`,
  },
  {
    id: "bash",
    name: "Bash",
    img: bashImg,
    desc:
      "Shell scripting for automation, CI and small utilities. Use the default script to get started with command-line tasks.",
    code: `#!/bin/bash

echo "Hello, World!"`,
  },
];

const About = () => {
  const [copied, setCopied] = useState(null);

  const copyCode = async (id, code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="min-h-screen  text-white p-3 md:p-12">
        <Navbar />
        <br/>
       <StarryBackground />
      {/* Header / Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto mb-8"
      >
        {/* <h1 className="text-3xl md:text-4xl font-bold mb-3">About</h1> */}
       <div className="flex justify-center">
  <img
    src={logo}
    className="h-64 w-64 md:h-96 md:w-96 lg:h-[400px] lg:w-[400px] object-contain"
    alt="KodeBase Logo"
  />
</div>

        <p className="text-gray-300 max-w-3xl leading-relaxed">
          MultiCode IDE is a small multi-language project editor where you can create,
          edit and delete projects. Projects are protected behind login so only
          authenticated users can manage their code. We currently support
          <strong className="text-white"> C++, C, JavaScript, Java, Python</strong> and
          <strong className="text-white"> Bash</strong>. Each new project opens with a
          ready-to-edit "Hello World" template so you can focus on building.
        </p>

        <div className="mt-6 flex gap-3 flex-wrap">
          <div className="px-4 py-2 bg-[#0f1720] rounded-md">Create project</div>
          <div className="px-4 py-2 bg-[#0f1720] rounded-md">Edit & Save</div>
          <div className="px-4 py-2 bg-[#0f1720] rounded-md">Run / Download</div>
          <div className="px-4 py-2 bg-[#0f1720] rounded-md">Share</div>
        </div>
      </motion.div>

      {/* Language sections (alternating layout) */}
      <div className="max-w-6xl mx-auto space-y-8">
        {languages.map((lang, idx) => {
          const content = (
            <motion.div
              key={lang.id + "-content"}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="flex-1"
            >
              <h3 className="text-2xl font-semibold mb-2">{lang.name}</h3>
              <p className="text-gray-300 mb-4">{lang.desc}</p>

              <div className="relative rounded-md border border-[#111] bg-[#070707] p-3 md:p-4">
                <div className="flex items-start justify-between">
                  <div className="text-xs text-gray-400">Default template</div>
                  <button
                    onClick={() => copyCode(lang.id, lang.code)}
                    className="text-sm bg-[#0b66ff] hover:bg-[#0952c8] px-3 py-1 rounded-md"
                  >
                    {copied === lang.id ? "Copied" : "Copy"}
                  </button>
                </div>

                <pre className="mt-3 overflow-auto text-sm leading-6 rounded">
                  <code>{lang.code}</code>
                </pre>
              </div>
            </motion.div>
          );

          const image = (
            <motion.div
              key={lang.id + "-img"}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="w-full md:w-56 flex-shrink-0"
            >
              <div className="w-full h-36 md:h-44 flex items-center justify-center bg-[#0b0b0b] rounded-md border border-[#111] p-4">
                <img
                  src={lang.img}
                  alt={lang.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </motion.div>
          );

          return (
            <section
              key={lang.id}
              className={`flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 rounded-md border border-[#111] bg-[#080808]`}
            >
              {/* alternate: even index => content left, image right; odd => image left */}
              {idx % 2 === 0 ? (
                <>
                  {content}
                  {image}
                </>
              ) : (
                <>
                  {image}
                  {content}
                </>
              )}
            </section>
          );
        })}

        {/* Quick steps */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-md border border-[#111] bg-[#070707]"
        >
          <h3 className="text-2xl font-semibold mb-3">How to get started</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Signup / Login to your account (projects are private to your account).</li>
            <li>Click <strong>Create Project</strong> and pick a language template.</li>
            <li>Edit the default code or replace it with your own.</li>
            <li>Save the project. Use Edit/Delete from your dashboard to manage projects.</li>
            <li>Download or share the project files as needed.</li>
          </ol>
        </motion.div>
      </div>

      <footer className="max-w-6xl mx-auto mt-10 text-gray-500 text-sm">
        Built with ❤️ • If you want a live runner for these languages (execute code on server), I can help add that next.
      </footer>
    </div>
  );
};

export default About;