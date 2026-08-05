type TimeSlotProps = {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

const TimeSlot = ({ value, selected, onSelect }: TimeSlotProps) => (
  <button
    type="button"
    className={`tirr__time-slot ${selected ? "is-selected" : ""}`}
    onClick={() => onSelect(value)}
    aria-pressed={selected}
  >
    {value}
  </button>
);

export default TimeSlot;
