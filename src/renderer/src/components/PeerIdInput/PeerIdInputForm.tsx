import { zodResolver } from '@hookform/resolvers/zod'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const formSchema = z.object({
  peer_id: z.string().length(36, 'Please enter a valid peer id')
})

type Values = z.infer<typeof formSchema>

export interface PeerIdInputFormProp {
  onSuccess: (values: string) => void
}

export function PeerIdInputForm({ onSuccess }: PeerIdInputFormProp) {
  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      peer_id: ''
    }
  })
  const onSubmit = (values: Values) => {
    onSuccess(values.peer_id)
    // console.log(values)
  }
  return (
    <Form {...form}>
      <form className="grid gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="peer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peer Id</FormLabel>
              <FormControl>
                <Input placeholder="Enter peer id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button title="Submit" type="submit">
          Submit <PaperPlaneIcon className="ml-1" />
        </Button>
      </form>
    </Form>
  )
}
