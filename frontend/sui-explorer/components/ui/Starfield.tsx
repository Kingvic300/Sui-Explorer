import React from 'react';

const Starfield: React.FC = React.memo(() => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
    <div id="stars1" className="star-layer animate-twinkle" style={{ animationDuration: '7s' }}></div>
    <div id="stars2" className="star-layer animate-twinkle" style={{ animationDuration: '10s' }}></div>
    <div id="stars3" className="star-layer animate-twinkle" style={{ animationDuration: '15s' }}></div>
  </div>
));

export default Starfield;
