import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  message = "There's nothing to display right now. Check back later or try a different action.",
  actionLabel = "Refresh",
  onAction,
  icon = "Inbox",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full flex items-center justify-center min-h-[300px] ${className}`}
    >
      <Card className="max-w-md w-full text-center">
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name={icon} className="text-secondary-400" size={40} />
          </motion.div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-600 leading-relaxed">{message}</p>
        </div>

        {onAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              onClick={onAction}
              className="flex items-center justify-center"
            >
              <ApperIcon name="RefreshCw" className="mr-2" size={18} />
              {actionLabel}
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-secondary-50 rounded-lg"
        >
          <p className="text-sm text-secondary-600">
            💡 <strong>Tip:</strong> Data updates automatically, or you can manually refresh to check for new information.
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default Empty;