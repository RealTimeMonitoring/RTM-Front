export default function filterPoint(value: number, latitude: boolean): boolean {
  return !isNaN(value) && latitude
    ? value >= -90 && value <= 90
    : value >= -180 && value <= 180;
}
