import { Route, Routes } from "react-router-dom";
import Home from "../TeamleaderDashboard/pages/Home";
import ManageCustomer from "../TeamleaderDashboard/pages/ManageCustomer";
import SendEmail from "../TeamleaderDashboard/pages/SendEmail";
import EmailReportManager from "../pages/ViewReport/EmailReportManager";
function TeamLeaderRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ManageCustomer" element={<ManageCustomer />} />
            <Route path="/SendEmail" element={<SendEmail />} />
            <Route path="/EmailReport" element={<EmailReportManager />} />
            {/* <Route path="/SendingEmail" element={<SendingEmail />} /> */}
        </Routes>
    )
}
export default TeamLeaderRoutes