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
import { useNavigate } from "react-router-dom";
import { CategoryInfo } from "../../api-service/dtos/category.dto";

interface CategoryDropdownProps {
  categories: CategoryInfo[];
  displayNavigation?: boolean;
  isMobile: boolean;
  fetchCategories: () => void | Promise<void>;
}

export default function CategoryDropdown({
  categories,
  displayNavigation,
  isMobile,
  fetchCategories,
}: CategoryDropdownProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (!open) {
      await fetchCategories();
    }
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAllCategoriesClick = () => {
    setSelectedIndex(null);
    setOpen(false);
    navigate("/categories");
  };

  const handleCategoryClick = (
    index: number,
    categoryId: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    navigate(`/categories/${categoryId}`);
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
                  <MenuItem onClick={handleAllCategoriesClick}>
                    All Categories
                  </MenuItem>
                  {categories.map((category, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={() => handleCategoryClick(index, category.id)}
                    >
                      {category.categoryName}
                    </MenuItem>
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
