import { cn } from "../../lib/utils";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-md", className)}>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};
