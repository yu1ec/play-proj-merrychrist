
import React, { useEffect, useRef } from 'react';
import { useGestureStore } from '../store/useGestureStore';

declare const Hands: any;
declare const Camera: any;

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setHandData = useGestureStore((state) => state.setHandData);
  const setCameraStatus = useGestureStore((state) => state.setCameraStatus);

  useEffect(() => {
    if (!videoRef.current) return;

    let cameraInstance: any = null;

    const startCamera = async () => {
      try {
        // 检查是否存在视频输入设备
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        
        if (!hasVideoDevice) {
          throw new Error("此设备未找到摄像头。");
        }

        const hands = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const d_index = Math.sqrt(Math.pow(landmarks[8].x - landmarks[0].x, 2) + Math.pow(landmarks[8].y - landmarks[0].y, 2));
            const d_pinky = Math.sqrt(Math.pow(landmarks[20].x - landmarks[0].x, 2) + Math.pow(landmarks[20].y - landmarks[0].y, 2));
            const isOpen = d_index > 0.4 || d_pinky > 0.4;
            
            setHandData({
              isOpen,
              x: landmarks[9].x,
              y: landmarks[9].y,
              confidence: 1.0
            });
          } else {
            setHandData({ isOpen: false, x: 0.5, y: 0.5, confidence: 0 });
          }
        });

        cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: { ideal: 640 },
          height: { ideal: 480 }
        });

        await cameraInstance.start();
        setCameraStatus(true, null);
      } catch (err: any) {
        console.warn("摄像头初始化失败:", err);
        setCameraStatus(false, err.message || "摄像头访问被拒绝或未找到设备。");
      }
    };

    startCamera();

    return () => {
      if (cameraInstance) {
        cameraInstance.stop();
      }
    };
  }, [setHandData, setCameraStatus]);

  return (
    <div className="fixed bottom-4 right-4 w-40 h-30 bg-black/50 border border-[#D4AF37]/50 rounded overflow-hidden z-[100] pointer-events-none opacity-0">
      <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline />
    </div>
  );
};

export default HandTracker;
