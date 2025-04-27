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
      <HUIListboxButton className="w-full h-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
        <span
          className={`truncate ${
            selectedSession ? "text-gray-900" : "text-gray-500"
          }`}
        >
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
        <HUIListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-200 rounded-xl py-1 text-base shadow-lg focus:outline-none">
          {sessions.map((s) => (
            <HUIListboxOption
              key={s.id}
              value={s.id}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                  active ? "bg-indigo-50 text-indigo-600" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-normal"
                    }`}
                  >
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
