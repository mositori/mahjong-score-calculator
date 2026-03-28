type Props = {
  label: string;
  onClick: () => void;
};

export function OptionButton({ label, onClick }: Props) {
  return (
    <button className="option-button" onClick={onClick}>
      {label}
    </button>
  );
}
