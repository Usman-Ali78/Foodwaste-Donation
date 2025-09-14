import React, { useState, useEffect} from "react";
import useDonations from "../hooks/useDonations";


const Reports = () => {
  const [donationStatusData, setDonationStatusData] = useState([]);
  const [changeInDonations, setChangeInDonations] = useState(0);
  const [donationTrendsData, setDonationTrendsData] = useState([]);
  const { donations } = useDonations();

  useEffect(() => {
    if (!donations || donations.length === 0) return;

    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // --- Count donations this month and last month ---
    const thisMonthDonations = donations.filter((d) => {
      const date = new Date(d.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const lastMonthDonations = donations.filter((d) => {
      const date = new Date(d.createdAt);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    const thisMonthTotal = thisMonthDonations.length;
    const lastMonthTotal = lastMonthDonations.length;

    const change =
      lastMonthTotal === 0
        ? thisMonthTotal > 0
          ? 100
          : 0
        : Math.round(
            ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
          );

    setChangeInDonations(change);

    // --- Status counts (from API) ---
    const expired = donations.filter((d) => d.status === "expired").length;
    const delivered = donations.filter((d) => d.status === "delivered").length;
    const available = donations.filter((d) => d.status === "available").length;

    setDonationStatusData([
      { name: "Available", value: available, color: "yellow-500", icon: "⏳" },
      { name: "Delivered", value: delivered, color: "green-500", icon: "✅" },
      { name: "Expired", value: expired, color: "red-500", icon: "⏰" },
    ]);

    // --- Monthly trends (last 4 months only) ---
    const last4Months = Array.from({ length: 4 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { key: `${d.getMonth()}-${d.getFullYear()}`, label: d };
    }).reverse();

    // Count donations for those months
    const monthCounts = {};
    donations.forEach((d) => {
      const date = new Date(d.createdAt);
      const key = `${date.getMonth()}-${date.getFullYear()}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });

    // Map into chart data
    const monthlyData = last4Months.map((m) => ({
      name: m.label.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }), // e.g. "Aug 2025"
      donations: monthCounts[m.key] || 0,
    }));

    setDonationTrendsData(monthlyData);
  }, [donations]);

  const totalDonations = donations.length;
  const totalDonation = donationTrendsData.reduce(
    (acc, curr) => acc + curr.donations,
    0
  );
  const avgDonations =
    donationTrendsData.length > 0
      ? totalDonations / donationTrendsData.length
      : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Reports and Analytics
      </h2>

      {/* Overall Donation Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          Overall Donation Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Donations</p>
            <p className="text-2xl font-bold text-blue-600">
              {donations.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Change from Last Month</p>
            <p
              className={`text-2xl font-bold ${
                changeInDonations >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeInDonations >= 0 ? "+" : ""}
              {changeInDonations}%
            </p>
            <p className="text-sm text-gray-600">
              {changeInDonations >= 0 ? "Increase" : "Decrease"} from last month
            </p>
          </div>
        </div>
      </div>

      {/* Donation Status Distribution and Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donation Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Donation Status Distribution
          </h3>
          <div className="space-y-4">
            {donationStatusData.map((status, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center">
                  <span className={`text-2xl mr-3 text-${status.color}`}>
                    {status.icon}
                  </span>
                  <span className="text-gray-700">{status.name}</span>
                </div>
                <span className="text-gray-700 font-semibold">
                  {status.value} (
                  {totalDonations > 0
                    ? Math.round((status.value / totalDonations) * 100)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Trends Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Donation Trends (Past 4 Months)
          </h3>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-600">
              Average Donations: {Math.round(avgDonations)}
            </h4>
            <div className="space-y-4">
              {donationTrendsData.map((month, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{month.name}</span>
                    <span className="text-gray-700 font-semibold">
                      {month.donations}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${
                          totalDonation > 0
                            ? (month.donations / totalDonation) * 100
                            : 0
                        }%`,
                        backgroundColor: "#4F46E5",
                      }}
                    ></div>
                  </div>
                  {index > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      {month.donations > donationTrendsData[index - 1].donations
                        ? "+"
                        : ""}
                      {month.donations -
                        donationTrendsData[index - 1].donations}{" "}
                      from previous month
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;