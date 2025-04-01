
import { toast } from '@/components/ui/use-toast';

// Mock database of known famous people
const knownFaces = [
  { 
    id: 1, 
    name: 'Emma Johnson', 
    role: 'Frontend Developer',
    imageFaceCoords: { x: 120, y: 80, width: 200, height: 200 },
    isFamous: false
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    role: 'Product Manager',
    imageFaceCoords: { x: 150, y: 100, width: 180, height: 180 },
    isFamous: false
  },
  { 
    id: 3, 
    name: 'Sarah Williams', 
    role: 'UX Designer',
    imageFaceCoords: { x: 130, y: 90, width: 190, height: 190 },
    isFamous: false
  },
  // Famous people database
  {
    id: 101,
    name: 'Elon Musk',
    role: 'CEO of Tesla & SpaceX',
    imageFaceCoords: { x: 140, y: 95, width: 195, height: 195 },
    isFamous: true
  },
  {
    id: 102,
    name: 'Taylor Swift',
    role: 'Singer-Songwriter',
    imageFaceCoords: { x: 135, y: 85, width: 185, height: 185 },
    isFamous: true
  },
  {
    id: 103,
    name: 'Leonardo DiCaprio',
    role: 'Actor',
    imageFaceCoords: { x: 145, y: 90, width: 190, height: 190 },
    isFamous: true
  },
  {
    id: 104,
    name: 'Beyoncé Knowles',
    role: 'Singer & Entrepreneur',
    imageFaceCoords: { x: 125, y: 82, width: 188, height: 188 },
    isFamous: true
  },
  {
    id: 105,
    name: 'Cristiano Ronaldo',
    role: 'Professional Footballer',
    imageFaceCoords: { x: 138, y: 88, width: 192, height: 192 },
    isFamous: true
  }
];

// Storage for learned faces
let learnedFaces: Array<{
  id: number,
  name: string,
  role: string,
  imageFaceCoords: { x: number, y: number, width: number, height: number },
  dateAdded: Date,
  isFamous: boolean
}> = [];

export type FaceLandmark = {
  x: number;
  y: number;
};

export type DetectedFace = {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: FaceLandmark[];
  matchedPerson?: {
    id: number;
    name: string;
    role: string;
    confidence: number;
    isFamous: boolean;
    similarCelebrities?: Array<{ name: string, similarity: number }>;
  };
};

export type DetectionResult = {
  faces: DetectedFace[];
  processingTime: string;
  newFaceId?: number;
  searchInitiated?: boolean;
  imageWidth?: number;
  imageHeight?: number;
};

// Generate facial landmarks 
const generateFaceLandmarks = (faceX: number, faceY: number, faceWidth: number, faceHeight: number): FaceLandmark[] => {
  // In a real implementation, these would come from OpenCV's facial landmark detector 
  // Here we simulate 68 facial landmarks (standard for many facial landmark models)
  const landmarks: FaceLandmark[] = [];
  
  // Eyebrows (10 points)
  for (let i = 0; i < 5; i++) {
    // Left eyebrow
    landmarks.push({
      x: faceX + faceWidth * (0.2 + 0.1 * i),
      y: faceY + faceHeight * 0.25
    });
    // Right eyebrow
    landmarks.push({
      x: faceX + faceWidth * (0.5 + 0.08 * i),
      y: faceY + faceHeight * 0.25
    });
  }
  
  // Eyes (12 points - 6 for each eye)
  // Left eye
  const leftEyeCenterX = faceX + faceWidth * 0.3;
  const leftEyeCenterY = faceY + faceHeight * 0.35;
  const eyeWidth = faceWidth * 0.15;
  const eyeHeight = faceHeight * 0.06;
  
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i;
    landmarks.push({
      x: leftEyeCenterX + Math.cos(angle) * eyeWidth / 2,
      y: leftEyeCenterY + Math.sin(angle) * eyeHeight / 2
    });
  }
  
  // Right eye
  const rightEyeCenterX = faceX + faceWidth * 0.7;
  const rightEyeCenterY = faceY + faceHeight * 0.35;
  
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i;
    landmarks.push({
      x: rightEyeCenterX + Math.cos(angle) * eyeWidth / 2,
      y: rightEyeCenterY + Math.sin(angle) * eyeHeight / 2
    });
  }
  
  // Nose (9 points)
  const noseTopX = faceX + faceWidth * 0.5;
  const noseTopY = faceY + faceHeight * 0.4;
  const noseWidth = faceWidth * 0.16;
  const noseHeight = faceHeight * 0.2;
  
  landmarks.push({ x: noseTopX, y: noseTopY }); // Nose top
  
  // Nose bridge
  for (let i = 1; i <= 3; i++) {
    landmarks.push({
      x: noseTopX,
      y: noseTopY + (noseHeight * i / 3)
    });
  }
  
  // Nose bottom
  for (let i = -2; i <= 2; i++) {
    landmarks.push({
      x: noseTopX + (noseWidth * i / 2),
      y: noseTopY + noseHeight
    });
  }
  
  // Mouth (20 points)
  const mouthCenterX = faceX + faceWidth * 0.5;
  const mouthCenterY = faceY + faceHeight * 0.7;
  const mouthWidth = faceWidth * 0.4;
  const mouthHeight = faceHeight * 0.1;
  
  // Outer mouth
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 / 12) * i;
    landmarks.push({
      x: mouthCenterX + Math.cos(angle) * mouthWidth / 2,
      y: mouthCenterY + Math.sin(angle) * mouthHeight / 2
    });
  }
  
  // Inner mouth
  const innerMouthWidth = mouthWidth * 0.7;
  const innerMouthHeight = mouthHeight * 0.7;
  
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i;
    landmarks.push({
      x: mouthCenterX + Math.cos(angle) * innerMouthWidth / 2,
      y: mouthCenterY + Math.sin(angle) * innerMouthHeight / 2
    });
  }
  
  // Jawline (17 points)
  const jawY = faceY + faceHeight * 0.85;
  
  for (let i = -8; i <= 8; i++) {
    // Create a curved jawline
    const jawX = faceX + faceWidth * (0.5 + (i / 16));
    const offset = Math.abs(i) / 8 * faceHeight * 0.15; // Curve down at the edges
    
    landmarks.push({
      x: jawX,
      y: jawY + offset
    });
  }
  
  // Add small random offsets to make landmarks look more natural
  return landmarks.map(landmark => ({
    x: landmark.x + (Math.random() - 0.5) * faceWidth * 0.02,
    y: landmark.y + (Math.random() - 0.5) * faceHeight * 0.02
  }));
};

// Simulate web search for similar celebrities
const findSimilarCelebrities = async (faceSignature: { x: number, y: number, width: number, height: number }) => {
  // In a real app, this would be an API call to a celebrity recognition service
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate random similar celebrities
  const celebrities = [
    'Brad Pitt', 'Scarlett Johansson', 'Dwayne Johnson', 'Emma Stone', 
    'Robert Downey Jr.', 'Jennifer Lawrence', 'Chris Hemsworth', 'Angelina Jolie',
    'Tom Cruise', 'Zendaya', 'Tom Hanks', 'Meryl Streep', 'Will Smith', 'Gal Gadot'
  ];
  
  const numCelebrities = Math.floor(Math.random() * 3) + 1; // 1-3 celebrities
  const results: Array<{ name: string, similarity: number }> = [];
  
  for (let i = 0; i < numCelebrities; i++) {
    const randomIndex = Math.floor(Math.random() * celebrities.length);
    const similarity = Math.random() * 0.25 + 0.6; // 60-85% similarity
    results.push({
      name: celebrities[randomIndex],
      similarity
    });
    
    // Remove selected celebrity from list to avoid duplicates
    celebrities.splice(randomIndex, 1);
  }
  
  return results;
};

// Learn a new face
export const learnNewFace = (faceData: { x: number, y: number, width: number, height: number }) => {
  const id = Date.now(); // Use timestamp as ID
  const newFace = {
    id,
    name: `Unknown #${learnedFaces.length + 1}`,
    role: 'New Profile',
    imageFaceCoords: faceData,
    dateAdded: new Date(),
    isFamous: false
  };
  
  learnedFaces.push(newFace);
  return id;
};

// Calculate facial features for precise facial detection
const calculateFacialFeatures = (imageData: string): Promise<{x: number, y: number, width: number, height: number}[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      // In a real app, we would use OpenCV.js for face detection
      // For this demo, we'll simulate more precise face detection
      
      const imageWidth = img.width;
      const imageHeight = img.height;
      
      // Simulate analyzing the image to find face regions
      // In a real app, this would use cv.detectMultiScale or similar OpenCV methods
      const faces: {x: number, y: number, width: number, height: number}[] = [];
      
      // Generate 1-2 realistic face positions based on image dimensions
      const numFaces = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < numFaces; i++) {
        // In a real app, these would be actual detected face coordinates
        // Golden ratio for face positioning: center of image with appropriate sizing
        const faceWidth = imageWidth * (0.15 + Math.random() * 0.1); // Face width is ~15-25% of image width
        const aspectRatio = 1.3 + (Math.random() * 0.1); // Faces are typically taller than wide
        const faceHeight = faceWidth * aspectRatio;
        
        // Position face in a realistic location (centered with some variation)
        let x, y;
        
        if (numFaces === 1) {
          // Center face with slight variation
          x = imageWidth * (0.5 - 0.5 * (faceWidth / imageWidth)) + (Math.random() * 0.1 - 0.05) * imageWidth;
          y = imageHeight * (0.4 - 0.5 * (faceHeight / imageHeight)) + (Math.random() * 0.1 - 0.05) * imageHeight;
        } else {
          // Position faces side by side with some spacing
          const spacing = imageWidth * 0.1;
          if (i === 0) {
            x = imageWidth * 0.25 - faceWidth / 2;
            y = imageHeight * 0.4 - faceHeight / 2;
          } else {
            x = imageWidth * 0.75 - faceWidth / 2;
            y = imageHeight * 0.4 - faceHeight / 2;
          }
          
          // Add some natural variation
          x += (Math.random() * 0.1 - 0.05) * imageWidth;
          y += (Math.random() * 0.1 - 0.05) * imageHeight;
        }
        
        faces.push({
          x: Math.max(0, Math.min(imageWidth - faceWidth, x)),
          y: Math.max(0, Math.min(imageHeight - faceHeight, y)),
          width: faceWidth,
          height: faceHeight
        });
      }
      
      resolve(faces);
    };
  });
};

// In a real application, this would use a proper face detection library like OpenCV.js
// or make API calls to a backend service
export const processImage = async (imageData: string): Promise<DetectionResult> => {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get image dimensions for scaling
    const img = new Image();
    img.src = imageData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    const imageWidth = img.width;
    const imageHeight = img.height;
    
    // Calculate precise facial features using OpenCV-style detection
    const facePositions = await calculateFacialFeatures(imageData);
    
    const faces: DetectedFace[] = [];
    let newFaceId: number | undefined = undefined;
    let searchInitiated = false;
    
    for (const facePos of facePositions) {
      const { x, y, width, height } = facePos;
      const confidence = 0.7 + Math.random() * 0.29; // 70-99% confidence
      
      // Generate facial landmarks
      const landmarks = generateFaceLandmarks(x, y, width, height);
      
      // Randomly match with a known person or famous person
      let matchedPerson = undefined;
      const faceCoords = { x, y, width, height };
      
      // 50% chance of being a famous person
      if (Math.random() > 0.5) { 
        const famousPeople = [...knownFaces, ...learnedFaces].filter(person => person.isFamous);
        if (famousPeople.length > 0) {
          const randomPerson = famousPeople[Math.floor(Math.random() * famousPeople.length)];
          const matchConfidence = 0.7 + Math.random() * 0.29; // 70-99% match confidence
          
          matchedPerson = {
            id: randomPerson.id,
            name: randomPerson.name,
            role: randomPerson.role,
            confidence: matchConfidence,
            isFamous: true
          };
        }
      } 
      // 30% chance of being a known non-famous person
      else if (Math.random() > 0.4) { 
        const nonFamousPeople = [...knownFaces, ...learnedFaces].filter(person => !person.isFamous);
        if (nonFamousPeople.length > 0) {
          const randomPerson = nonFamousPeople[Math.floor(Math.random() * nonFamousPeople.length)];
          const matchConfidence = 0.65 + Math.random() * 0.34; // 65-99% match confidence
          
          matchedPerson = {
            id: randomPerson.id,
            name: randomPerson.name,
            role: randomPerson.role,
            confidence: matchConfidence,
            isFamous: false
          };
        }
      } 
      // Unknown person - learn new face
      else {
        // Learn this new face
        newFaceId = learnNewFace(faceCoords);
        
        // Simulate finding similar celebrities
        const similarCelebrities = await findSimilarCelebrities(faceCoords);
        searchInitiated = true;
        
        matchedPerson = {
          id: newFaceId,
          name: `Unknown #${learnedFaces.length}`,
          role: 'New Profile',
          confidence: 0.98,
          isFamous: false,
          similarCelebrities
        };
      }
      
      faces.push({
        x,
        y,
        width,
        height,
        confidence,
        landmarks,
        matchedPerson
      });
    }

    return {
      faces,
      processingTime: (Math.random() * 0.5 + 0.2).toFixed(2) + 's',
      newFaceId,
      searchInitiated,
      imageWidth,
      imageHeight
    };
    
  } catch (error) {
    console.error("Face detection error:", error);
    toast({
      title: "DETECTION FAILED",
      description: "There was an error processing your image",
      variant: "destructive",
    });
    throw error;
  }
};

// Process webcam frames with improved precision using simulated OpenCV
export const processWebcamFrame = async (videoElement: HTMLVideoElement | null): Promise<DetectionResult> => {
  try {
    if (!videoElement) {
      throw new Error("Video element not available");
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get video dimensions
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    
    // In a real app, we would analyze the video frame with OpenCV to detect faces
    // For this demo, we'll create more realistic face coordinates
    const faceWidth = videoWidth * 0.2; // Face is about 20% of frame width
    const faceHeight = faceWidth * 1.35; // Typical face aspect ratio
    
    // Center the face with slight variation to make it more realistic
    const x = (videoWidth - faceWidth) / 2 + (Math.random() * 0.1 - 0.05) * videoWidth;
    const y = (videoHeight - faceHeight) / 2 + (Math.random() * 0.1 - 0.05) * videoHeight;
    
    // Generate facial landmarks for the detected face
    const landmarks = generateFaceLandmarks(x, y, faceWidth, faceHeight);
    
    const confidence = 0.96;
    
    // 40% chance to be a famous person, 30% chance to be a non-famous known person, 30% chance to be unknown
    let matchedPerson = undefined;
    let newFaceId = undefined;
    let searchInitiated = false;
    const random = Math.random();
    
    if (random > 0.6) {
      // Famous person
      const famousPeople = knownFaces.filter(person => person.isFamous);
      const randomPerson = famousPeople[Math.floor(Math.random() * famousPeople.length)];
      
      matchedPerson = {
        id: randomPerson.id,
        name: randomPerson.name,
        role: randomPerson.role,
        confidence: 0.75 + Math.random() * 0.24,
        isFamous: true
      };
    } else if (random > 0.3) {
      // Non-famous known person
      const nonFamousPeople = knownFaces.filter(person => !person.isFamous);
      const randomPerson = nonFamousPeople[Math.floor(Math.random() * nonFamousPeople.length)];
      
      matchedPerson = {
        id: randomPerson.id,
        name: randomPerson.name,
        role: randomPerson.role,
        confidence: 0.7 + Math.random() * 0.29,
        isFamous: false
      };
    } else {
      // Unknown person - learn new face
      const faceCoords = { x, y, width: faceWidth, height: faceHeight };
      newFaceId = learnNewFace(faceCoords);
      searchInitiated = true;
      
      // Find similar celebrities
      const similarCelebrities = await findSimilarCelebrities(faceCoords);
      
      matchedPerson = {
        id: newFaceId,
        name: `Unknown #${learnedFaces.length}`,
        role: 'New Profile',
        confidence: 0.98,
        isFamous: false,
        similarCelebrities
      };
    }
    
    const faces: DetectedFace[] = [{
      x,
      y,
      width: faceWidth,
      height: faceHeight,
      confidence,
      landmarks,
      matchedPerson
    }];
    
    return {
      faces,
      processingTime: '0.24s',
      newFaceId,
      searchInitiated,
      imageWidth: videoWidth,
      imageHeight: videoHeight
    };
    
  } catch (error) {
    console.error("Webcam face detection error:", error);
    throw error;
  }
};
