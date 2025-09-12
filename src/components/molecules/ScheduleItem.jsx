import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ScheduleItem = ({ schedule, variant = "default" }) => {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  const getStatusVariant = () => {
    const now = new Date();
    const scheduleDate = new Date(schedule.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate.getTime() === today.getTime()) {
      return "accent";
    } else if (scheduleDate > today) {
      return "primary";
    } else {
      return "secondary";
    }
  };

  return (
    <Card variant={variant} className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900">{schedule.position}</h3>
            <p className="text-sm text-secondary-600">{schedule.location}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant()} size="sm">
          {format(new Date(schedule.date), "MMM d")}
        </Badge>
      </div>

      <div className="flex items-center space-x-4 text-sm text-secondary-600">
        <div className="flex items-center space-x-1">
          <ApperIcon name="Clock" size={16} />
          <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ApperIcon name="MapPin" size={16} />
          <span>{schedule.location}</span>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleItem;