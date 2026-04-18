"use client";

const COPY = {
  title: "טורניר",
  message: "לא ניתן לטעון את נתוני הטורניר כרגע. נסה שוב מאוחר יותר.",
  retry: "נסה שוב",
};

export default function TournamentError({
  reset,
}: {
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
      <p className="text-[15px] text-[#6B7280] text-center">{COPY.message}</p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-full bg-[#0D9488] text-white text-[14px] font-medium"
      >
        {COPY.retry}
      </button>
    </div>
  );
}
