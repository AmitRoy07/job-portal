import { Button } from "@/components/ui/button";
import { LogOutUserAction } from "@/feature/auth/server/auth.action";
import React from "react";

const ApplicantDashboard = () => {
  return (
    <div>
      <h1>ApplicantDashboard</h1>
      <Button onClick={LogOutUserAction}>Log Out</Button>
    </div>
  );
};

export default ApplicantDashboard;
