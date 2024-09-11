import { CiCircleChevDown } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "./ui/dropdown-menu.tsx";
import { useEffect, useRef, useState } from "react";

type Props = {
  triggerTitle: string;
  triggerCustomStyles?: string;
  label?: string;
  options: string[];
  onSelect?: (option: string) => void;
  defaultOption?: string;
  resetCondition?: boolean;
  childWidth?: boolean;
};

function Dropdown({
  triggerTitle,
  label,
  options,
  onSelect,
  triggerCustomStyles,
  defaultOption,
  resetCondition,
  childWidth,
}: Props) {
  const [currentOption, setCurrentOption] = useState<string | null>();
  const [menuWidth, setMenuWidth] = useState<number | undefined>(0);

  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (defaultOption) setCurrentOption(defaultOption);
    setMenuWidth(menuRef.current?.clientWidth);
  }, []);

  useEffect(() => {
    if (resetCondition) {
      setCurrentOption(null);
    }
  }, [resetCondition]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={menuRef}
        className={`flex justify-between items-center ${
          triggerCustomStyles
            ? triggerCustomStyles
            : "w-full border border-gray-200 rounded-lg py-3 px-2"
        }`}
      >
        {currentOption ? currentOption : triggerTitle}
        <CiCircleChevDown className="text-2xl" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          width: menuWidth + "px",
        }}
        className="max-h-[400px] overflow-y-scroll"
      >
        {label ? <DropdownMenuLabel>{label}</DropdownMenuLabel> : null}
        {options &&
          options.map((option: string) => (
            <DropdownMenuItem
              className={`cursor-pointer ${childWidth ? "p-0" : ""}`}
              key={option}
              onClick={() => {
                setCurrentOption(option);
                if (onSelect) onSelect(option);
              }}
            >
              {option}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dropdown;
