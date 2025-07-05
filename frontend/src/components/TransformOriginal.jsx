import React from "react";
import ImageLoader from "./ImageLoader";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { PiMagnifyingGlassPlus, PiMagnifyingGlassMinus, PiX } from "react-icons/pi";

const Controls = ({closeOriginal}) => {
    const { zoomIn, resetTransform } = useControls();

    return (
        <div className="absolute right-0 top-0 w-auto h-[50px] flex items-center justify-center mix-blend-difference z-[2]">
            <button onClick={() => zoomIn()} className="w-[50px] h-[50px] flex items-center justify-center group"><PiMagnifyingGlassPlus className="text-2xl group-hover:scale-x-[-1] transition-transform duration-300" /></button>
            <button onClick={() => resetTransform()} className="w-[50px] h-[50px] flex items-center justify-center group"><PiMagnifyingGlassMinus className="text-2xl group-hover:scale-x-[-1] transition-transform duration-300" /></button>
            <button onClick={closeOriginal} className="w-[50px] h-[50px] flex items-center justify-center group"><PiX className="text-2xl group-hover:rotate-90 transition-transform duration-300" /></button>
        </div>
    )
}

const TransformOriginal = ({ src, alt, closeOriginal }) => {
  return (
    <>
      <TransformWrapper maxScale={4}>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls closeOriginal={closeOriginal} />
            <TransformComponent>
              <ImageLoader containerStyles="h-full w-screen flex items-center justify-center" className="m-auto !h-full object-contain" src={src} alt={alt} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </>
  );
};

export default TransformOriginal;
