import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VerticalBarChart({ problemByRating }) {
  const [data, setData] = React.useState(null);
  const [options, setOptions] = React.useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    console.log('Map data:', problemByRating);
    if (problemByRating && Array.from(problemByRating.keys()).length > 0) {
      const ratings = Array.from(problemByRating.keys()).sort((a, b) => a - b);
      setRatings(ratings);
      const maxProblems = Math.max(...problemByRating.values());
      console.log('Ratings:', ratings, maxProblems);

      setData({
        labels: ratings || [],
        datasets: [
          {
            label: 'Problems Solved',
            data: ratings.map((item) => problemByRating.get(item) || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
          },
        ],
      });

      setOptions({
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: maxProblems + Math.ceil(maxProblems / 10),
            ticks: {
              stepSize: Math.ceil(maxProblems / 10),
              callback: function (value) {
                return value;
              },
            },
            title: {
              display: true,
              text: 'Number of Problems Solved',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Problem Rating',
            },
          },
        },
      });
    } else {
      setData(null);
      setOptions(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemByRating]);

  useEffect(() => {
    console.log(data);
    console.log(options);
  }, [data, options]);

  return (
    <>
      {!data || !options ? (
        <div className="text-center text-gray-500">No data available</div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </>
  );
}
