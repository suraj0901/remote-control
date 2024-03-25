import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { MenuButton } from '../MenuButton'
import { PeerWrapper } from '../PeerWrapper'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { ChatForm } from './ChatForm'
import { useMessage } from './useMessage'

function ChatBox({ peer }: { peer: PeerWrapper }) {
  const { message_list, send_message } = useMessage({ peer })
  return (
    <Sheet>
      <SheetTrigger>
        <MenuButton title="Chat">
          <Button size="icon">
            <ChatBubbleIcon />
          </Button>
        </MenuButton>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full gap-1 pb-4">
          <ScrollArea className="flex-1">
            {message_list.map((message) => (
              <div
                key={message.time_stamp}
                className="flex max-w-[280px] my-1 bg-gray-600/30 px-2 rounded items-baseline justify-between"
              >
                <p>{message.message}</p>
                <p className="text-xs">{RelativeTime(message.time_stamp)}</p>
              </div>
            ))}
          </ScrollArea>
          <ChatForm sendMessage={send_message} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
export default ChatBox

function RelativeTime(date) {
  const date_format = new Date(date)
  return date_format.toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
