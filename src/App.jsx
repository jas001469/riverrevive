import React, { useState, useEffect } from 'react';

function App() {
  const [selectedJunction, setSelectedJunction] = useState(1); // Default to Junction 1
  const [currentTime, setCurrentTime] = useState(new Date()); // State for current time
  const [isDarkMode, setIsDarkMode] = useState(true); // State for dark/light mode

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Data for each junction
  const junctionData = {
    1: {
      name: "Junction 1 (Wazirabad)",
      flowRate: "180 L/min",
      turbidity: "92 NTU",
      pH: "6.9",
      tds: "72%",
      chokeTime: "5.2 hrs",
      lastMaintenance: "2 days ago",
      tdsPpm: "1045 ppm",
      chokeLevel: "72%"
    },
    2: {
      name: "Junction 2 (Nizamuddin)",
      flowRate: "210 L/min",
      turbidity: "85 NTU",
      pH: "7.1",
      tds: "65%",
      chokeTime: "7.5 hrs",
      lastMaintenance: "1 day ago",
      tdsPpm: "980 ppm",
      chokeLevel: "58%"
    },
    3: {
      name: "Junction 3 (Okhla)",
      flowRate: "165 L/min",
      turbidity: "110 NTU",
      pH: "6.7",
      tds: "81%",
      chokeTime: "3.8 hrs",
      lastMaintenance: "3 days ago",
      tdsPpm: "1200 ppm",
      chokeLevel: "81%"
    }
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#0E1323' : '#FFFFFF',
    minHeight: '100vh',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? '#1E2333' : '#f0f0f0',
    borderRadius: '12px',
    padding: '20px',
    flex: 1,
    margin: '10px',
    minHeight: '100px',
  };

  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const smallText = {
    color: isDarkMode ? '#aaa' : '#333',
    fontSize: '12px',
  };

  // Function to handle junction click
  const handleJunctionClick = (junctionNumber) => {
    setSelectedJunction(junctionNumber);
  };

  // Style for junction points
  const junctionPointStyle = (color, top, left, junctionNumber) => ({
    position: 'absolute',
    top: top,
    left: left,
    width: '12px',
    height: '12px',
    backgroundColor: color,
    borderRadius: '50%',
    border: selectedJunction === junctionNumber ? '2px solid white' : '2px solid transparent',
    cursor: 'pointer',
    zIndex: 2,
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'scale(1.2)'
    }
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: '20px' }}>🌊 RiverRevive</h1>
        <div style={smallText}>
          {currentTime.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </div>
        <button 
          style={{
            padding: '8px 12px',
            background: isDarkMode ? '#FFFFFF' : '#0E1323',
            color: isDarkMode ? '#000000' : '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Top Stats */}
      <div style={rowStyle}>
        <div style={cardStyle}>
          <div style={smallText}>Avg. Turbidity</div>
          <h2>56 <span style={{ fontSize: '14px' }}>NTU</span></h2>
        </div>
        <div style={cardStyle}>
          <div style={smallText}>Avg. pH Level</div>
          <h2>7.3</h2>
        </div>
        <div style={cardStyle}>
          <div style={smallText}>Overall Choke Level</div>
          <h2>32%</h2>
        </div>
        <div style={cardStyle}>
          <div style={smallText}>Time to Next Maintenance</div>
          <h2>~18 h</h2>
        </div>
      </div>

      {/* Middle Section: Map + Unit Details */}
      <div style={rowStyle}>
        {/* Map Section */}
        <div style={{ ...cardStyle, flex: 1.5, minHeight: '220px' }}>
          <div style={smallText}>Yamuna River Map</div>
          <div style={{ 
            height: '150px', 
            marginTop: '10px', 
            backgroundColor: isDarkMode ? '#2a3547' : '#e0e0e0', 
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            background: isDarkMode ? 'linear-gradient(160deg, #1a3d7a, #4a8fe7)' : 'linear-gradient(160deg, #85c0f5, #c8e1f5)' 
          }}>
            {/* River Path */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '10%',
              width: '80%',
              height: '8px',
              background: '#4169E1',
              borderRadius: '5px',
              transform: 'rotate(-3deg)'
            }}></div>
            
            {/* Junction Points */}
            <div 
              style={junctionPointStyle('yellow', '25%', '30%', 1)}
              onClick={() => handleJunctionClick(1)}
            ></div>
            <div 
              style={junctionPointStyle('#00BFFF', '45%', '50%', 2)}
              onClick={() => handleJunctionClick(2)}
            ></div>
            <div 
              style={junctionPointStyle('#32CD32', '35%', '70%', 3)}
              onClick={() => handleJunctionClick(3)}
            ></div>
            
            {/* Legend */}
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'rgba(0,0,0,0.5)',
              padding: '5px',
              borderRadius: '4px',
              fontSize: '10px',
              color: 'white'
            }}>
              <div><span style={{color: 'yellow'}}>●</span> Wazirabad</div>
              <div><span style={{color: '#00BFFF'}}>●</span> Nizamuddin</div>
              <div><span style={{color: '#32CD32'}}>●</span> Okhla</div>
            </div>
          </div>
          
          <select 
            style={{ 
              marginTop: '10px', 
              width: '100%', 
              padding: '8px', 
              backgroundColor: isDarkMode ? '#2B2F42' : '#f0f0f0', 
              border: 'none', 
              color: isDarkMode ? 'white' : 'black' 
            }}
            value={selectedJunction}
            onChange={(e) => setSelectedJunction(parseInt(e.target.value))}
          >
            <option value={1}>Junction 1 (Wazirabad)</option>
            <option value={2}>Junction 2 (Nizamuddin)</option>
            <option value={3}>Junction 3 (Okhla)</option>
          </select>
        </div>

        {/* Selected Unit Details 1 */}
        <div style={cardStyle}>
          <div style={smallText}>Selected Unit: {junctionData[selectedJunction].name}</div>
          <p>Flow Rate: {junctionData[selectedJunction].flowRate}</p>
          <p>Turbidity: {junctionData[selectedJunction].turbidity}</p>
          <p>pH Level: {junctionData[selectedJunction].pH}</p>
          <p>TDS: {junctionData[selectedJunction].tds}</p>
          <p>Time till full choke: {junctionData[selectedJunction].chokeTime}</p>
        </div>

        {/* Selected Unit Details 2 */}
        <div style={cardStyle}>
          <div style={smallText}>Selected Unit Details</div>
          <p>Flow Rate: {junctionData[selectedJunction].flowRate}</p>
          <p>Turbidity: {junctionData[selectedJunction].turbidity}</p>
          <p>TDS: {junctionData[selectedJunction].tdsPpm}</p>
          <p>Choke Level: {junctionData[selectedJunction].chokeLevel}</p>
          <p>Last maintenance: {junctionData[selectedJunction].lastMaintenance}</p>
        </div>
      </div>

      {/* Warning - dynamic based on selected junction */}
<div style={{ 
  ...cardStyle, 
  backgroundColor: isDarkMode ? '#2B2F42' : '#f0f0f0', 
  color: '#ff0000', // Set text color to red
  textAlign: 'center' 
}}>
  {selectedJunction === 3 ? (
    <span>⚠️ Critical: Junction 3 (Okhla) has high pollution levels. Immediate action recommended.</span>
  ) : selectedJunction === 2 ? (
    <span>⚠️ Warning: Junction 2 (Nizamuddin) requires maintenance within 24 hours.</span>
  ) : (
    <span>⚠️ 3 filters predicted to clog within 6 hours. Pre-emptive cleaning recommended.</span>
  )}
</div>

      {/* Bottom Graphs */}
      <div style={rowStyle}>
        <div style={cardStyle}>
          <div style={smallText}>Choke %</div>
          <div style={{ 
            height: '100px', 
            backgroundColor: isDarkMode ? '#2B2F42' : '#f0f0f0', 
            borderRadius: '6px', 
            marginTop: '10px', 
            textAlign: 'center', 
            paddingTop: '35px',
            position: 'relative'
          }}>
            <div style={{
              width: `${junctionData[selectedJunction].chokeLevel}`,
              height: '30px',
              backgroundColor: junctionData[selectedJunction].chokeLevel > 70 ? '#ff5555' : '#55ff55',
              position: 'absolute',
              bottom: '35px',
              left: '10px',
              transition: 'all 0.5s ease'
            }}></div>
            {junctionData[selectedJunction].chokeLevel}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={smallText}>Flow Rate (L/min)</div>
          <div style={{ 
            height: '100px', 
            backgroundColor: isDarkMode ? '#2B2F42' : '#f0f0f0', 
            borderRadius: '6px', 
            marginTop: '10px', 
            textAlign: 'center', 
            paddingTop: '35px',
            position: 'relative'
          }}>
            <div style={{
              width: '80%',
              height: '30px',
              backgroundColor: '#5555ff',
              position: 'absolute',
              bottom: '35px',
              left: '10px'
            }}>
              <div style={{
                width: `${parseInt(junctionData[selectedJunction].flowRate) / 2.5}%`,
                height: '100%',
                backgroundColor: '#55aaff'
              }}></div>
            </div>
            {junctionData[selectedJunction].flowRate}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={smallText}>Turbidity (NTU)</div>
          <div style={{ 
            height: '100px', 
            backgroundColor: isDarkMode ? '#2B2F42' : '#f0f0f0', 
            borderRadius: '6px', 
            marginTop: '10px', 
            textAlign: 'center', 
            paddingTop: '35px',
            position: 'relative'
          }}>
            <div style={{
              width: '80%',
              height: '30px',
              backgroundColor: '#333',
              position: 'absolute',
              bottom: '35px',
              left: '10px'
            }}>
              <div style={{
                width: `${parseInt(junctionData[selectedJunction].turbidity) / 1.5}%`,
                height: '100%',
                backgroundColor: parseInt(junctionData[selectedJunction].turbidity) > 100 ? '#ff5555' : 
                               parseInt(junctionData[selectedJunction].turbidity) > 80 ? '#ffaa55' : '#55ff55'
              }}></div>
            </div>
            {junctionData[selectedJunction].turbidity}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

