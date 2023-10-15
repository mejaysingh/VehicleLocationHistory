
export function has(key) {
    return import.meta.env['VITE_' + key] ? true : false
}

export function get(key, value = null) {
    return import.meta.env['VITE_' + key] ? import.meta.env['VITE_' + key]  : value
}