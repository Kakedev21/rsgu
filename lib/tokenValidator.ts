import jwt, { TokenExpiredError } from 'jsonwebtoken';


export const generateToken = (payload: any, expiration: string = '1h'): string =>  {
   // Expiration time (1 hour)
   
    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET as string, { expiresIn: expiration });
  
    return token;
}

export const isTokenExpired = (token: string): boolean => {
    // Replace with your own secret key

    try {
      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
  
      // No error thrown and decoded exists, token is not expired
      return false;
    } catch (err) {
      // Check if error is due to token expiration
      if (err instanceof TokenExpiredError) {
        return true; // Token is expired
      } else {
        console.error('JWT verification error:', err);
        return true; // Other errors (consider as expired for safety)
      }
    }
}