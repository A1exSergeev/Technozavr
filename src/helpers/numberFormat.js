export default function numerFormat(value) {
  return new Intl.NumberFormat().format(value);
}