import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatusCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = "default",
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card variant={variant} className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 mb-2">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-secondary-500">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name={icon} className="text-white" size={24} />
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary-50 opacity-30 -z-10" />
      </Card>
    </motion.div>
  );
};

export default StatusCard;