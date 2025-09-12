import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import employeeService from "@/services/api/employeeService";
import timeEntryService from "@/services/api/timeEntryService";
import ApperIcon from "@/components/ApperIcon";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [timeStats, setTimeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    position: ""
  });

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, weeklyHours, recentEntries] = await Promise.all([
        employeeService.getCurrentEmployee(),
        timeEntryService.getWeeklyHours("1"),
        timeEntryService.getByEmployeeId("1")
      ]);

      setEmployee(employeeData);
      setEditForm({
        name: employeeData.name,
        email: employeeData.email,
        department: employeeData.department,
        position: employeeData.position
      });

      // Calculate stats
      const totalHours = recentEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
      const avgHours = recentEntries.length > 0 ? totalHours / recentEntries.length : 0;

      setTimeStats({
        weeklyHours,
        totalHours,
        avgDailyHours: avgHours,
        totalDays: recentEntries.length
      });
    } catch (err) {
      setError(err.message);
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      await employeeService.update("1", editForm);
      setEmployee(prev => ({ ...prev, ...editForm }));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position
    });
    setEditing(false);
  };

  if (loading) {
    return <Loading type="card" message="Loading your profile..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProfileData} />;
  }

  if (!employee) {
    return <Error message="Employee data not found" onRetry={loadProfileData} />;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-transparent rounded-bl-full opacity-50" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar
              src={employee.avatar}
              fallback={employee.name.split(" ").map(n => n[0]).join("")}
              size="xl"
              className="ring-4 ring-white shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                {employee.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="primary" size="md">
                  {employee.position}
                </Badge>
                <Badge variant="accent" size="md">
                  {employee.department}
                </Badge>
              </div>
              <div className="text-sm text-secondary-600">
                <p className="flex items-center mb-1">
                  <ApperIcon name="Mail" size={16} className="mr-2" />
                  {employee.email}
                </p>
                <p className="flex items-center">
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  Started {format(new Date(employee.startDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setEditing(!editing)}
              variant={editing ? "ghost" : "outline"}
              className="flex items-center"
            >
              <ApperIcon name={editing ? "X" : "Edit"} size={18} className="mr-2" />
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Edit Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card variant="elevated">
            <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
              <ApperIcon name="UserCog" className="mr-3 text-primary-600" size={24} />
              Edit Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              <Input
                label="Department"
                name="department"
                value={editForm.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
              />
              <Input
                label="Position"
                name="position"
                value={editForm.position}
                onChange={handleInputChange}
                placeholder="Enter your position"
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Work Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <ApperIcon name="BarChart3" className="mr-3 text-primary-600" size={24} />
            Work Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Clock" className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-primary-700 mb-1">
                {timeStats.weeklyHours}h
              </p>
              <p className="text-sm text-primary-600">This Week</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
              <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Calendar" className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-success-700 mb-1">
                {timeStats.totalDays}
              </p>
              <p className="text-sm text-success-600">Total Days</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="TrendingUp" className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-accent-700 mb-1">
                {timeStats.avgDailyHours.toFixed(1)}h
              </p>
              <p className="text-sm text-accent-600">Daily Average</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl">
              <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Award" className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-secondary-700 mb-1">
                {timeStats.totalHours.toFixed(0)}h
              </p>
              <p className="text-sm text-secondary-600">Total Hours</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Employee Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <ApperIcon name="User" className="mr-3 text-primary-600" size={24} />
            Employee Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Employee ID</p>
                <p className="text-lg font-semibold text-secondary-900">EMP-{employee.Id.toString().padStart(4, '0')}</p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Department</p>
                <p className="text-lg font-semibold text-secondary-900">{employee.department}</p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Position</p>
                <p className="text-lg font-semibold text-secondary-900">{employee.position}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Email Address</p>
                <p className="text-lg font-semibold text-secondary-900 break-words">{employee.email}</p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Start Date</p>
                <p className="text-lg font-semibold text-secondary-900">
                  {format(new Date(employee.startDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm font-medium text-secondary-600 mb-1">Status</p>
                <Badge variant="success" size="md">Active Employee</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <ApperIcon name="Zap" className="mr-3 text-primary-600" size={20} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Download" className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-secondary-900">Download Pay Stub</p>
                <p className="text-sm text-secondary-600">Get your latest pay stub</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors">
              <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="FileText" className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-secondary-900">View Benefits</p>
                <p className="text-sm text-secondary-600">Check your benefits info</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="HelpCircle" className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-secondary-900">Contact HR</p>
                <p className="text-sm text-secondary-600">Get help and support</p>
              </div>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;