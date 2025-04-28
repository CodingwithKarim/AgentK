import React from "react";
import { Provider } from "../../utils/types/types";
import { Layers } from "react-feather";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type ProviderSelectorProps = {
  selectedProvider: string
  onSelectProvider: (provider: Provider) => void;
  providers: Provider[]

}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onSelectProvider,
  providers
}) => {
  return (
    <div className="flex-1">
      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center space-x-2">
        <Layers className="w-5 h-5 text-indigo-500" />
        <span>Provider</span>
      </label>
      <Listbox
        value={selectedProvider}
        onChange={onSelectProvider}
      >
        <div className="relative">
          <ListboxButton className="w-full px-4 py-3 bg-white rounded-xl shadow-sm flex justify-between items-center focus:ring-2 focus:ring-indigo-300 transition">
            {selectedProvider || "All Providers"}
            <ChevronUpDownIcon className="w-5 h-5 text-gray-500" />
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-2 w-full max-h-40 overflow-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent outline-none">
            <ListboxOption key="" value="" className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-10 transition-all duration-200 ${
                  active ? "bg-indigo-100 text-indigo-700" : "text-gray-900"
                }`
              }>
            {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                      All Providers
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <CheckIcon className="w-5 h-5" />
                      </span>
                    )}
                  </>
                )}
            </ListboxOption>
            {providers.map((p) => (
              <ListboxOption key={p} value={p} className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-10 transition-all duration-200 ${
                  active ? "bg-indigo-100 text-indigo-700" : "text-gray-900"
                }`
              }>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                      {p}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <CheckIcon className="w-5 h-5" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}