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

export async function updateAddrStatus(address: string, good: number, bad: number, ai: number | null) {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Ensure the server knows you're sending JSON
        },
        body: JSON.stringify({
            address: address,  // Or just `address` (shorthand syntax in ES6)
            good: good,
            bad: bad,
            ai: ai
        }),
    };
    
    try {
        const res = await fetch("https://greenpower.wayneies1206.workers.dev/addressStatus/upload", requestOptions);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json(); // Assuming the response is in JSON format
        console.log(data); // Process the response
    } catch (e) {
        console.error('Fetch error:', e);
    }
}