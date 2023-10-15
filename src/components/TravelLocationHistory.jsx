import React, { useEffect, useRef, useState } from 'react';
import { config } from '../utils/helpers';
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Slider, Typography } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import LocationHistoryService from '../services/locationHistoryService';
import sportCar from '../assets/sport-car.png';

function TravelLocationHistory() {
  const secretGoogleMapsApiKey = config('GOOGLE_MAPS_API_KEY');
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: secretGoogleMapsApiKey });
  const [map, setMap] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [carRotation, setCarRotation] = useState(0);
  const [isAnimate, setIsAnimate] =  useState(false);
  const animationSpeedRef = useRef(1000);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (AuthService.logout()) {
      cancelAnimationFrame(animationFrameRef.current);
      navigate('/login');
    }
  };

  const vehicle = {
    VehicleId: 123,
    VehicleNo: 'MCUSA-74001',
    StartDate: '2023-02-27 00:00:00',
    EndDate: '2023-02-28 23:59:59',
  };

  useEffect(() => {
    LocationHistoryService.searchVehicleLocationHistory(vehicle)
      .then((resp) => {
        const formattedData = resp.data.data.historyData.map(item => {
          const { lat, lon: lng, tracktime } = item;
          return { lat, lng, tracktime };
        });
        // console.log(formattedData);        
        setPathData(formattedData);
      })
      .catch((err) => {
        console.log('error=', err);
      });
  }, []);

  const handleSpeedChange = (event, newValue) => {
    setAnimationSpeed(newValue);
    animationSpeedRef.current = newValue;
    // console.log('speed change=',newValue,' current=',animationSpeed,' interval=',animationInterval)
  };

  const animateCar = () => {
    // console.log('animate car=',map)
    if (!map || carPosition === null) return;

    const totalSteps = pathData.length - 1;
    let currentStep = 0;

    const animateStep = () => {
      if (currentStep < totalSteps) {
        const newPosition = pathData[currentStep];
        setCarPosition(newPosition);

        const nextPosition = pathData[currentStep + 1];
        const bearing = (Math.atan2(nextPosition.lng - newPosition.lng, nextPosition.lat - newPosition.lat) * 180) / Math.PI;
        // console.log('bearing=',bearing)
        setCarRotation(bearing);

        map.panTo(newPosition);
        map.setZoom(15);

        currentStep += 1;

        animationFrameRef.current = requestAnimationFrame(() => {
          setTimeout(animateStep, 10000 / animationSpeedRef.current);
        });
        
        
      } else {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    animateStep();
    setIsAnimate(true)
  };

  const handleStartAnimation = () => {
    setCarPosition(pathData[0]);
    animateCar();
  };

  const handleStopAnimation = () => {
    // console.log('before stop interval=',animationFrameRef.current)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      setCarPosition(pathData[0]);
      map.panTo(center);
      map.setZoom(12);
      setIsAnimate(false)
    }
  };

  useEffect(() => {
    // console.log('map effect=',map)
    if (map && pathData) {
      //  console.log('found map effect=',map)

      setCarPosition(pathData[0]);
    }
  }, [map, pathData]);

  const [center, setCenter] = useState(false);

  const calculateCenter = (pathData) => {
    if(!center){
      let minLat = Number.MAX_VALUE;
      let maxLat = -Number.MAX_VALUE;
      let minLng = Number.MAX_VALUE;
      let maxLng = -Number.MAX_VALUE;
    
      pathData.forEach((point) => {
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
        minLng = Math.min(minLng, point.lng);
        maxLng = Math.max(maxLng, point.lng);
      });
    
      const center = {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2,
      };
      setCenter(center);
      // console.log('center1',center)
      return center;
    }
    return center;
  };

  return (
    <React.Fragment>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', float: 'right' }}>
        <button type="button" onClick={() => handleLogout()}>
          Logout
        </button>
      </Box>
      <div style={{  }}>
        <button onClick={handleStartAnimation} disabled={!pathData ? true : isAnimate}>Start Animation</button>
        <button onClick={handleStopAnimation} disabled={!isAnimate} style={{marginLeft:'10px'}}>Stop Animation</button>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <Typography>Min:100</Typography>
          <Slider
            aria-labelledby="speed-slider-label"
            value={animationSpeed}
            min={100}
            max={3000}
            step={100}
            onChange={handleSpeedChange}
            style={{margin:'10px'}}
            disabled={!pathData ? true : isAnimate}
          />
          <Typography>Max:3000</Typography>
          <Typography style={{marginLeft:'10px'}}>Speed:{animationSpeed}</Typography>
      </div>
      </div>
      {!isLoaded ? <>Loading...</> : (
        <Container maxWidth="xl">
          <Box sx={{ bgcolor: '#cfe8fc', height: '460px', width: '100vh' }}>
              <GoogleMap
                center={pathData && pathData.length > 0 ? calculateCenter(pathData) : {lat: 20.5937, lng: 78.9629}} // Calculate and set the center
                zoom={pathData ? 12 : 2}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => setMap(map)}
              >
                {pathData && <>
                <Marker
                  position={pathData[0]}
                  title={`Start: ${pathData[0].tracktime}`}
                  label={'A'}
                />
                <Marker
                  position={pathData[pathData.length - 1]}
                  title={`End: ${pathData[pathData.length - 1].tracktime}`}
                  label={'B'}
                />
                <Polyline
                  path={pathData}
                  options={{
                    strokeColor: '#01579b',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  }}
                />
                </>
                }
                {/* {console.log('car pos=', carPosition)} */}
                {carPosition && <Marker
                  position={carPosition}
                  icon={{
                    url: sportCar,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  rotation={carRotation}
                />
                }
              </GoogleMap>
          </Box>
        </Container>
      )}
    </React.Fragment>
  );
}

export default TravelLocationHistory;
