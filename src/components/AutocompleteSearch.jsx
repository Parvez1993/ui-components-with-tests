import { useEffect, useRef, useState } from "react";
import React from "react";
function AutocompleteSearch({
  apiUrl, // URL for fetching data
  searchKey = "users", // Key to access array from API response
  displayFields = ["firstName", "lastName"], // Fields to display in results
  placeholder = "Type here...",
  itemsLimit = 5,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const [limit, setLimit] = useState(itemsLimit);
  const [selected, setSelected] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const resultsRef = useRef(null);
  const searchRef = useRef(null);

  const fetchData = async () => {
    try {
      setIsSearching(true);
      const response = await fetch(`${apiUrl}${search}`);
      const data = await response.json();
      setResults(data?.[searchKey] || []);
      setLimit(itemsLimit);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (search && !selected) {
      const timeOut = setTimeout(() => {
        fetchData();
      }, 300);

      return () => clearTimeout(timeOut);
    }
  }, [search]);

  const handleSelect = (item) => {
    const displayValue = displayFields.map((field) => item[field]).join(" ");
    setSelected(displayValue);
    setSearch(displayValue);
    setResults(null);
    searchRef.current?.blur();
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setResults(null);
    }
    setSelected("");
  };

  return (
    <div className="w-full max-w-sm min-w-[200px]">
      <input
        ref={searchRef}
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e)}
        value={search}
      />
      {results?.length === 0 && !isSearching && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Oopsie!</strong>
          <span className="block sm:inline">No Results Found</span>
        </div>
      )}

      {results?.length > 0 && (
        <ul className="bg-white shadow-md rounded-md">
          {results?.slice(0, limit)?.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 border-b last:border-none hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {displayFields.map((field) => item[field]).join(" ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteSearch;
