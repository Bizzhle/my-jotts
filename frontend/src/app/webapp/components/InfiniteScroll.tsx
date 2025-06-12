import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useActivities } from "../utils/contexts/hooks/useActivities";

interface WithIntersectionObserverProps {
  children?: React.ReactNode;
}
export const WithIntersectionObserver = ({
  children,
}: WithIntersectionObserverProps) => {
  const { activities, setPage, pageInfo } = useActivities();
  const loader = useRef<HTMLDivElement | null>(null);
  const currentPage =
    Math.floor((pageInfo.offset ?? 0) / (pageInfo.limit ?? 10)) + 1;
  const totalPages = Math.max(
    1,
    Math.ceil((pageInfo.count ?? 0) / (pageInfo.limit ?? 10))
  );
  useEffect(() => {
    if (!loader.current) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        activities.length < (pageInfo.count ?? 0) &&
        currentPage < totalPages
      ) {
        setPage(currentPage + 1);
      }
    };

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const currentLoader = loader.current;
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [currentPage, totalPages, activities.length, pageInfo, setPage]);

  return (
    <>
      {children}
      <Box ref={loader} sx={{ height: 40 }} />
    </>
  );
};
