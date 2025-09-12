import React from "react";
import { format, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TimeOffCard = ({ request }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Check";
      case "pending":
        return "Clock";
      case "rejected":
        return "X";
      default:
        return "Calendar";
    }
  };

  const getDuration = () => {
if (!request.endDate || !request.startDate || isNaN(new Date(request.endDate)) || isNaN(new Date(request.startDate))) {
      return "Duration unknown";
    }
    const days = differenceInDays(new Date(request.endDate), new Date(request.startDate)) + 1;
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            request.status === "approved" 
              ? "bg-gradient-to-br from-success-500 to-success-600"
              : request.status === "pending"
              ? "bg-gradient-to-br from-warning-500 to-warning-600"
              : "bg-gradient-to-br from-error-500 to-error-600"
          }`}>
            <ApperIcon 
              name={getStatusIcon(request.status)} 
              className="text-white" 
              size={20} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900">{request.reason}</h3>
            <p className="text-sm text-secondary-600">
Requested on {request.requestDate && !isNaN(new Date(request.requestDate)) ? format(new Date(request.requestDate), "MMM d, yyyy") : "Date unknown"}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(request.status)} size="sm">
          {request.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Duration:</span>
          <span className="font-medium text-secondary-900">{getDuration()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Start Date:</span>
          <span className="font-medium text-secondary-900">
{request.startDate && !isNaN(new Date(request.startDate)) ? format(new Date(request.startDate), "MMM d, yyyy") : "Invalid date"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">End Date:</span>
<span className="font-medium text-secondary-900">
            {request.endDate && !isNaN(new Date(request.endDate)) ? format(new Date(request.endDate), "MMM d, yyyy") : "Invalid date"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TimeOffCard;