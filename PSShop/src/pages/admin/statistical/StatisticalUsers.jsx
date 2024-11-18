import React, { useEffect, useState } from "react";
import { GetUserStatistics } from "../service/api_service";

const StatisticalUsers = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await GetUserStatistics();
        console.log(response.data);
        setUserStats(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Thống kê người dùng</h1>
      <p>Tổng số người dùng: {userStats.totalUsers}</p>
      <p>Người dùng hoạt động: {userStats.activeUsers}</p>
      <p>Người dùng không hoạt động: {userStats.inactiveUsers}</p>
    </div>
  );
};

export default StatisticalUsers;
