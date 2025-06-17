const WaveDown = ({
  startColor = "#f9f586",
  stopColor = "#96fbc4",
}: {
  startColor?: string;
  stopColor?: string;
}) => {
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color={startColor} />
          <stop offset="100%" stop-color={stopColor} />
        </linearGradient>
      </defs>

      <path
        fill="url(#waveGradient)"
        fill-opacity="1"
        d="M0,192L30,176C60,160,120,128,180,128C240,128,300,160,360,154.7C420,149,480,107,540,112C600,117,660,171,720,208C780,245,840,267,900,266.7C960,267,1020,245,1080,224C1140,203,1200,181,1260,149.3C1320,117,1380,75,1410,53.3L1440,32L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
      ></path>
    </svg>
  );
};

export default WaveDown;
