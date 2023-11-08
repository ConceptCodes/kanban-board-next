import { Card, CardDescription } from "@/components/ui/card";

import { cn } from "@/utils";

interface IIconProps {
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const Icon = ({ icon, selected, onClick }: IIconProps) => {
  return (
    <Card
      className={cn(
        "mr-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center hover:border-4 hover:border-primary hover:text-white transition duration-200 ease-in-out w-20 h-20",
        { "border-4 border-primary shadow-lg": selected },
      )}
      onClick={onClick}
    >
      <CardDescription>
        <h3 className="mb-4 text-xl">{icon}</h3>
      </CardDescription>
    </Card>
  );
};

export default Icon;
