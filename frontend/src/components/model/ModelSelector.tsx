import React from "react";
import { Model } from "../../types/types"
import { Cpu } from "react-feather";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

type ModelSelectorProps = {
    selectedModel: string;
    models: Model[]
    onSelectModel: (id: string) => void;

}

export const ModelSelector : React.FC<ModelSelectorProps> = ({
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
                      <ListboxOptions className="absolute mt-1 w-full bg-white rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
                        {!selectedModel && (
                          <div className="px-4 py-2 text-gray-500">Select a model</div>
                        )}
                        {models.map((m) => (
                          <ListboxOption key={m.id} value={m.id}>
                            {({ active }) => (
                              <div className={`px-4 py-2 cursor-pointer ${active ? "bg-indigo-100" : ""}`}>
                                {m.name}
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