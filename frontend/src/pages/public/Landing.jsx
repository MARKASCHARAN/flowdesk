import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FlipWords } from '@/components/ui/flip-words';
import { motion } from 'framer-motion';

const Landing = () => {
  const words = ["customers", "support", "billing", "sales"];

  return (
    <div className="w-full">
      
      {/* Adaline Style Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-40 pb-20 bg-background text-foreground text-center overflow-hidden">
        {/* Soft Background Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-medium tracking-tight text-balance leading-[1.05] text-foreground mb-12">
            The single platform to <br className="hidden md:block"/> 
            manage your <span className="font-serif italic"><FlipWords words={words} /></span>
          </h1>


          
          <div className="mt-32 w-full flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-10">Platform Highlights</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
               <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">Omnichannel Support</span>
               <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">AI Ticket Routing</span>
               <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">Custom Workflows</span>
               <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">Unified Inbox</span>
               <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">Team Collaboration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Metrics Section */}
      <section className="py-32 relative bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-5xl md:text-[4rem] leading-[1] font-black tracking-tighter mb-24 text-center max-w-2xl mx-auto text-foreground">Results you can take to the bank</h2>
          
          {/* Exact alignment and vertical line implementation */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-x border-foreground/30 divide-y md:divide-y-0 md:divide-x divide-foreground/30">
            {/* Metric 1 */}
            <div className="flex flex-col py-16 px-8 relative min-h-[380px]">
              <div className="self-start bg-foreground/5 rounded-full px-3 py-1.5 flex items-center gap-2 mb-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span className="text-[11px] font-bold text-foreground">Ticketing System</span>
              </div>
              <div className="flex flex-col items-center justify-center my-12">
                <span className="text-[4.5rem] md:text-[5.5rem] leading-none font-black text-foreground tracking-tighter">40<span className="text-[3.5rem] md:text-[4rem]">%</span></span>
              </div>
              <div className="mt-auto text-center">
                <p className="text-xs font-bold text-foreground">Reduction in response times</p>
              </div>
            </div>
            
            {/* Metric 2 */}
            <div className="flex flex-col py-16 px-8 relative min-h-[380px]">
              <div className="self-start bg-foreground/5 rounded-full px-3 py-1.5 flex items-center gap-2 mb-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-[11px] font-bold text-foreground">Sales CRM</span>
              </div>
              <div className="flex flex-col items-center justify-center my-12">
                <span className="text-xl font-bold text-foreground mb-1">Up to</span>
                <span className="text-[5.5rem] md:text-[6.5rem] leading-none font-black text-foreground tracking-tighter">3<span className="text-[4rem] md:text-[5rem]">x</span></span>
              </div>
              <div className="mt-auto text-center">
                <p className="text-xs font-bold text-foreground">Increase in lead conversion</p>
              </div>
            </div>
            
            {/* Metric 3 */}
            <div className="flex flex-col py-16 px-8 relative min-h-[380px]">
              <div className="self-start bg-foreground/5 rounded-full px-3 py-1.5 flex items-center gap-2 mb-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="text-[11px] font-bold text-foreground">Automation</span>
              </div>
              <div className="flex flex-col items-center justify-center my-12">
                <span className="text-[5.5rem] md:text-[6.5rem] leading-none font-black text-foreground tracking-tighter mt-7">100<span className="text-[4rem] md:text-[5rem]">+</span></span>
              </div>
              <div className="mt-auto text-center">
                <p className="text-xs font-bold text-foreground">Hours a month of manual triaging saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Make better decisions Card */}
      <section className="py-20 relative bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-[3.5rem] leading-[1] font-black tracking-tighter text-foreground">Unify your support<br/>and sales pipeline</h2>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex-1 space-y-6">
              <div className="bg-gray-100 inline-flex rounded-full px-3 py-1 items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs font-bold text-foreground">CRM & Ticketing</span>
              </div>
              <h3 className="text-4xl font-bold tracking-tight text-foreground leading-[1.1]">Centralized workflows with AI-powered triaging</h3>
              <a href="#" className="inline-block font-bold text-foreground hover:underline mt-4">Learn more →</a>
            </div>
            
            <div className="flex-1 bg-slate-950 rounded-xl p-8 w-full min-h-[400px] flex justify-center items-center relative overflow-hidden">
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-white rounded px-2 py-1 shadow-sm border border-gray-100 flex items-center gap-1">
                    <span className="text-xs">🎯</span>
                    <span className="text-sm font-bold">98% <span className="text-[10px] text-gray-400 font-normal">SLA Met</span></span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground">Tickets Resolved</p>
                    <p className="text-2xl font-black tracking-tight text-foreground">14,239</p>
                  </div>
                </div>

                <div className="bg-[#F4F1EA] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-foreground">Response Time</span>
                    <span className="text-[10px] bg-gray-200 px-1 rounded font-bold">1-7 Mar</span>
                  </div>
                  {/* Fake Bar Chart */}
                  <div className="flex justify-around items-end h-32 border-b border-gray-200 pb-2">
                    <div className="w-16 bg-blue-300 rounded-t-sm h-24 relative flex justify-center">
                      <span className="absolute top-2 text-[10px] font-bold text-foreground">£4.2k</span>
                    </div>
                    <div className="w-16 bg-blue-300 rounded-t-sm h-16 relative flex justify-center">
                      <span className="absolute top-2 text-[10px] font-bold text-foreground">£3.9k</span>
                    </div>
                  </div>
                  <div className="flex justify-around mt-2">
                    <span className="text-[10px] text-gray-400 font-bold">Mon 1</span>
                    <span className="text-[10px] text-gray-400 font-bold">Tue 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplify supply chains Card */}
      <section className="py-10 relative bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex-1 space-y-6">
              <div className="bg-gray-100 inline-flex rounded-full px-3 py-1 items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-foreground">Ticketing</span>
              </div>
              <h3 className="text-4xl md:text-[3rem] font-bold tracking-tight text-foreground leading-[1.1]">Streamline support and team collaboration instantly</h3>
              <a href="#" className="inline-block font-bold text-foreground hover:underline mt-4">Learn more →</a>
            </div>
            <div className="flex-1 bg-indigo-950 rounded-xl p-8 w-full min-h-[400px] flex justify-center items-center relative overflow-hidden">
                <div className="bg-primary text-white rounded-xl px-6 py-3 font-bold text-2xl shadow-xl flex items-center gap-3">
                  <span className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-sm">!</span>
                  Ticket Escalated
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboard, manage & reward Card */}
      <section className="py-10 relative bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex-1 space-y-6">
              <div className="bg-gray-100 inline-flex rounded-full px-3 py-1 items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span className="text-xs font-bold text-foreground">Billing</span>
              </div>
              <h3 className="text-4xl md:text-[3rem] font-bold tracking-tight text-foreground leading-[1.1]">Manage subscriptions and billing effortlessly</h3>
              <a href="#" className="inline-block font-bold text-foreground hover:underline mt-4">Learn more →</a>
            </div>
            <div className="flex-1 bg-violet-950 rounded-xl p-8 w-full min-h-[400px] flex justify-center items-center relative overflow-hidden">
                <div className="space-y-3 w-full max-w-xs">
                  <div className="flex gap-3">
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-90">
                      <p className="font-bold text-sm">Pro Plan</p>
                      <p className="text-xs opacity-70">Active</p>
                    </div>
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-90">
                      <p className="font-bold text-sm">Invoice #1024</p>
                      <p className="text-xs opacity-70">Paid</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-60">
                      <p className="font-bold text-sm">Invoice #1023</p>
                      <p className="text-xs opacity-70">Paid</p>
                    </div>
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-60">
                      <p className="font-bold text-sm">Annual Renewal</p>
                      <p className="text-xs opacity-70">Dec 14th</p>
                    </div>
                  </div>
                   <div className="flex gap-3">
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-40">
                      <p className="font-bold text-sm">Invoice #1022</p>
                    </div>
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 flex-1 opacity-40">
                      <p className="font-bold text-sm">Invoice #1021</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Carousel */}
      <section className="py-32 relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-[4rem] leading-[1] font-black tracking-tighter text-foreground mb-8 text-balance">We help growing startups scale their operations effortlessly...</h2>
              <Button variant="outline" className="font-bold border-foreground/20 rounded-md py-6 px-6">Read more case studies</Button>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center gap-2 border border-border w-24 py-3 rounded bg-white hover:bg-gray-50 transition-colors font-bold text-sm">← Prev</button>
              <button className="flex items-center justify-center gap-2 border border-border w-24 py-3 rounded bg-white hover:bg-gray-50 transition-colors font-bold text-sm">Next →</button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
            {/* Case Study 1 */}
            <div className="min-w-[85vw] md:min-w-[600px] h-[550px] rounded-2xl relative overflow-hidden snap-center flex-shrink-0 bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
              
              <div className="absolute bottom-6 left-6 right-12 bg-white rounded-xl p-8 max-w-sm shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 leading-tight tracking-tight">Acme SaaS builds the infrastructure to scale with FlowDesk</h3>
                <div className="flex gap-8 border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">Reduced support admin time</p>
                    <p className="font-black text-xl">40%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">Faster average ticket resolution</p>
                    <p className="font-black text-xl">&lt; 1 hour</p>
                  </div>
                </div>
                <a href="#" className="inline-block mt-6 font-bold text-sm underline hover:text-primary transition-colors">Read Acme's story →</a>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="min-w-[85vw] md:min-w-[600px] h-[550px] rounded-2xl relative overflow-hidden snap-center flex-shrink-0 bg-gray-200">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
              
              <div className="absolute bottom-6 left-6 right-12 bg-white rounded-xl p-8 max-w-sm shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 leading-tight tracking-tight">TechFlow builds pipeline clarity and operational confidence with FlowDesk</h3>
                <div className="flex gap-8 border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">Increase in sales productivity</p>
                    <p className="font-black text-xl">3x</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">Reduction in time spent reporting</p>
                    <p className="font-black text-xl">~50%</p>
                  </div>
                </div>
                <a href="#" className="inline-block mt-6 font-bold text-sm underline hover:text-primary transition-colors">Read TechFlow's story →</a>
              </div>
            </div>

             {/* Case Study 3 */}
             <div className="min-w-[85vw] md:min-w-[600px] h-[550px] rounded-2xl relative overflow-hidden snap-center flex-shrink-0 bg-gray-200">
               <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-emerald-900"></div>
              
              <div className="absolute bottom-6 left-6 right-12 bg-white rounded-xl p-8 max-w-sm shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 leading-tight tracking-tight">Inside Global System's framework for 99.9% SLA adherence</h3>
                <div className="flex gap-8 border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">Customer Satisfaction (CSAT)</p>
                    <p className="font-black text-xl">99%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-1">SLA Adherence</p>
                    <p className="font-black text-xl">99.9%</p>
                  </div>
                </div>
                <a href="#" className="inline-block mt-6 font-bold text-sm underline hover:text-primary transition-colors">Read Global System's story →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Want better margins */}
      <section className="pt-32 pb-0 relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xl z-10">
              <h2 className="text-5xl md:text-[5rem] leading-[1] font-black tracking-tighter text-foreground mb-6">Ready to scale?</h2>
              <p className="text-xl font-bold text-foreground mb-8">Ask us how we can unify your operations and help you grow.</p>
              <Link to="/register">
                <Button size="lg" className="font-bold text-lg h-14 px-8 rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all bg-foreground text-background hover:bg-foreground/90">
                  Book a chat
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Laptop on Crate placeholder */}
          <div className="mt-12 relative flex justify-center w-full max-w-4xl mx-auto h-[400px]">
             {/* The Crate */}
             <div className="absolute bottom-0 w-[80%] h-[250px] bg-primary rounded-t-xl border-t-[16px] border-primary/80 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col justify-end overflow-hidden">
                <div className="flex justify-around w-full opacity-40 mb-4 px-8">
                  <div className="w-12 h-32 border-[6px] border-indigo-950/20 rotate-45 transform origin-bottom-left"></div>
                  <div className="w-12 h-32 border-[6px] border-indigo-950/20 -rotate-45 transform origin-bottom-right"></div>
                  <div className="w-12 h-32 border-[6px] border-indigo-950/20 rotate-45 transform origin-bottom-left"></div>
                  <div className="w-12 h-32 border-[6px] border-indigo-950/20 -rotate-45 transform origin-bottom-right"></div>
                </div>
             </div>
             {/* The Laptop Display */}
             <div className="absolute bottom-[234px] w-[90%] h-[320px] bg-black rounded-t-xl border-[12px] border-gray-800 shadow-2xl flex justify-center items-center overflow-hidden z-10">
               <div className="w-full h-full bg-white relative">
                  {/* Fake Laptop Screen UI */}
                  <div className="absolute top-0 left-0 w-48 h-full bg-gray-50 border-r border-gray-200"></div>
                  <div className="absolute top-0 right-0 left-48 h-12 border-b border-gray-200"></div>
                  <div className="absolute bottom-4 right-8 left-56 h-40 bg-gray-50 rounded-lg flex items-end justify-around pb-2 px-6">
                     <div className="w-6 h-16 bg-primary rounded-t-sm"></div>
                     <div className="w-6 h-24 bg-primary rounded-t-sm"></div>
                     <div className="w-6 h-12 bg-primary rounded-t-sm"></div>
                     <div className="w-6 h-32 bg-primary rounded-t-sm"></div>
                     <div className="w-6 h-20 bg-primary rounded-t-sm"></div>
                  </div>
               </div>
             </div>
             {/* Laptop Base */}
             <div className="absolute bottom-[234px] w-full h-[16px] bg-gray-400 rounded-b-xl shadow-2xl z-20">
               <div className="w-32 h-2 bg-gray-300 mx-auto rounded-b-md"></div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
