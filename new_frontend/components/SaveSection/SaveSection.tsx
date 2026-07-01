import React from "react";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";

type SaveSectionProps = {
  websiteName: string;
  onChange?: (name: string) => void;
  success: boolean;
  onSave: () => void;
};

export default function SaveSection({
  websiteName,
  onChange,
  success,
  onSave,
}: SaveSectionProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <h3 className="text-2xl font-bold text-center mb-4 text-green-700">
        {success && "Your recommendations have been saved."}
      </h3>
      <div className="flex flex-row items-end gap-4 justify-center p-4 bg-gray-100 rounded-lg shadow-md w-full">
        <TextField
          label="Enter website name"
          value={websiteName}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
        />
        <div>
          <Button
            onClick={() => {
              onSave();
            }}
            label="Save"
          />
        </div>
      </div>
    </div>
  );
}
