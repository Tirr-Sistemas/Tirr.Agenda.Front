/**
 * @description Propriedades de uma opção de horário selecionável.
 */
type TimeSlotProps = {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

/**
 * @description Renderiza um horário como botão com estado de seleção acessível.
 *
 * @param props - Propriedades recebidas pelo componente.
 *
 * @returns Elemento React renderizado pelo componente.
 */
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
