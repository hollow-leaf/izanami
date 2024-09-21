import { useEffect } from 'react'
import { useSignTypedData } from 'wagmi'
import { updateAddrStatus } from '../services/api'

export function SignButton({address, evaluation, good, bad, ai }: {address: `0x${string}`, evaluation: boolean, good: number, bad: number, ai: number | null}) {

    const { signTypedData, isSuccess } = useSignTypedData()

    useEffect(() => {
        if(isSuccess) {
            updateAddrStatus(address, good, bad, ai)
            alert("Vote successfully!")
        }
    }, [isSuccess])

    return (
        <button
            disabled={isSuccess}
            onClick={() =>
                signTypedData({
                types: {
                    Address: [
                    { name: 'address', type: 'address' },
                    { name: 'evaluation', type: 'bool' },
                    ],
                },
                primaryType: 'Address',
                message: {
                    "address": address,
                    "evaluation": evaluation
                },
                })
            }
        >
            {
                evaluation ?
                <img src="thumbs-up.png" className="h-[40px] p-2 "></img>:
                <img src="handdown.png" className="h-[40px] p-2 "></img>
            }
        </button>
    )
}