import { getCurrentUser } from "@/feature/auth/server/auth.queries";
import { EmployerProfileCompletionStatus } from "@/feature/employers/components/employer-profile-status";
import { StatsCards } from "@/feature/employers/components/employer-stats";

const EmployerDashboard = async () => {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, <span className="capitalize">{user?.name.toLowerCase()}</span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and appLications
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      <EmployerProfileCompletionStatus />
    </div>
  );
};

export default EmployerDashboard;
