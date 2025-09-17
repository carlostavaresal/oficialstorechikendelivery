import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { BusinessAddress } from "@/pages/delivery/DeliveryAreas";

interface GoogleMapsLinkProps {
  address: BusinessAddress;
  className?: string;
}

const GoogleMapsLink: React.FC<GoogleMapsLinkProps> = ({ address, className }) => {
  const formatAddressForUrl = (addr: BusinessAddress): string => {
    const fullAddress = `${addr.street}, ${addr.number}, ${addr.neighborhood}, ${addr.city}, ${addr.state}, ${addr.postalCode}`;
    return encodeURIComponent(fullAddress);
  };

  const openGoogleMaps = () => {
    const addressParam = formatAddressForUrl(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressParam}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Button
      onClick={openGoogleMaps}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
    >
      <MapPin className="h-4 w-4" />
      Ver no Google Maps
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
};

export default GoogleMapsLink;