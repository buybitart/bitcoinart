import React from "react";
import api from "../http";
import { toast } from "react-toastify";

const DeletePopup = ({ setPopup, popup, type, setCategoryData, categoryData }) => {
  const deleteItem = async () => {
    try {
      const itemId = popup.item._id;
      setPopup({ state: false, item: null });
      await toast.promise(
        api.delete(
          `/${
            type === "Shop"
              ? "products"
              : type === "Gallery"
              ? "gallery-products"
              : type === "Auction"
              ? "auctions"
              : "products"
          }/${itemId}`
        ),
        {
          pending: `Deleting...`,
          success: `Deleted Successfully!`,
          error: `Failed to delete :/`,
        }
      );
      setCategoryData(categoryData.filter(item => item._id !== itemId));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full max-w-[383px] h-full max-h-[319px] rounded-[32px] p-8 flex flex-col gap-10 bg-[#171717]">
      <div className="w-full h-auto flex flex-col gap-3 items-center relative">
        <button
          className="w-[24px] h-[24px] absolute right-0 top-0 flex items-center justify-center group"
          onClick={() => setPopup({ state: false, item: null })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="group-hover:rotate-45 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9998 13.4L7.0998 18.3C6.91647 18.4834 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4834 5.6998 18.3C5.51647 18.1167 5.4248 17.8834 5.4248 17.6C5.4248 17.3167 5.51647 17.0834 5.6998 16.9L10.5998 12L5.6998 7.10005C5.51647 6.91672 5.4248 6.68338 5.4248 6.40005C5.4248 6.11672 5.51647 5.88338 5.6998 5.70005C5.88314 5.51672 6.11647 5.42505 6.3998 5.42505C6.68314 5.42505 6.91647 5.51672 7.0998 5.70005L11.9998 10.6L16.8998 5.70005C17.0831 5.51672 17.3165 5.42505 17.5998 5.42505C17.8831 5.42505 18.1165 5.51672 18.2998 5.70005C18.4831 5.88338 18.5748 6.11672 18.5748 6.40005C18.5748 6.68338 18.4831 6.91672 18.2998 7.10005L13.3998 12L18.2998 16.9C18.4831 17.0834 18.5748 17.3167 18.5748 17.6C18.5748 17.8834 18.4831 18.1167 18.2998 18.3C18.1165 18.4834 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4834 16.8998 18.3L11.9998 13.4Z"
              className="fill-[#858585] group-hover:fill-white transition-colors duration-300"
            />
          </svg>
        </button>
        <svg
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="32" height="32" rx="6" fill="#FEE2E1" />
          <path
            d="M7.22479 25C7.04146 25 6.87479 24.9542 6.72479 24.8625C6.57479 24.7708 6.45812 24.65 6.37479 24.5C6.29146 24.35 6.24562 24.1875 6.23729 24.0125C6.22896 23.8375 6.27479 23.6667 6.37479 23.5L15.6248 7.5C15.7248 7.33333 15.854 7.20833 16.0123 7.125C16.1706 7.04167 16.3331 7 16.4998 7C16.6665 7 16.829 7.04167 16.9873 7.125C17.1456 7.20833 17.2748 7.33333 17.3748 7.5L26.6248 23.5C26.7248 23.6667 26.7706 23.8375 26.7623 24.0125C26.754 24.1875 26.7081 24.35 26.6248 24.5C26.5415 24.65 26.4248 24.7708 26.2748 24.8625C26.1248 24.9542 25.9581 25 25.7748 25H7.22479ZM8.94979 23H24.0498L16.4998 10L8.94979 23ZM16.4998 22C16.7831 22 17.0206 21.9042 17.2123 21.7125C17.404 21.5208 17.4998 21.2833 17.4998 21C17.4998 20.7167 17.404 20.4792 17.2123 20.2875C17.0206 20.0958 16.7831 20 16.4998 20C16.2165 20 15.979 20.0958 15.7873 20.2875C15.5956 20.4792 15.4998 20.7167 15.4998 21C15.4998 21.2833 15.5956 21.5208 15.7873 21.7125C15.979 21.9042 16.2165 22 16.4998 22ZM16.4998 19C16.7831 19 17.0206 18.9042 17.2123 18.7125C17.404 18.5208 17.4998 18.2833 17.4998 18V15C17.4998 14.7167 17.404 14.4792 17.2123 14.2875C17.0206 14.0958 16.7831 14 16.4998 14C16.2165 14 15.979 14.0958 15.7873 14.2875C15.5956 14.4792 15.4998 14.7167 15.4998 15V18C15.4998 18.2833 15.5956 18.5208 15.7873 18.7125C15.979 18.9042 16.2165 19 16.4998 19Z"
            fill="#F05C5D"
          />
        </svg>
        <h2 className="font-main text-2xl leading-[28.8px] text-white tracking-wide font-[600] text-center">
          Are you sure?
        </h2>
        <p className="text-center font-main font-[300] text-sm leading-[16.8px] text-[#A2A2A2]">
          Are you sure you want to delete this item This action cannot be undone
        </p>
      </div>

      <div className="w-full h-auto flex flex-col gap-4 relative">
        <button
          onClick={deleteItem}
          className="bg-[#EE4445] hover:opacity-85 transition-opacity duration-300 h-[40px] rounded-[20px] py-[10px] px-6 font-main text-white text-base leading-[19.2px] tracking-wide font-[500]"
        >
          Delete item
        </button>
        <button
          onClick={() => setPopup({ state: false, item: null })}
          className="bg-[#ffffff] hover:opacity-85 transition-opacity duration-300 h-[40px] rounded-[20px] py-[10px] px-6 font-main text-black text-base leading-[19.2px] tracking-wide font-[500]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePopup;
