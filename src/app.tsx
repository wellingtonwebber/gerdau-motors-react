import { Plus, Search, Filter, FileDown, MoreHorizontal, Loader2 } from 'lucide-react'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Pagination } from './components/pagination'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { CreateMotorForm } from './components/create-motor-form'
import { Select, SelectContent, SelectItem, SelectTrigger } from './components/ui/select'

export interface MotorResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Motor[]
}

export interface Motor {
  codigo: string,
  descricao: string,
  localizacao: string,
  id: string
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter') ?? ''
  
  const [filter, setFilter] = useState(urlFilter)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: motorResponse, isLoading, isFetching } = useQuery<MotorResponse>({
    queryKey: ['get-motors', urlFilter, page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/motores?_page=${page}&_per_page=10&codigo=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
  })

  function handleFilter(event: FormEvent) {
    event.preventDefault()

    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="mx-6 max-w-6xl mx-auto space-y-5 ">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Motores</h1>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant='primary'>
                <Plus className="size-3" />
                Criar novo
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-zinc-950 border-l border-zinc-900">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold">
                    Adicionar motor
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500">
                    Criar novo motor a partir das especificações
                  </Dialog.Description>
                </div>

                <CreateMotorForm />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {isFetching && <Loader2 className="size-4 animate-spin text-zinc-500" />}
        </div>

        <div className="flex items-center justify-between">
          <form onSubmit={handleFilter} className="flex items-center gap-2">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control 
                placeholder="Buscar motores..." 
                onChange={e => setFilter(e.target.value)}
                value={filter}
              />
            </Input>
            <Button type="submit">
              <Filter className="size-3" />
              Filtrar
            </Button>
            <Select defaultValue="l1">
              <SelectTrigger aria-label="Local" />
              <SelectContent className="text-sm">
                <SelectItem value="l1">Laminação 1</SelectItem>
                <SelectItem value="l2">Laminação 2</SelectItem>
                <SelectItem value="t1">Trefila 1</SelectItem>
                <SelectItem value="t2">Trefila 2</SelectItem>
              </SelectContent>
            </Select>
          </form>

          <Button>
            <FileDown className="size-3" />
            Exportar
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {motorResponse?.data.map((motor) => {
              return (
                <TableRow key={motor.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{motor.codigo}</span>
                      <span className="text-xs text-zinc-500">{motor.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {motor.descricao}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {motor.localizacao}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {motorResponse && <Pagination pages={motorResponse.pages} items={motorResponse.items} page={page} />}
      </main>
    </div>
  )
}
