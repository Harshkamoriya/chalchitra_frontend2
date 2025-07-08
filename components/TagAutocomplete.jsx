"use client"
import { useState } from "react";

export default function TagAutocomplete({ allowedTags,value, onChange, onAdd, disabled, placeholder }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = allowedTags.filter(tag =>
    tag.toLowerCase().includes(value.toLowerCase()) &&
    !disabled // hide suggestions if disabled
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay to allow click
        className="h-14 w-full text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg px-4"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow z-10 max-h-48 overflow-auto">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              onMouseDown={() => {
                onAdd(suggestion);
                onChange(""); // clear input
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
