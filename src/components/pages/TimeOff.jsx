import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TimeOffCard from "@/components/molecules/TimeOffCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import timeOffService from "@/services/api/timeOffService";
import ApperIcon from "@/components/ApperIcon";

const TimeOff = () => {
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  const loadTimeOffRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      const requests = await timeOffService.getByEmployeeId("1");
      setTimeOffRequests(requests);
    } catch (err) {
      setError(err.message);
      console.error("Error loading time off requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeOffRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);
      
      await timeOffService.create({
        employeeId: "1",
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim()
      });

      toast.success("Time off request submitted successfully!");
      setShowRequestForm(false);
      setFormData({ startDate: "", endDate: "", reason: "" });
      loadTimeOffRequests();
    } catch (err) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusCounts = () => {
    return timeOffRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading type="list" message="Loading time off requests..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTimeOffRequests} />;
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
          <h2 className="text-2xl font-bold text-secondary-900">Time Off Requests</h2>
          <p className="text-secondary-600">Manage your vacation and personal time</p>
        </div>

        <Button
          onClick={() => setShowRequestForm(!showRequestForm)}
          variant="primary"
          className="flex items-center"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          New Request
        </Button>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <Card variant="success" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Check" className="text-white" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-success-700 mb-1">
            {statusCounts.approved || 0}
          </p>
          <p className="text-sm font-medium text-success-600">Approved</p>
        </Card>

        <Card variant="warning" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-warning-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="text-white" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-warning-700 mb-1">
            {statusCounts.pending || 0}
          </p>
          <p className="text-sm font-medium text-warning-600">Pending</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" className="text-white" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-700 mb-1">
            {timeOffRequests.length}
          </p>
          <p className="text-sm font-medium text-primary-600">Total Requests</p>
        </Card>
      </motion.div>

      {/* Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="elevated">
            <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
              <ApperIcon name="CalendarPlus" className="mr-3 text-primary-600" size={24} />
              Submit Time Off Request
            </h3>
            
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={format(new Date(), "yyyy-MM-dd")}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || format(new Date(), "yyyy-MM-dd")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please provide a reason for your time off request..."
                  className="w-full h-24 px-3 py-2 border-2 border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="bg-secondary-50 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-2">Request Guidelines:</h4>
                <ul className="text-sm text-secondary-600 space-y-1">
                  <li>• Submit requests at least 2 weeks in advance when possible</li>
                  <li>• Manager approval is required for all time off</li>
                  <li>• You'll receive notification once your request is reviewed</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" size={18} className="mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRequestForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Time Off Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <ApperIcon name="List" className="mr-3 text-primary-600" size={24} />
            Your Requests
          </h3>
          
          <div className="space-y-4">
            {timeOffRequests && timeOffRequests.length > 0 ? (
              timeOffRequests.map((request) => (
                <TimeOffCard key={request.Id} request={request} />
              ))
            ) : (
              <Empty
                title="No time off requests"
                message="You haven't submitted any time off requests yet. Click 'New Request' to get started."
                icon="Calendar"
                onAction={() => setShowRequestForm(true)}
                actionLabel="Create Request"
              />
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <ApperIcon name="Info" className="mr-3 text-primary-600" size={20} />
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
              <ApperIcon name="Calendar" className="text-primary-600 mt-1" size={18} />
              <div>
                <h4 className="font-medium text-primary-800 mb-1">Plan Ahead</h4>
                <p className="text-sm text-primary-700">Submit requests 2+ weeks in advance for better approval chances.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-success-50 rounded-lg">
              <ApperIcon name="CheckCircle" className="text-success-600 mt-1" size={18} />
              <div>
                <h4 className="font-medium text-success-800 mb-1">Check Balance</h4>
                <p className="text-sm text-success-700">Contact HR to check your available vacation days balance.</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TimeOff;