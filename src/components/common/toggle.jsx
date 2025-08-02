import { useState, useEffect } from "react"

const Toggle = ({ defaultChecked, onChange }) => {
  const isControlled = typeof defaultChecked === 'boolean';
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Keep internal state in sync with defaultChecked if not controlled
  useEffect(() => {
    if (!isControlled) {
      setIsChecked(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const actualChecked = isControlled ? defaultChecked : isChecked;

  const handleToggle = () => {
    const newValue = !actualChecked;

    if (!isControlled) {
      setIsChecked(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${actualChecked ? "bg-gray-800" : "bg-gray-300"
        }`}
      role="switch"
      aria-checked={actualChecked}
      onClick={handleToggle}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${actualChecked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
};

export default function TogglePage({ defaultChecked, setRestaurantStatus }) {
  const [state, setState] = useState(defaultChecked || false)

  
  if (setRestaurantStatus) setRestaurantStatus(state);


  return (
    <div className="flex flex-col items-center justify-center  space-y-4">
      <Toggle defaultChecked={state} onChange={setState} />
      {/* <p className="text-lg">Toggle is {state ? "ON" : "OFF"}</p> */}
    </div>
  )
}
