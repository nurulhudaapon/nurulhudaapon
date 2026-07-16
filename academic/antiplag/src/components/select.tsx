'use client'

function Select({options, onChange}: {options: Array<{value: string; label: string}>, onChange: (value: string) => void}) {
    return (
        <select
          id="algos"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose a variation</option>
          {options.map((variation) => (
            <option value={variation.value}>{variation.label}</option>
          ))}
        </select>
    );
  }
  