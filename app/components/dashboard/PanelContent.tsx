import FormButton from "../inputFormPemodalPerusahaan/component/FormButton";

export const PanelContent: React.FC<{
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  actionButton?: () => void;
}> = ({ title, message, icon, buttonTitle, actionButton }) => {
  return (
    <div className="flex flex-col items-center max-w-md">
      {icon && <div className="text-teal-700 mb-4">{icon}</div>}
      <h2 className="font-bold text-xl md:text-2xl text-black mb-2">{title}</h2>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
        {message}
      </p>

      {buttonTitle && (
        <FormButton onClick={actionButton}>{buttonTitle}</FormButton>
      )}
    </div>
  );
};
