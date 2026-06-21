import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/10 dark:bg-slate-800/[0.8] block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-xl h-full w-full p-4 overflow-hidden bg-card border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 shadow-sm transition-all">
            <div className="relative z-50">
              <div className="p-2 space-y-2">
                <h4 className="text-muted-foreground font-medium tracking-wide">
                  {item.title}
                </h4>
                <p className="mt-2 text-3xl font-bold tracking-wide text-foreground">
                  {item.value}
                </p>
                <p className={cn("text-xs mt-2", item.isNegative ? 'text-destructive' : 'text-emerald-500')}>
                  {item.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
