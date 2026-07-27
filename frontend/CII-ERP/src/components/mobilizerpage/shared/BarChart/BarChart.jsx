import React, { useEffect, useState } from "react";
import "./BarChart.css";

/**
 * BarChart
 *
 * Dependency-free bar chart built with plain divs sized by inline
 * height percentages rather than a charting library, keeping this
 * shared component lightweight and easy to restyle. Generic over any
 * `[{ day, value }]` series (Weekly Calls today, any other weekly
 * metric later), so it lives in /shared.
 *
 * Bars grow from 0 -> their value on mount for a subtle entrance
 * animation (see .m-bar-chart__bar's `transition: height`).
 *
 * Props:
 *  - data: [{ day: string, value: number }]
 *  - maxValue: number   -> top of the y-axis scale (default 100)
 *  - step: number       -> gridline step (default 20)
 *  - color: string      -> CSS color for the bars (default brand navy)
 */
const BarChart = ({ data, maxValue = 100, step = 20, color = "#16214b" }) => {
  const [animate, setAnimate] = useState(false);
  const ySteps = [];
  for (let v = maxValue; v >= 0; v -= step) ySteps.push(v);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="m-bar-chart">
      <div className="m-bar-chart__y-axis">
        {ySteps.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>

      <div className="m-bar-chart__plot">
        {ySteps.map((v) => (
          <div className="m-bar-chart__gridline" key={v} />
        ))}

        <div className="m-bar-chart__bars">
          {data.map((item) => (
            <div className="m-bar-chart__col" key={item.day}>
              <div
                className="m-bar-chart__bar"
                style={{
                  height: animate ? `${(item.value / maxValue) * 100}%` : "0%",
                  background: color,
                }}
                title={`${item.day}: ${item.value}`}
              />
              <span className="m-bar-chart__label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
