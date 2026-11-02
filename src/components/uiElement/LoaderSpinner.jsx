import React from "react";

const LoaderSpinner = () => {
  return (
    <>
    <div className="flex justify-center items-start h-full">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mt-10"></div>
    </div>
    </>
  );
};

export default LoaderSpinner;
