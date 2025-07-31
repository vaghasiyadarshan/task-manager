import Navbar from "../../components/Navbar";

export default async function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />

      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
