import React, { useState } from "react";
import AutocompleteSearch from "../components/AutocompleteSearch";

function Autocomplete() {
  const [value, setValue] = useState("");
  const handleSelectedValue = (selectedItem) => {
    setValue(selectedItem);
    // Do something with the selected item, e.g., store it in state
  };
  return (
    <div className="flex flex-col gap-y-12 justify-center items-center">
      <div className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Autocomplete
      </div>

      <AutocompleteSearch
        apiUrl="https://dummyjson.com/users/search?q="
        searchKey="users"
        displayFields={["firstName", "lastName"]}
        placeholder="Search names..."
        itemsLimit={5}
        onSelect={handleSelectedValue} // Pass the callback here
      />
    </div>
  );
}

export default Autocomplete;
