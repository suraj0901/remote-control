import { Button } from './components/ui/button'
import { CopyIcon } from '@radix-ui/react-icons'
import { useToast } from './components/ui/use-toast'

interface Prop {
  peerState?: {
    id?: string
  }
}

export function DisplayCopyId({ peerState }: Prop) {
  const { toast } = useToast()
  console.log({ peerState })
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(peerState?.id ?? '')
      toast({
        title: 'Copied ID to clipboard',
        description: peerState?.id
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Unable to copy id'
      })
    }
  }
  return (
    <div className="flex items-center gap-x-4">
      <p>{peerState?.id}</p>
      <Button variant="outline" size="icon" onClick={handleCopy}>
        <CopyIcon />
      </Button>
    </div>
  )
}
