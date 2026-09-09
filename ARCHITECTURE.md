# BeatVision-Test Architecture

## Principle

The presentation edition separates the **creative workflow** from the **provider engine**.

```text
Creator
  ↓
Project Input
  ↓
World Builder
  ↓
World Approval Gate
  ↓
World Assets
  ├─ Style Bible
  ├─ Character Sheet
  └─ Environment Sheet
  ↓
Storyboard
  ↓
Scene Direction
  ↓
Scene Visuals
  ↓
Motion / Video Provider
  ↓
Final Music Video
```

## Provider seams

A production implementation should expose explicit provider interfaces for:

- `LanguageProvider.generateWorldReport(project)`
- `LanguageProvider.generateWorldAssets(world)`
- `LanguageProvider.generateStoryboard(world, assets)`
- `LanguageProvider.generateScenePrompts(storyboard, assets)`
- `ImageProvider.generateSceneImage(scene, references)`
- `VideoProvider.animateScene(sceneImage, scene, audioContext)`
- `StorageProvider.putAsset(asset)`
- `JobProvider.enqueue(job)`

Each provider returns normalized BeatVision data rather than provider-specific shapes leaking into the UI.

## Demo mode

When no live provider is configured, the presentation uses deterministic content. This makes the sponsor demonstration repeatable and avoids accidental paid calls.

A live adapter can replace a demo adapter without changing the workflow presentation.

## Historical recovery principles

The prototype preserves the strongest ideas from earlier BeatVision iterations:

- staged approvals
- world report before generation
- reusable world assets
- eight-beat storyboard structure
- scene-level reference selection
- provider routing
- fallback behavior
- motion/export planning

It intentionally does not present old persistence, credentials, or production-account assumptions as part of the sponsor demo.
