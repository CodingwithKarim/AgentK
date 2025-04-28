import React, { Fragment } from "react";
import {
  Listbox,
  Transition,
  ListboxButton as HUIListboxButton,
  ListboxOptions as HUIListboxOptions,
  ListboxOption as HUIListboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { SessionSelectorProps } from "../../utils/types/types";

export const ChatSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  selectedSession,
  onSelectSession,
}) => (
  <Listbox value={selectedSession} onChange={onSelectSession}>
    <div className="relative flex-[0_0_70%] h-12">
      <HUIListboxButton
        className={
          /* Core layout and styling */
          "w-full h-full flex items-center justify-between px-4 bg-white border-gray-300 rounded-2xl shadow-sm transition-all duration-200 outline-none " +
          /* Hover effect */
          "hover:border-indigo-400 " 
          /* Keyboard-focus ring only on Tab (soft glow) */
        }
      >
        <span className={`truncate ${selectedSession ? "text-gray-900" : "text-gray-500"}`}>
          {selectedSession
            ? sessions.find((s) => s.id === selectedSession)?.name
            : "Select a chat…"}
        </span>
        <ChevronUpDownIcon className="pointer-events-none absolute right-3 top-1/2 w-5 h-5 text-gray-400 -translate-y-1/2" />
      </HUIListboxButton>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <HUIListboxOptions
          className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent outline-none"
        >
          {sessions.map((s) => (
            <HUIListboxOption
              key={s.id}
              value={s.id}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-10 transition-all duration-200 ${
                  active ? "bg-indigo-100 text-indigo-700" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                    {s.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <CheckIcon className="w-5 h-5" />
                    </span>
                  )}
                </>
              )}
            </HUIListboxOption>
          ))}
        </HUIListboxOptions>
      </Transition>
    </div>
  </Listbox>
);

/* Add the following CSS to your global styles (e.g., src/index.css) */
/*

*/
