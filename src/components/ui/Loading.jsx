import React from "react";
import { motion } from "framer-motion";

const LoadingCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl border border-secondary-200 p-6 ${className}`}>
    <div className="animate-shimmer h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded mb-3"></div>
    <div className="animate-shimmer h-6 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded mb-2"></div>
    <div className="animate-shimmer h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded w-3/4"></div>
  </div>
);

const LoadingGrid = ({ count = 6, className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

const LoadingList = ({ count = 5, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

const LoadingStats = ({ className = "" }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-shimmer h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded w-20"></div>
          <div className="animate-shimmer h-8 w-8 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded-lg"></div>
        </div>
        <div className="animate-shimmer h-8 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded mb-2"></div>
        <div className="animate-shimmer h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);

const Loading = ({ 
  type = "card", 
  count = 6, 
  className = "",
  message = "Loading..." 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center space-x-2 text-secondary-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full"
          />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </motion.div>

      {type === "stats" && <LoadingStats />}
      {type === "grid" && <LoadingGrid count={count} />}
      {type === "list" && <LoadingList count={count} />}
      {type === "card" && <LoadingCard />}
    </div>
  );
};

export default Loading;