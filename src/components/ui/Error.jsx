import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showRetry = true,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex items-center justify-center min-h-[300px] ${className}`}
    >
      <Card className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="text-error-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-600 leading-relaxed">{message}</p>
        </div>

        {showRetry && onRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={onRetry}
              className="flex items-center justify-center"
            >
              <ApperIcon name="RefreshCw" className="mr-2" size={18} />
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center"
            >
              <ApperIcon name="RotateCcw" className="mr-2" size={18} />
              Refresh Page
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-error-50 rounded-lg">
          <p className="text-xs text-error-700">
            If this problem persists, please contact IT support or try refreshing the page.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;