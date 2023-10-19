import { Route, Routes } from "react-router-dom";
import EmailReport from "../TeamleaderDashboard/pages/EmailReport";
import Home from "../TeamleaderDashboard/pages/Home";
import ManageCustomer from "../TeamleaderDashboard/pages/ManageCustomer";
import SendEmail from "../TeamleaderDashboard/pages/SendEmail";


function TeamLeaderRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ManageCustomer" element={<ManageCustomer />} />
            <Route path="/SendEmail" element={<SendEmail />} />
            {/* <Route path="/TeamLeaderEmailReport" element={<TeamLeaderEmailReport />} /> */}
            <Route path="/EmailReport" element={<EmailReport/>} />
            {/* <Route path="/SendingEmail" element={<SendingEmail />} /> */}
        </Routes>
    )
}
export default TeamLeaderRoutes