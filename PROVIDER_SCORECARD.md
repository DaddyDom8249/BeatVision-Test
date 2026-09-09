# BeatVision Provider Evaluation Scorecard

Use this as a fast technical review sheet when a provider evaluates the prototype.

| Capability | BeatVision needs | Provider can demonstrate | Success signal |
|---|---|---|---|
| Language & reasoning | Structured world/story generation | World report, story beats, scene direction | Coherent visual world from song context |
| Image generation | Consistent visual assets | Style frame, character, environment, scene image | Identity survives across scenes |
| Video generation | Controlled motion from approved frames | Image-to-video, camera motion, temporal consistency | Motion preserves approved world |
| Audio intelligence | Musical structure and timing | BPM, sections, energy, beat events | Visual pacing follows the song |
| Infrastructure | Long-running media workload | Jobs, storage, compute, delivery | Reliable generation at creator scale |

## Partnership levels

### Capability Pilot

One provider capability connected to the existing prototype with limited credits and a defined demonstration path.

### Sponsored Prototype

Provider credits or infrastructure support sufficient to demonstrate an end-to-end song-to-video workflow using the provider's technology.

### Strategic Partnership

Technical collaboration, program access, infrastructure support, and a documented production integration path.

## What should be measured

- Creative quality improvement over deterministic demo output
- Consistency of world, character, and environment across scenes
- Latency from request to usable asset
- Reliability and retry behavior
- Cost per generated scene or finished minute
- Input/output quality and format compatibility
- Ability to scale from a single demo to many creator jobs

## Evaluation rule

A provider is a strong fit when its capability improves the creator experience **without forcing BeatVision to abandon its provider-neutral orchestration model**.

The prototype should make this comparison easy. The goal is not to claim a provider is already integrated. The goal is to give a provider a precise place to prove what its technology can do.
