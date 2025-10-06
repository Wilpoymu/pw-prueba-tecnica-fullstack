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
  Search,
  Filter,
  Users,
  Shield,
  UserCheck,
  Pencil,
  Loader2,
  AlertCircle,
  Crown,
  User as UserIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePermissions } from "@/lib/rbac/usePermissions";
import { Permission } from "@/lib/rbac/permissions";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  _count?: {
    movements: number;
  };
}

interface UserFormData {
  name: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export default function UsersPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const canView = can(Permission.VIEW_USERS);
  const canEdit = can(Permission.EDIT_USERS);

  // Redirect si no tiene permisos
  useEffect(() => {
    if (!canView) {
      router.push("/dashboard");
    }
  }, [canView, router]);

  // Estado
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");

  // Form data
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    role: "USER",
  });

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 1) {
      newErrors.name = "El nombre debe tener al menos 1 caracter";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "El nombre no puede exceder 255 caracteres";
    }

    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (formData.phone && formData.phone.trim()) {
      if (formData.phone.trim().length > 20) {
        newErrors.phone = "El teléfono no puede exceder 20 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar campo individual en tiempo real
  const validateFieldOnChange = (field: string, value: any) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (value.trim() && value.trim().length >= 1 && value.trim().length <= 255) {
          delete newErrors.name;
        }
        break;

      case "phone":
        if (!value || value.trim().length <= 20) {
          delete newErrors.phone;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (roleFilter !== "ALL") {
        params.append("role", roleFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        console.error("Error fetching users:", data.error);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      fetchUsers();
    }
  }, [roleFilter, search, canView]);

  // Handlers
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      phone: user.phone || "",
      role: user.role,
    });
    setErrors({});
    setApiError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        role: formData.role,
      };

      // Solo incluir phone si tiene valor
      if (formData.phone && formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }

      const response = await fetch(`/api/users/${currentUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        setFormData({
          name: "",
          phone: "",
          role: "USER",
        });
        setErrors({});
        fetchUsers();
      } else {
        if (data.error.details && Array.isArray(data.error.details)) {
          const backendErrors: Record<string, string> = {};
          data.error.details.forEach((detail: any) => {
            if (detail.path && detail.path.length > 0) {
              backendErrors[detail.path[0]] = detail.message;
            }
          });
          setErrors(backendErrors);
        }
        setApiError(data.error.message || "Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      setApiError("Error de conexión. Por favor, intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular estadísticas
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
  const totalRegularUsers = users.filter((u) => u.role === "USER").length;

  // Si no tiene permisos, no mostrar nada (el useEffect redirigirá)
  if (!canView) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra los usuarios del sistema
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Usuarios
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {totalUsers}
                </p>
              </div>
              <div className="rounded-full bg-purple-500/10 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Administradores
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {totalAdmins}
                </p>
              </div>
              <div className="rounded-full bg-amber-500/10 p-3">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Usuarios Regulares
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalRegularUsers}
                </p>
              </div>
              <div className="rounded-full bg-blue-500/10 p-3">
                <UserCheck className="h-6 w-6 text-blue-600" />
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
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-purple-500/20 focus:border-purple-500"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value: "ALL" | "USER" | "ADMIN") =>
                setRoleFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-[200px] border-purple-500/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los roles</SelectItem>
                <SelectItem value="USER">Usuarios</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
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
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-purple-500/10 p-4 mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-muted-foreground">
                {search || roleFilter !== "ALL"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay usuarios registrados en el sistema"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Movimientos</TableHead>
                  {canEdit && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden ring-2 ring-purple-400/30 flex items-center justify-center">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phone || (
                        <span className="text-muted-foreground/50 italic">
                          Sin teléfono
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                        className={
                          user.role === "ADMIN"
                            ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border-blue-500/20"
                        }
                      >
                        {user.role === "ADMIN" ? (
                          <Crown className="mr-1 h-3 w-3" />
                        ) : (
                          <UserIcon className="mr-1 h-3 w-3" />
                        )}
                        {user.role === "ADMIN" ? "Admin" : "Usuario"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {user._count?.movements || 0} movimientos
                      </span>
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="hover:bg-purple-500/10 hover:text-purple-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] border-purple-500/20 bg-background/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Editar Usuario
              </DialogTitle>
              <DialogDescription>
                Actualiza la información del usuario
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    validateFieldOnChange("name", e.target.value);
                  }}
                  className={`border-purple-500/20 focus:border-purple-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="Número de teléfono (opcional)"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    validateFieldOnChange("phone", e.target.value);
                  }}
                  className={`border-purple-500/20 focus:border-purple-500 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "USER" | "ADMIN") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="border-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
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
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
