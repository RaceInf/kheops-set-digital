import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { backendService } from '@/services/backendService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier l'authentification locale
        const localAuth = authService.isAuthenticated();
        
        if (!localAuth) {
          setIsAuthenticated(false);
          setHasAccess(false);
          return;
        }

        // Vérifier l'authentification avec le backend
        const result = await backendService.verifyAuth();
        
        if (result.success && result.data) {
          setIsAuthenticated(true);
          
          // Vérifier les permissions
          let access = true;
          
          if (requiredRole && !authService.hasRole(requiredRole)) {
            access = false;
            setError(`Rôle requis: ${requiredRole}`);
          }
          
          if (requiredPermissions.length > 0) {
            const missingPermissions = requiredPermissions.filter(
              permission => !authService.hasPermission(permission)
            );
            
            if (missingPermissions.length > 0) {
              access = false;
              setError(`Permissions manquantes: ${missingPermissions.join(', ')}`);
            }
          }
          
          setHasAccess(access);
        } else {
          setIsAuthenticated(false);
          setHasAccess(false);
          setError('Session expirée');
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        setIsAuthenticated(false);
        setHasAccess(false);
        setError('Erreur de vérification d\'authentification');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, requiredPermissions, requiredRole]);

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Pas d'accès (permissions insuffisantes)
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Accès Refusé
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error || 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                Retour
              </Button>
              
              <Button
                onClick={() => authService.logout()}
                variant="destructive"
                className="w-full"
              >
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accès autorisé
  return <>{children}</>;
};

export default ProtectedRoute; 