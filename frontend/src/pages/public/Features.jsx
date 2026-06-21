import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const features = [
    { title: "Universal Inbox", desc: "Manage emails, chats, and social mentions in one place.", span: "col-span-1 md:col-span-2", icon: "📫" },
    { title: "Automated Workflows", desc: "Set up SLA rules and automatic ticket assignment.", span: "col-span-1", icon: "⚡️" },
    { title: "Real-time Collaboration", desc: "Collaborate with team members inside tickets seamlessly.", span: "col-span-1", icon: "👥" },
    { title: "Built-in CRM", desc: "Keep track of customer history and interaction logs automatically.", span: "col-span-1 md:col-span-2", icon: "🤝" },
    { title: "Stripe Billing", desc: "Manage subscriptions and send invoices without leaving the app.", span: "col-span-1 md:col-span-2", icon: "💳" },
    { title: "Advanced Analytics", desc: "Track response times, CSAT scores, and team performance.", span: "col-span-1", icon: "📈" },
  ];

  return (
    <div className="container mx-auto px-4 py-32 max-w-7xl">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6"
        >
          <span>Platform Capabilities</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
        >
          Powerful Features <br className="hidden md:block"/> for Modern Teams
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
        >
          Everything you need to manage customer support, build your CRM, and handle billing without switching context.
        </motion.p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {features.map((feature, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`group p-8 rounded-[2rem] border border-border/60 bg-card shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${feature.span}`}
          >
            {/* Background glowing orb effect on hover */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 group-hover:bg-primary/10 border border-border/50 group-hover:border-primary/20 flex items-center justify-center mb-8 transition-colors duration-300">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">{feature.desc}</p>
            </div>
            
            <div className="mt-8 overflow-hidden h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
               <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary rounded-full"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;
