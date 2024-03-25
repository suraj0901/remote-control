import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { MenuButton } from './MenuButton'

function EndCall({ onClose }: { onClose: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <MenuButton title="End Session">
          <Button variant="destructive" size="icon">
            <Cross2Icon />
          </Button>
        </MenuButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End session</AlertDialogTitle>
          <AlertDialogDescription>Do you want to end session?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClose}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default EndCall
