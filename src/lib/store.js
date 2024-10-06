import { writable } from 'svelte/store';
const isBrowser = typeof window !== 'undefined';

function createPersistedStore(key, initialValue) {
    const storedValue = isBrowser ? localStorage.getItem(key) : null;

    const data = writable(storedValue ? JSON.parse(storedValue) : initialValue);


    data.subscribe((value) => {
        if (isBrowser && value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return data;
}

export const nombre = createPersistedStore('nombre', '');
