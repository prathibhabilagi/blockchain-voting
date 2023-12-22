const calculateTimeRemaining = (targetTimestamp) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeRemaining = targetTimestamp - currentTime;
    return timeRemaining > 0 ? timeRemaining : 0;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  };
export {calculateTimeRemaining, formatTime}
