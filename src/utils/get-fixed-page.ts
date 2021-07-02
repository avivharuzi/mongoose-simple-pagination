export const getFixedPage = (page: number | string): number => {
  return isNaN(+page) || +page < 1 ? 1 : +page;
};
