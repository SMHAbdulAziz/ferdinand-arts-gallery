// Simple test page to verify Next.js is working
export default function Test() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🎨 The FUND - Test Page</h1>
      <p>This is a simple test page to verify the application is running.</p>
      <p>If you can see this, Next.js is working!</p>
      <h2>Quick Status Check:</h2>
      <ul>
        <li>✅ Next.js: Running</li>
        <li>✅ React: Working</li>
        <li>✅ TypeScript: Compiled</li>
      </ul>
      <p>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Go back to main site
        </a>
      </p>
    </div>
  );
}