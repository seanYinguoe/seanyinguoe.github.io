# Bistability note: sources and media

The public note is `/research/bistable-kirigami/`, linked from the 2026 publication. It is a guide to the manuscript **under review**, not a substitute for its methods or supplementary information.

## Scientific source

Xiaoyuan Ying and Marcelo A. Dias, *Instability-induced bistable shape-morphing kirigami structures*, [arXiv:2607.26941v1](https://arxiv.org/html/2607.26941v1). Figure and equation numbers in the note refer to this version. Bibliographic references were checked against primary sources.

## Author-supplied media

Animations and the unit diagram come from **SES-Xiaoyuan Ying.pptx**. Only the selected media below are published; the complete presentation is not included.

| Public asset, under `static/assets/` | Original source |
|---|---|
| `bistable-kirigami-framework.png` | Existing author-supplied graphical abstract |
| `bistable-note/ligament-geometry.png` | SES slide 4, `image15.png` |
| `bistable-note/ligament-unit.mp4` | SES slide 5, `media1.mp4` |
| `bistable-note/smooth-mapping.mp4` | SES slide 11, `image32.gif` |
| `bistable-note/discrete-mapping.mp4` | SES slide 11, `image33.gif` |
| `bistable-note/dome-deployment.mp4` | SES slide 16, `image43.gif` |
| `bistable-note/double-dome-deployment.mp4` | SES slide 16, `image44.gif` |
| `bistable-note/anisotropic-deployment.png` | Author’s `anisotropic_deployment.pdf`, paper Fig. 4 |
| `bistable-note/design-workflow.png` | Author’s `workflow_process.pdf`, paper Fig. 6 |
| `bistable-note/experiments.png` | Author’s `experiment.pdf`, paper Fig. 8 |

Each MP4 has a same-named JPEG poster showing its first frame. Animations were converted with FFmpeg to H.264/yuv420p, preserving the original temporal ordering and duration, with no audio and fast-start metadata. Maximum widths: 1200 px for the ligament unit, 1000 px for the mapping pair and 1280 px for deployment examples. Research PDFs were rendered with Poppler at a maximum dimension of 1800 px. No geometry, scientific labels, or plotted data were redrawn or altered. Figures retain the original research palette and labels; surrounding typography and controls use the website’s Helvetica family.

## Interpretation to preserve when editing

- Bistability depends on unit geometry and the deformation path. It is not guaranteed for every unit or target surface.
- Deployment edge stretches are defined as deployed length divided by flat length. Do not confuse them with the reverse flattening scale convention in parts of the supplement.
- Smooth conformality is local; finite triangular cells may require unequal edge stretches.
- The isotropic/anisotropic comparison uses the same unit geometry and approximately the same area expansion. The displayed stretch values are rounded.
- The energy-well measure is eta = (E_max − E_min) / E_max; E_min is the deployed local minimum and E_max the intervening barrier.
- The Hencky bar-chain is a numerical approximation to a continuous ligament, not a physical linkage with pin joints.
- Deployment animations follow prescribed paths. They do not represent measured time-dependent motion. Their summed in-plane energies exclude out-of-plane interface bending.
- Experimental contour errors describe projected front-view profiles, not complete 3D surface reconstruction.
- Avoid importing exact HBM accuracy percentages from the presentation: the slide and manuscript versions report different rounded comparisons.

## Maintenance and checking

Run the normal build and public-output checks. When changing media or playback code, also check Play/Pause, Reset, keyboard scrubbing, paired mapping playback, switching deployment examples and mobile layout in a browser. Animations must start paused. The publication link should continue to lead to the note, with the original arXiv link retained while the manuscript is under review.
