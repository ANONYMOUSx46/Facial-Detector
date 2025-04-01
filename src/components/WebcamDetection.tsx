
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCcw, User, Search } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { processWebcamFrame, DetectionResult, DetectedFace } from '@/services/faceRecognitionService';
import { Progress } from './ui/progress';

const WebcamDetection = () => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Handle search progress animation
  useEffect(() => {
    // Simulate search progress if a new face was found
    if (detectionResult?.searchInitiated) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setSearchProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [detectionResult]);
  
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsWebcamActive(true);
          
          // Start face detection
          startDetection();
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast({
        title: "WEBCAM ACCESS DENIED",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };
  
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    setIsWebcamActive(false);
    setIsDetecting(false);
    setDetectionResult(null);
    setSearchProgress(0);
  };
  
  const startDetection = async () => {
    setIsDetecting(true);
    try {
      const result = await processWebcamFrame(videoRef.current);
      setDetectionResult(result);
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "DETECTION FAILED",
        description: "There was an error analyzing the webcam feed",
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Get scaled coordinates for face boxes
  const getScaledCoords = (face: DetectedFace) => {
    if (!detectionResult?.imageWidth || !detectionResult?.imageHeight) {
      return { x: face.x, y: face.y, width: face.width, height: face.height };
    }
    
    const containerWidth = containerRef.current?.clientWidth || 640;
    const containerHeight = containerRef.current?.clientHeight || 360;
    
    const scaleX = containerWidth / detectionResult.imageWidth;
    const scaleY = containerHeight / detectionResult.imageHeight;
    
    return {
      x: face.x * scaleX,
      y: face.y * scaleY,
      width: face.width * scaleX,
      height: face.height * scaleY
    };
  };

  // Get scaled coordinates for face landmarks
  const getScaledLandmark = (landmark: {x: number, y: number}, faceX: number, faceY: number) => {
    if (!detectionResult?.imageWidth || !detectionResult?.imageHeight) {
      return { x: landmark.x, y: landmark.y };
    }
    
    const containerWidth = containerRef.current?.clientWidth || 640;
    const containerHeight = containerRef.current?.clientHeight || 360;
    
    const scaleX = containerWidth / detectionResult.imageWidth;
    const scaleY = containerHeight / detectionResult.imageHeight;
    
    return {
      x: landmark.x * scaleX,
      y: landmark.y * scaleY
    };
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-[640px] aspect-video bg-gray-900 overflow-hidden mx-auto retro-card vhs-effect"
      >
        <div className="scanline"></div>
        
        {!isWebcamActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white retro-grid">
            <CameraOff size={48} className="mb-4 opacity-60" />
            <p className="text-lg mb-4 font-vt323 tracking-wider">WEBCAM NOT ACTIVE</p>
            <Button onClick={startWebcam} className="flex items-center gap-2 bg-gradient-to-r from-accent to-secondary hover:opacity-90 transition-opacity retro-button">
              <Camera size={16} />
              <span className="font-vt323 tracking-wider">START WEBCAM</span>
            </Button>
          </div>
        ) : (
          <div className="relative">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            ></video>
            
            <canvas 
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            ></canvas>
            
            {isDetecting && !detectionResult && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-sm text-sm flex items-center gap-2 retro-border">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <span className="font-vt323 tracking-wider">DETECTING...</span>
              </div>
            )}
            
            {detectionResult && detectionResult.faces && detectionResult.faces.map((face: DetectedFace, index: number) => {
              const { x, y, width, height } = getScaledCoords(face);
              return (
                <div 
                  key={index}
                  className="face-detection-box pulse-border" 
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className="highlight-dot top-0 left-0" />
                  <div className="highlight-dot top-0 right-0" />
                  <div className="highlight-dot bottom-0 left-0" />
                  <div className="highlight-dot bottom-0 right-0" />
                  
                  {/* Face landmarks - these would be positioned accurately in a real OpenCV implementation */}
                  {face.landmarks && face.landmarks.map((landmark, landmarkIdx) => {
                    const { x: lx, y: ly } = getScaledLandmark(landmark, x, y);
                    return (
                      <div 
                        key={`landmark-${landmarkIdx}`} 
                        className="face-landmark" 
                        style={{ left: `${lx-x}px`, top: `${ly-y}px` }}
                      />
                    );
                  })}
                  
                  {face.confidence && (
                    <div className="absolute -top-8 left-0 bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 rounded-sm shadow-lg retro-border">
                      <span className="font-vt323 tracking-wider">{Math.round(face.confidence * 100)}% MATCH</span>
                    </div>
                  )}
                  {face.matchedPerson && (
                    <div className="face-match-badge retro-border">
                      {face.matchedPerson.isFamous ? '⭐ ' : ''}
                      <span className="font-vt323 tracking-wider">ID: {face.matchedPerson.name.split(' ')[0]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {isWebcamActive && detectionResult?.searchInitiated && (
        <div className="mt-6 w-full max-w-[640px]">
          <div className="mb-4 p-4 retro-card">
            <div className="flex items-center gap-2 mb-3">
              <Search className="text-accent animate-pulse" size={20} />
              <h4 className="font-vt323 text-xl tracking-wider">INTERNET SEARCH</h4>
            </div>
            
            {searchProgress < 100 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-space-mono">Searching internet database for facial matches...</p>
                <Progress value={searchProgress} className="h-2 retro-border" />
              </div>
            ) : (
              <p className="text-sm text-gray-600 font-space-mono">Search completed</p>
            )}
          </div>
        </div>
      )}
      
      {isWebcamActive && detectionResult && detectionResult.faces.some(face => face.matchedPerson) && (
        <div className="mt-4 w-full max-w-[640px]">
          <h3 className="text-xl font-press-start mb-4 gradient-text">MATCHED PROFILES</h3>
          <div className="space-y-4">
            {detectionResult.faces
              .filter(face => face.matchedPerson)
              .map((face, index) => (
                <div key={index} className="matched-person retro-card">
                  <div className="match-result">
                    <div className={`match-avatar ${face.matchedPerson?.isFamous ? 'bg-gradient-to-r from-retro-pink to-retro-cyan' : ''}`}>
                      <User size={24} />
                    </div>
                    <div className="match-details">
                      <div className="match-name">
                        {face.matchedPerson!.name}
                        {face.matchedPerson?.isFamous && (
                          <span className="ml-2 inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 retro-border">
                            <span className="font-vt323">CELEBRITY</span>
                          </span>
                        )}
                      </div>
                      <div className="match-confidence text-gray-600 font-space-mono">{face.matchedPerson!.role}</div>
                    </div>
                    <div className="match-percentage font-bold text-primary font-vt323">
                      {Math.round(face.matchedPerson!.confidence * 100)}% MATCH
                    </div>
                  </div>
                  
                  {face.matchedPerson?.similarCelebrities && face.matchedPerson.similarCelebrities.length > 0 && (
                    <div className="mt-4 ml-12">
                      <h4 className="text-sm font-semibold mb-2 font-vt323">SIMILAR PROFILES</h4>
                      <div className="space-y-2">
                        {face.matchedPerson.similarCelebrities.map((celebrity, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm retro-border">
                            <span className="text-sm font-space-mono">{celebrity.name}</span>
                            <span className="text-xs font-medium text-gray-600 font-vt323">
                              {Math.round(celebrity.similarity * 100)}% SIMILAR
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}
      
      {isWebcamActive && (
        <div className="mt-6 flex justify-center gap-4">
          <Button 
            variant="destructive" 
            onClick={stopWebcam}
            className="flex items-center gap-2 retro-button font-vt323 tracking-wider"
          >
            <CameraOff size={16} />
            <span>STOP WEBCAM</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setDetectionResult(null);
              setSearchProgress(0);
              startDetection();
            }}
            className="flex items-center gap-2 retro-button font-vt323 tracking-wider hover:bg-primary hover:text-white"
            disabled={!isWebcamActive || isDetecting}
          >
            <RefreshCcw size={16} />
            <span>RESTART SCAN</span>
          </Button>
        </div>
      )}
      
      <p className="mt-4 text-sm text-gray-500 text-center font-space-mono">
        For privacy reasons, no data is sent to any server. All processing happens locally in your browser.
      </p>
    </div>
  );
};

export default WebcamDetection;
