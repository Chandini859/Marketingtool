import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ManageCategory from "../pages/ManageCategory";
import ManageSubcategory from "../pages/ManageSubcategory";
import ManageTeamleader from "../pages/ManageTeamleader";
import ViewReport from "../pages/ViewReport";
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ManageTeamleader" element={<ManageTeamleader/>} />
      <Route path="/ManageCategory" element={<ManageCategory />} />
      <Route path="/ManageSubcategory" element={<ManageSubcategory />} />
      <Route path="/ViewReport" element={<ViewReport />} />
    </Routes>
  );
}

export default AdminRoutes;