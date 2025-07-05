import React from "react";

const SocialButton = ({ type, typeForm, onClick }) => {
  return (
    <button type="button" onClick={onClick} className={`h-[44px] w-full flex justify-center items-center tracking-normal gap-3 py-[10px] px-4 rounded-lg font-[600] text-base leading-[24px] ${type === "google" ? 'bg-white text-[#344054]' : type === 'facebook' ? 'bg-[#1877F2] text-[#fff]' : ''}`}>
      {type === "google" ? <img src="/google.svg" alt="google icon" className="" width={24} height={24} /> : type === "facebook" ? <img src="/facebook.svg" alt="google icon" className="" width={24} height={24} /> : <></>}
      {type === "google"
        ? `Sign ${typeForm === 'register' ? 'up' : 'in'} with Google`
        : type === "facebook"
        ? `Sign ${typeForm === 'register' ? 'up' : 'in'} with Facebook`
        : ""}
    </button>
  );
};

export default SocialButton;
