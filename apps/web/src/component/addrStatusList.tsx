import { useEffect, useState } from "react"
import { getAddrStatus } from "../services/api"
import { useLocation } from 'react-router-dom';
import { SignButton } from "./signButton";

export type addressDetail = {
    address: string
    good: number
    bad: number
    analytics: string
}

export function AddrStatusList() {

    const location = useLocation();

    // Use URLSearchParams to extract query parameters
    const searchParams = new URLSearchParams(location.search);
    const address = searchParams.get('address');

    const [addrStatus, setAddrStatus] = useState<{"address": string, "status": string}[]>([])

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const res = await getAddrStatus()
        console.log(res)
        if(address) {
            console.log(address)
            let t: boolean = false
            res.result.map((a) => {
                if(a.address == address) {
                    setAddrStatus([a])
                    t = true
                } 
            })
            if(!t) setAddrStatus(res.result)
        } else {
            setAddrStatus(res.result)
        }
    }

    return (
        <div className="w-full my-[90px]">
            <div className="w-full flex justify-end my-10">
                <div>
                    <form className="w-[340px] mx-auto mr-2">   
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Address..."/>
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-0 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">Search</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Good
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Bad
                            </th>
                            <th scope="col" className="px-6 py-3 text-wrap">
                               { "analytics (Power by Phala)" }
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Vote
                            </th>
                        </tr>
                    </thead>
                    {
                        addrStatus.map((a, index) => {
                            return (
                                <tbody key={index} className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            {a.address}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {a.status.split(":")[0]}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {a.status.split(":")[1]}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {a.status.split(":")[2] ? a.status.split(":")[2] : "Unready"}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {Number(a.status.split(":")[0]) + Number(a.status.split(":")[1]) > 100 ? Number(a.status.split(":")[0]) > Number(a.status.split(":")[1]) ? "Reliable" : "Suspicious" : "Uncertain"}
                                        </th>
                                        <th scope="col" className="flex px-2 py-3">
                                            <SignButton address={a.address as `0x${string}`} evaluation={true} good={Number(a.status.split(":")[0]) + 1} bad={Number(a.status.split(":")[1])} ai={a.status.split(":")[2] ? Number(a.status.split(":")[2]) : null}/>
                                            <SignButton address={a.address as `0x${string}`} evaluation={false} good={Number(a.status.split(":")[0])} bad={Number(a.status.split(":")[1]) + 1} ai={a.status.split(":")[2] ? Number(a.status.split(":")[2]) : null}/>
                                        </th>
                                    </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}