import { Link, Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (!item.href || isLast) {
          return (
            <Typography
              key={index}
              color={isLast ? "inherit" : "text.secondary"}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component={RouterLink}
            to={item.href}
            color="inherit"
            sx={{ textDecoration: "none" }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
