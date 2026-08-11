# Squircler

**Squircler** is a [Tauri][] (v2) wrapper around [azmaldev][]'s delightfully
minimal [squircle-generator][original] web app.

The ridiculousness of building such a contraption to replicate what is probably
a one-liner with ImageMagick isn't lost on me. However, such as it is,
Squircler provides a cross-platform, single-binary solution for **transforming
images into rounded square[^fn1] shapes**, to be used, for example, as
application launcher icons.

<p align="center">
<a href="img/screenshot.png"><img alt="A screenshot of Squircler" src="img/screenshot.png" width="480" /></a>
</p>

See azmaldev's [original README](src/README.md) for all the marketing copy.

I created this tool _specifically_ to make it easier to generate app icons for
["progressive" web apps][pwa] managed by [artemanufrij/webpin][webpin] or
[linuxmint/webapp-manager][wam]. I have a lot of these, and I like them to have
nice icons.

## Online version

_Original source: [azmaldev/squircle-generator][original]_

There's an online (web app) version available [here][webapp], which itself
works fine as a PWA.

## Credits and license

Built by [azmaldev][azmaldev] and me, with machine assistance. I used
[Aider][] with the gemini-3.1-pro-preview model for code generation, and
performed manual reviews of the diffs before committing. Commits which contain
machine-generated code are credited as such.

[Original icon][icon] by me, with inspiration taken from Daniel Witt's
[Squircle Icon Maker][dansapp], and many apologies to people who dislike the
Ubuntu "aubergine" color scheme.[^fn2] 

The license for this code is [as yet undetermined][license], but obviously no
warranty is expressed or implied. If this breaks your system, you get to keep
both pieces.

[^fn1]: In spite of this application's name, the icons generated are not
  technically [squircles](https://en.wikipedia.org/wiki/Squircle). On macOS,
  these icons will probably stand out for that, but on a Mac, you probably have
  lots of better alternatives anyway.
[^fn2]: Gemini 3.5 Flash-Lite supplied me with an SVG having the basic
  "squircle" geometry, but did a miserable job with the icon _itself_, so I
  rolled up my sleeves and did it myself in Inkscape.

[tauri]: https://tauri.app/
[azmaldev]: https://github.com/azmaldev
[aider]: https://github.com/aider-ai/aider
[original]: https://github.com/azmaldev/squircle-generator
[pwa]: https://en.wikipedia.org/wiki/Progressive_web_app
[webpin]: https://github.com/artemanufrij/webpin
[wam]: https://github.com/linuxmint/webapp-manager
[webapp]: https://azmaldev.github.io/squircle-generator
[icon]: img/icon.svg
[dansapp]: https://apps.apple.com/us/app/squircle-icon-maker/id6476942163
[license]: https://github.com/azmaldev/squircle-generator/issues/1
