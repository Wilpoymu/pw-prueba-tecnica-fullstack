import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Flowly API Documentation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Documentación completa de los endpoints REST para gestión de movimientos financieros
          </p>
        </div>
        
        <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
          <SwaggerUI 
            url="/docs/openapi.yml"
            deepLinking={true}
            displayRequestDuration={true}
            filter={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
