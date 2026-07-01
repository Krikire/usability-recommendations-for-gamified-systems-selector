"use client";
import React, { useEffect } from "react";
import dayjs from "dayjs";

export type Results = {
  id: number;
  name: string;
  createdAt: string;
}[];

const SavedResultsPage = () => {
  const [results, setResults] = React.useState<Results>([]);
  useEffect(() => {
    // Simulate fetching saved results from an API
    const fetchSavedResults = async () => {
      // In a real application, replace this with an API call
      const fetchedResults = await fetch("/api/saved-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setResults(fetchedResults);
    };

    fetchSavedResults();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Saved Gamification Evaluation Instances
      </h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border-b">Website Name</th>
              <th className="px-4 py-3 border-b">Saved Date</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {results.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{item.name}</td>
                <td className="px-4 py-3 border-b">
                  {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="px-4 py-3 border-b">
                  <a
                    href={`/saved/${item.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No saved results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavedResultsPage;
