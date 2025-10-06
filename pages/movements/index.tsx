"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { usePermissions } from "@/lib/rbac/usePermissions";
import { Permission } from "@/lib/rbac/permissions";

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MovementFormData {
  concept: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  date: Date;
}

export default function MovimientosPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const canCreate = can(Permission.CREATE_MOVEMENT);
  const canEdit = can(Permission.EDIT_MOVEMENT);
  const canDelete = can(Permission.DELETE_MOVEMENT);

  // Estado
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovement, setCurrentMovement] = useState<Movement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState<MovementFormData>({
    concept: "",
    amount: "",
    type: "INCOME",
    date: new Date(),
  });

  // Fetch movements
  const fetchMovements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        sortBy: "date",
        sortOrder: "asc",
      });

      if (typeFilter !== "ALL") {
        params.append("type", typeFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/movements?${params}`);
      const data = await response.json();

      if (data.success) {
        setMovements(data.data);
      } else {
        console.error("Error fetching movements:", data.error);
      }
    } catch (error) {
      console.error("Error fetching movements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [typeFilter, search]);

  // Handlers
  const handleCreateNew = () => {
    setIsEditing(false);
    setCurrentMovement(null);
    setFormData({
      concept: "",
      amount: "",
      type: "INCOME",
      date: new Date(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (movement: Movement) => {
    setIsEditing(true);
    setCurrentMovement(movement);
    setFormData({
      concept: movement.concept,
      amount: movement.amount.toString(),
      type: movement.type,
      date: new Date(movement.date),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este movimiento?")) return;

    try {
      const response = await fetch(`/api/movements/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchMovements();
      } else {
        alert("Error al eliminar: " + data.error.message);
      }
    } catch (error) {
      console.error("Error deleting movement:", error);
      alert("Error al eliminar el movimiento");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        concept: formData.concept.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date.toISOString(),
      };

      const url = isEditing
        ? `/api/movements/${currentMovement?.id}`
        : "/api/movements";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        fetchMovements();
      } else {
        alert("Error: " + data.error.message);
      }
    } catch (error) {
      console.error("Error submitting movement:", error);
      alert("Error al guardar el movimiento");
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular totales
  const filteredMovements = movements;
  const totalIncome = filteredMovements
    .filter((m) => m.type === "INCOME")
    .reduce((sum, m) => sum + Number(m.amount), 0);
  const totalExpense = filteredMovements
    .filter((m) => m.type === "EXPENSE")
    .reduce((sum, m) => sum + Number(m.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Movimientos Financieros
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona todos tus ingresos y egresos
            </p>
          </div>

          {canCreate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-purple-500/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? "Actualiza la información del movimiento"
                      : "Agrega un nuevo ingreso o egreso a tu registro"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="concept">Concepto</Label>
                    <Input
                      id="concept"
                      placeholder="Ej: Salario mensual"
                      value={formData.concept}
                      onChange={(e) =>
                        setFormData({ ...formData, concept: e.target.value })
                      }
                      required
                      minLength={3}
                      maxLength={255}
                      className="border-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                        className="border-purple-500/20 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "INCOME" | "EXPENSE") =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger className="border-purple-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INCOME">Ingreso</SelectItem>
                          <SelectItem value="EXPENSE">Egreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <DatePicker
                      date={formData.date}
                      onDateChange={(date) =>
                        setFormData({ ...formData, date: date || new Date() })
                      }
                      placeholder="Selecciona una fecha"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={submitting}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Ingresos
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${totalIncome.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-full bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Egresos
                </p>
                <p className="text-3xl font-bold text-red-600">
                  ${totalExpense.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-full bg-red-500/10 p-3">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Balance Neto
                </p>
                <p
                  className={`text-3xl font-bold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-full bg-purple-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-purple-500/20 focus:border-purple-500"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value: "ALL" | "INCOME" | "EXPENSE") =>
                setTypeFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-[200px] border-purple-500/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="INCOME">Ingresos</SelectItem>
                <SelectItem value="EXPENSE">Egresos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-purple-500/10 p-4 mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No hay movimientos registrados
              </h3>
              <p className="text-muted-foreground mb-4">
                Comienza agregando tu primer ingreso o egreso
              </p>
              {canCreate && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Movimiento
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  {(canEdit || canDelete) && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow
                    key={movement.id}
                    className="border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant={
                          movement.type === "INCOME" ? "default" : "destructive"
                        }
                        className={
                          movement.type === "INCOME"
                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20"
                            : "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/20"
                        }
                      >
                        {movement.type === "INCOME" ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {movement.type === "INCOME" ? "Ingreso" : "Egreso"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.concept}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        movement.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movement.type === "INCOME" ? "+" : "-"}$
                      {Number(movement.amount).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(movement.date).toLocaleDateString("es-MX")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden ring-2 ring-purple-400/30 flex items-center justify-center">
                          {movement.user.image ? (
                            <img
                              src={movement.user.image}
                              alt={movement.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {movement.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movement.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {(canEdit || canDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(movement)}
                              className="hover:bg-purple-500/10 hover:text-purple-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(movement.id)}
                              className="hover:bg-red-500/10 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
