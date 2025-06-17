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
        d="M0,160L30,176C60,192,120,224,180,218.7C240,213,300,171,360,160C420,149,480,171,540,160C600,149,660,107,720,128C780,149,840,235,900,256C960,277,1020,235,1080,208C1140,181,1200,171,1260,144C1320,117,1380,75,1410,53.3L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
      />
    </svg>
  );
};

export default WaveUp;
