import { memo } from "react";
import OptimizedImage from "@/components/OptimizedImage";

interface ServiceCardProps {
  image: string;
  title: string;
  subtitle: string;
}

const ServiceCard = ({ image, title, subtitle }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
      {/* Circular image container - same structure as About page */}
      <div className="h-[250px] w-[250px] rounded-full bg-background border-2 border-[#8c3820] flex items-center justify-center">
        <div className="h-[220px] w-[220px] rounded-full overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      
      {/* Title and subtitle text */}
      <div className="mt-6 text-center max-w-[250px]">
        <h3 className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-[#a35f44] leading-tight" data-editor-id="h3-text-sm-sm-text-base-0" style={{ position: "relative" }}>
          {title}
        </h3>
        <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-[#a35f44] mt-1 leading-tight" data-editor-id="p-text-sm-sm-text-base-1" style={{ position: "relative", fontWeight: 700 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default memo(ServiceCard);
