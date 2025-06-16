const WaveUp = ({
  startColor = "#f9f586",
  stopColor = "#96fbc4",
}: {
  startColor?: string;
  stopColor?: string;
}) => {
  return (
    <svg
      style={{ position: "absolute", bottom: 0, left: 0, zIndex: 0 }}
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
        d="M0,288L60,282.7C120,277,240,267,360,250.7C480,235,600,213,720,192C840,171,960,149,1080,160C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      />
    </svg>
  );
};

export default WaveUp;
