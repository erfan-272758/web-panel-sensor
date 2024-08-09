export default function slugify(str = "") {
  return str.replace(/ /g, "-");
}
