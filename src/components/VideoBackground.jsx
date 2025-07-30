// src/components/VideoBackground.jsx
// ** UPDATED FILE **
// This component now accepts a 'videoSrc' prop to dynamically change the video.

import React from 'react';

function VideoBackground({ videoSrc }) { // Receive videoSrc as a prop
  return (
    // The key={videoSrc} is important. It tells React to re-render the component
    // and reload the video when the source changes.
    <video autoPlay muted loop id="bg-video" key={videoSrc}>
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoBackground;
