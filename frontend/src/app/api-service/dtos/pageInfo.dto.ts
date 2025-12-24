export interface PageInfoDto {
  limit: number; // Number of items per page
  offset: number; // Offset for pagination
  count: number | null; // Total number of items
}

export interface PageDto<T = unknown> extends PageInfoDto {
  data: T; // Array of items for the current page
}
