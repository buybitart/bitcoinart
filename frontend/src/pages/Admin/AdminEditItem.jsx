import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { MdAdd, MdArrowBack } from "react-icons/md";
import Dropzone from "../../components/Dropzone";
import Input from "../../components/Input";
import InputLabel from "../../components/InputLabel";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import BtcIcon from "../../components/subComponents/BtcIcon";
import TextEditor from "../../components/TextEditor";
import { useForm } from "react-hook-form";
import ImageLoader from "../../components/ImageLoader";
import { Helmet } from "react-helmet-async";
import api from "../../http";
import slugify from "slugify";
import { toast } from "react-toastify";
import { inputCSS } from "../../utils";
import Loader from "../../components/Loader";

const AdminEditItem = () => {
  const { hash } = useParams();
  const [searchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [data, setData] = useState({});
  const prevType = searchParams.get("type");
  const [type, setType] = useState(searchParams.get("type"));
  const [videoFile, setVideoFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setFetchError] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const watchedFields = watch();

  const removeImage = useCallback((index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const handleImageChange = (newImages) => {
    setImages(newImages);
    clearErrors("images");
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1 },
    }),
    exit: (index) => ({
      opacity: 0,
      scale: 0,
      transition: { delay: index * 0.05 },
    }),
  };

  const customSlug = (title) => {
    return slugify(title, {
      lower: true,
      strict: true,
      replacement: "-",
    })
      .replace("painting-embroidery-", "")
      .replace("and", "")
      .trim();
  };

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const response = await api.get(
          `/${
            prevType === "usual"
              ? "products"
              : prevType === "gallery"
              ? "gallery-products"
              : prevType === "auction"
              ? "auctions"
              : "products"
          }/${hash}`
        );

        const itemData = response.data;

        setData(itemData);
        setImages(itemData.images || []);
        setVideoFile(itemData.video);

        setType(searchParams.get("type"));
        setValue("itemType", prevType);
      } catch (err) {
        console.error("Error fetching item data:", err);
        setFetchError("Failed to fetch item data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [hash]);

  function changeType(settedType) {
    setType(settedType);
  }

  useEffect(() => {
    const baseValues = {
      title: data.title,
      description: data.description,
      itemType: prevType === "" ? "usual" : prevType,
    };

    if (type === "auction") {
      reset({
        ...baseValues,
        minPrice: data?.minPrice || "",
        maxPrice: data?.maxPrice || "",
        endTime: data?.endTime || "",
        dimensions: data?.dimensions || "",
        delivery: data?.delivery || "",
      });
    } else if (type === "" || type === "usual") {
      reset({
        ...baseValues,
        price: data?.price || "",
        dimensions: data?.dimensions || "",
        delivery: data?.delivery || "",
      });
    } else if (type === "gallery") reset(baseValues);
  }, [data, type]);

  const isDataSame = () => {
    if (!data) return false;

    const normalizeImages = (imgs) =>
      imgs?.map((img) => img.optimized || img) || [];
    const normalizeVideo = (vid) => (vid ? vid.name || vid : null);

    const originalData = {
      title: data.title || undefined,
      description: data.description || undefined,
      price: data.price || undefined,
      minPrice: data.minPrice || undefined,
      maxPrice: data.maxPrice || undefined,
      endTime: data.endTime || undefined,
      dimensions: data.dimensions || undefined,
      delivery: data.delivery || undefined,
      images: normalizeImages(data.images),
      video: normalizeVideo(data.video),
    };

    const newData = {
      title: getValues("title"),
      description: getValues("description"),
      price: getValues("price"),
      minPrice: getValues("minPrice"),
      maxPrice: getValues("maxPrice"),
      endTime: getValues("endTime"),
      dimensions: getValues("dimensions"),
      delivery: getValues("delivery"),
      images: normalizeImages(images),
      video: normalizeVideo(videoFile),
    };

    return JSON.stringify(originalData) === JSON.stringify(newData);
  };

  useEffect(() => {
    setIsDisabled(isDataSame());
  }, [data, watchedFields, images, videoFile]);

  const onSubmit = async (formData) => {
    if (!images.length) {
      setError("images", {
        type: "manual",
        message: "At least 1 image is required",
      });
      return;
    }

    try {
      let updatedImages = [
        ...images.filter((img) => !img?.src?.startsWith("data:image")),
      ];
      let newImages = images.filter((img) =>
        img?.src?.startsWith("data:image")
      );

      if (newImages.length > 0) {
        const formDataImgUpload = new FormData();
        newImages.forEach((image) => {
          const base64Data = image.src.replace(/^data:image\/\w+;base64,/, "");
          formDataImgUpload.append("images", base64Data);
        });

        const { data: uploadedImages } = await toast.promise(
          api.post("/utils/upload-images", formDataImgUpload, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            pending: "Uploading images...",
            success: "Images uploaded successfully!",
            error: "Failed to upload images",
          }
        );

        updatedImages = [...updatedImages, ...uploadedImages];
      }

      const newHash =
        formData.title !== data.title ? customSlug(formData.title) : hash;
        
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });

        formDataToSend.set("hash", newHash);
        formDataToSend.set("images", JSON.stringify(updatedImages));

        if (videoFile) formDataToSend.append("video", videoFile);
        if (type === "auction") formDataToSend.set("status", "active");

        let apiCall;
        if (prevType !== type) {
          formDataToSend.append("newType", type);
    
          apiCall = api.put(`/utils/change-type/${data._id}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          apiCall = api.put(`/${getEndpoint(type)}/${data._id}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
    
        await toast.promise(apiCall, {
          pending: `Updating ${getAbbr(type)}...`,
          success: `${getAbbr(type)} updated successfully!`,
          error: `Failed to update ${getAbbr(type)}`,
        });

      navigate(-1, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении товара");
    }
  };

  const getEndpoint = (type) => {
    return type === "usual"
      ? "products"
      : type === "gallery"
      ? "gallery-products"
      : "auctions";
  };

  const getAbbr = (type) => {
    return type === "usual"
      ? "Product"
      : type === "gallery"
      ? "gallery Product"
      : "Auction";
  };

  const handleVideoChange = (file) => {
    if (file?.size > 300 * 1024 * 1024) {
      alert("Video file size must be less than 300MB");
      return;
    }

    setVideoFile(file);
  };

  if(!data) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Admin page | Item Editing</title>
      </Helmet>
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative px-[16px] xl:px-[6.25rem] 2xl:max-w-[85%] 2xl:mx-auto pb-28">
          <div className="flex items-center gap-3 w-full mb-8 mt-[calc(52px+20px)] xl:mt-[calc(65px+20px)]">
            <Link
              to={-1}
              className="w-[30px] h-[30px] flex items-center justify-center opacity-80 hover:scale-x-125 transition-transform duration-300"
            >
              <MdArrowBack size={24} />
            </Link>
            <h2 className="font-main font-[600] text-4xl leading-[100%] tracking-wide">
              Edit Item
            </h2>
          </div>

          <div className="w-full h-auto flex xl:gap-[125px] gap-[60px] xl:flex-row flex-col justify-between">
            {/* Left */}
            <div className="w-full h-auto flex flex-col relative">
              <div
                className={`${
                  errors.images
                    ? ""
                    : "grid grid-cols-5 sm:grid-rows-6 grid-rows-5 sm:gap-4 gap-2.5"
                }`}
              >
                <AnimatePresence initial={false}>
                  {!images.length ? (
                    <motion.div
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className={`${
                        errors.images
                          ? "flex flex-col gap-3"
                          : "col-span-5 sm:row-span-6 row-span-5"
                      } max-h-[600px]`}
                    >
                      <Dropzone data={images} setData={handleImageChange} />
                      {errors.images && (
                        <p className="text-red-500 text-xs">
                          {errors.images.message}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    images.map(
                      (image, index) =>
                        index <= 4 && (
                          <motion.div
                            key={index}
                            layout
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={containerVariants}
                            className={`relative rounded-3xl ${
                              !index
                                ? "col-span-5 sm:row-span-6 row-span-5 max-h-[600px]"
                                : "sm:row-start-7 row-start-6 max-h-[83px] sm:max-h-[110px]"
                            }`}
                          >
                            <ImageLoader
                              src={image.src ? image.src : image.optimized}
                              alt={`Uploaded-${index}`}
                              className="w-full h-full object-cover rounded-3xl"
                              containerStyles="h-full"
                              draggable={false}
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className={`absolute z-[1] backdrop-blur-xl group rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 active:scale-90 ${
                                !index
                                  ? "w-[30px] h-[30px]"
                                  : "w-[24px] h-[24px]"
                              } bg-[#0000003d] flex items-center justify-center -right-2 -top-2 border-[1px] border-[#FFFFFF1A]`}
                            >
                              <img
                                src="/close.svg"
                                alt="Remove"
                                className={`${
                                  !index
                                    ? "w-[20px] h-[20px]"
                                    : "w-[17px] h-[17px]"
                                } group-hover:rotate-90 transition-transform duration-300 object-contain`}
                                draggable={false}
                              />
                            </button>
                          </motion.div>
                        )
                    )
                  )}
                  {images.length > 0 && images.length < 6 && (
                    <motion.div
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className="sm:row-start-7 row-start-6 rounded-3xl"
                    >
                      <Dropzone data={images} setData={setImages} autoCSS />
                    </motion.div>
                  )}
                  {images.length >= 6 && (
                    <motion.div
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className="sm:row-start-7 group relative row-start-6 rounded-3xl flex items-center justify-center font-main text-xl bg-[#ffffff1A] font-[500] tracking-widest"
                    >
                      +{images.length - 5}
                      <div className="absolute opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-[opacity,visibility] duration-500 w-max rounded-3xl z-[3] top-[-110px] right-[5px] h-[90px] bg-[#1a1a1a] flex items-center gap-3 p-1">
                        {images.slice(5).map((image, index) => (
                          <ImageLoader
                            src={image.src ? image.src : image.optimized}
                            alt={`uploaded-additional-${index}`}
                            key={index}
                            className="w-full max-w-[82px] h-full object-cover rounded-3xl"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-6 w-full h-auto relative">
                <label
                  htmlFor="videoUploadA"
                  className="bg-[#2B2B2B] font-[300] cursor-pointer flex group items-center justify-center gap-1 w-full py-4 px-3 rounded-xl outline-none leading-[23px] border-[2px] border-dashed border-[#6d6d6d] tracking-wide transition-colors duration-[250ms] font-main placeholder-[#707070] focus:placeholder-[#ffffff00]"
                >
                  {videoFile ? (
                    <span className="inline-block whitespace-nowrap overflow-hidden max-w-[380px] text-ellipsis text-center transition-[opacity] duration-300 group-hover:opacity-80">
                      {typeof videoFile === "string"
                        ? videoFile
                        : videoFile.name}
                    </span>
                  ) : (
                    <>
                      <span className="group-hover:tracking-wider transition-[letter-spacing,opacity] duration-300 group-hover:opacity-80">
                        Upload Video (Max 300MB)
                      </span>
                      <MdAdd
                        size={25}
                        className={`group-hover:scale-125 transition-[transform,color] duration-300`}
                      />
                    </>
                  )}
                </label>
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  id="videoUploadA"
                  onChange={(e) => handleVideoChange(e.target.files[0])}
                />
              </div>
            </div>

            {/* Right */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-auto flex flex-col gap-6"
            >
              <div className="flex flex-col gap-3 w-full h-auto relative">
                {/* Input fields */}
                <InputLabel
                  label="Title"
                  id="titleA"
                  placeholder="Painting-Embroidery «Unknown Bitcoin»"
                  type="text"
                  defaultValue={data.title}
                  register={register("title", {
                    required: "Title is required",
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </div>

              {/* Price, Size, Delivery */}
              {type === "gallery" ? (
                <></>
              ) : type === "auction" ? (
                <>
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <div className="flex flex-col w-full h-auto gap-1.5">
                      <label
                        htmlFor="minPriceA"
                        className="text-white text-sm leading-[16.8px] font-main tracking-wide"
                      >
                        Price
                      </label>
                      <div className="w-full h-auto flex items-center gap-3">
                        <Input
                          id="minPriceA"
                          placeholder="min."
                          min="0.0001"
                          step="0.0001"
                          type="number"
                          defaultValue={data.minPrice}
                          {...register("minPrice", {
                            required: "min. price is required",
                          })}
                          className={inputCSS}
                        />
                        -
                        <Input
                          id="maxPriceA"
                          placeholder="max."
                          min="0.0001"
                          step="0.0001"
                          type="number"
                          defaultValue={data.maxPrice}
                          {...register("maxPrice", {
                            required: "max. price is required",
                          })}
                          className={inputCSS}
                        />
                      </div>
                    </div>
                    {(errors.minPrice || errors.maxPrice) && (
                      <div className="w-full h-auto flex justify-between gap-9 items-start">
                        <p className="text-red-500 text-xs w-full text-left">
                          {errors.minPrice.message}
                        </p>
                        <p className="text-red-500 text-xs w-full text-left">
                          {errors.maxPrice.message}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="priceA"
                    placeholder="0.0013"
                    defaultValue={data.price ? data.price : ""}
                    label="Price"
                    icon={<BtcIcon />}
                    min="0.0001"
                    step="0.0001"
                    type="number"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              )}

              {type === "auction" && (
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="endTimeA"
                    placeholder="30x40"
                    label="End time"
                    defaultValue={data.endTime}
                    type="datetime-local"
                    {...register("endTime", {
                      required: "End time is required",
                    })}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              )}
              {type !== "gallery" && (
                <>
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <InputLabel
                      id="sizeA"
                      placeholder="30x40"
                      label="Size"
                      defaultValue={data.dimensions}
                      type="text"
                      {...register("dimensions", {
                        required: "Size is required",
                      })}
                    />
                    {errors.dimensions && (
                      <p className="text-red-500 text-xs">
                        {errors.dimensions.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <InputLabel
                      id="deliveryA"
                      label="Delivery"
                      placeholder="International-Free"
                      defaultValue={data.delivery}
                      type="text"
                      {...register("delivery", {
                        required: "Delivery information is required",
                      })}
                    />
                    {errors.delivery && (
                      <p className="text-red-500 text-xs">
                        {errors.delivery.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <TextEditor
                description={data.description}
                placeholder="Your product description"
                onChange={(desc) => setValue("description", desc)}
              />

              {/* Radio buttons */}
              <div className="flex flex-col w-full h-auto gap-3 relative">
                {["Usual", "Auction", "Gallery"].map((category, index) => (
                  <label
                    key={category}
                    onClick={() => changeType(category.toLowerCase())}
                    className="relative flex items-center cursor-pointer justify-between select-none"
                  >
                    <input
                      defaultChecked={type === category.toLowerCase()}
                      className="sr-only peer"
                      name="futuristic-radio"
                      type="radio"
                    />
                    <span className="text-white font-main text-base tracking-wide font-[300]">
                      {category}
                    </span>
                    <div className="w-4 h-4 bg-transparent outline outline-1 outline-offset-2 outline-[#909090] rounded-full peer-checked:bg-white peer-checked:outline-[#909090] peer-hover:shadow-lg transition duration-300 ease-in-out" />
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="w-full flex items-center gap-4 justify-between relative h-auto">
                <Link
                  to={-1}
                  className="flex font-main rounded-[1.25rem] w-full h-[44px] bg-white text-black font-[600] items-center justify-center hover:bg-[#dddddd] hover:text-[#000]/90 transition-colors duration-[250ms]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`flex font-main rounded-[1.25rem] w-full h-[44px] font-[600] items-center justify-center transition-colors duration-[250ms] ${
                    isDisabled
                      ? "bg-[#D4A900] text-[#1C1600] pointer-events-none"
                      : "hover:bg-[#D4A900] hover:text-[#1C1600] bg-[#FCCB00] text-[#522700]"
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminEditItem;
