import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the admin password from environment or use a default
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check for admin password in headers or query params
    const providedPassword = request.headers.get('x-admin-password') || 
                           request.nextUrl.searchParams.get('password');
    
    if (providedPassword !== adminPassword) {
      // Return a simple password prompt
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Admin Access Required</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                margin: 0; 
                background: #f5f5f5;
              }
              .container { 
                background: white; 
                padding: 2rem; 
                border-radius: 8px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
              }
              input { 
                padding: 0.5rem; 
                margin: 1rem 0; 
                border: 1px solid #ddd; 
                border-radius: 4px; 
                width: 200px;
              }
              button { 
                padding: 0.5rem 1rem; 
                background: #000; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
              }
              button:hover { background: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Admin Access Required</h2>
              <p>Enter admin password to continue:</p>
              <form method="GET">
                <input type="password" name="password" placeholder="Admin password" required>
                <br>
                <button type="submit">Access Admin</button>
              </form>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
