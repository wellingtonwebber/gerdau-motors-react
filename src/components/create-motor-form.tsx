import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "./ui/button";
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function generateId(): string {
  const num = Math.floor(Math.random() * 1000);
  const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return `${num}${letter}`;
}

const createMotorSchema = z.object({
  code: z.string().regex(/^\d+$/).length(8, {message: 'Deve ter 8 caracteres'}),
  description: z.string().min(10, { message: 'Minimo 10 caracteres' }),
  location: z.string().min(10, {message: 'Mínimo 10 caracteres'})
})

type CreateMotorSchema = z.infer<typeof createMotorSchema>


export function CreateMotorForm() {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState } = useForm<CreateMotorSchema>({
    resolver: zodResolver(createMotorSchema),
  })

  const { mutateAsync } = useMutation({
    mutationFn: async ({ code, description, location }: CreateMotorSchema) => {

      await fetch('http://localhost:3333/motores', {
        method: 'POST',
        body: JSON.stringify({
          codigo: code,
          descricao: description,
          localizacao: location,
          id: generateId()
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-motores'],
      })
    }
  })

  async function createMotor({ code, description, location }: CreateMotorSchema) {
    await mutateAsync({ code, description, location })
  }

  return (
    <form onSubmit={handleSubmit(createMotor)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="code">Código</label>
        <input 
          {...register('code')}
          id="code" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.code && (
          <p className="text-sm text-red-400">{formState.errors.code.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="description">Descrição</label>
        <input 
          {...register('description')}
          id="description" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.description && (
          <p className="text-sm text-red-400">{formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="description">Localização</label>
        <input 
          {...register('location')}
          id="location" 
          type="text" 
          className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.location && (
          <p className="text-sm text-red-400">{formState.errors.location.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button disabled={formState.isSubmitting} className="bg-blue-800 text-white-950 hover:bg-blue-900" type="submit">
          {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          Save
        </Button>
      </div>
    </form>
  )
}