import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { FieldValues, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface ChatFormProp {
  sendMessage: (message: string) => void
}

export function ChatForm({ sendMessage }: ChatFormProp) {
  const form = useForm()
  const onSubmit = (data: FieldValues) => {
    const message = data.chat
    sendMessage(message)
    form.reset({
      chat: ''
    })
  }
  return (
    <div className="before:bg-gradient-to-t from-black to-transparent before:absolute before:-top-11 before:left-0 before:right-0 before:h-10 before:content-[' '] relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-x-1">
          <section className="flex-1">
            <FormField
              name="chat"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    placeholder="Enter message"
                    className="min-h-6  scroll-bar resize-none"
                    onInput={(e) => {
                      const textArea = e.currentTarget
                      textArea.style.height = 'auto'
                      textArea.style.height = `${textArea.scrollHeight - 16}px`
                    }}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <Button disabled={!!form.formState.errors.chat} type="submit" size="icon">
            <PaperPlaneIcon />
          </Button>
        </form>
      </Form>
    </div>
  )
}
