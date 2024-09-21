export async function getAddrStatus(): Promise<{result: {"address": string, "status": string}[]}> {
    const requestOptions = {
        method: "GET",
    };
    try {
        const res = await fetch("https://greenpower.wayneies1206.workers.dev/addressStatus", requestOptions)
        console.log(res)
        const _res = await res.json()
        return _res as {result: {"address": string, "status": string}[]}
    } catch(e) {
        console.log(e)
        return {result: []}
    }
}