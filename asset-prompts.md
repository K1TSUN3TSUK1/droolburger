# Görsel düzenleme istemleri

Araç: yerleşik OpenAI image_gen. Higgsfield kullanılmadı.

## assets/claw-cutout.png

Use case: background-extraction. Edit target is this exact burger advertising photo. Create one production PNG cutout on a genuinely TRANSPARENT alpha background for a website pendulum animation. Keep ONLY the central chrome arcade claw mechanism (including the top chrome connector going out of the top frame and its three curved fingers) holding the two central stacked burgers. Preserve their exact arrangement, photoreal textures, colors, proportions, silhouette and camera view. Both burgers and the claw are one connected suspended subject. REMOVE all blue background, all white circular branding/text, the black coiled cord at upper left, the paper/table at bottom, and all four extra burgers at the lower corners. Transparent negative spaces between claw fingers and the burgers are essential. No blue rectangle, no simulated transparency checkerboard, no new background or shadow, no text. Keep 4:5 portrait canvas, same alignment and original scale; central subject occupies original top through approximately 73% of canvas with empty transparent space below.

## assets/cabinet-cutout.png

Use case: background-extraction. Make an EXACT cutout of this blue emergency burger cabinet on genuine transparent alpha background. Remove ONLY background outside the cabinet: the blue wall and the large background words WHEN HUNGER and TAKES OVER. Preserve the entire cabinet and contents EXACTLY, its chrome blue frame, blue right side, glass interior with same reflections, the exact burger and shelf and positions. Keep lettering ON the cabinet IN CASE OF EMERGENCY and DROOL intact. Keep same 4:5 portrait canvas and EXACT original cabinet bounding box, perspective and scale (left x15%, right x90%, top y14.5%, bottom y88%). Do not recenter or zoom. No axe. No checkerboard, no colored or white background, no drop shadow outside cabinet. This is a precise transparent compositing asset which must align with the source.
# Foreground burgers — built-in OpenAI Imagegen

Saved asset: `dist/assets/claw-foreground.png`

Edit target: supplied Drool claw burger photograph. Extract ONLY the four stationary burgers along the bottom left and bottom right corners. Remove the entire chrome claw, its two suspended center burgers, all logos, all blue background, and the printed paper/table surface. Output a true transparent PNG with actual alpha, not a checkerboard. Preserve the exact photographic appearance, scale and positions of the four bottom corner burgers on the SAME portrait 1080x1350 canvas; top 60% must be empty transparent, and the space between the corner burgers transparent. Preserve original edge cropping. This will be a static foreground layer under an independently animated claw on a website. No additional food, no text, no shadows outside the food silhouettes.
