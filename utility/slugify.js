export function createSlug(title) {
    console.log(title , "title in slugify function");
  if (!title) return ''; 
  // return empty string if title is undefined/null
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')           // replace spaces with -
    .replace(/-+/g, '-');           // collapse multiple -
}
