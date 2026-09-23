// Verifies the Math and ML learning tracks: every concept is in a track, no track repeats a
// concept, and each concept comes after all of its prerequisites that are in the same track.
import { concepts, conceptMap } from '../src/data/concepts.js';
import { trackIds, trackOrder } from '../src/data/learningTracks.js';

const problems = [];
const covered = new Set();
for (const trackId of trackIds) {
  const order = trackOrder(trackId);
  const position = new Map(order.map((id, index) => [id, index]));
  if (position.size !== order.length) problems.push(`${trackId}: a concept is listed twice`);
  order.forEach((id, index) => {
    if (!conceptMap[id]) problems.push(`${trackId}: unknown concept "${id}"`);
    covered.add(id);
    for (const prerequisite of conceptMap[id]?.prerequisites ?? []) {
      if (position.has(prerequisite) && position.get(prerequisite) > index) {
        problems.push(`${trackId}: "${id}" comes before its prerequisite "${prerequisite}"`);
      }
    }
  });
}
for (const concept of concepts) if (!covered.has(concept.id)) problems.push(`"${concept.id}" is in no track`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Tracks OK: ${trackIds.map((id) => `${id} ${trackOrder(id).length}`).join(', ')}; ${covered.size} of ${concepts.length} concepts covered.`);
