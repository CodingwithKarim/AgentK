import React from "react";
import { Provider } from "../../utils/types/types";
import { Layers } from "react-feather";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
            <ListboxOptions className="absolute mt-1 w-full bg-white rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
              <ListboxOption key="" value="">
                {({ active }) => (
                  <div className={`px-4 py-2 cursor-pointer ${active ? "bg-indigo-100" : ""}`}>
                    All Providers
                  </div>
                )}
              </ListboxOption>
              {providers.map((p) => (
                <ListboxOption key={p} value={p}>
                  {({ active }) => (
                    <div className={`px-4 py-2 cursor-pointer ${active ? "bg-indigo-100" : ""}`}>
                      {p}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    )
}