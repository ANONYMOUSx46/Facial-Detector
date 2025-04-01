
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCcw, User, Search } from 'lucide-react';
import { Button } from './ui/button';
import { DetectionResult, DetectedFace } from '@/services/faceRecognitionService';
import { Progress } from './ui/progress';

interface ImageDetectionProps {
  imageUrl: string;
  detectionResult: DetectionResult | null;
  isProcessing: boolean;
  onReset: () => void;
}

const ImageDetection = ({ imageUrl, detectionResult, isProcessing, onReset }: ImageDetectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  
  // Load image dimensions when image loads
  useEffect(() => {
    const handleImageLoad = () => {
      if (imageRef.current) {
        const { clientWidth, clientHeight, naturalWidth, naturalHeight } = imageRef.current;
        setImageDimensions({
          width: clientWidth,
          height: clientHeight,
          naturalWidth,
          naturalHeight
        });
      }
    };

    if (imageRef.current) {
      if (imageRef.current.complete) {
        handleImageLoad();
      } else {
        imageRef.current.addEventListener('load', handleImageLoad);
        return () => {
          imageRef.current?.removeEventListener('load', handleImageLoad);
        };
      }
    }
  }, [imageUrl]);
  
  useEffect(() => {
    if (detectionResult && containerRef.current) {
      // This would animate the face boxes in a real implementation
      // using GSAP or other animation libraries
    }
    
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
  
  // Get scaled coordinates for face boxes
  const getScaledCoords = (face: DetectedFace) => {
    if (!detectionResult?.imageWidth || !detectionResult?.imageHeight) {
      return { x: face.x, y: face.y, width: face.width, height: face.height };
    }
    
    const scaleX = imageDimensions.width / detectionResult.imageWidth;
    const scaleY = imageDimensions.height / detectionResult.imageHeight;
    
    return {
      x: face.x * scaleX,
      y: face.y * scaleY,
      width: face.width * scaleX,
      height: face.height * scaleY
    };
  };

  // Get scaled coordinates for face landmarks
  const getScaledLandmark = (landmark: {x: number, y: number}) => {
    if (!detectionResult?.imageWidth || !detectionResult?.imageHeight) {
      return { x: landmark.x, y: landmark.y };
    }
    
    const scaleX = imageDimensions.width / detectionResult.imageWidth;
    const scaleY = imageDimensions.height / detectionResult.imageHeight;
    
    return {
      x: landmark.x * scaleX,
      y: landmark.y * scaleY
    };
  };
  
  return (
    <div className="relative">
      <div ref={containerRef} className="relative overflow-hidden max-h-[500px] retro-card vhs-effect">
        <div className="scanline"></div>
        <img 
          ref={imageRef}
          src={imageUrl} 
          alt="Uploaded image" 
          className="w-full object-contain max-h-[500px]" 
        />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="retro-card p-6 bg-white/80 backdrop-blur-md shadow-xl flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-vt323 tracking-wider">ANALYZING FACES...</p>
            </div>
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
                const { x: lx, y: ly } = getScaledLandmark(landmark);
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
      
      <div className="mt-8">
        {detectionResult?.searchInitiated && (
          <div className="mb-6 p-4 retro-card">
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
        )}
        
        {detectionResult && detectionResult.faces && detectionResult.faces.some(face => face.matchedPerson) && (
          <div className="mb-6">
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
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2 retro-button font-vt323 tracking-wider hover:bg-primary hover:text-white transition-all duration-300"
          disabled={isProcessing}
        >
          <RefreshCcw size={16} />
          <span>TRY ANOTHER IMAGE</span>
        </Button>
      </div>
    </div>
  );
};

export default ImageDetection;
