import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { imagesOnly } from "../utils";
import LoadingCircle from "./LoadingCircle";
import { MdAdd } from "react-icons/md";

const Dropzone = ({ data, setData, autoCSS }) => {
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
              updatedData.push(newFile);
              setData(updatedData);
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.error("Error processing the image:", error);
          }
        }
        setLoading(false);
      };

      processFiles();
    },
    [data, setData]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: imagesOnly,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full ${
        autoCSS
          ? "text-xs text-center sm:h-full h-[83px] sm:min-h-[83px] sm:max-h-[110px]"
          : "lg:h-[600px] h-[394px] text-lg"
      } bg-[#2B2B2B] font-main group font-[300] cursor-pointer rounded-3xl flex justify-center items-center overflow-hidden`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23FFFFFF4F' stroke-width='4' stroke-dasharray='20' stroke-dashoffset='11' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }}
    >
      <input {...getInputProps()} />
      <div
        className={`flex h-auto flex-col w-auto max-w-[80%] justify-center items-center ${
          autoCSS ? "gap-2" : "gap-4"
        }`}
      >
        {loading ? (
          <LoadingCircle />
        ) : (
          <>
            <MdAdd
              size={autoCSS ? "45" : `60`}
              className={`group-hover:scale-125 transition-[transform,color] duration-300 ${
                isDragReject && "rotate-45 scale-125 text-red-500"
              } ${isDragAccept && "scale-125 text-[#FCCB00]"}`}
            />
          </>
        )}

        {autoCSS ? (
          <></>
        ) : isDragActive ? (
          isDragAccept ? (
            <p>Drop the files here ...</p>
          ) : (
            isDragReject && <p>Only .jpg, .png, .jpeg, .webp, .avif, .jfif</p>
          )
        ) : loading ? (
          <p>Compressing and loading...</p>
        ) : (
          <p className="group-hover:tracking-wider transition-[letter-spacing,opacity] duration-300 group-hover:opacity-80">
            Load image or drag and drop
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
