
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Directly return a Navigate component to redirect to the auth page
  return <Navigate to="/" replace />;
};

export default Index;
