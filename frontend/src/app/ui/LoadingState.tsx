import { Grid, Skeleton } from "@mui/material";

interface LoadingStateProps {
  count?: number;
}

export default function LoadingState({ count = 3 }: LoadingStateProps) {
  return (
    <Grid container spacing={{ xs: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} key={index}>
          <Skeleton
            variant="rectangular"
            height={140}
            sx={{
              borderRadius: 1,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
