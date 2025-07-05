import React, { Suspense, useEffect } from "react";
import Canvas from '../utils/Canvas';

const Model = ({ btcRef }) => {

  useEffect(() => {
    if (btcRef.current && btcRef.current.model) {
      console.log('Model is already loaded.');
    } else {
      console.log('Model is initializing...');
    }

    return () => {
      if (btcRef.current?.model) {
        btcRef.current.model.dispose();
        btcRef.current = null;
        console.log('Model cleaned up');
      }
    };
  }, [btcRef]);

  return (
    <div className={`w-full min-h-[40vh] sm:top-0 top-7 sm:min-h-[50vh] md:h-full overflow-hidden relative flex items-center justify-center xl:scale-100 sm:scale-90`}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          scene="https://prod.spline.design/toBlmQipCMJXjajN/scene.splinecode"
          type3D="BTC"
          ref={btcRef}
        />
      </Suspense>
    </div>
  );
};

export default Model;