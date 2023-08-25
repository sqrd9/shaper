# Shaper

This project resizes, crops and smart crops images from an URL.

In case of SVG the images the images can be passed trough is there is not a
specific conversion asked for via the `format` parameter ie `?format=png`.

The service is protected either by whitelisting domains or computing a signature
with a secret.

The project started a Docker artfifact because the sharp could not be installed
on the CloudFlare worker environement. Then a WASM version of sharp was
released.

## Credits

To [RReverser](https://github.com/RReverser/sharp-fork/tree/node-wasm-squash) for making a wasm version sharp possible

To [sharp](https://github.com/lovell/sharp) for building a awesome, high-level imagine manipulation.

## Towards a serverless solution

On August 3rd 2023, [an article][sharp-wasm] was published on converting sharp
dependencies to WASM that would open the usage of this project directly on
CloudFlare.

The [Push Request 3522][sharp-3522] was initialized on January 9th, 2023 but was
still not merged on August 18th, 2023. It is now 130 commits behind the main
repository.

The main maintainer of sharp has [stressed][commment-1] that this is a
StackBlitz only compatiblity but there is a [task][sharp-3750] including WASM
support.

The libvips required multi threading and node api (using _dirname) that kept me
from using the sharp WASM version on CloudFlare

[sharp-wasm]: https://blog.stackblitz.com/posts/bringing-sharp-to-wasm-and-webcontainers/
[sharp-3522]: https://github.com/lovell/sharp/pull/3522
[comment-1]: https://github.com/lovell/sharp/pull/3522#issuecomment-1665420973
[sharp-3750]: https://github.com/lovell/sharp/issues/3750

