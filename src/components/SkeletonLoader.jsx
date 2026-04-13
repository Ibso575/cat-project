import React from "react";

const SkeletonLoader = ({ count = 6, variant = "product" }) => {
  const skeletons = Array.from({ length: count });

  if (variant === "product") {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 transition-colors duration-300">
        {skeletons.map((_, index) => (
          <div
            key={index}
            role="status"
            className="animate-pulse rounded-3xl border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="mb-5 aspect-[4/3] rounded-3xl bg-[#f6ede0] dark:bg-slate-800"></div>
            <div className="mb-3 h-3 w-20 rounded-full bg-[#f2e4cf] dark:bg-slate-700"></div>
            <div className="mb-2 h-5 w-3/4 rounded-full bg-[#efe5d8] dark:bg-slate-700"></div>
            <div className="mb-5 h-4 w-1/2 rounded-full bg-[#f4eadb] dark:bg-slate-700"></div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="h-6 w-24 rounded-full bg-[#efe5d8] dark:bg-slate-700"></div>
              <div className="h-10 w-20 rounded-2xl bg-[#fff2df] dark:bg-slate-800"></div>
            </div>
            <div className="h-11 rounded-full bg-[#f0e2ca] dark:bg-slate-700"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div role="status" className="grid animate-pulse gap-8 lg:grid-cols-[1.05fr_0.95fr] transition-colors duration-300">
        <div className="rounded-[2rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="aspect-square rounded-[1.75rem] bg-[#f6ede0] dark:bg-slate-800"></div>
        </div>
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 h-4 w-28 rounded-full bg-[#f2e4cf] dark:bg-slate-700"></div>
            <div className="mb-3 h-10 w-4/5 rounded-full bg-[#efe5d8] dark:bg-slate-800"></div>
            <div className="h-6 w-40 rounded-full bg-[#f0e2ca] dark:bg-slate-700"></div>
          </div>
          <div className="rounded-[2rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 h-8 w-36 rounded-full bg-[#efe5d8] dark:bg-slate-800"></div>
            <div className="h-24 rounded-[1.5rem] bg-[#f6ede0] dark:bg-slate-800"></div>
          </div>
          <div className="rounded-[2rem] border border-[#eadfcf] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 h-5 w-36 rounded-full bg-[#efe5d8] dark:bg-slate-800"></div>
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-[#f4eadb] dark:bg-slate-700"></div>
              <div className="h-4 rounded-full bg-[#f4eadb] dark:bg-slate-700"></div>
              <div className="h-4 w-5/6 rounded-full bg-[#f4eadb] dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
