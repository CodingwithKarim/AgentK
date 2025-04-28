import React from "react";
import { Model } from "../../utils/types/types"
import { Cpu } from "react-feather";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type ModelSelectorProps = {
  selectedModel: string;
  models: Model[]
  onSelectModel: (id: string) => void;

}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  models,
  onSelectModel
}) => {
  return (
    <div className="flex-1">
      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center space-x-2">
        <Cpu className="w-5 h-5 text-indigo-500" />
        <span>Model</span>
      </label>
      <Listbox
        value={selectedModel}
        onChange={onSelectModel}
      >
        <div className="relative">
          <ListboxButton className="w-full px-4 py-3 bg-white rounded-xl shadow-sm flex justify-between items-center focus:ring-2 focus:ring-indigo-300 transition">
            {models.find((m) => m.id === selectedModel)?.name || "Select a model"}
            <ChevronUpDownIcon className="w-5 h-5 text-gray-500" />
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-2 w-full max-h-40 overflow-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent outline-none">
            {models.map((m) => (
              <ListboxOption key={m.id} value={m.id} className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-10 transition-all duration-200 ${active ? "bg-indigo-100 text-indigo-700" : "text-gray-900"
                }`
              }>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                      {m.name}
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