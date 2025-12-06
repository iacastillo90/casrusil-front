import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/axios"

interface Client {
    id: string;
    rut: string;
    razonSocial: string;
    email: string;
}

interface ClientSearchProps {
    onSelect: (client: Client) => void;
    selectedClientRut?: string;
}

export function ClientSearch({ onSelect, selectedClientRut }: ClientSearchProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    // Mock API call for clients - replace with real service
    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['clients', search],
        queryFn: async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Mock data
            return [
                { id: '1', rut: '76.123.456-7', razonSocial: 'Empresa Demo SpA', email: 'contacto@demo.cl' },
                { id: '2', rut: '12.345.678-9', razonSocial: 'Juan Pérez', email: 'juan@perez.cl' },
                { id: '3', rut: '99.888.777-6', razonSocial: 'Servicios IT Ltda', email: 'pagos@it.cl' },
            ] as Client[];
        }
    });

    const selectedClient = clients.find(c => c.rut === selectedClientRut);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedClient
                        ? `${selectedClient.rut} - ${selectedClient.razonSocial}`
                        : "Buscar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar por RUT o nombre..." onValueChange={setSearch} />
                    <CommandList>
                        <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={`${client.rut} ${client.razonSocial}`}
                                    onSelect={() => {
                                        onSelect(client)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedClientRut === client.rut ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{client.razonSocial}</span>
                                        <span className="text-xs text-muted-foreground">{client.rut}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
