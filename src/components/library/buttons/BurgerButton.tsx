interface Props {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  onOpen: () => void;
}

const BurgerButton = ({ isOpen, onClose, onOpen, className }: Props) => {
  return (
    <button
      onClick={isOpen ? onClose : onOpen}
      className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200 border ${className}`}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  )
}

export default BurgerButton
