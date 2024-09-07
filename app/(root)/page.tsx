import { redirect } from "next/navigation";

import { getLoggedInUser } from "@/lib/actions/user.actions";

import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const Dashboard = async () => {
  // Trying to get the logged in user data
  const loggedIn = await getLoggedInUser();

  // Redirecting user if he's not signed it
  if (!loggedIn) redirect("/sign-in");

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn.name}
            subtext="Access and manage your account and transactions efficiently"
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.6 }, { currentBalance: 52 }]}
      />
    </section>
  );
};

export default Dashboard;
