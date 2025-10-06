import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint que redirige a la página de documentación
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(307, '/docs');
}
