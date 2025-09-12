import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import StatusCard from "@/components/molecules/StatusCard";
import TimeClockButton from "@/components/molecules/TimeClockButton";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import ScheduleItem from "@/components/molecules/ScheduleItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import timeEntryService from "@/services/api/timeEntryService";
import scheduleService from "@/services/api/scheduleService";
import announcementService from "@/services/api/announcementService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [currentTimeEntry, weeklyHours, todaySchedule, upcomingSchedules, recentAnnouncements] = await Promise.all([
        timeEntryService.getCurrentTimeEntry("1"),
        timeEntryService.getWeeklyHours("1"),
        scheduleService.getTodaySchedule("1"),
        scheduleService.getUpcomingSchedules("1", 3),
        announcementService.getRecent(3)
      ]);

      setDashboardData({
        currentTimeEntry,
        weeklyHours,
        todaySchedule,
        upcomingSchedules,
        recentAnnouncements
      });
    } catch (err) {
      setError(err.message);
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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
      loadDashboardData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAsRead = async (announcementId) => {
    try {
      await announcementService.markAsRead(announcementId);
      loadDashboardData();
    } catch (err) {
      console.error("Error marking announcement as read:", err);
    }
  };

  if (loading) {
    return <Loading type="stats" message="Loading your dashboard..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const { currentTimeEntry, weeklyHours, todaySchedule, upcomingSchedules, recentAnnouncements } = dashboardData;
const isClockedIn = currentTimeEntry && !currentTimeEntry.clock_out_c;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, Sarah!
        </h2>
        <p className="text-primary-100">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
        {todaySchedule && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">Today's Schedule</span>
            </div>
            <p className="text-sm text-primary-100 mt-1">
{todaySchedule.start_time_c} - {todaySchedule.end_time_c} at {todaySchedule.location_c}
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatusCard
          title="Current Status"
          value={isClockedIn ? "Clocked In" : "Clocked Out"}
subtitle={currentTimeEntry ? `Since ${format(new Date(currentTimeEntry.clock_in_c), "h:mm a")}` : "Ready to start"}
          icon={isClockedIn ? "Clock" : "Coffee"}
          variant={isClockedIn ? "success" : "default"}
        />
        <StatusCard
          title="Today's Hours"
          value={currentTimeEntry ? `${currentTimeEntry.hoursWorked}h` : "0h"}
          subtitle="Hours worked today"
          icon="Timer"
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
          title="Quick Actions"
          value="Available"
          subtitle="Time clock & requests"
          icon="Zap"
          variant="default"
        />
      </motion.div>

      {/* Time Clock Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">⏰</span>
            </div>
            Time Clock
          </h3>
          <div className="space-y-4">
            <TimeClockButton
              type={isClockedIn ? "out" : "in"}
              onClick={() => handleClockAction(isClockedIn ? "out" : "in")}
              currentStatus={isClockedIn}
            />
            {currentTimeEntry && (
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <p className="text-sm text-secondary-600">
                  {isClockedIn ? "Clocked in at" : "Last worked"}
                </p>
                <p className="font-semibold text-secondary-900">
                  {format(new Date(currentTimeEntry.clockIn), "h:mm a")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">📅</span>
            </div>
            Upcoming Schedule
          </h3>
          <div className="space-y-3">
            {upcomingSchedules && upcomingSchedules.length > 0 ? (
              upcomingSchedules.slice(0, 2).map((schedule) => (
                <ScheduleItem key={schedule.Id} schedule={schedule} variant="gradient" />
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-secondary-500">No upcoming schedules</p>
              </div>
            )}
            <button
              onClick={() => navigate("/schedule")}
              className="w-full text-center py-3 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View Full Schedule →
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">📢</span>
            </div>
            Recent Announcements
          </h3>
          <button
            onClick={() => navigate("/announcements")}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {recentAnnouncements && recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.Id}
                announcement={announcement}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          ) : (
            <Empty
              title="No announcements"
              message="Stay tuned for company updates and news."
              icon="Megaphone"
              onAction={loadDashboardData}
              actionLabel="Refresh"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;