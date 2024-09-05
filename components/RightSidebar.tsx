import { RightSidebarProps } from "@/types";

function RightSidebar({ user, transactions, banks }: RightSidebarProps) {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user.firstName[0]}
            </span>
          </div>
          <div className="profile-details">
            <h3 className="profile-name">
              {user.firstName} {user.lastName}
            </h3>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default RightSidebar;
