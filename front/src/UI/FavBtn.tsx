import React, { useState } from "react";
import { Button, ButtonProps } from "react-admin";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const FavBtn = ({
  onClick,
  activeDefault = false,
  ...props
}: ButtonProps & {
  onClick: (active: boolean) => void;
  activeDefault?: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(activeDefault);

  return (
    <Button
      {...props}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const newFav = !isFavorite;
        setIsFavorite(newFav);
        if (onClick) {
          onClick(newFav);
        }
      }}
    >
      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
    </Button>
  );
};

export default FavBtn;
