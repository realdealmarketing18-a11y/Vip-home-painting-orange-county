#!/bin/bash
# Placeholder "camera legs" for the scroll-world demo — Ken-Burns push-ins
# synthesized locally (zero Higgsfield credits). Real build replaces these
# with Seedance camera flights per the scroll-world skill.
set -e
mk () { # $1=src $2=out $3=zoomrate
  ffmpeg -y -loop 1 -framerate 30 -t 8 -i "$1" -vf \
    "scale=4200:-2:force_original_aspect_ratio=increase,crop=4200:2362,zoompan=z='1+$3*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,unsharp=5:5:0.5" \
    -an -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2" 2>/dev/null
  echo "made $2"
}
mk assets/estate.jpg  assets/vid/estate.mp4  0.0016
mk assets/canvas.webp assets/vid/canvas.mp4  0.0020
mk assets/studio.jpg  assets/vid/studio.mp4  0.0014
mk assets/spec.jpg    assets/vid/spec.mp4    0.0018
mk assets/reveal.jpg  assets/vid/reveal.mp4  0.0011
