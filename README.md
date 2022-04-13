# 🔑 → GPGQR → 🏞 → 🖨

> **gpgqr** helps to back up secret GPG keys as QR codes that may be printed

### Requirements

- https://github.com/google/zx
- `split` or `gsplit` for MacOS
- `paperkey`
- `qrencode`
- `zbarimg`

## Creating backup

1. ☝️ Install all the dependencies above.

2. 🔑 Check if you have your secret keys on your machine:

```shell
$ gpg -K
/var/folders/jx/5ll9xg7166945zr_jrzh423m0000gn/T/gnupg_202204132230_XXX.6TZDeVqr/pubring.kbx
--------------------------------------------------------------------------------------------
sec   rsa4096 2022-04-13 [SC]
      5E4A60CDCE1374ADE9D4B42E311366FBF780DB86
uid           [ultimate] Eugene Dzhumak <eugene@example.com>
ssb   rsa4096 2022-04-13 [E]
```

If you see a hash symbol near the key type (`sec#`), it means your key is not on your machine. Did you store it offline
on a USB drive?

3. 🏞 Run backup script providing your key identifier:

```shell
$ ./backup.mjs 5E4A60CDCE1374ADE9D4B42E311366FBF780DB86
rm -f generated/*
cp index.html generated/
gpg --export-secret-key 5E4A60CDCE1374ADE9D4B42E311366FBF780DB86 | paperkey --output-type raw | base64 | gsplit -C 1500 -d -a 2 - generated/temp-chunk-
cat generated/temp-chunk-00
qrencode -l L -o generated/qr-1.png
cat generated/temp-chunk-01
qrencode -l L -o generated/qr-2.png
cat generated/temp-chunk-02
qrencode -l L -o generated/qr-3.png
```

4. 🖨 Open `./generated/index.html` in your browser and print the page or save it as PDF (
   see [example](example/example.pdf))
5. ✨ You are awesome ✨

## Restoring

To restore secret keys you need to have your public key, what usually is not a problem.

1. 🏞 Place QR images inside `/generated` folder naming them with number suffix for proper sorting (like `qr-1.png`)
2. 🔐 Run the script providing a path to your public key file (binary, not armored)

```shell
$ ./restore.mjs ~/pubkey.gpg
zbarimg -q --raw ./generated/*.png | base64 -d | paperkey --pubring /Users/eugenedzhumak/pubkey.gpg | gpg --import
gpg: key 311366FBF780DB86: public key "Eugene Dzhumak <eugene@example.com>" imported
gpg: key 311366FBF780DB86: secret key imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg:       secret keys read: 1
gpg:   secret keys imported: 1
```

3. ✅ Done. Check your GPG keys, they were restored:

```shell
$ gpg --list-secret-keys
/var/folders/jx/5ll9xg7166945zr_jrzh423m0000gn/T/gnupg_202204132230_XXX.6TZDeVqr/pubring.kbx
--------------------------------------------------------------------------------------------
sec   rsa4096 2022-04-13 [SC]
      5E4A60CDCE1374ADE9D4B42E311366FBF780DB86
uid           [ unknown] Eugene Dzhumak <eugene@example.com>
ssb   rsa4096 2022-04-13 [E]

$ gpg --list-public-keys
/var/folders/jx/5ll9xg7166945zr_jrzh423m0000gn/T/gnupg_202204132230_XXX.6TZDeVqr/pubring.kbx
--------------------------------------------------------------------------------------------
pub   rsa4096 2022-04-13 [SC]
      5E4A60CDCE1374ADE9D4B42E311366FBF780DB86
uid           [ unknown] Eugene Dzhumak <eugene@example.com>
sub   rsa4096 2022-04-13 [E]
```

### Links and credits

- [Paperkey - an OpenPGP key archiver](https://www.jabberwocky.com/software/paperkey/)
- [Paperkey ArchWiki](https://wiki.archlinux.org/title/Paperkey)
- [Create a paper backup of your GPG key](https://medium.com/@johnnymatthews/create-a-paper-backup-of-your-gpg-key-5e43894c59a)
- [Producing printable QR codes for persistent storage of GPG private keys](https://gist.github.com/joostrijneveld/59ab61faa21910c8434c)
- https://github.com/balos1/easy-gpg-to-paper
