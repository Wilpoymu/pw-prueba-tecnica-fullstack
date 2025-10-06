import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint que redirige a la página de documentación
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Redirigir a la página de docs
  res.redirect(307, '/docs');
}
