import Image from "next/image";

export const LiveblocksLoader = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-transparent">
      <div className="flex items-center justify-center space-x-3">
        <Image
          src="/liveblocks-loader.svg"
          alt="Loading"
          className="animate-spin dark:filter dark:invert"
          width={100}
          height={100}
        />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
};
