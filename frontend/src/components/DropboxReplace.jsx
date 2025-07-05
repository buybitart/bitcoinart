import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { imagesOnly } from "../utils";
import LoadingCircle from "./LoadingCircle";
import ImageLoader from "./ImageLoader";
import { MdAdd } from "react-icons/md";

const Dropzone = ({ data, setData, index }) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setLoading(true);
      const processFiles = async () => {
        const updatedData = [...data];
        for (const file of acceptedFiles) {
          try {
            const reader = new FileReader();
            reader.onload = () => {
              const newFile = { name: file.name, src: reader.result };
              updatedData[index] = newFile;
              setData(updatedData);
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.error("Error compressing the image:", error);
          }
        }
        setLoading(false);
      };

      processFiles();
    },
    [data, index, setData]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: imagesOnly,
    });

  return (
    <div
      {...getRootProps()}
      className={`w-full text-xs text-center h-[83px] sm:h-[110px] bg-[#2B2B2B] font-main group font-[300] cursor-pointer rounded-3xl flex justify-center items-center overflow-hidden`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23FFFFFF4F' stroke-width='4' stroke-dasharray='20' stroke-dashoffset='11' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }}
    >
      <input {...getInputProps()} />
      <div
        className={`flex flex-col w-auto max-w-[80%] justify-center items-center max-h-[80%] h-auto overflow-hidden rounded-2xl gap-2`}
      >
        {loading ? (
          <LoadingCircle />
        ) : (
          <>
            {data[index]?.src || data[index]?.original ? (
              <ImageLoader
                src={data[index].src || data[index].original}
                alt={`me-upload-${index}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <MdAdd
                size={45}
                className={`group-hover:scale-125 transition-[transform,color] duration-300 ${
                  isDragReject && "rotate-45 scale-125 text-red-500"
                } ${isDragAccept && "scale-125 text-[#FCCB00]"}`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
