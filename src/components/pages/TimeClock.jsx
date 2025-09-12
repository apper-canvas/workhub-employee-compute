import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import TimeClockButton from "@/components/molecules/TimeClockButton";
import StatusCard from "@/components/molecules/StatusCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import timeEntryService from "@/services/api/timeEntryService";
import ApperIcon from "@/components/ApperIcon";

const TimeClock = () => {
  const [timeData, setTimeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadTimeData = async () => {
    try {
      setLoading(true);
      setError("");

      const [currentTimeEntry, weeklyHours, recentEntries] = await Promise.all([
        timeEntryService.getCurrentTimeEntry("1"),
        timeEntryService.getWeeklyHours("1"),
        timeEntryService.getByEmployeeId("1")
      ]);

      setTimeData({
        currentTimeEntry,
        weeklyHours,
        recentEntries: recentEntries.slice(-5)
      });
    } catch (err) {
      setError(err.message);
      console.error("Error loading time data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeData();
    
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClockAction = async (action) => {
    try {
      if (action === "in") {
        await timeEntryService.clockIn("1");
        toast.success("Successfully clocked in!");
      } else {
        await timeEntryService.clockOut("1");
        toast.success("Successfully clocked out!");
      }
      loadTimeData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <Loading type="stats" message="Loading time clock..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTimeData} />;
  }

  const { currentTimeEntry, weeklyHours, recentEntries } = timeData;
  const isClockedIn = currentTimeEntry && !currentTimeEntry.clockOut;

  const calculateCurrentHours = () => {
    if (!isClockedIn || !currentTimeEntry) return 0;
    const clockInTime = new Date(currentTimeEntry.clockIn);
    const now = new Date();
    return ((now - clockInTime) / (1000 * 60 * 60)).toFixed(2);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Current Time Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-xl">
          <motion.div
            key={currentTime.getSeconds()}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-6xl font-bold mb-2 font-mono">
              {format(currentTime, "h:mm:ss")}
            </h1>
            <p className="text-2xl text-primary-100 mb-1">
              {format(currentTime, "a")}
            </p>
            <p className="text-lg text-primary-200">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatusCard
          title="Current Status"
          value={isClockedIn ? "Working" : "Off Duty"}
          subtitle={isClockedIn ? "Currently clocked in" : "Ready to clock in"}
          icon={isClockedIn ? "Play" : "Pause"}
          variant={isClockedIn ? "success" : "secondary"}
        />
        <StatusCard
          title="Today's Hours"
          value={isClockedIn ? `${calculateCurrentHours()}h` : `${currentTimeEntry?.hoursWorked || 0}h`}
          subtitle={isClockedIn ? "Hours worked (live)" : "Hours completed"}
          icon="Clock"
          variant="accent"
        />
        <StatusCard
          title="Weekly Total"
          value={`${weeklyHours}h`}
          subtitle="This week"
          icon="Calendar"
          variant="gradient"
        />
        <StatusCard
          title="Average Daily"
          value={`${(weeklyHours / 5).toFixed(1)}h`}
          subtitle="This week average"
          icon="TrendingUp"
          variant="default"
        />
      </motion.div>

      {/* Time Clock Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <Card variant="elevated" className="text-center">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">Time Clock</h3>
          
          {isClockedIn && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-success-700 mb-2">
                <ApperIcon name="Clock" size={20} />
                <span className="font-medium">Clocked in at</span>
              </div>
              <p className="text-2xl font-bold text-success-800">
                {format(new Date(currentTimeEntry.clockIn), "h:mm a")}
              </p>
            </div>
          )}

          <TimeClockButton
            type={isClockedIn ? "out" : "in"}
            onClick={() => handleClockAction(isClockedIn ? "out" : "in")}
            currentStatus={isClockedIn}
          />

          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-2">Need help?</p>
            <p className="text-xs text-secondary-500">
              Contact your supervisor if you experience any issues with the time clock system.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Recent Time Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <ApperIcon name="History" className="mr-3 text-primary-600" size={24} />
            Recent Time Entries
          </h3>
          <div className="space-y-4">
            {recentEntries && recentEntries.length > 0 ? (
              recentEntries.map((entry) => (
                <div
                  key={entry.Id}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-secondary-900">
                      {format(new Date(entry.date), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {format(new Date(entry.clockIn), "h:mm a")} - {entry.clockOut ? format(new Date(entry.clockOut), "h:mm a") : "Active"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary-900">
                      {entry.clockOut ? `${entry.hoursWorked}h` : `${calculateCurrentHours()}h`}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {entry.clockOut ? "Completed" : "In Progress"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <ApperIcon name="Clock" size={48} className="mx-auto mb-4 text-secondary-300" />
                <p>No time entries recorded yet</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TimeClock;