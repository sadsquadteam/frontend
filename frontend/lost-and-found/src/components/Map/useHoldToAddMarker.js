import { useRef, useState, useCallback } from 'react';

export const useHoldToAddMarker = () => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [pendingMarkerPosition, setPendingMarkerPosition] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isHoldingRef = useRef(false);
  const holdStartTimeRef = useRef(null);

  const startHold = useCallback((lat, lng) => {
    isHoldingRef.current = true;
    holdStartTimeRef.current = Date.now();
    setHoldProgress(0);
    
    // Clear any existing timers
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    // Update progress every 100ms
    progressIntervalRef.current = setInterval(() => {
      if (isHoldingRef.current && holdStartTimeRef.current) {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min((elapsed / 5000) * 100, 100);
        setHoldProgress(progress);
        
        if (progress >= 100) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 100);
    
    // Set timeout for 5 seconds
    holdTimerRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        setPendingMarkerPosition([lat, lng]);
        setShowAddItemModal(true);
        setHoldProgress(0);
      }
    }, 5000);
  }, []);

  const cancelHold = useCallback(() => {
    isHoldingRef.current = false;
    setHoldProgress(0);
    
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowAddItemModal(false);
    setPendingMarkerPosition(null);
  }, []);

  const handleItemCreated = useCallback((itemData, markers, setMarkers) => {
    if (pendingMarkerPosition) {
      const newMarker = {
        id: Date.now(),
        position: pendingMarkerPosition,
        title: itemData.title,
        description: itemData.description,
        status: itemData.status,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMarkers(prev => [...prev, newMarker]);
    }
    
    handleModalClose();
  }, [pendingMarkerPosition, handleModalClose]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  return {
    holdProgress,
    pendingMarkerPosition,
    showAddItemModal,
    startHold,
    cancelHold,
    handleModalClose,
    handleItemCreated,
    setShowAddItemModal,
    setPendingMarkerPosition,
    cleanup
  };
};