
export const prefetchRouteComponent = (path: string) => {
  // This is a simplified example. In a real-world scenario with a manifest,
  // you would look up the actual JS chunk for the route.
  // For now, we rely on browser prefetching heuristics.
  if (document.querySelector(`link[rel="prefetch"][href="${path}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  // 'as' attribute is tricky without knowing if it's a doc or script.
  // Modern browsers often do the right thing without it for prefetch.
  document.head.appendChild(link);
};
