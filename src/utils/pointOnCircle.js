export function pointOnCircle(data) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [data.lng, data.lat]
    },
    properties: data
  };
}