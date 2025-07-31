import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <CircularProgress color="primary" size={64} />
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-medium">
        Loading... next page
      </p>
    </div>
  );
}
