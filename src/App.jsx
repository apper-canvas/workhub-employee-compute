import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import TimeClock from "@/components/pages/TimeClock";
import Schedule from "@/components/pages/Schedule";
import TimeOff from "@/components/pages/TimeOff";
import Announcements from "@/components/pages/Announcements";
import Profile from "@/components/pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="time-clock" element={<TimeClock />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="time-off" element={<TimeOff />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;