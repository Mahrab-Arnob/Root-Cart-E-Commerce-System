import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const data = [
    {
      title: "Total Products",
      value: "2,847",
      icon: Package,
    },
    {
      title: "Total Customers",
      value: "18,432",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: "9,251",
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: "$432,890",
      icon: DollarSign,
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
      </div>

      {/* Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3">
                <Icon size={24} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;