import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { PeerIdInputForm, PeerIdInputFormProp } from './PeerIdInputForm'
import { useState } from 'react'

function PeerIdInput({ onSuccess }: PeerIdInputFormProp) {
  const [open_dialog, set_open_dialog] = useState(false)
  return (
    <Dialog open={open_dialog} onOpenChange={set_open_dialog}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-1" /> Connect Peer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Peer</DialogTitle>
        </DialogHeader>
        <div className="py-4 gap-4 grid">
          <PeerIdInputForm
            onSuccess={(values) => {
              onSuccess(values)
              set_open_dialog(false)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default PeerIdInput
