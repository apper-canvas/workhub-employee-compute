import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TimeClockButton = ({ 
  type = "in", 
  onClick, 
  disabled = false,
  currentStatus 
}) => {
  const isClockIn = type === "in";
  const variant = isClockIn ? "success" : "error";
  const icon = isClockIn ? "LogIn" : "LogOut";
  const text = isClockIn ? "Clock In" : "Clock Out";
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="w-full"
    >
      <Button
        variant={variant}
        size="lg"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-20 text-xl font-semibold shadow-lg"
      >
        <ApperIcon name={icon} className="mr-3" size={28} />
        {text}
      </Button>
    </motion.div>
  );
};

export default TimeClockButton;