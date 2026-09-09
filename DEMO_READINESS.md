# BeatVision-Test Demo Readiness

## Purpose

BeatVision-Test is a provider and sponsorship presentation prototype. It is intentionally deterministic when live provider credentials are unavailable. Its job is to demonstrate the product workflow and make the integration seams obvious without requiring a sponsor to fund the demo first.

## Presentation Checklist

- [x] Song-to-world workflow is represented in the UI
- [x] Visual World approval gate is persistent
- [x] World Assets approval gate is persistent
- [x] Stage navigation is available from the sidebar
- [x] Motion preview explicitly avoids external provider calls
- [x] Provider categories are mapped to concrete BeatVision capabilities
- [x] Provider-neutral integration architecture is documented
- [x] Sponsor integration brief is included
- [x] Sponsor demo talk track is included
- [x] Provider evaluation scorecard is included
- [x] Demo can operate without paid API credentials
- [x] Repository guidance excludes secrets from source control

## Five-Minute Demo Path

1. Open `index.html`.
2. Start with **The Song** and establish the creator problem.
3. Move to **Reveal the World** and show the generated visual-world concept.
4. Approve the world to demonstrate the creator control gate.
5. Move through **World Assets** and approve continuity assets.
6. Show **Storyboard** and **Scene Direction** to demonstrate structured orchestration.
7. Show **Visual Scenes** and explain the image-provider seam.
8. Run **Motion & Edit** and point out that the preview is deterministic and does not consume provider credits.
9. Finish at **The Pitch** and show exactly where Language, Image, Video, Audio Intelligence, and Infrastructure partners can contribute.

## What Is Intentionally Not Production

This prototype does not claim to provide production-grade authentication, billing, account management, live provider credentials, distributed rendering, or guaranteed final video generation. Those are integration targets for provider partnership rather than requirements for this presentation build.

## Sponsor Safety

Never place provider API keys, access tokens, service credentials, private URLs, or billing secrets in this repository. Live integrations should be introduced through environment-backed adapters outside the deterministic demo path.

## Definition of Ready

A sponsor should be able to understand the following without reading the entire codebase:

1. What BeatVision does.
2. Why the creator approves the world before generation.
3. How the creative workflow becomes structured generation jobs.
4. Which provider capabilities are needed at each stage.
5. What can be demonstrated without consuming paid credits.
6. What sponsorship, credits, compute, storage, or technical partnership would unlock next.

## Source of Truth

The prototype UI is the presentation surface. `ARCHITECTURE.md`, `SPONSOR_INTEGRATION.md`, `PROVIDER_BRIEF.md`, `DEMO_SCRIPT.md`, and `PROVIDER_SCORECARD.md` describe the intended provider-facing architecture and partnership case.
