import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ScheduleItem from "@/components/molecules/ScheduleItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import scheduleService from "@/services/api/scheduleService";
import ApperIcon from "@/components/ApperIcon";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // week, list

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError("");
      
      const employeeSchedules = await scheduleService.getByEmployeeId("1");
      setSchedules(employeeSchedules);
    } catch (err) {
      setError(err.message);
      console.error("Error loading schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

const getScheduleForDate = (date) => {
    if (!date || isNaN(date)) return null;
    try {
      const dateString = format(date, "yyyy-MM-dd");
      return schedules.find(schedule => schedule.date_c === dateString);
    } catch {
      return null;
    }
  };

  const navigateWeek = (direction) => {
    const newDate = addDays(selectedDate, direction * 7);
    setSelectedDate(newDate);
  };

const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return "Invalid time";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  if (loading) {
    return <Loading type="grid" count={7} message="Loading your schedule..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSchedules} />;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Work Schedule</h2>
          <p className="text-secondary-600">
            {format(startOfWeek(selectedDate), "MMM d")} - {format(endOfWeek(selectedDate), "MMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </motion.div>

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigateWeek(-1)}
            className="flex items-center"
          >
            <ApperIcon name="ChevronLeft" size={20} className="mr-1" />
            Previous Week
          </Button>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-secondary-900">
              Week of {format(startOfWeek(selectedDate), "MMMM d, yyyy")}
            </h3>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => navigateWeek(1)}
            className="flex items-center"
          >
            Next Week
            <ApperIcon name="ChevronRight" size={20} className="ml-1" />
          </Button>
        </Card>
      </motion.div>

      {/* Schedule Content */}
      {viewMode === "week" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4"
        >
          {getWeekDays().map((day, index) => {
            const daySchedule = getScheduleForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <Card
                key={index}
                variant={isCurrentDay ? "accent" : "default"}
                className={`transition-all duration-200 ${
                  isCurrentDay ? "ring-2 ring-accent-300" : ""
                }`}
              >
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h4 className="font-semibold text-secondary-900">
                      {format(day, "EEE")}
                    </h4>
                    {isCurrentDay && (
                      <Badge variant="accent" size="sm">
                        Today
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-secondary-700">
                    {format(day, "d")}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {format(day, "MMM")}
                  </p>
                </div>

                {daySchedule ? (
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <ApperIcon name="Clock" size={14} className="text-primary-600" />
                        <span className="text-sm font-medium text-primary-800">
{formatTime(daySchedule.start_time_c)} - {formatTime(daySchedule.end_time_c)}
                        </span>
                      </div>
                      <p className="text-xs text-primary-600 font-medium">
{daySchedule.position_c}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <ApperIcon name="MapPin" size={12} className="text-secondary-400" />
                      <span className="text-xs text-secondary-600">
{daySchedule.location_c}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ApperIcon 
                      name="Coffee" 
                      size={24} 
                      className="mx-auto mb-2 text-secondary-300" 
                    />
                    <p className="text-sm text-secondary-500">Off Day</p>
                  </div>
                )}
              </Card>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {schedules && schedules.length > 0 ? (
            schedules.map((schedule) => (
              <ScheduleItem
                key={schedule.Id}
                schedule={schedule}
                variant={isToday(new Date(schedule.date)) ? "accent" : "default"}
              />
            ))
          ) : (
            <Empty
              title="No schedules found"
              message="Your work schedule will appear here once it's been assigned by your manager."
              icon="Calendar"
              onAction={loadSchedules}
              actionLabel="Refresh"
            />
          )}
        </motion.div>
      )}

      {/* Schedule Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" className="mr-3 text-primary-600" size={20} />
            This Week Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-700">
                {getWeekDays().filter(day => getScheduleForDate(day)).length}
              </p>
              <p className="text-sm text-primary-600">Scheduled Days</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <p className="text-2xl font-bold text-success-700">
{getWeekDays().reduce((total, day) => {
                  const schedule = getScheduleForDate(day);
                  if (schedule && schedule.start_time_c && schedule.end_time_c) {
                    try {
                      const start = new Date(`2000-01-01T${schedule.start_time_c}`);
                      const end = new Date(`2000-01-01T${schedule.end_time_c}`);
                      if (!isNaN(start) && !isNaN(end)) {
                        return total + (end - start) / (1000 * 60 * 60);
                      }
                    } catch {
                      // Skip invalid dates
                    }
                  }
                  return total;
                }, 0)}h
              </p>
              <p className="text-sm text-success-600">Total Hours</p>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <p className="text-2xl font-bold text-accent-700">
                {7 - getWeekDays().filter(day => getScheduleForDate(day)).length}
              </p>
              <p className="text-sm text-accent-600">Days Off</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Schedule;