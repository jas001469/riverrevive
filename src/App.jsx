import React, { useState, useEffect } from 'react';

function App() {
  const [selectedJunction, setSelectedJunction] = useState(1); // Default to Junction 1
  const [currentTime, setCurrentTime] = useState(new Date()); // State for current time
  const [isDarkMode, setIsDarkMode] = useState(true); // State for dark/light mode
  const [sensorData, setSensorData] = useState({
    turbidity: 0,
    tds: 0,
    flow1: 0,
    flow2: 0,
    timestamp: new Date().toISOString()
  });
  const [prediction, setPrediction] = useState({
    predicted_days: 0,
    alert: false,
    status: 'Loading...'
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('error');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch sensor data and predictions every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      if (backendStatus !== 'connected') {
        setError('Backend server not connected');
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        
        // Fetch sensor data
        const sensorResponse = await fetch('http://localhost:8000/sensor-data');
        if (!sensorResponse.ok) {
          throw new Error(`Sensor data error: ${sensorResponse.status}`);
        }
        const newSensorData = await sensorResponse.json();
        
        // Validate sensor data
        if (!newSensorData || typeof newSensorData !== 'object') {
          throw new Error('Invalid sensor data format');
        }

        // Always update sensor data to ensure fresh values
        setSensorData(newSensorData);
        setLastUpdate(new Date());

        // Get prediction from ML model
        const predictionResponse = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSensorData)
        });
        
        if (!predictionResponse.ok) {
          throw new Error(`Prediction error: ${predictionResponse.status}`);
        }
        
        const predictionData = await predictionResponse.json();
        setPrediction(predictionData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setPrediction({
          predicted_days: 0,
          alert: true,
          status: '⚠️ Error fetching data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();
    
    // Set up interval for subsequent fetches
    const interval = setInterval(fetchData, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [backendStatus]); // Only depend on backendStatus

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate choke level percentage
  const calculateChokeLevel = (predictedDays) => {
    const maxDays = 10; // Maximum days before full choke
    return Math.min(100, Math.max(0, ((maxDays - predictedDays) / maxDays) * 100));
  };

  // Get alert color based on prediction
  const getAlertColor = (predictedDays) => {
    if (predictedDays < 2) return '#ff0000'; // Red for critical
    if (predictedDays < 5) return '#ffa500'; // Orange for warning
    return '#00ff00'; // Green for normal
  };

  // Data for each junction
  const junctionData = {
    1: {
      name: "Junction 1 (Wazirabad)",
      flowRate: `${sensorData.flow1.toFixed(2)} L/min`,
      turbidity: `${sensorData.turbidity.toFixed(2)} NTU`,
      tds: `${sensorData.tds.toFixed(2)}%`,
      chokeTime: `${prediction.predicted_days.toFixed(2)} days`,
      lastMaintenance: "2 days ago",
      tdsPpm: `${sensorData.tds.toFixed(2)} ppm`,
      chokeLevel: `${calculateChokeLevel(prediction.predicted_days).toFixed(2)}%`
    },
    2: {
      name: "Junction 2 (Nizamuddin)",
      flowRate: `${sensorData.flow2.toFixed(2)} L/min`,
      turbidity: `${sensorData.turbidity.toFixed(2)} NTU`,
      tds: `${sensorData.tds.toFixed(2)}%`,
      chokeTime: `${prediction.predicted_days.toFixed(2)} days`,
      lastMaintenance: "1 day ago",
      tdsPpm: `${sensorData.tds.toFixed(2)} ppm`,
      chokeLevel: `${calculateChokeLevel(prediction.predicted_days).toFixed(2)}%`
    },
    3: {
      name: "Junction 3 (Okhla)",
      flowRate: `${sensorData.flow1.toFixed(2)} L/min`,
      turbidity: `${sensorData.turbidity.toFixed(2)} NTU`,
      tds: `${sensorData.tds.toFixed(2)}%`,
      chokeTime: `${prediction.predicted_days.toFixed(2)} days`,
      lastMaintenance: "3 days ago",
      tdsPpm: `${sensorData.tds.toFixed(2)} ppm`,
      chokeLevel: `${calculateChokeLevel(prediction.predicted_days).toFixed(2)}%`
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
        <div style={{
          ...smallText,
          color: backendStatus === 'connected' ? '#00ff00' : '#ff0000'
        }}>
          Status: {backendStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div style={smallText}>
          Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
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

      {error && (
        <div style={{
          ...cardStyle,
          backgroundColor: isDarkMode ? '#4a1c1c' : '#ffebee',
          color: '#ff0000',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Loading data...
        </div>
      ) : (
        <>
          {/* Top Stats */}
          <div style={rowStyle}>
            <div style={cardStyle}>
              <div style={smallText}>Avg. Turbidity</div>
              <h2>{sensorData.turbidity.toFixed(2)} <span style={{ fontSize: '14px' }}>NTU</span></h2>
            </div>
            <div style={cardStyle}>
              <div style={smallText}>Avg. TDS Level</div>
              <h2>{sensorData.tds.toFixed(2)}</h2>
            </div>
            <div style={cardStyle}>
              <div style={smallText}>Overall Choke Level</div>
              <h2>{calculateChokeLevel(prediction.predicted_days).toFixed(2)}%</h2>
            </div>
            <div style={cardStyle}>
              <div style={smallText}>Time to Next Maintenance</div>
              <h2>~{prediction.predicted_days.toFixed(2)} days</h2>
            </div>
          </div>

          {/* Alert Status */}
          <div style={{
            ...cardStyle,
            backgroundColor: getAlertColor(prediction.predicted_days),
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h2>{prediction.status}</h2>
            <div style={smallText}>
              Predicted days until clogging: {prediction.predicted_days.toFixed(2)}
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
        </>
      )}
    </div>
  );
}

export default App;

