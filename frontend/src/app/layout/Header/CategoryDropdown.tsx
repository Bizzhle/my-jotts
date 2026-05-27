import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryData } from "../../api-service/dtos/category.dto";

interface CategoryDropdownProps {
  categories: CategoryData[];
  displayNavigation?: boolean;
  isMobile: boolean;
}

export default function CategoryDropdown({
  categories,
  displayNavigation,
  isMobile,
}: CategoryDropdownProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
    setSelectedIndex(null);
  };

  if (!displayNavigation || isMobile) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
      <ButtonGroup variant="text" ref={anchorRef}>
        <Button
          sx={{
            backgroundColor: "primary.main",
            color: "secondary.dark",
            "&:hover": {
              backgroundColor: "primary.dark",
              color: "secondary.dark",
            },
          }}
          onClick={handleToggle}
        >
          Categories
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1, mt: "45px", minWidth: 150 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem onClick={() => navigate("/categories")}>
                    All Categories
                  </MenuItem>
                  {categories.map((category, index) => (
                    <Link
                      to={`/categories/${category.id}`}
                      key={index}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <MenuItem
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {category.categoryName}
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
