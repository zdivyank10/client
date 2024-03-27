import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useAuth } from '../../store/auth';
import './dashboard.css'

function AdminDashboard() {
  const [chartData, setChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const { API_BASE_URL, user } = useAuth();
  const [chartInstance, setChartInstance] = useState(null);
  const [piechartInstance, setPieChartInstance] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/monthlyuser`);
        if (!response.ok) {
          throw new Error('Failed to fetch user registration data');
        }
        const userData = await response.json();

        const months = userData.map(item => `${item._id.month}/${item._id.year}`);
        const counts = userData.map(item => item.count);

        setChartData({
          labels: months,
          datasets: [{
            label: 'New Users Registered',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching user registration data:', error);
      }
    };

    const fetchBlogData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/admin/blogstat`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        const blogData = await response.json();

        const labels = ['Approved', 'Pending', 'Declined'];
        const backgroundColors = ['#36a2eb', '#ffce56', '#ff6384'];
        const counts = [blogData.approved, blogData.pending, blogData.declined];

        setPieChartData({
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchUserData();
    fetchBlogData();
  }, [API_BASE_URL]);

  useEffect(() => {
    const renderUserRegistrationChart = () => {
      const ctx = document.getElementById('userRegistrationChart');
      if (ctx && chartData.labels && chartData.labels.length > 0) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        const newChartInstance = new Chart(ctx, {
          type: 'bar',
          data: chartData
        });
        setChartInstance(newChartInstance);
      }
    };

    renderUserRegistrationChart();
  }, [chartData]);

  useEffect(() => {
    const renderBlogOverviewChart = () => {
      const ctx = document.getElementById('blogPieChart');
      if (ctx && pieChartData.labels && pieChartData.labels.length > 0) {
        if (piechartInstance) {
          piechartInstance.destroy();
        }
        const newChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: pieChartData,
          options: {
            plugins: {
              legend: {
                display: true,
                // position: 'right',
              },
              title: {
                display: true,
                text: 'Blogs Overview',
                padding: 20,
              },
              doughnutLabel: {
                labels: [
                  {
                    render: 'percentage',
                    fontColor: '#fff',
                    fontStyle: 'bold',
                    fontSize: 20,
                  },
                  {
                    render: 'label',
                    fontColor: '#000',
                    position: 'outside',
                    textMargin: 20,
                  },
                  {
                    render: 'value',
                    fontColor: '#000',
                    fontSize: 16,
                  },
                ],
              },
            },
            layout: {
              padding: {
                left: 50,
                right: 50,
                top: 0,
                bottom: 0,
              },
            },
            cutout: '70%',
            animation: {
              animateScale: true,
              animateRotate: true,
            },
          },
        });
        setPieChartInstance(newChartInstance);
      }
    };

    renderBlogOverviewChart();
  }, [pieChartData]);

  return (
    <>


      <div className="dashboard_admin">
        <div className="admin_info">

          <h2>{user.username}</h2>
          <h6>{user.email}</h6>
          <div className="admin_role ">

            <p className='role text-center me-3 '>User</p>
            <p className='role text-center'>Admin</p>
          </div>
        </div>
        <img src="../img/admin.jpg" alt="" className='admin_pic' height={175} />
      </div>

      <hr />

      <div className="chart">
        <div className='barchart'>
          <h2 className='text-center'>User Registration Chart</h2>
          <canvas id="userRegistrationChart" width="500" height="500"></canvas>
        </div>
        <div className="top_dashboard">
          <h3>Total User: </h3>
          <p>10</p>
        </div>

      </div>

      <hr />

      <div className="head_dashboard">


        <div className='piechart'>
          <h2 className='text-center'>Blog Overview</h2>
          <canvas id="blogPieChart" width="500" height="500"></canvas>
        </div>

        <div className="adminblog_info">

        <div className="top_dashboard">
          <h3>Total blogs:</h3>
          <p>10</p>
        </div>

        <div className="top_dashboard">
          <h3>Total Like:</h3>
          <p>10</p>
        </div>

        <div className="top_dashboard">
          <h3>Total Comment:</h3>
          <p>10</p>
        </div>
        </div>



      </div>
    </>
  );
}

export default AdminDashboard;
