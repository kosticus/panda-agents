---
id: pa-p57f
status: closed
deps: []
links: []
created: 2026-04-02T00:07:46Z
type: task
priority: 2
assignee: Kimberly Kost
---
# The current *2 edge sprites (gather2, water2, garden2) have grass borders on all four sides, rendering as isolated blobs when tiled at zone edges. To get smooth zone-to-grass transitions, each zone needs directional edge variants: N, S, E, W (and optionally corners — NE, NW, SE, SW). The isZoneEdge() helper already identifies boundary tiles; it would need to return which sides are edges so getGroundSprite() can pick the correct directional variant. Scope: design 4-8 directional edge sprites per zone (gathering, water, garden), update isZoneEdge to report edge directions, update getGroundSprite to select the correct variant.

