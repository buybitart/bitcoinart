export default function Toolbar({ editor, setLink }) {
  if (!editor) return null;

  const handleToggle = (command, options = {}) => {
    editor.chain().focus()[command](options).run();
  };

  const isActive = (type, attributes = {}) => editor.isActive(type, attributes);

  return (
    <div className="rounded-lg w-max border border-[#212121] bg-background p-1 text-sm flex items-center h-[40px] gap-1">
      {/* bold */}
      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("bold") ? "bg-[#212121]" : ""
        }`}
        onClick={() => handleToggle("toggleBold")}
      >
        <svg
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.6 6.79C9.57 6.12 10.25 5.02 10.25 4C10.25 1.74 8.5 0 6.25 0H0V14H7.04C9.13 14 10.75 12.3 10.75 10.21C10.75 8.69 9.89 7.39 8.6 6.79ZM3 2.5H6C6.83 2.5 7.5 3.17 7.5 4C7.5 4.83 6.83 5.5 6 5.5H3V2.5ZM6.5 11.5H3V8.5H6.5C7.33 8.5 8 9.17 8 10C8 10.83 7.33 11.5 6.5 11.5Z"
            fill="#707070"
          />
        </svg>
      </button>

      {/* italic */}
      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("italic") ? "bg-[#212121]" : ""
        }`}
        onClick={() => handleToggle("toggleItalic")}
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 0V3H6.21L2.79 11H0V14H8V11H5.79L9.21 3H12V0H4Z"
            fill="#707070"
          />
        </svg>
      </button>

      {/* h2 */}
      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 ${
          isActive("heading", { level: 2 }) ? "bg-[#212121]" : ""
        } h-8 w-8 flex justify-center items-center`}
        onClick={() => handleToggle("toggleHeading", { level: 2 })}
      >
        <svg
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7822 15H8.85254V8.90625H3.13965V15H0.209961V0.78125H3.13965V6.54297H8.85254V0.78125H11.7822V15Z"
            fill="#707070"
          />
        </svg>
      </button>

      {/* h4 */}
      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 ${
          isActive("heading", { level: 4 }) ? "bg-[#212121]" : ""
        } h-8 w-8 flex justify-center items-center`}
        onClick={() => handleToggle("toggleHeading", { level: 4 })}
      >
        <svg
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.74805 12H7.02148V7.25H2.98242V12H0.240234V0.625H2.98242V5.14062H7.02148V0.625H9.74805V12Z"
            fill="#707070"
          />
        </svg>
      </button>

      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("blockquote") ? "bg-[#212121]" : ""
        }`}
        onClick={() => handleToggle("toggleBlockquote")}
      >
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 10H4L6 6V0H0V6H3L1 10ZM9 10H12L14 6V0H8V6H11L9 10Z"
            fill="#707070"
          />
        </svg>
      </button>

      {/* link */}
      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("link") ? "bg-[#212121]" : ""
        }`}
        onClick={setLink}
      >
        <svg
          width="20"
          height="10"
          viewBox="0 0 20 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.9 5C1.9 3.29 3.29 1.9 5 1.9H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6H14V4H6V6ZM15 0H11V1.9H15C16.71 1.9 18.1 3.29 18.1 5C18.1 6.71 16.71 8.1 15 8.1H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0Z"
            fill="#707070"
          />
        </svg>
      </button>

      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("bulletList") ? "bg-[#212121]" : ""
        }`}
        onClick={() => handleToggle("toggleBulletList")}
      >
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25 6.5C1.42 6.5 0.75 7.17 0.75 8C0.75 8.83 1.42 9.5 2.25 9.5C3.08 9.5 3.75 8.83 3.75 8C3.75 7.17 3.08 6.5 2.25 6.5ZM2.25 0.5C1.42 0.5 0.75 1.17 0.75 2C0.75 2.83 1.42 3.5 2.25 3.5C3.08 3.5 3.75 2.83 3.75 2C3.75 1.17 3.08 0.5 2.25 0.5ZM2.25 12.5C1.42 12.5 0.75 13.18 0.75 14C0.75 14.82 1.43 15.5 2.25 15.5C3.07 15.5 3.75 14.82 3.75 14C3.75 13.18 3.08 12.5 2.25 12.5ZM5.25 15H19.25V13H5.25V15ZM5.25 9H19.25V7H5.25V9ZM5.25 1V3H19.25V1H5.25Z"
            fill="#707070"
          />
        </svg>
      </button>

      <button
        type="button"
        className={`toggle rounded-md hover:bg-[#212121] transition-colors duration-300 h-8 w-8 flex justify-center items-center ${
          isActive("orderedList") ? "bg-[#212121]" : ""
        }`}
        onClick={() => handleToggle("toggleOrderedList")}
      >
        <svg
          width="19"
          height="16"
          viewBox="0 0 19 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 13H2V13.5H1V14.5H2V15H0V16H3V12H0V13ZM1 4H2V0H0V1H1V4ZM0 7H1.8L0 9.1V10H3V9H1.2L3 6.9V6H0V7ZM5 1V3H19V1H5ZM5 15H19V13H5V15ZM5 9H19V7H5V9Z"
            fill="#707070"
          />
        </svg>
      </button>
    </div>
  );
}
