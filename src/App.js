import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./components/routes/AdminRoutes";
import TeamLeaderRoutes from "./components/routes/TeamLeaderRoutes";
export default function App() {
  const [currentRole, setCurrentRole] = useState("admin");

  return (
    <>
      {/* <Navbar /> */}
      {/* <TeamleadNavbar /> */}
      <Routes>
        <Route path="/*" element={<AdminRoutes />} />
        {/* <Route path="/*" element={<TeamLeaderRoutes/>} /> */}

        <Route path="/TeamLeaderRoutes/*" element={<TeamLeaderRoutes />} />
      </Routes>
      {/* {currentRole === "admin" ? <Sidenav /> : <TeamleadSidenav />} */}
      {/* <TeamleadSidenav /> */}
    </>
  );
}
