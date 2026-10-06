# David's cutout rig

One good David, cut into parts in Photoshop. The game moves the parts to make every animation: walk, run, jump, throw, roll, flip, double jump, climb, harp.

## 1. The starting pose
Side view, **facing right**, standing straight, arms and legs **slightly apart** so every limb can be seen in full (nothing hidden behind the body). Neutral face, mouth closed. Ask GPT for it with your first David sheet as the reference:

```
Same boy as the attached image (curly hair, cream tunic, brown shoulder bag, laced
sandals), same Pixar-style look. Full body, side view facing right, standing straight
with arms hanging slightly away from the body and legs slightly apart, so both arms and
both legs are fully visible. Neutral expression. Transparent background, no shadow,
no text.
```

## 2. The layers to cut (15)
"Near" = the arm/leg closest to the camera. "Far" = the one behind the body (a touch darker).

| # | Layer name | What's in it |
|---|---|---|
| 1 | `head` | head, hair, face, neck stub |
| 2 | `torso` | chest and tunic top, including the bag strap |
| 3 | `skirt` | the bottom of the tunic, from the belt down |
| 4 | `bag` | the shoulder bag |
| 5 | `arm_near_upper` | near upper arm |
| 6 | `arm_near_lower` | near forearm **and hand** together |
| 7 | `arm_far_upper` | far upper arm |
| 8 | `arm_far_lower` | far forearm and hand |
| 9 | `leg_near_thigh` | near thigh |
| 10 | `leg_near_shin` | near shin |
| 11 | `leg_near_foot` | near foot and sandal |
| 12 | `leg_far_thigh` | far thigh |
| 13 | `leg_far_shin` | far shin |
| 14 | `leg_far_foot` | far foot and sandal |
| 15 | `sling` | the sling, if it's visible (I can also draw the cord in code) |

## 3. The one tricky part: joints
When a limb rotates, the hidden bit under the joint shows. So **every piece needs a rounded end that tucks under the piece it joins**:
- the top of each upper arm is a rounded shoulder that goes under the torso,
- the top of each forearm overlaps the elbow,
- the top of each thigh goes up under the skirt,
- the top of each shin overlaps the knee,
- the neck goes down under the torso.

Paint those hidden bits in (they only need to be rough; they're mostly covered). Without them, gaps appear at the joints when he moves.

## 4. Exporting
- Keep every layer **in its original position on the same canvas.** Don't move or trim them.
- **File > Export > Layers to Files…**, PNG-24 with transparency, and **untick "Trim Layers"**.
- Every file comes out the same canvas size, so I can see exactly where each piece sits.
- Put them in `Desktop\david-sling-art\david-rig\`.

## 5. Extras (later, optional)
Extra heads on the same canvas: `head_blink`, `head_determined`, `head_hurt`, `head_happy`. Extra hands: `hand_fist`, `hand_open`.

## What happens next
I find the joints, build the rig, and send you a test animation of David walking, running and jumping before anything else gets built on it.
