'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import LoginDialog from './components/LoginDialog';

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <main>
        <Hero onStartClick={handleDialogOpen} isLoading={isLoading} />
        <Features />
        <CallToAction onButtonClick={handleDialogOpen} isLoading={isLoading} />
      </main>
      <LoginDialog open={openDialog} onClose={handleDialogClose} />
    </>
  );
}
