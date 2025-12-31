import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Package, Truck, CheckCircle, Clock, XCircle, CreditCard, MapPin, User, Mail, DollarSign } from "lucide-react";

const Orders = () => {
  const { currency, axios, admin } = useContext(AppContext);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/all");
      
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        console.log(data.message);
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/api/order/status/${id}`, { status });
      if (data.success) {
        toast.success(data.message);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle className="text-green-500" />;
      case 'Shipped': return <Truck className="text-blue-500" />;
      case 'Processing': return <Package className="text-yellow-500" />;
      case 'Cancelled': return <XCircle className="text-red-500" />;
      default: return <Clock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'cod': return <DollarSign className="text-green-500" />;
      case 'card': return <CreditCard className="text-blue-500" />;
      default: return <CreditCard className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = myOrders.filter(order => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today" && diffDays > 0) return false;
      if (dateFilter === "week" && diffDays > 7) return false;
      if (dateFilter === "month" && diffDays > 30) return false;
    }
    return true;
  });

  const stats = {
    total: myOrders.length,
    pending: myOrders.filter(o => o.status === 'Pending').length,
    processing: myOrders.filter(o => o.status === 'Processing').length,
    delivered: myOrders.filter(o => o.status === 'Delivered').length
  };

  return (
    <div className="min-h-screen bg-gray-50 md:py-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500">{stats.total} total orders</p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 bg-primary text-white rounded-full"
          >
            <Package size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-8 px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
        <p className="text-gray-600 mt-2">Manage customer orders and track shipments</p>
      </div>

      <div className="p-4 md:p-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="text-primary" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Truck className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Status</p>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Date</p>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-6 font-semibold text-gray-700 p-4 border-b bg-gray-50">
            <div>Customer</div>
            <div>Order Details</div>
            <div>Amount</div>
            <div>Payment</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {statusFilter !== "all" ? `No ${statusFilter.toLowerCase()} orders` : "No orders yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Order Cards */}
              <div className="md:hidden">
                {filteredOrders.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 border-b hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedOrder(item)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.user?.name || "Customer"}</h3>
                        <p className="text-sm text-gray-500">{item.user?.email || "No email"}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span className="truncate">
                          {item.address?.city}, {item.address?.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <DollarSign size={16} className="mr-1 text-green-500" />
                          <span className="font-bold">{currency}{item.totalAmount}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CreditCard size={16} className="mr-1" />
                          <span className="capitalize">{item.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Rows */}
              <div className="hidden md:block">
                {filteredOrders.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-6 items-center p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Customer */}
                    <div>
                      <p className="font-medium text-gray-900">{item.user?.name || "Customer"}</p>
                      <p className="text-sm text-gray-500 truncate">{item.user?.email || "No email"}</p>
                    </div>
                    
                    {/* Order Details */}
                    <div>
                      <p className="text-sm text-gray-600 truncate">
                        {item.address?.city}, {item.address?.state}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    
                    {/* Amount */}
                    <div>
                      <p className="font-bold text-gray-900">
                        {currency}{item.totalAmount}
                      </p>
                    </div>
                    
                    {/* Payment Method */}
                    <div>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(item.paymentMethod)}
                        <span className="capitalize">{item.paymentMethod}</span>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                      <select
                        value={item.status}
                        onChange={(e) => updateOrderStatus(item._id, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setSelectedOrder(item)}
                        className="text-xs text-primary hover:underline mt-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobile Pagination Info */}
        {filteredOrders.length > 0 && (
          <div className="md:hidden mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {myOrders.length} orders
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tap on an order to view details
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full min-h-screen md:min-h-0 md:max-w-2xl md:rounded-lg md:max-h-[90vh] md:overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">Order #{selectedOrder._id.substring(0, 8)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.user?.name}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.address?.name}</p>
                      <p className="text-gray-600">
                        {selectedOrder.address?.city}, {selectedOrder.address?.state}<br />
                        {selectedOrder.address?.country} - {selectedOrder.address?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Status */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Order Status</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedOrder.status)}
                    <div>
                      <p className={`font-medium ${getStatusColor(selectedOrder.status).split(' ')[1]}`}>
                        {selectedOrder.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last updated: {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {currency}{selectedOrder.totalAmount}
                    </p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>
                
                {/* Status Update */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-3 focus:ring-primary focus:border-primary"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Order Items (if available) */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Order Items ({selectedOrder.items.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center">
                            <Package size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {currency}{item.price * item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currency}{item.price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex flex-col items-center p-2 ${statusFilter === 'all' ? 'text-primary' : 'text-gray-500'}`}
          >
            <Package size={20} />
            <span className="text-xs mt-1">All</span>
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`flex flex-col items-center p-2 ${statusFilter === 'Pending' ? 'text-primary' : 'text-gray-500'}`}
          >
            <Clock size={20} />
            <span className="text-xs mt-1">Pending</span>
          </button>
          <button
            onClick={() => setStatusFilter('Processing')}
            className={`flex flex-col items-center p-2 ${statusFilter === 'Processing' ? 'text-primary' : 'text-gray-500'}`}
          >
            <Truck size={20} />
            <span className="text-xs mt-1">Active</span>
          </button>
          <button
            onClick={() => setStatusFilter('Delivered')}
            className={`flex flex-col items-center p-2 ${statusFilter === 'Delivered' ? 'text-primary' : 'text-gray-500'}`}
          >
            <CheckCircle size={20} />
            <span className="text-xs mt-1">Delivered</span>
          </button>
        </div>
      </div>
      
      {/* Mobile content padding for bottom nav */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Orders;