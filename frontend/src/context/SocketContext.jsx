import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const socketUrl = 'http://localhost:4000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to socket server');
      setIsConnected(true);
      
      // Check for admin token (simplified logic)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token && token !== "null" && token !== "undefined") {
        newSocket.emit('adminJoin');
        console.log('👑 Joined admin dashboard room');
      }
      
      // Request initial stats
      newSocket.emit('getDashboardStats');
    });

    // Dashboard stats update
    newSocket.on('dashboardStats', (stats) => {
      console.log('📊 Received dashboard stats');
      setDashboardStats(stats);
    });

    // New order notification
    newSocket.on('newOrder', (data) => {
      console.log('🆕 New order received:', data);
      setDashboardStats(data.stats);
      
      // Add to recent activity
      setRecentActivity(prev => [
        {
          type: 'newOrder',
          message: `New order #${data.orderId} from ${data.customer}`,
          amount: `৳${data.totalAmount}`,
          time: new Date(),
        },
        ...prev.slice(0, 9) // Keep last 10 activities
      ]);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('New Order!', {
          body: `Order #${data.orderId} for ৳${data.totalAmount}`,
          icon: '/favicon.ico'
        });
      }
    });

    // Connection error
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Disconnection
    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      setIsConnected(false);
    });

    // Reconnection
    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`♻️ Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    setSocket(newSocket);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('🔔 Notification permission granted');
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    isConnected,
    dashboardStats,
    setDashboardStats,
    recentActivity,
    clearActivity: () => setRecentActivity([])
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};