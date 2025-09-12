import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import announcementService from "@/services/api/announcementService";
import ApperIcon from "@/components/ApperIcon";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, high, medium, low

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allAnnouncements = await announcementService.getAll();
      setAnnouncements(allAnnouncements);
    } catch (err) {
      setError(err.message);
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleMarkAsRead = async (announcementId) => {
    try {
      await announcementService.markAsRead(announcementId);
      loadAnnouncements();
    } catch (err) {
      console.error("Error marking announcement as read:", err);
    }
  };

  const getFilteredAnnouncements = () => {
    if (filter === "all") return announcements;
    if (filter === "unread") {
return announcements.filter(ann => {
        const readByList = ann.read_by_c ? ann.read_by_c.split('\n').filter(u => u.trim()) : [];
        return !readByList.includes("current-user");
      });
    }
return announcements.filter(ann => ann.priority_c && ann.priority_c.toLowerCase() === filter);
  };

  const getFilterCounts = () => {
const unreadCount = announcements.filter(ann => {
      const readByList = ann.read_by_c ? ann.read_by_c.split('\n').filter(u => u.trim()) : [];
      return !readByList.includes("current-user");
    }).length;
    const priorityCounts = announcements.reduce((acc, ann) => {
const priority = ann.priority_c ? ann.priority_c.toLowerCase() : 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});
    
    return {
      all: announcements.length,
      unread: unreadCount,
      ...priorityCounts
    };
  };

  const filterCounts = getFilterCounts();
  const filteredAnnouncements = getFilteredAnnouncements();

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "AlertTriangle";
      case "medium":
        return "Info";
      case "low":
        return "CheckCircle";
      default:
        return "Bell";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-error-600";
      case "medium":
        return "text-warning-600";
      case "low":
        return "text-success-600";
      default:
        return "text-primary-600";
    }
  };

  if (loading) {
    return <Loading type="list" message="Loading announcements..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnnouncements} />;
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
          <h2 className="text-2xl font-bold text-secondary-900">Company Announcements</h2>
          <p className="text-secondary-600">Stay updated with the latest news and updates</p>
        </div>

        {filterCounts.unread > 0 && (
          <Badge variant="error" size="md">
            {filterCounts.unread} unread
          </Badge>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                  : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border-2 border-transparent"
              }`}
            >
              <ApperIcon name="List" size={16} className="mr-2" />
              All ({filterCounts.all})
            </button>
            
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                  : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border-2 border-transparent"
              }`}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
              Unread ({filterCounts.unread})
            </button>

            <button
              onClick={() => setFilter("high")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "high"
                  ? "bg-error-100 text-error-700 border-2 border-error-200"
                  : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border-2 border-transparent"
              }`}
            >
              <ApperIcon name="AlertTriangle" size={16} className="mr-2 text-error-500" />
              High Priority ({filterCounts.high || 0})
            </button>

            <button
              onClick={() => setFilter("medium")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "medium"
                  ? "bg-warning-100 text-warning-700 border-2 border-warning-200"
                  : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border-2 border-transparent"
              }`}
            >
              <ApperIcon name="Info" size={16} className="mr-2 text-warning-500" />
              Medium Priority ({filterCounts.medium || 0})
            </button>

            <button
              onClick={() => setFilter("low")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "low"
                  ? "bg-success-100 text-success-700 border-2 border-success-200"
                  : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border-2 border-transparent"
              }`}
            >
              <ApperIcon name="CheckCircle" size={16} className="mr-2 text-success-500" />
              Low Priority ({filterCounts.low || 0})
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Announcements List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnnouncementCard
                announcement={announcement}
                onMarkAsRead={handleMarkAsRead}
              />
            </motion.div>
          ))
        ) : (
          <Empty
            title={filter === "unread" ? "All caught up!" : "No announcements"}
            message={
              filter === "unread" 
                ? "You've read all the latest announcements. Great job staying informed!"
                : `No announcements match the ${filter} filter. Try selecting a different filter.`
            }
            icon={filter === "unread" ? "CheckCircle2" : "Megaphone"}
            onAction={() => setFilter("all")}
            actionLabel="View All"
          />
        )}
      </motion.div>

      {/* Stats Summary */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <ApperIcon name="BarChart3" className="mr-3 text-primary-600" size={20} />
              Announcements Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["high", "medium", "low"].map((priority) => (
                <div
                  key={priority}
                  className="text-center p-4 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center justify-center mb-2">
                    <ApperIcon 
                      name={getPriorityIcon(priority)} 
                      className={`${getPriorityColor(priority)} mr-2`} 
                      size={20} 
                    />
                    <span className="font-medium text-secondary-900 capitalize">
                      {priority}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-secondary-700">
                    {filterCounts[priority] || 0}
                  </p>
                  <p className="text-xs text-secondary-500">announcements</p>
                </div>
              ))}
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  <span className="font-medium text-secondary-900">Unread</span>
                </div>
                <p className="text-2xl font-bold text-primary-700">
                  {filterCounts.unread}
                </p>
                <p className="text-xs text-primary-600">remaining</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Announcements;