import { forwardRef, useEffect } from "react";
import { Application } from "@splinetool/runtime";
import useResponsive from "../hooks/useResponsive";

const Canvas = forwardRef(
  ({ className, scene, type3D, onLoad, ...props }, ref) => {
    const id = `canvas3d-${type3D}`;
    const {isMobile, isSmallMobile} = useResponsive()

    useEffect(() => {
      let spline = null;

      if (!ref.current?.model) {
        const canvas = document.getElementById(id);
        spline = new Application(canvas);

        spline
          .load(scene)
          .then(() => {
            console.log(`${type3D} loaded`);

            if(isMobile && !isSmallMobile) {
              spline._camera.scale.x = 1.6
              spline._camera.scale.y = 1.6
              spline._camera.scale.z = 1.6
            } else if (isSmallMobile) {
              spline._camera.scale.x = 2
              spline._camera.scale.y = 2
              spline._camera.scale.z = 2
            }

            ref.current = { model: spline, type3D };
            if (onLoad) onLoad();
          })
          .catch((error) => {
            console.error("Spline load error: ", error);
          });
      } else {
        console.log(`${type3D} is already loaded.`);
      }

      return () => {
        if (spline) {
          console.log("Disposing WebGL context for", type3D);
          spline.dispose();
          ref.current = null;
        }
      };
    }, [scene, ref]);

    return <canvas id={id} className={`${className ? className : ''} active:scale-95 transition-transform duration-300 touch-auto`}></canvas>;
  }
);

export default Canvas;