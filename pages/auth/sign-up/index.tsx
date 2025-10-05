import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth/client"
import { Github } from "lucide-react"
import Link from "next/link"


function SignUp() {

  const handleGithubSignUp = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>Continúa con Github para comenzar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGithubSignUp}
            className="w-full"
            size="lg"
            variant="default"
          >
            <Github />
            Continuar con Github
          </Button>
        </CardContent>

        <div className="text-center text-sm text-muted-foreground p-4">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión    
          </Link>
        </div>
      </Card>
    </div>
  )
}
export default SignUp