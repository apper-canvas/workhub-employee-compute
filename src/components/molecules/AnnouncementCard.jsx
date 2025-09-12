import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AnnouncementCard = ({ announcement, onMarkAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRead = announcement.readBy?.includes("current-user");

const getPriorityVariant = (priority) => {
    if (!priority || typeof priority !== 'string') {
      return "default";
    }
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isRead) {
      onMarkAsRead(announcement.Id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          !isRead ? "border-l-4 border-l-primary-500" : ""
        }`}
        onClick={handleToggleExpand}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${
                isRead ? "bg-secondary-300" : "bg-primary-500"
              }`} />
            </div>
            <h3 className="font-semibold text-secondary-900 truncate">
              {announcement.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant={getPriorityVariant(announcement.priority)} size="sm">
              {announcement.priority}
            </Badge>
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              className="text-secondary-400" 
              size={20} 
            />
          </div>
        </div>

        <div className="flex items-center text-sm text-secondary-500 mb-3">
          <ApperIcon name="Calendar" className="mr-2" size={16} />
{announcement.publishDate && !isNaN(new Date(announcement.publishDate)) ? format(new Date(announcement.publishDate), "MMM d, yyyy 'at' h:mm a") : "Date unknown"}
        </div>

        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : "0",
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-2 border-t border-secondary-200">
            <p className="text-secondary-700 leading-relaxed">
              {announcement.content}
            </p>
          </div>
        </motion.div>

        {!isExpanded && (
          <div className="text-sm text-secondary-500">
            {announcement.content.substring(0, 120)}
            {announcement.content.length > 120 && "..."}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AnnouncementCard;