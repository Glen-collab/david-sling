# Making sprites from video

Glen makes short AI video clips (Grok) of each move. They get split into frames and turned into **smooth** sprite sheets (Pixar look, like the unicorn game). No pixel step.

## 1. Make the clip
Upload the David reference (a frame from his walk clip), then:

```
This exact boy, same look. Side view, facing right, full body always in frame,
[WALKING IN PLACE like on a treadmill] (he does not move across the screen).
Locked, static camera, no zoom, no camera movement. Plain solid bright green
background (#00FF00), no floor, no shadow, no other objects. 3 seconds.
```
Swap the bracketed part for each move:
- walking in place, arms swinging
- running in place
- jumping straight up and landing
- swinging a sling over his head and throwing (stays in place)
- crouching, tucking and rolling forward (it's OK if he moves; I'll re-centre him)
- a forward flip in the air
- sitting and playing a small harp

**Tips:** in place + locked camera = the cleanest frames. One move per clip. Green background. Keep the reference image the same for every clip so David always matches.

## 2. Drop it in
Save the video (mp4 is fine) in `Desktop\david-sling-art\video\`, named for the move: `david_walk.mp4`, `david_run.mp4`, ...

## 3. What happens to it (`tools/vid2sprite.py`)
1. Split into frames (ffmpeg).
2. Pick one clean loop: the frame where the stride matches the first one again.
3. Remove the green background.
4. Line up the feet on one ground line and centre him.
5. Scale him to the standard height (240 px), smoothly, so every animation matches.
6. Save the sprite sheet plus a preview GIF in `claude-checks` for Glen to approve.

The same steps work for the lamb, the animals, the people and the bosses.

## Running the converter
```
python tools/vid2sprite.py "<clip>.mp4" "<out>/david_walk"            # looping moves: walk, run, idle
python tools/vid2sprite.py "<clip>.mp4" "<out>/david_jump" --once      # one-shot moves: jump, throw, roll, flip
```
Options: `--frames 16` for more frames, `--height 240` for the character height.
Output: `_sheet.png` (one row, transparent), `_preview.gif`, and a `.json` with frame size, timing and the foot point.

**Same framing every clip:** add "full body, centred, same distance from the camera as the reference" to the prompt, so David is the same size in every move.
