export function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

export function sortByNum(a, b) {
    return Number(a.match(/(\d+)/)[0]) - Number(b.match(/(\d+)/)[0])
}
