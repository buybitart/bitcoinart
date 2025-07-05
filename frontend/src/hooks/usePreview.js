import { useEffect, useState } from "react";

const usePreview = (url) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!url) return;
    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";

    const onSeeked = () => {
      const newCanvas = document.createElement("canvas");
      newCanvas.width = video.videoWidth;
      newCanvas.height = video.videoHeight;
      const ctx = newCanvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const isFullBlack = checkIfFullBlack(ctx);
      if (isFullBlack) {
        video.currentTime += 1;
      } else {
        const canvasToURL = newCanvas.toDataURL();
        setImageUrl(canvasToURL);
      }

      const CanvasToURL = newCanvas.toDataURL()
      setImageUrl(CanvasToURL);
    };
    
    const checkIfFullBlack = (context) => {
      const imageData = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) {
          return false;
        }
      }

      // All pixels are black
      return true;
    };

    video.addEventListener("seeked", onSeeked);

    const onLoadMetadata = () => video.currentTime = 0;

    video.addEventListener("loadedmetadata", onLoadMetadata);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoadMetadata);
      video.pause();
      video.src = "";
    };
  }, [url]);

  return imageUrl;
};

export default usePreview;