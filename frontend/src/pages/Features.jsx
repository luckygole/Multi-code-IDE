import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCloud, FiLock, FiZap, FiPlusCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar.jsx';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  useEffect(() => {
    gsap.utils.toArray('.feat').forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen text-white p-6 md:p-12">
        <Navbar />
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="text-gray-300 mt-3">
          Professional features that make MultiCode IDE feel like a SaaS code platform.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Multi-language support */}
        <section className="feat flex flex-col md:flex-row items-center gap-6 p-6 bg-[#0b0b0b] border border-[#111] rounded-md">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">Multi-language support</h3>
            <p className="text-gray-300 mt-2">
              Supports multiple languages: C++, C, JavaScript, Java, Python, Bash. Each project starts with a ready-to-edit template.
            </p>
          </div>
          <div className="w-full md:w-56 flex-shrink-0 p-4 rounded bg-gradient-to-br from-[#001022] to-[#00172b] flex justify-center text-gray-400">
            {/* Placeholder for language icons */}
            <span className="text-xl">[C++ | Java | Python]</span>
          </div>
        </section>

        {/* Smart Editor */}
        <section className="feat flex flex-col md:flex-row items-center gap-6 p-6 bg-[#080808] border border-[#111] rounded-md">
          <div className="w-full md:w-56 flex-shrink-0 p-4 rounded bg-gradient-to-br from-[#071020] to-[#10121b] flex justify-center">
            <FiZap className="text-4xl"/>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">Smart Editor</h3>
            <p className="text-gray-300 mt-2">
              Syntax highlighting, auto-indent, bracket matching, and small lint hints. Fast and focused.
            </p>
          </div>
        </section>

        {/* Cloud Projects */}
        <section className="feat flex flex-col md:flex-row items-center gap-6 p-6 bg-[#0b0b0b] border border-[#111] rounded-md">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">Cloud Projects</h3>
            <p className="text-gray-300 mt-2">
              Auto-save and cross-device sync with secure storage.
            </p>
          </div>
          <div className="w-full md:w-56 flex-shrink-0 p-4 rounded bg-gradient-to-br from-[#021427] to-[#04203a] flex justify-center">
            <FiCloud className="text-4xl"/>
          </div>
        </section>

        {/* One Click Management */}
        <section className="feat p-6 bg-[#07101a] border border-[#111] rounded-md text-center">
          <h3 className="text-2xl font-semibold mb-2">One Click Management</h3>
          <p className="text-gray-300">
            Create, fork, delete projects. Clean cards, fast actions.
          </p>
          <div className="mt-4 flex justify-center">
            <button className="bg-blue-500 px-5 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Create Project
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Features;