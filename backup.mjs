#!/usr/bin/env zx
import { sortByNum } from './utils.mjs'
import { config } from './config.mjs'

const keyID = process.argv[process.argv.length - 1]
const isMacOS = os.type() === 'Darwin'
const tempFilePath = config.outputPath.concat('/', 'temp-chunk-')
const fileName = config.outputPath.concat('/', config.qrPrefix)

/**
 * Remove temporary files from last run
 */
await $`rm -f ${config.outputPath}/*`
await $`cp index.html ${config.outputPath}/`

/**
 * Split the file by 1500 bytes chunks
 */
if (isMacOS) {
    await $`gpg --export-secret-key ${keyID} | paperkey --output-type raw | base64 | gsplit -C ${config.sliceSize} -d -a 2 - ${tempFilePath}`
} else {
    await $`gpg --export-secret-key ${keyID} | paperkey --output-type raw | base64 | split -C ${config.sliceSize} -d -a 2 - ${tempFilePath}`
}

/**
 * Generate QR Codes
 */
const files = await globby(`${tempFilePath}*`)
files.sort(sortByNum)

for (const [i, file] of Object.entries(files)) {
    const name = fileName.concat(Number(i) + 1, '.png')
    await $`cat ${file}`.pipe($`qrencode -l L -o ${name}`)
    await fs.unlink(file)
}

/**
 * Generate HTML
 */
const images = await globby(`${fileName}*`)
let html = ''
for (const [i, path] of Object.entries(images)) {
    const img = path.split('/').slice(-1)[0]
    html = html.concat(`
        <figure>
            <img src='${img}' />
            <figcaption>
                QR ${Number(i) + 1} / ${images.length}
            </figcaption>
        </figure>
`)
}

html = html.concat(`
    <header>
        Backup of: ${keyID}
        <br>
        Created at: ${new Date().toLocaleDateString()}
    </header>
    <footer>
        Total chunks: ${images.length}
        <br>
        Made with: ${config.repoUrl}
    </footer>
`)

/**
 * Write HTML
 */
const page = await fs.readFile('index.html')
let pageContent = page.toString()
pageContent = pageContent.replace(/{content}/, html)

await fs.writeFile(`${config.outputPath}/index.html`, pageContent)
