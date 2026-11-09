// Legacy installations may still import this entrypoint until reinstalled.
// It intentionally does not scan, start timers, or write package files.
export async function onRequest(){return undefined;}
