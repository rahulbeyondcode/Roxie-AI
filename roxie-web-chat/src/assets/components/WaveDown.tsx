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
        d="M0,128L60,106.7C120,85,240,43,360,48C480,53,600,107,720,138.7C840,171,960,181,1080,192C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      ></path>
    </svg>
  );
};

export default WaveDown;
