import { Box } from "@mui/material"
import TeamleadNavbar from "../../TeamleaderDashboard/TeamleadNavbar"
import TeamleadSidenav from "../../TeamleaderDashboard/TeamleadSidenav"
import EmailReport from "./EmailReport"

const EmailReportManager = () => {
    return (
        <div>
            <TeamleadNavbar />
            <Box height={30} />
            <Box sx={{ display: "flex" }}>
                <TeamleadSidenav />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <EmailReport />
                </Box>
            </Box>
        </div>
    )
}

export default EmailReportManager
