#!/usr/bin/env zx

const pubkey = process.argv[process.argv.length - 1];

await $`zbarimg -q --raw ./generated/*.png | base64 -d | paperkey --pubring ${pubkey} | gpg --import`
