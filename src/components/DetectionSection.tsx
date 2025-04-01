
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, AlertCircle, Shield, Database, Scan, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import ImageDetection from './ImageDetection';
import WebcamDetection from './WebcamDetection';
import { processImage, DetectionResult } from '@/services/faceRecognitionService';
import { Card, CardContent } from './ui/card';

const DetectionSection = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
          processImageData(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "INVALID FILE TYPE",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };
  
  const processImageData = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      const result = await processImage(imageData);
      setDetectionResult(result);
      
      toast({
        title: "DETECTION COMPLETE",
        description: `Found ${result.faces.length} face(s) in ${result.processingTime}`,
      });
    } catch (error) {
      toast({
        title: "DETECTION FAILED",
        description: "There was an error processing your image",
        variant: "destructive",
      });
      console.error("Detection error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const resetDetection = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  return (
    <section id="detection-section" className="py-16 px-6 relative">
      <div className="absolute inset-0 retro-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 mb-4 retro-border cyber-box">
            <Scan className="text-accent mr-2 animate-pulse" size={24} />
            <span className="font-vt323 text-lg tracking-widest">ADVANCED DETECTION SYSTEM</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-press-start mb-6 gradient-text glitch">FACE ANALYSIS SYSTEM</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg font-space-mono">
            Upload an image or use your webcam to instantly detect faces with our OpenCV-powered recognition engine.
          </p>
        </div>
        
        <div className="glass-effect p-8 md:p-10 retro-border relative overflow-hidden">
          <div className="absolute inset-0 circuit-bg opacity-10 -z-10"></div>
          <div className="scanline opacity-20 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="retro-card p-4 flex flex-col items-center justify-center">
              <Shield className="text-secondary mb-4" size={32} />
              <h3 className="font-vt323 text-xl mb-1">SECURE PROCESSING</h3>
              <p className="text-center text-xs text-gray-500">All data is processed locally in your browser</p>
            </Card>
            
            <Card className="retro-card p-4 flex flex-col items-center justify-center">
              <FileCode className="text-accent mb-4" size={32} />
              <h3 className="font-vt323 text-xl mb-1">OPENCV POWERED</h3>
              <p className="text-center text-xs text-gray-500">Uses advanced facial recognition algorithms</p>
            </Card>
            
            <Card className="retro-card p-4 flex flex-col items-center justify-center">
              <Database className="text-primary mb-4" size={32} />
              <h3 className="font-vt323 text-xl mb-1">CELEBRITY DATABASE</h3>
              <p className="text-center text-xs text-gray-500">Matches against our database of known individuals</p>
            </Card>
          </div>
          
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 retro-border bg-white/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 scanline opacity-10"></div>
              <TabsTrigger value="upload" className="flex items-center gap-2 py-3 font-vt323 text-lg tracking-wider transition-all relative group data-[state=active]:bg-primary data-[state=active]:text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                <Upload size={18} />
                <span className="font-medium">UPLOAD IMAGE</span>
              </TabsTrigger>
              <TabsTrigger value="webcam" className="flex items-center gap-2 py-3 font-vt323 text-lg tracking-wider transition-all relative group data-[state=active]:bg-primary data-[state=active]:text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
                <Camera size={18} />
                <span className="font-medium">USE WEBCAM</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              {!selectedImage ? (
                <div 
                  className="border-4 border-double border-primary/30 p-10 text-center cursor-pointer hover:border-accent transition-colors retro-card noise-effect"
                  onClick={handleUploadClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="bg-gradient-to-br from-primary/30 to-accent/30 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center retro-border shadow-inner">
                    <Upload size={56} className="text-primary/70 animate-pulse-light" />
                  </div>
                  <h3 className="text-2xl font-vt323 tracking-wider mb-3 gradient-text">UPLOAD AN IMAGE</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto font-space-mono">
                    Drag and drop an image here or click to browse. Supported formats: JPG, PNG, WEBP
                  </p>
                  
                  <div className="mt-8 grid grid-cols-3 gap-2 max-w-md mx-auto">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-gray-100/50 retro-border opacity-50"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <ImageDetection 
                  imageUrl={selectedImage} 
                  detectionResult={detectionResult} 
                  isProcessing={isProcessing} 
                  onReset={resetDetection}
                />
              )}
            </TabsContent>
            
            <TabsContent value="webcam">
              <WebcamDetection />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-white/30 backdrop-blur-md rounded-sm retro-border shadow-inner">
            <AlertCircle size={14} className="text-accent mr-2" />
            <p className="text-sm text-gray-600 font-space-mono">
              Your privacy is important - all processing is done in your browser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
