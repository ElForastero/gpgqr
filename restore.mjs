#!/usr/bin/env zx

const pubkey = process.argv[process.argv.length - 1];

const b64 = await $`zbarimg -q --raw ./generated/*.png | paperkey --pubring ${pubkey}`
