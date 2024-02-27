import React from 'react';

const Chart = ({ fill = '#D7DBDF', width = 24, className = '', viewBox = '0 0 49 48' }) => (
  <svg
    width={width}
    height={width}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.3224 2.69424C34.9975 2.01676 36.0151 1.81372 36.8986 2.1801L43.5954 4.95701C44.7949 5.4544 45.3675 6.82726 44.8768 8.02956L42.1445 14.7248C41.7835 15.6094 40.9248 16.1891 39.9693 16.1934C39.014 16.1977 38.1503 15.6256 37.7815 14.7442L36.7003 12.1611L9.51308 23.7811C8.31427 24.2935 6.92706 23.737 6.41468 22.5382C5.9023 21.3394 6.45875 19.9522 7.65759 19.4398L34.8773 7.80587L33.8168 5.27207C33.4475 4.38971 33.6472 3.37172 34.3224 2.69424Z"
      fill="#3E63DD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.9868 19.2466C43.8216 19.2466 44.6223 19.5782 45.2124 20.1685C45.8026 20.7587 46.1343 21.5593 46.1343 22.394V44.4263C46.1343 45.2953 45.4296 46 44.5606 46H36.6919C35.8229 46 35.1182 45.2953 35.1182 44.4263V22.394C35.1182 21.5593 35.4499 20.7587 36.0401 20.1685C36.6302 19.5782 37.4309 19.2466 38.2656 19.2466H42.9868ZM27.2495 23.9678C28.0843 23.9678 28.8849 24.2994 29.4751 24.8897C30.0654 25.4799 30.397 26.2805 30.397 27.1152V44.4263C30.397 45.2953 29.6924 46 28.8233 46H20.9546C20.0855 46 19.3809 45.2953 19.3809 44.4263V27.1152C19.3809 26.2805 19.7125 25.4799 20.3027 24.8897C20.893 24.2994 21.6936 23.9678 22.5283 23.9678H27.2495ZM13.7378 29.6109C13.1475 29.0206 12.347 28.689 11.5122 28.689H6.79102C5.95626 28.689 5.15569 29.0206 4.56542 29.6109C3.97516 30.2011 3.64355 31.0017 3.64355 31.8364V44.4263C3.64355 45.2953 4.34814 46 5.21729 46H13.0859C13.9551 46 14.6597 45.2953 14.6597 44.4263V31.8364C14.6597 31.0017 14.3281 30.2011 13.7378 29.6109Z"
      fill={fill}
    />
  </svg>
);

export default Chart;
