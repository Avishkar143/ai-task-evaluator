import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Zap, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import HeroAnimation from '../components/HeroAnimation';

const HeroSection = () => (
  <section className="bg-white pt-24 pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
      {/* Left Content */}
      <div className="flex-1 space-y-8 text-left relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-black tracking-tight leading-[1.1]">
          Smart Task Evaluator
        </h1>
        <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
          Elevate your hiring with AI-powered code evaluation. Identify top Gen-AI developers with unparalleled speed and accuracy.
        </p>
        <Link to="/submit">
          <button className="mt-6 bg-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xl shadow-purple-200 hover:-translate-y-1">
            Start Evaluating for Free <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Right Content: Live AI Animation */}
      <div className="flex-1 w-full flex justify-center md:justify-end">
        <HeroAnimation />
      </div>
    </div>
  </section>
);

const DarkFeaturesSection = () => (
  <section className="bg-black text-white py-32">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-24">
      {/* Left Text */}
      <div className="md:w-1/3 pt-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
          A Comprehensive Evaluation Platform
        </h2>
        <p className="text-gray-400 text-xl leading-relaxed">
          Everything you need to assess coding skills with precision, efficiency, and deep analytical insight.
        </p>
      </div>

      {/* Right Cards */}
      <div className="md:w-2/3 space-y-8">
        {/* Card 1 */}
        <div className="bg-gray-900/50 p-10 rounded-2xl border border-gray-800 flex gap-8 items-start hover:border-gray-700 transition-colors">
          <div className="p-4 bg-blue-900/30 rounded-xl text-blue-400">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Our engine evaluates code for quality, structure, and best practices, providing feedback that mirrors a senior developer's review.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900/50 p-10 rounded-2xl border border-gray-800 flex gap-8 items-start hover:border-gray-700 transition-colors">
          <div className="p-4 bg-indigo-900/30 rounded-xl text-indigo-400">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Instant, Actionable Feedback</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Receive comprehensive evaluation reports within minutes, enabling rapid screening and decision-making.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900/50 p-10 rounded-2xl border border-gray-800 flex gap-8 items-start hover:border-gray-700 transition-colors">
          <div className="p-4 bg-purple-900/30 rounded-xl text-purple-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Secure & Unbiased</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Enterprise-grade security ensures data protection, while AI provides consistent, unbiased evaluation for every candidate.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section className="bg-white py-32">
    <div className="max-w-7xl mx-auto px-6 text-center mb-24">
      <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">A Streamlined Evaluation Process</h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">From submission to decision in three simple, automated steps.</p>
    </div>

    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
      {/* Step 1 */}
      <div className="p-10 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow text-center group">
        <div className="text-7xl font-black text-blue-50 mb-8 group-hover:text-blue-100 transition-colors">01</div>
        <h3 className="text-2xl font-bold text-black mb-4">Submit Task</h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          Easily upload your coding challenge, complete with descriptions and expected outputs for our AI to analyze.
        </p>
      </div>

      {/* Step 2 */}
      <div className="p-10 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow text-center group">
        <div className="text-7xl font-black text-blue-50 mb-8 group-hover:text-blue-100 transition-colors">02</div>
        <h3 className="text-2xl font-bold text-black mb-4">AI Evaluation</h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          Our system analyzes code quality, efficiency, and adherence to modern standards against your requirements.
        </p>
      </div>

      {/* Step 3 */}
      <div className="p-10 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-shadow text-center group">
        <div className="text-7xl font-black text-blue-50 mb-8 group-hover:text-blue-100 transition-colors">03</div>
        <h3 className="text-2xl font-bold text-black mb-4">Review Results</h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          Access detailed feedback, scores, and unlock comprehensive reports to make informed hiring decisions.
        </p>
      </div>
    </div>
  </section>
);

const BottomCTA = () => (
  <section className="bg-white py-32 border-t border-gray-100">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">Ready to Hire Smarter?</h2>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Join innovative teams using AI-powered evaluation to build world-class engineering talent. Get started today.
      </p>
      <Link to="/dashboard">
        <button className="bg-purple-600 text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-purple-700 transition-colors shadow-2xl shadow-purple-600/30 hover:-translate-y-1">
            Submit Your First Task <span className="ml-2">→</span>
        </button>
      </Link>
    </div>
  </section>
);

export default function Home() {
  return (
    <div>
      <HeroSection />
      <DarkFeaturesSection />
      <ProcessSection />
      <BottomCTA />
    </div>
  );
}