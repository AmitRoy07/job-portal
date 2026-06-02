import { Button } from "@/components/ui/button";
import { LogOutUserAction } from "@/feature/auth/server/auth.action";

const EmployerDashboard = () => {
  return (
    <div>
      employer
      <Button onClick={LogOutUserAction}>Log Out</Button>
    </div>
  );
};

export default EmployerDashboard;
